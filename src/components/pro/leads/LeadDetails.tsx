import Heading from "../../UI/Heading";
import HomeCard from "../dashboard/home/HomeCard";
import Credit from "../../../assets/Credit.png";
import NoImage from "../../../assets/no-photo.png";

import Button from "../../UI/Button";
import LeadsDetailSkeleton from "../skeleton/Leads/LeadsDetailSkeleton";
import { useNavigate, useParams } from "react-router";
import useSWR from "swr";
import { fetcher } from "../../../store/customer/home-context";
import { UserRequestList } from "../../../models/pro/userrequestlist";
import { useLead } from "../../../store/pro/lead-context";
import { useAuth } from "../../../store/pro/auth-pro-context";
import { useState } from "react";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../../config/api";

function LeadDetails() {
  const leadsId = useParams();
  const dealerdetailurl = buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS_DETAIL}/${leadsId.id}/detail`);
  const { data: leadsDetailData, isLoading, error: apiError } = useSWR(
    leadsId?.id ? dealerdetailurl : null,
    fetcher
  );
  const leadsDetail: UserRequestList = leadsDetailData?.data;
  
  // Debug logging
  console.log("LeadDetails Debug:", {
    leadsId: leadsId?.id,
    url: dealerdetailurl,
    isLoading,
    apiError,
    responseStatus: leadsDetailData?.status,
    hasData: !!leadsDetail,
    answersCount: leadsDetail?.answers?.length,
    hasUser: !!leadsDetail?.user,
    fullResponse: leadsDetailData
  });
  
  if (apiError) {
    console.error("LeadDetails API Error:", apiError);
  }
  if (leadsDetailData && leadsDetailData.status === "0") {
    console.error("LeadDetails API Response Error:", leadsDetailData.message);
  }
  const { userData } = useAuth();
  const { buyLead, page, isBuyLeadLoading, isBuyOutrightLoading } = useLead();
  const baseUrl = buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?for_pro=1&page=${page}&per_page=5`);
  const { mutate } = useSWR(baseUrl, fetcher);

  const navigate = useNavigate();

  const handleBuy = async (type: string) => {
    const formData = new FormData();
    formData.append("user_request_id", leadsId?.id ?? "");
    formData.set("for_pro", "1");
    if (type === "outright") {
      formData.set("is_outright", "1");
      await buyLead(formData, "outright");
    } else {
      formData.set("is_outright", "0");
      await buyLead(formData, "lead");
    }

    await mutate();
    navigate("/pro/responses");
  };

  return (
    <div>
      {isLoading ? (
        <LeadsDetailSkeleton limit={1} />
      ) : apiError || (leadsDetailData && leadsDetailData.status === "0") ? (
        <HomeCard className="rounded-md  px-5 pb-10 mt-5">
          <div className="py-4">
            <Heading
              text={leadsDetailData?.message || "Failed to load lead details"}
              variant="subHeader"
              headingclassname="!font-normal !text-lg mx-1 text-red-500 tracking-wide dark:text-red-400"
            />
          </div>
        </HomeCard>
      ) : !leadsDetail ? (
        <HomeCard className="rounded-md  px-5 pb-10 mt-5">
          <div className="py-4">
            <Heading
              text="No data available"
              variant="subHeader"
              headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
            />
          </div>
        </HomeCard>
      ) : (
        <HomeCard className="rounded-md  px-5 pb-10 mt-5">
          <div className="py-4 border-b-[0.5px] border-b-slate-200">
            <Heading
              text={`Leads Details`}
              variant="subHeader"
              headingclassname="!font-bold  text-textColor  text-xl tracking-wide dark:text-white"
            />
          </div>
          <div className="py-4 grid lg:grid-cols-2 xs:gap-3 lg:gap-6">
            {leadsDetail?.answers && leadsDetail.answers.length > 0 ? (
              leadsDetail.answers.map((answer) => (
                <div key={answer.id}>
                  <Heading
                    text={answer?.question?.title || "Question"}
                    variant="subTitle"
                    headingclassname="!font-semibold text-slate-400 !text-sm  mx-1 tracking-wide dark:text-slate-400 "
                  />
                  <Heading
                    text={answer?.answer || "--"}
                    variant="subHeader"
                    headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                  />
                </div>
              ))
            ) : (
              <div>
                <Heading
                  text={"No data available"}
                  variant="subHeader"
                  headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                />
              </div>
            )}
          </div>
          <div className="py-4 grid lg:grid-cols-2 xs:gap-3 lg:gap-0">
            <div>
              <Heading
                text={"Comments / Photos"}
                variant="subTitle"
                headingclassname="!font-semibold text-slate-400 !text-sm  mx-1 tracking-wide dark:text-slate-400 "
              />
              <Heading
                text={leadsDetail?.comment}
                variant="subHeader"
                headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
              />
            </div>
          </div>
          <div className="py-4 flex justify-between gap-5">
            <div>
              <img
                src={
                  leadsDetail?.file
                    ? `https://erranddo.s3.eu-west-2.amazonaws.com/${leadsDetail?.file}`
                    : NoImage
                }
                className="lg:h-60 md:h-36 xs:h-28 w-full object-cover"
              />
            </div>
          </div>
          <div className="py-4 flex lg:flex-row xs:flex-col justify-between gap-5">
            <div className="flex w-full items-center gap-3">
              <img src={Credit} className="w-5 h-5 object-cover" />
              <Heading
                text={`3 credits`}
                variant="subHeader"
                headingclassname="!font-normal !text-sm mx-1 text-textColor tracking-wide dark:text-white"
              />
              <Button
                disabled={
                  (leadsDetail?.leads_count ?? 0) >= 4 ||
                  (userData?.available_credits ?? 0) == 0
                }
                variant="filled"
                color="primary"
                size="normal"
                children="Buy Leads"
                buttonClassName="!px-4 py-2 text-sm tracking-wide  disabled:text-white"
                onClick={() => handleBuy("lead")}
                loading={isBuyLeadLoading}
              />
            </div>
            {(leadsDetail?.leads_count ?? 0) === 0 && (
              <div className="flex w-full items-center gap-3 relative">
                <img src={Credit} className="w-5 h-5 object-cover" />
                <Heading
                  text={`6 credits`}
                  variant="subHeader"
                  headingclassname="!font-normal !text-sm mx-1 text-textColor tracking-wide dark:text-white"
                />
                <Button
                  disabled={
                    (leadsDetail?.leads_count ?? 0) > 0 ||
                    (userData?.available_credits ?? 0) == 0
                  }
                  variant="filled"
                  color="primary"
                  size="normal"
                  children="Buy Outright"
                  buttonClassName="!px-4 py-2 text-sm tracking-wide disabled:text-white"
                  onClick={() => handleBuy("outright")}
                  loading={isBuyOutrightLoading}
                />
                <div className="absolute flex left-0 -bottom-10">
                  <Heading
                    text={`Why share this lead?`}
                    variant="subHeader"
                    headingclassname="!font-normal !text-sm mx-1 text-textColor tracking-wide dark:text-white"
                  />
                  <Heading
                    text={`BUY OUTRIGHT`}
                    variant="subHeader"
                    headingclassname="!font-normal !text-sm mx-1 text-primaryYellow tracking-wide dark:text-primaryYellow"
                  />
                </div>
              </div>
            )}
          </div>
        </HomeCard>
      )}
    </div>
  );
}

export default LeadDetails;
