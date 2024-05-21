import DetailHero from "../../../../assets/detail-hero.png";
import Button from "../../../UI/Button";
import Navigation from "../../../UI/Navigation";
import AnswersSections from "./AnswersSections";
import FilterSection from "./FilterSection";
import ServiceItemsSection from "./ServiceItemsSection";
import ServiceTitle from "./ServiceTitle";
import ServiceQuestionsSkeleton from "../skeleton/ServiceQuestionSkeleton";
import useSWR from "swr";
import { fetcher } from "../../../../store/customer/home-context";
import { useParams } from "react-router";
import { Request } from "../../../../models/customer/requestlist";
import { Business } from "../../../../models/customer/businesslist";
import { useEffect, useState } from "react";
import { useServices } from "../../../../store/customer/service-context";
import Heading from "../../../UI/Heading";
import ServiceDetailSkeleton from "../skeleton/ServiceDetailSkeleton";
import CloseRequestModal from "../../../../layout/close-request-modals/CloseRequestModal";

function SeviceDetailMainPage() {
  const requestId = useParams();
  console.log(requestId?.id, "hygvhui");

  const url = `https://erranddo.com/admin/api/v1/user-requests/${requestId?.id}/detail`;
  const { data, isLoading } = useSWR(url, fetcher);

  const serviceRequestData = data?.data;
  const {
    datarender,
    sortHandler,
    isLoading: businessListLoading,
  } = useServices();
  const serviceId = serviceRequestData?.service_id;
  const businessesData: Business[] = datarender;

  const userRequestId = requestId?.id;

  const array = [serviceRequestData];
  const services = [businessesData];

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {
        <CloseRequestModal
          serviceId={data?.service_id}
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
          }}
          onCancelAll={() => {
            setOpenModal(false);
          }}
        />
      }
      <div className="dark:bg-black ">
        <img
          src={DetailHero}
          className="w-full h-[24.80965147453083vh] object-cover xs:object-center "
        />

        <div className="lg:mx-20 xl:mx-36 xs:mx-5 ">
          <Navigation isButton={true} />
          <div>
            {isLoading ? (
              <ServiceQuestionsSkeleton />
            ) : (
              <div>
                <ServiceTitle data={serviceRequestData} />
                <AnswersSections
                  array={array}
                  location={serviceRequestData?.postcode?.name}
                />
              </div>
            )}
          </div>
          <div>
            <Button
              variant="filled"
              color="secondary"
              size="normal"
              children="Close Request"
              centerClassName="flex items-center justify-center"
              buttonClassName="!px-4 py-2 text-sm tracking-wide md:hidden  w-full"
              onClick={() => setOpenModal(true)}
            />
            <FilterSection
              latitude={serviceRequestData?.postcode?.latitude}
              longitude={serviceRequestData?.postcode?.longitude}
              serviceId={serviceId}
              userRequestId={userRequestId}
              list={services}
              onChange={(sort: string) => {
                console.log(sort, "sort");
                if (sort === "Highest overall score") {
                  sortHandler(
                    "reviews_avg_rating",
                    serviceRequestData?.service_id
                  );
                } else if (sort === "Registration date") {
                  sortHandler("created_at", serviceRequestData?.service_id);
                } else if (sort === "Highest reviews") {
                  console.log("here");
                  sortHandler("highest_rating", serviceRequestData?.service_id);
                }
              }}
            />
            {businessListLoading ? (
              <ServiceDetailSkeleton limit={3} />
            ) : (
              <div>
                {datarender.length > 0 ? (
                  <ServiceItemsSection
                    services={services}
                    id={serviceRequestData?.service?.id}
                    name={serviceRequestData?.service?.name}
                    isLoading={businessListLoading}
                  />
                ) : (
                  <div className="!mt-10">
                    <Heading
                      text={"There is no response from the pros"}
                      variant="subHeader"
                      headingclassname="text-textColor dark:text-white !font-semibold tracking-wide flex justify-center lg:h-24  xs:h-24 items-center"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SeviceDetailMainPage;
