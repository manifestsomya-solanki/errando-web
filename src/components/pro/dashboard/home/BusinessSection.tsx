import Heading from "../../../UI/Heading";
import HomeCard from "./HomeCard";
import BussinessImageOne from "../../../../assets/service-image-one.png";
import BussinessImageTwo from "../../../../assets/service-image-one.png";
import BusinessItem from "./BusinessItem";
import Add from "../../../../assets/Add.tsx";
import BusinessSkeleton from "../../skeleton/BusinessSkeleton";
import { useTheme } from "../../../../store/theme-context";
import { useBusiness } from "../../../../store/pro/dashboard-context.tsx";
import { useState } from "react";
import AddBusinessModal from "../../../../layout/pro-models/AddBusinessLayout.tsx";

function BusinessSection() {
  const { theme } = useTheme();
  const [openModal, setOpenModal] = useState(false);

  const { data, isBussinessLoading } = useBusiness();
  return (
    <div className="my-7">
      {openModal && <AddBusinessModal onCancel={() => setOpenModal(false)} />}
      <Heading
        text="My Business / es"
        variant="headingTitle"
        headingclassname="!font-bold mx-1 tracking-wide dark:text-white"
      />
      <div>
        {isBussinessLoading ? (
          <BusinessSkeleton limit={3} />
        ) : (
          <div className="grid xl:grid-cols-3 md:grid-cols-2 my-5 gap-5 xs:grid-cols-1 ">
            {data &&
              data?.length > 0 &&
              data.map((item, key) => {
                return (
                  <BusinessItem
                    id={item.id}
                    image={item.image}
                    title={item.name}
                    subTitle={item.services}
                    description={item.description}
                    ratingCount={item.reviews_avg_rating}
                    progress={`${+item.profile_percentage}%`}
                    review_count={item.reviews_count}
                  />
                );
              })}
            <HomeCard
              children={
                <div
                  onClick={() => setOpenModal(true)}
                  className="xs:py-10 lg:py-16 border border-dashed rounded !border-[#707070] h-full flex justify-center items-center flex-col gap-5 cursor-pointer"
                >
                  <div>
                    {theme === "light" && (
                      <div children={<Add color="black" />} />
                    )}

                    {theme === "dark" && (
                      <div children={<Add color="white" />} />
                    )}
                  </div>
                  <Heading
                    text={"Add Business"}
                    variant="subHeader"
                    headingclassname={` !font-semibold tracking-wide !text-lg text-slate-700  dark:text-slate-400`}
                  />
                </div>
              }
              className="!bg-transparent "
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessSection;
