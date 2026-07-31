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
import { buildApiUrl, API_ENDPOINTS } from "../../../config/api";
import { getLeadPurchaseSlotCount } from "../../../utils/leadSlots";
import "../dashboard/services/dealer-detail/check.css";
import { useState } from "react";
import { resolveAssetUrl } from "../../../utils/resolveAssetUrl";

const PENDING_LEAD_PURCHASE_KEY = "pending_lead_purchase";

function DangerousHTML({
  dangerouslySetInnerHTML,
}: {
  dangerouslySetInnerHTML: { __html: string };
}) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<span class="text-textColor !font-normal tracking-wide !text-lg dark:text-white">${dangerouslySetInnerHTML.__html}</span>`,
      }}
    />
  );
}

function LeadDetails() {
  const leadsId = useParams();
  const dealerdetailurl = buildApiUrl(
    `${API_ENDPOINTS.USER_REQUESTS_DETAIL}/${leadsId.id}/detail?for_pro=1`
  );
  const { data: leadsDetailData, isLoading, error: apiError } = useSWR(
    leadsId?.id ? dealerdetailurl : null,
    fetcher
  );
  const leadsDetail: UserRequestList = leadsDetailData?.data;
  
  
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
  const purchasedSlots = getLeadPurchaseSlotCount(leadsDetail);
  const availableCredits = Number(userData?.available_credits ?? 0);
  const leadCreditsRequired = Number(leadsDetail?.calculated_base_credits ?? 3);
  const outrightCreditsRequired = Number(
    leadsDetail?.calculated_outright_credits ?? 6
  );
  const [insufficientMessage, setInsufficientMessage] = useState<string>("");
  const hasInsufficientForLead = availableCredits < leadCreditsRequired;
  const hasInsufficientForOutright = availableCredits < outrightCreditsRequired;
  const leadBlockedBySlots = (leadsDetail?.leads_count ?? 0) >= 4;
  const outrightBlockedBySlots = purchasedSlots > 0;
  const insufficientButtonClass =
    "!bg-primaryBlue !border-primaryBlue !text-white hover:!bg-primaryBlue/80";

  const disableEmailsAndLinks = (text: any) => {
    if (!text || typeof text !== 'string') {
      return '';
    }
    const emailRegex = /\S+@\S+\.\S+/g;
    const urlRegex = /(?:https?|ftp):\/\/[\n\S]+|www\.[\S]+\.[a-z]+/g;
    const numberSequenceRegex = /(\d[\d\s\-\.]{0,}\d|\d)/g;
    
    let processedText = text.replace(
      emailRegex,
      '<span class="blur-text">$&</span>'
    );
    processedText = processedText.replace(
      urlRegex,
      '<span class="blur-text">$&</span>'
    );
    
    processedText = processedText.replace(numberSequenceRegex, (match) => {
      const digitsOnly = match.replace(/\D/g, '');
      
      if (digitsOnly.length > 6) {
        return '<span class="blur-text">' + match + '</span>';
      }
      
      return match;
    });
    
    return processedText;
  };

  const handleBuy = async (type: string) => {
    setInsufficientMessage("");
    if (type === "lead" && hasInsufficientForLead) {
      localStorage.setItem(
        PENDING_LEAD_PURCHASE_KEY,
        JSON.stringify({
          user_request_id: leadsId?.id ?? "",
          purchase_type: "lead",
          lead_credits_required: leadCreditsRequired,
          created_at: Date.now(),
        })
      );
      setInsufficientMessage(
        `Insufficient credits. You need ${leadCreditsRequired} credits, but you only have ${availableCredits}.`
      );
      navigate("/pro/settings/credits");
      return;
    }
    if (type === "outright" && hasInsufficientForOutright) {
      localStorage.setItem(
        PENDING_LEAD_PURCHASE_KEY,
        JSON.stringify({
          user_request_id: leadsId?.id ?? "",
          purchase_type: "outright",
          outright_credits_required: outrightCreditsRequired,
          created_at: Date.now(),
        })
      );
      setInsufficientMessage(
        `Insufficient credits. You need ${outrightCreditsRequired} credits, but you only have ${availableCredits}.`
      );
      navigate("/pro/settings/credits");
      return;
    }

    const formData = new FormData();
    formData.append("user_request_id", leadsId?.id ?? "");
    formData.set("for_pro", "1");
    let result = { success: false, code: "", message: "" };
    if (type === "outright") {
      formData.set("is_outright", "1");
      result = await buyLead(formData, "outright");
    } else {
      formData.set("is_outright", "0");
      result = await buyLead(formData, "lead");
    }

    if (!result.success) {
      if (result.code === "INSUFFICIENT_CREDITS") {
        setInsufficientMessage(
          result.message ||
            "Insufficient credits. Please buy credits to continue."
        );
      }
      return;
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
                  <DangerousHTML
                    dangerouslySetInnerHTML={{
                      __html: disableEmailsAndLinks(answer?.answer || "--"),
                    }}
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
              <DangerousHTML
                dangerouslySetInnerHTML={{
                  __html: disableEmailsAndLinks(leadsDetail?.comment || ""),
                }}
              />
            </div>
          </div>
          <div className="py-4 flex justify-between gap-5">
            <div>
              <img
                src={
                  leadsDetail?.file
                    ? resolveAssetUrl(leadsDetail?.file)
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
                text={`${leadsDetail?.calculated_base_credits ?? 3} credits`}
                variant="subHeader"
                headingclassname="!font-normal !text-sm mx-1 text-textColor tracking-wide dark:text-white"
              />
              <Button
                disabled={
                  leadBlockedBySlots
                }
                variant="filled"
                color="primary"
                size="normal"
                children="Buy Leads"
                buttonClassName={`!px-4 py-2 text-sm tracking-wide disabled:text-white ${
                  hasInsufficientForLead ? insufficientButtonClass : ""
                }`}
                onClick={() => handleBuy("lead")}
                loading={isBuyLeadLoading}
              />
            </div>
            {purchasedSlots === 0 && (
              <div className="flex w-full items-center gap-3 relative">
                <img src={Credit} className="w-5 h-5 object-cover" />
                <Heading
                  text={`${leadsDetail?.calculated_outright_credits ?? 6} credits`}
                  variant="subHeader"
                  headingclassname="!font-normal !text-sm mx-1 text-textColor tracking-wide dark:text-white"
                />
                <Button
                  disabled={
                    outrightBlockedBySlots
                  }
                  variant="filled"
                  color="primary"
                  size="normal"
                  children="Buy Outright"
                  buttonClassName={`!px-4 py-2 text-sm tracking-wide disabled:text-white ${
                    hasInsufficientForOutright
                      ? insufficientButtonClass
                      : ""
                  }`}
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
                    headingclassname="!font-normal !text-sm mx-1 text-primaryGreen tracking-wide dark:text-primaryGreen"
                  />
                </div>
              </div>
            )}
          </div>
          {insufficientMessage && (
            <div className="pb-3 flex items-center gap-3">
              <Heading
                text={insufficientMessage}
                variant="subHeader"
                headingclassname="!font-normal !text-sm text-red-500 tracking-wide dark:text-red-400"
              />
              <Button
                variant="filled"
                color="primary"
                size="normal"
                children="Buy Credits"
                buttonClassName="!px-4 py-2 text-sm tracking-wide"
                onClick={() => navigate("/pro/settings/credits")}
              />
            </div>
          )}
        </HomeCard>
      )}
    </div>
  );
}

export default LeadDetails;
