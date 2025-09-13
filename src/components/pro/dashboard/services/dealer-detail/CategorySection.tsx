import { useState } from "react";
import Add from "../../../../../assets/Add.tsx";
import { useTheme } from "../../../../../store/theme-context";
import Heading from "../../../../UI/Heading";
import HomeCard from "../../home/HomeCard";
import AddServiceModal from "../../../../../layout/pro-models/AddServiceLayout.tsx";
import { useParams } from "react-router";

function CategorySection() {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
  const id = useParams().id;
  return (
    <div className="">
      {show && (
        <AddServiceModal
          onCancel={() => setShow(false)}
          businessId={id ? +id : 0}
        />
      )}
      <HomeCard
        children={
          <div
            className="xs:py-10 lg:py-10 border border-dashed !border-[#707070] rounded !h-full flex justify-center items-center flex-col gap-5"
            onClick={() => setShow(true)}
          >
            <div>
              {theme === "light" && <div children={<Add color="black" />} />}

              {theme === "dark" && <div children={<Add color="white" />} />}
            </div>
            <Heading
              text={"Add Service"}
              variant="subHeader"
              headingclassname={` !font-semibold tracking-wide !text-lg text-slate-700  dark:text-slate-400`}
            />
          </div>
        }
        className="!bg-transparent h-full"
      />
    </div>
  );
}

export default CategorySection;
