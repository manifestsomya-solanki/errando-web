import HomeCard from "./HomeCard";
import Location from "../../../../assets/LocationIcon.tsx";
import Delete from "../../../../assets/delete.svg";

import Edit from "../../../../assets/edit.svg";
import Heading from "../../../UI/Heading";
import { useTheme } from "../../../../store/theme-context.tsx";
import { useState } from "react";
import EditServiceModal from "../../../../layout/pro-models/EditServiceModal.tsx";
import { PostCode } from "../../../../models/home.ts";
import { Postcode2 } from "../../../../models/pro/business.ts";
import DeleteBusinessServiceModal from "../../../../layout/pro-models/DeleteBusinessServiceModal.tsx";

function ServiceItem(props: {
  serviceId: number;
  title: string;
  business: string;
  request_count: number;
  locationOne?: string;
  locationTwo?: string;
  ratingCount: number;
  progress: string;
  leads: number;
  purchases: number;
  location: Postcode2[];
  is_nation_wide: boolean;
  is_remote_service: boolean;
}) {
  const { theme } = useTheme();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <>
      {openEditModal && (
        <EditServiceModal
          onCancel={() => setOpenEditModal(false)}
          serviceId={props?.serviceId}
        />
      )}
      {openDeleteModal && (
        <DeleteBusinessServiceModal
          onCancel={() => setOpenDeleteModal(false)}
          id={props?.serviceId}
        />
      )}
      <HomeCard
        className="px-4 py-5 h-full  "
        children={
          <div className="parent flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col lg:h-max">
                  <Heading
                    text={props.title}
                    variant="subTitle"
                    headingclassname="!font-bold  tracking-wide dark:text-white"
                  />
                  <Heading
                    text={props.business}
                    variant="subTitle"
                    headingclassname="!font-medium text-primaryYellow tracking-wide text-sm "
                  />
                </div>
                <div className="flex gap-0">
                  <div className=" hover:bg-slate-100 dark:hover:bg-slate-700 w-10 h-10 flex items-center justify-center rounded-full">
                    <button onClick={() => setOpenEditModal(true)}>
                      <img src={Edit} />
                    </button>
                  </div>
                  <div className=" hover:bg-slate-100 dark:hover:bg-slate-700 w-10 h-10 flex items-center justify-center rounded-full">
                    <button onClick={() => setOpenDeleteModal(true)}>
                      <img src={Delete} className="w-h h-5" />
                    </button>
                  </div>
                </div>
              </div>
              {props?.location &&
                props.location.map((item) => {
                  return (
                    <div className="flex items-center gap-2 my-0">
                      {theme === "light" && (
                        <div children={<Location color="black" />} />
                      )}

                      {theme === "dark" && (
                        <div children={<Location color="white" />} />
                      )}
                      <Heading
                        text={`${
                          props.is_nation_wide || props.is_remote_service
                            ? props.is_nation_wide
                              ? "Nation wide "
                              : "Remote service"
                            : `${item?.radius} miles`
                        }  around ${item?.postcode?.name}`}
                        variant="subHeader"
                        headingclassname="!font-semibold my-2 !text-sm text-slate-600 tracking-wide  dark:text-slate-400 "
                      />
                    </div>
                  );
                })}
            </div>
            <div>
              <hr className="text-slate-500 mt-2"></hr>

              <div className="flex justify-between items-end mt-2 gap-2  ">
                <div className="flex flex-col">
                  <Heading
                    text={`Leads Posted Today`}
                    variant="subHeader"
                    headingclassname="text-textColor !font-light tracking-wide text-sm  dark:text-white"
                  />
                  <Heading
                    text={props?.request_count}
                    variant="subHeader"
                    headingclassname="text-primaryYellow !font-semibold tracking-wide text-sm  dark:text-slate-400"
                  />
                </div>
                <div className="flex flex-col">
                  <Heading
                    text={`My Purchases`}
                    variant="subHeader"
                    headingclassname="text-textColor !font-light tracking-wide text-sm  dark:text-white"
                  />
                  <Heading
                    text={`${props?.purchases ?? 0}`}
                    variant="subHeader"
                    headingclassname="text-primaryBlue !font-semibold tracking-wide text-sm  dark:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}

export default ServiceItem;
