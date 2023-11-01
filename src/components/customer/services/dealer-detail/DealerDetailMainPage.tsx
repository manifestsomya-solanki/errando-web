import DealerDetailHero from "../../../../assets/dealer-detail.png";
import Navigation from "../../../UI/Navigation";
import DealerDetailSection from "./DealerDetailSection";

import PhotosTitle from "./PhotosTitle";
import PhotosSection from "./PhotosSection";
import ReviewsBar from "./ReviewsBar";
import CommentSection from "./CommentSection";
import DealerDetailSkeleton from "../skeleton/DealerDetailSkeleton";
import { fetcher } from "../../../../store/customer/home-context";
import useSWR from "swr";

import { useLocation, useParams } from "react-router";
import ContactBar from "./ContactBar";
import { Business } from "../../../../models/customer/businesslist";
import TopBar from "../top-bar/TopBar";

function DealerDetailMainPage() {
  const page_key = useLocation()?.state?.page_key;
  console.log(page_key);
  const businessId = useParams();
  const serviceName = useLocation()?.state?.serviceName;
  const userRequestId = useLocation()?.state?.userRequestId;
  const distance = useLocation()?.state?.distance;
  const url = `https://erranddo.kodecreators.com/api/v1/businesses/${businessId?.id}/detail?user_request_id=${userRequestId}`;

  const { data, isLoading, mutate } = useSWR(url, fetcher);
  const serviceData: Business = data?.data;

  const displayPhoto = `https://erranddo.kodecreators.com/storage/${serviceData?.image}`;

  const subTitle = serviceData?.services?.map((d) => d.name).toString();

  return (
    <div className="overflow-x-hidden">
      {page_key === "customer" && <TopBar />}

      <div
        className={
          page_key === "customer"
            ? "xl:mt-[8.651474530831099vh] lg:mt-[9.651474530831099vh] xs:mt-[9.051474530831099vh]"
            : ""
        }
      >
        <div className="">
          <img
            src={DealerDetailHero}
            className="w-full h-[24.80965147453083vh] object-cover object-center "
          />
          <div className="lg:mx-20 xl:mx-36 xs:mx-5">
            <Navigation isButton={true} />
            <div>
              {isLoading ? (
                <DealerDetailSkeleton />
              ) : (
                <DealerDetailSection
                  page_key={page_key}
                  businessName={serviceData?.name}
                  requestId={userRequestId}
                  service={serviceName}
                  userBusinessId={serviceData?.user_id}
                  title={serviceData?.name}
                  subTitle={subTitle}
                  location={distance}
                  ratingCount={
                    serviceData?.reviews_avg_rating
                      ? serviceData?.reviews_avg_rating
                      : 0
                  }
                  icon={displayPhoto}
                  description={serviceData?.description}
                  quote={
                    serviceData?.request_quotes.length > 0
                      ? serviceData.request_quotes[0]?.quote
                      : ""
                  }
                  quoteType={
                    serviceData?.request_quotes.length > 0
                      ? serviceData.request_quotes[0]?.payment_type
                      : ""
                  }
                />
              )}
            </div>
            {serviceData?.responded_requests.length > 0 ||
            page_key === "pro" ? (
              <ContactBar
                website={serviceData?.website_url}
                email={serviceData?.email}
                phone_number={serviceData?.mobile_number}
                facebook={serviceData?.facebook_url}
                instagram={serviceData?.instagram_url}
                twitter={serviceData?.twitter_url}
              />
            ) : null}
            <PhotosTitle
              data={serviceData}
              mutate={mutate}
              page_key={page_key}
            />
            <PhotosSection />
            <ReviewsBar />
            <CommentSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealerDetailMainPage;
