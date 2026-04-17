import { useEffect, useState } from "react";
import PostCodeModal from "../../../layout/home/PostCodeModal";
import { publicFetcher, useHomeServices } from "../../../store/customer/home-context";
import useSWR from "swr";
import { Service } from "../../../models/home";
import SearchBar from "./SearchBar";
import Plumber from "../../../assets/plumber-compress.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import Card from "./Card";
import Arrow from "../../../assets/left-arrow.svg";
import ServiceImageSkeleton from "../../UI/Skeletons/ServiceImageSkeleton";
import Button from "../../UI/Button";
import { useNavigate } from "react-router";
import NoImage from "../../../assets/no-photo.png";
import { buildApiUrl, API_ENDPOINTS } from "../../../config/api";
import { resolveAssetUrl } from "../../../utils/resolveAssetUrl";

const resolveServiceImageUrl = (image?: string | null) => {
  const url = resolveAssetUrl(image);
  return url || NoImage;
};

const HomePageDetails = () => {
  const { datarender, searchHandler, isLoading } = useHomeServices();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const url = buildApiUrl(API_ENDPOINTS.SERVICES);
  const { data, isLoading: isServiceLoading } = useSWR(url, publicFetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0,
  });
  const serviceData: Service[] = data?.data ?? [];
  // const imageStorageUrl = "https://erranddo.kodecreators.com/storage";
  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const navigate = useNavigate();
  const list = datarender;
  useEffect(() => {
    localStorage.removeItem("service"), localStorage.removeItem("post_code");
    localStorage.removeItem("question");
  }, []);
  return (
    <div className="lg:relative">
      <div className="overflow-y-hidden md:pt-10 xs:pt-0 w-screen bg-[#E7F0F9] dark:bg-dimGray 2xl:h-[76vh] lg:h-[70vh] md:h-[29rem] xs:mt-2">
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
              localStorage.removeItem("service");
              localStorage.removeItem("post_code");
              localStorage.removeItem("question");
            }}
          />
        }
        <div className="flex xl:pt-5 xs:pt-24 h-full">
          <div className="2xl:pt-36 xl:pt-24 md:pt-10 2xl:pl-48 xl:pl-48 lg:pl-20 md:pl-32 xs:pl-5">
            <p className="font-poppins-bold p-2 2xl:text-7xl xl:text-6xl md:text-5xl xs:text-3xl font-bold 2xl:w-[540px] xl:w-[450px] md:w-[370px] dark:text-darktextColor">
              Get Stuff Done
            </p>
            <p className="p-2 2xl:text-2xl xl:text-xl md:text-xl xs:text-md font-medium 2xl:w-[450px] xl:w-[370px] dark:text-slate-400 font-poppins">
              We’ll match you with the perfect Pro for{" "}
              <span className="text-green-500 font-semibold">FREE</span>
            </p>
            <div className="flex gap-2 items-center ">
              <SearchBar
                searchkey="search"
                onChange={(key: string) => {
                  searchHandler(key);
                  setOpenSearch(true);
                }}
              />
            </div>
            {list?.length > 0
              ? openSearch && (
                  <div className="bg-white md:w-96 lg:w-80 xl:w-96 xs:w-64 xl:max-h-48 lg:max-h-36 h-auto   z-[100] absolute overflow-y-scroll rounded-lg dark:bg-black">
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

                              openSearch &&
                                localStorage.setItem(
                                  "service",
                                  JSON.stringify(d)
                                );
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
                  <div className="bg-white dark:bg-black md:w-96 lg:w-80 xl:w-96 xs:w-64 xl:max-h-48 lg:max-h-36 h-auto py-3 px-3  z-[100] absolute overflow-y-scroll rounded-xl text-red-400 font-semibold">
                    No matched related to your search
                  </div>
                )}
          </div>
          <div className="place-self-end h-[90%] mx-auto">
            <img
              src={Plumber}
              alt=""
              className="lg:flex h-full  !w-full xs:hidden mt-auto object-cover"
            />
          </div>
        </div>
      </div>
      <div className="flex xs:hidden pt-4 items-center justify-between">
        <p className=" pl-4 font-semibold text-md">Services</p>
        <button className="text-[#0003FF] pr-4">view more</button>
      </div>
      <div className="relative -mt-28 xs:hidden lg:block w-full px-10">
        <button className="absolute top-20 left-0 z-20 arrow-left arrow">
          <img src={Arrow} alt="" className=" h-16" />
        </button>
        {isServiceLoading ? (
          <ServiceImageSkeleton />
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={5}
            navigation={{ nextEl: ".arrow-right", prevEl: ".arrow-left" }}
            pagination={{ clickable: true, dynamicBullets: true }}
            scrollbar={{ draggable: true }}
          >
            {serviceData &&
              serviceData?.map((d, i) => {
                return (
                  <SwiperSlide key={d.id || i}>
                    <Card
                      image={resolveServiceImageUrl(d?.image)}
                      desc={d?.name}
                    />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        )}
        <button className="absolute top-20 right-0 z-20 arrow-right arrow">
          <img src={Arrow} alt="" className="rotate-180 h-16" />
        </button>
      </div>
      <div className="2xl:px-40 xl:px-36 md:px-28 2xl:mt-[-90px] xl:mt-[-60px] lg:mt-[-50px] lg:hidden xs:grid xs:grid-cols-2">
        {serviceData &&
          serviceData?.map((d, index) => {
            return (
              <Card
                key={d.id || index}
                image={
                  resolveServiceImageUrl(d?.image)
                }
                desc={d?.name}
              />
            );
          })}
      </div>
      {isLoggedIn === "true" ? (
        <footer
          className="bg-white dark:bg-dimGray
             text-3xl text-white text-center
             fixed
             inset-x-0
             bottom-0
             p-3 xs:flex lg:hidden"
        >
          <Button
            variant="filled"
            color="primary"
            size="normal"
            children="Your Projects"
            buttonClassName="!px-7 text-sm lg:hidden w-full py-2 "
            centerClassName="flex items-center justify-center"
            onClick={() => {
              navigate("/projects");
            }}
          />
        </footer>
      ) : (
        <></>
      )}
      {/* <div className=" bg-white w-full absolute bottom-0 z-[199]">
        <Button
          variant="outlined"
          color="primary"
          size="normal"
          children="Your Projects"
          buttonClassName="!px-7 text-sm xs:flex lg:hidden w-full"
          onClick={() => {
            navigate("/projects");
          }}
        />
      </div> */}
    </div>
  );
};

export default HomePageDetails;


//SG6 0TG
