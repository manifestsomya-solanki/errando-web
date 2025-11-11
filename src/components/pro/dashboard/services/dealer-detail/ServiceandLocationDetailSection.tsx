import Heading from "../../../../UI/Heading";
import DealerServiceSkeleton from "../../../skeleton/Dealer/DealerServiceSkeleton";
import CategorySection from "./CategorySection";
import ServiceItem from "../../home/ServiceItem";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../../../../store/customer/home-context";
import { buildApiUrl, API_ENDPOINTS } from "../../../../../config/api";

function ServicesandLocationDetailSection() {
  const { id } = useParams();
  const [url, setUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      setUrl(
        buildApiUrl(`${API_ENDPOINTS.BUSINESS_SERVICES}?business_ids[]=${id}&per_page=100`)
      );
    }
  }, [id]);

  const { data, isLoading } = useSWR(url, fetcher);
  const services = data?.data || [];

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
            {services &&
              services.length > 0 &&
              services.map((item: any, key: number) => {
                return (
                  <div key={key}>
                    <ServiceItem
                      serviceId={item?.id}
                      title={item?.service?.name}
                      business={item?.user_bussiness?.name}
                      locationOne={
                        item.post_codes?.[0]
                          ? `${item?.post_codes[0]?.radius} miles around ${item?.post_codes[0]?.postcode}`
                          : ""
                      }
                      locationTwo={
                        item.post_codes?.[1]
                          ? `${item?.post_codes[1]?.radius} miles around ${item?.post_codes[1]?.postcode}`
                          : ""
                      }
                      ratingCount={4}
                      progress="60%"
                      leads={20}
                      location={item.post_codes || []}
                      purchases={item.lead_count || 0}
                      request_count={item.request_count || 0}
                      is_nation_wide={item.nation_wide == 1 ? true : false}
                      is_remote_service={
                        item.remote_service == 1 ? true : false
                      }
                    />
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicesandLocationDetailSection;
