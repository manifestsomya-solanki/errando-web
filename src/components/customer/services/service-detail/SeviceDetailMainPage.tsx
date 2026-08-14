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
import { Business } from "../../../../models/customer/businesslist";
import { useState } from "react";
import { useServices } from "../../../../store/customer/service-context";
import Heading from "../../../UI/Heading";
import ServiceDetailSkeleton from "../skeleton/ServiceDetailSkeleton";
import CloseRequestModal from "../../../../layout/close-request-modals/CloseRequestModal";
import { buildApiUrl, API_ENDPOINTS } from "../../../../config/api";

function SeviceDetailMainPage() {
  const requestId = useParams();
  console.log(requestId?.id, "hygvhui");

  const url = buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS_DETAIL}/${requestId?.id}/detail`);
  const { data, isLoading, error: apiError } = useSWR(
    requestId?.id ? url : null,
    fetcher
  );

  // Debug logging
  if (apiError) {
    console.error("ServiceDetail API Error:", apiError);
  }
  if (data && data.status === "0") {
    console.error("ServiceDetail API Response Error:", data.message);
  }

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
  const customerPostingPaused = !!serviceRequestData?.customer_posting_paused;
  const isClosed =
    serviceRequestData?.status === "COMPLETED" ||
    serviceRequestData?.is_closed === 1 ||
    serviceRequestData?.is_closed === "1";

  return (
    <>
      {
        <CloseRequestModal
          serviceId={serviceRequestData?.service_id}
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
            ) : apiError || (data && data.status === "0") ? (
              <div className="py-10">
                <Heading
                  text={data?.message || "Failed to load service details"}
                  variant="subHeader"
                  headingclassname="!font-normal !text-lg mx-1 text-red-500 tracking-wide dark:text-red-400 text-center"
                />
              </div>
            ) : !serviceRequestData ? (
              <div className="py-10">
                <Heading
                  text="No data available"
                  variant="subHeader"
                  headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white text-center"
                />
              </div>
            ) : (
              <div>
                <ServiceTitle data={serviceRequestData} />
                <AnswersSections
                  array={array}
                  location={serviceRequestData?.postcode || ""}
                />
              </div>
            )}
          </div>
          <div>
            {!isClosed && (
              <Button
                variant="filled"
                color="secondary"
                size="normal"
                children="Close Request"
                centerClassName="flex items-center justify-center"
                buttonClassName="!px-4 py-2 text-sm tracking-wide md:hidden  w-full"
                onClick={() => setOpenModal(true)}
              />
            )}
            {customerPostingPaused ? (
              <div className="w-full flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="#DC2626" strokeWidth="2" />
                    <path d="M7 17L17 7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <Heading
                  text="We couldn't process your request. Please contact customer support if the problem persists."
                  variant="subHeader"
                  headingclassname="text-red-500 dark:text-red-300 !font-semibold tracking-wide text-center"
                />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SeviceDetailMainPage;
