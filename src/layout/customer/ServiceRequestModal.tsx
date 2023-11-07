import React, { useState } from "react";
import { useTheme } from "../../store/theme-context";
import Modal from "../home/Modal";
import Close from "../../assets/close";

import { fetcher, useHomeServices } from "../../store/customer/home-context";

import SearchBar from "../../components/customer/home/SearchBar";
import PostCodeModal from "../home/PostCodeModal";

const ServiceRequestModal = (props: {
  onCancel: () => void;
  open: boolean;
  onCancelAll: () => void;
}) => {
  const { datarender, searchHandler, isLoading } = useHomeServices();

  // const { data, isLoading: isServiceLoading } = useSWR(url, fetcher);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openServiceModal, setOpenServiceModal] = useState(false);

  const list = datarender;
  const { theme } = useTheme();
  return (
    <>
      {
        <PostCodeModal //change to PostCodeModal
          open={openMenu}
          onCancel={() => {
            setOpenMenu(false);
            localStorage.removeItem("service");
            localStorage.removeItem("post_code");
          }}
          onCancelAll={() => {
            setOpenMenu(false);
            props.onCancelAll();
            localStorage.removeItem("service");
            localStorage.removeItem("post_code");
            localStorage.removeItem("question");
          }}
        />
      }
      {props.open && !openServiceModal && (
        <Modal className="bg-gray-100 opacity-100 rounded-lg dark:bg-modalDarkColor xl:w-[570px] lg:w-[470px] md:w-[520px]">
          <button
            className=" absolute top-5 right-5"
            onClick={() => {
              props.onCancelAll();
            }}
          >
            {theme === "light" && <div children={<Close color="black" />} />}

            {theme === "dark" && <div children={<Close color="white" />} />}
          </button>
          <div className="flex flex-col ">
            <div className="flex xl:mt-1 md:mt-2">
              <h1 className="text-black xl:text-lg md:text-md font-medium font-poppins p-2 dark:text-white">
                Search Services
              </h1>
            </div>
            <div className="flex ">
              <div className="flex gap-2 items-center ">
                <SearchBar
                  searchkey={"search"}
                  onChange={(key: string) => {
                    searchHandler(key);
                    setOpenSearch(true);
                  }}
                />
              </div>
              {list?.length > 0
                ? openSearch && (
                    //xl:mt-64 lg:mt-48 xs:mt-48
                    <div className="bg-white md:w-96 xl:mt-16 lg:mt-16 xs:mt-16 lg:w-80 xl:w-96 xs:w-56 xl:max-h-48 lg:max-h-36 xs:max-h-36  z-[100] absolute overflow-y-scroll rounded-lg dark:bg-black">
                      {list?.map((d, key) => {
                        return (
                          <ul
                            className="xl:text-lg lg:text-md xs:text-sm text-[#707070] dark:text-white"
                            key={key}
                          >
                            <button
                              className="w-full"
                              onClick={() => {
                                setOpenMenu(true), setOpenSearch(false);
                                console.log(d.name);
                                openSearch &&
                                  localStorage.setItem(
                                    "service",
                                    JSON.stringify(d)
                                  );
                                setOpenServiceModal(true);
                              }}
                            >
                              <li className="px-6 py-1 text-left">{d.name}</li>
                            </button>
                            <hr />
                          </ul>
                        );
                      })}
                    </div>
                  )
                : openSearch &&
                  !isLoading && (
                    <div className="bg-white dark:bg-black md:w-96 lg:w-80 xl:w-96 xs:w-64 xl:max-h-48 lg:max-h-36 h-auto py-3 px-3  z-[100] absolute overflow-y-scroll rounded-xl text-red-400 font-semibold mt-16">
                      No matched related to your search
                    </div>
                  )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ServiceRequestModal;
