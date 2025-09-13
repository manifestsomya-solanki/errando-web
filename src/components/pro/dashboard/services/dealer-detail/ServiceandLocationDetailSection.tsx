import { PostCode, Service } from "../../../../../models/home";
import Heading from "../../../../UI/Heading";
import DealerServiceSkeleton from "../../../skeleton/Dealer/DealerServiceSkeleton";
import CategorySection from "./CategorySection";
import ServiceandLocationItems from "./ServicesandLocationItems";

function ServicesandLocationDetailSection(props: { services: Service[] }) {
  const isLoading = false;
  return (
    <div className="mt-7">
      <Heading
        text="My Services & Locations"
        variant="headingTitle"
        headingclassname="!font-bold mx-1 tracking-wide dark:text-white"
      />
      <div>
        {isLoading ? (
          <DealerServiceSkeleton limit={5} />
        ) : (
          <div className="grid lg:grid-cols-3 mt-5 gap-5 xs:grid-cols-1 dark:text-white">
            <CategorySection />
            {props.services.map((item) => {
              return (
                <ServiceandLocationItems
                  id={item?.id}
                  title={item?.name}
                  locationOne={`50 miles around SE4 09D`}
                  locationTwo="5 miles around BN1 7YD"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicesandLocationDetailSection;
