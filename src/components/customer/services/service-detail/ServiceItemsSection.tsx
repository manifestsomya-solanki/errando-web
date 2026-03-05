import { useState } from "react";
import ShowInterestToAllModal from "../../../../layout/customer/ShowInterestToAllModal";
import { Business } from "../../../../models/customer/businesslist";
import ServiceDetailSkeleton from "../skeleton/ServiceDetailSkeleton";
import ServiceCard from "./ServiceItem";

function ServiceItemsSection(props: {
  services: any[];
  name?: string;
  id?: number;
  isLoading?: boolean;
}) {
  const dataList = props?.services;
  const businessList: Business[] = [];
  for (let i = 0; i < dataList.length; i++) {
    dataList[i]?.map((d: Business) => businessList.push(d));
  }
  const isLoading = props?.isLoading;
  console.log(businessList, "helloo");

  return (
    <div>
      {isLoading ? (
        <ServiceDetailSkeleton limit={3} />
      ) : (
        <div className="my-5 grid lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 rounded-sm gap-5 ">
          {businessList?.map((item: Business) => {
            console.log(
              item?.request_quotes?.length > 0
                ? item.request_quotes[0]?.quote
                : "null",
              "quote chckinf"
            );

            return (
              <ServiceCard
                userId={item?.user_id}
                serviceName={props.name}
                serviceId={props.id}
                id={item?.id}
                icon={item?.image}
                title={item?.name}
                subTitle={item?.services}
                description={item?.description}
                location={
                  item?.business_postcode?.distance
                    ? Math.round(+item?.business_postcode?.distance)
                    : 0
                }
                ratingCount={item?.reviews_avg_rating}
                reviewsCount={item?.reviews_count ?? 0}
                isInterested={item?.is_interest}
                isClientNotInterested={
                  item?.user?.not_interested_user_requests?.length > 0
                    ? true
                    : false
                }
                isResponded={item?.is_responded}
                quote={item?.request_quotes}
                isQuoteRequested={item?.is_quote_requested}
                quotes={
                  item?.request_quotes?.length > 0
                    ? item.request_quotes[0]?.quote
                    : ""
                }
                quoteTypes={
                  item?.request_quotes?.length > 0
                    ? item.request_quotes[0]?.payment_type
                    : ""
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ServiceItemsSection;
