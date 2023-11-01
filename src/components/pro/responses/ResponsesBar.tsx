import Heading from "../../UI/Heading";
import HomeCard from "../dashboard/home/HomeCard";
import Edit from "../../../assets/edit.svg";
import Outright from "../../../assets/outright.svg";
import LeadsSideSkeleton from "../skeleton/Leads/LeadsSideSkeleton";
import ResponsesList from "./ResponsesList";

import { useLeadResponse } from "../../../store/pro/response-context";
import useSWR from "swr";
import { fetcher } from "../../../store/customer/home-context";
import { useState } from "react";
import FilterLeadsModal from "../../../layout/pro-models/FilterLeads";
import Search from "../../../assets/search";
import SearchLeadsModal from "../../../layout/pro-models/SearchLeadsModal";

function ResponsesBar() {
  const { isLoading } = useLeadResponse();
  const url = `https://erranddo.kodecreators.com/api/v1/user-requests?for_pro=1&show_only_count=1`;
  let { data: count } = useSWR(url, fetcher);
  count = count?.data;
  const { total } = useLeadResponse();
  const [openModal, setOpenModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);

  return (
    <div>
      {openModal && (
        <FilterLeadsModal
          onCancel={() => setOpenModal(false)}
          filterKey="response"
        />
      )}
      {openSearchModal && (
        <SearchLeadsModal onCancel={() => setOpenSearchModal(false)} />
      )}
      {isLoading ? (
        <LeadsSideSkeleton limit={1} />
      ) : (
        <div className=" xs:pb-20 lg:pb-0 lg:overflow-y-scroll lg:h-[85vh] ">
          <div className=" ">
            <HomeCard className="rounded-md py-3 w-full flex justify-center gap-2 items-center ">
              <Heading
                text={`${count?.user_request_count ?? 0} Leads |  ${
                  count?.user_business_count ?? 0
                } Businesses | ${
                  count?.user_business_service_count ?? 0
                } Services`}
                variant="subHeader"
                headingclassname="!font-semibold my-2  text-slate-900 dark:text-white  tracking-wide text-center"
              />
              <div className=" hover:bg-slate-100 dark:hover:bg-slate-700 w-10 h-10 flex items-center justify-center rounded-full">
                <img
                  src={Edit}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                />
              </div>
              <div
                onClick={() => {
                  setOpenSearchModal(true);
                }}
                className=" hover:bg-slate-100 dark:hover:bg-slate-700 w-8 h-8 flex items-center justify-center rounded-full "
              >
                <Search color="#0003FF" />
              </div>
            </HomeCard>
            <HomeCard className="rounded-md py-3 w-full flex justify-center gap-2 items-center my-3">
              <Heading
                text={total}
                variant="subHeader"
                headingclassname="!font-semibold my-2  text-slate-900 dark:text-slate-400  tracking-wide "
              />
              <div className=" hover:bg-slate-100 w-10 h-10 flex items-center justify-center rounded-full">
                <img src={Outright} />
              </div>
              <Heading
                text={`Bought Outright`}
                variant="subHeader"
                headingclassname="!font-semibold my-2  text-primaryGreen   tracking-wide "
              />
            </HomeCard>
          </div>
          <ResponsesList />
        </div>
      )}
    </div>
  );
}

export default ResponsesBar;
