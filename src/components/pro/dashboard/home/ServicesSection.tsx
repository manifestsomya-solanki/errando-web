import { useState } from "react";
import Add from "../../../../assets/Add";
import { useService } from "../../../../store/pro/service-context";
import { useTheme } from "../../../../store/theme-context";
import Heading from "../../../UI/Heading";
import ServiceSkeleton from "../../skeleton/ServiceSkeleton";
import HomeCard from "./HomeCard";
import ServiceItem from "./ServiceItem";
import AddServiceModal from "../../../../layout/pro-models/AddServiceLayout";
import EditServiceModal from "../../../../layout/pro-models/EditServiceModal";
import TableFooter from "../../leads/TableFooter";

function ServiceSection() {
  const [openModal, setOpenModal] = useState(false);
  const { theme } = useTheme();
  const {
    data,
    isServiceLoading,
    page,
    handlePrevPage,
    handleNextPage,
    setPage,
    total,
  } = useService();

  return (
    <div className="my-7">
      {openModal && <AddServiceModal onCancel={() => setOpenModal(false)} />}
      <Heading
        text="My Services & Locations"
        variant="headingTitle"
        headingclassname="!font-bold mx-1 tracking-wide dark:text-white"
      />
      <div>
        {isServiceLoading ? (
          <ServiceSkeleton limit={3} />
        ) : (
          <div className="grid xl:grid-cols-3 md:grid-cols-2 my-5 gap-5 xs:grid-cols-1">
            <HomeCard
              children={
                <div
                  onClick={() => setOpenModal(true)}
                  className="xs:py-10 cursor-pointer  border border-dashed rounded !border-[#707070] h-full flex justify-center items-center flex-col gap-5"
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
                    text={"Add Service"}
                    variant="subHeader"
                    headingclassname={` !font-semibold tracking-wide !text-lg text-slate-700  dark:text-slate-400`}
                  />
                </div>
              }
              className="!bg-transparent "
            />
            {data &&
              data?.length > 0 &&
              data.map((item, key) => {
                return (
                  <div key={key}>
                    <ServiceItem
                      serviceId={item?.id}
                      title={item?.service?.name}
                      business={item?.user_bussiness?.name}
                      locationOne={
                        item.post_codes[0]
                          ? `${item?.post_codes[0]?.radius} miles around ${item?.post_codes[0]?.postcode?.name}`
                          : ""
                      }
                      locationTwo={
                        item.post_codes[1]
                          ? `${item?.post_codes[1]?.radius} miles around ${item?.post_codes[1]?.postcode?.name}`
                          : ""
                      }
                      ratingCount={4}
                      progress="60%"
                      leads={20}
                      location={item.post_codes}
                      purchases={item.lead_count}
                      request_count={item.request_count}
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
      {data && data?.length > 0 && (
        <TableFooter
          valid={Math.ceil(total / 8) === page ? false : true}
          slice={data ?? []}
          page={page}
          prev={handlePrevPage}
          next={handleNextPage}
        />
      )}
    </div>
  );
}

export default ServiceSection;
