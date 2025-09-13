import Heading from "../../../../UI/Heading";
import HomeCard from "../../home/HomeCard";
import Location from "../../../../../assets/LocationIcon.tsx";
import Edit from "../../../../../assets/edit.svg";
import { useTheme } from "../../../../../store/theme-context.tsx";
import { useState } from "react";
import EditServiceModal from "../../../../../layout/pro-models/EditServiceModal.tsx";
function ServiceandLocationItems(props: {
  id: number;
  title: string;
  locationOne: string;
  locationTwo: string;
}) {
  const { theme } = useTheme();
  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <div>
      {showEditModal && (
        <EditServiceModal
          onCancel={() => {
            setShowEditModal(false);
          }}
          serviceId={props.id}
        />
      )}

      <HomeCard
        className="px-4 py-5 h-full"
        children={
          <div className="">
            <div className="flex justify-between items-center">
              <div className="flex flex-col  ">
                <Heading
                  text={props.title}
                  variant="subTitle"
                  headingclassname="!font-bold  tracking-wide"
                />
              </div>
              <div
                onClick={() => {
                  setShowEditModal(!showEditModal);
                }}
                className="dark:hover:bg-slate-700 hover:bg-slate-100 w-10 h-10 flex items-center justify-center rounded-full"
              >
                <img src={Edit} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5">
              {theme === "light" && (
                <div children={<Location color="black" />} />
              )}

              {theme === "dark" && (
                <div children={<Location color="white" />} />
              )}
              <Heading
                text={props.locationOne}
                variant="subHeader"
                headingclassname="!font-semibold my-2 !text-sm text-slate-600 tracking-wide dark:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 mb-5">
              {theme === "light" && (
                <div children={<Location color="black" />} />
              )}

              {theme === "dark" && (
                <div children={<Location color="white" />} />
              )}
              <Heading
                text={props.locationTwo}
                variant="subHeader"
                headingclassname="!font-semibold my-2 !text-sm text-slate-600 tracking-wide dark:text-slate-400"
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default ServiceandLocationItems;
