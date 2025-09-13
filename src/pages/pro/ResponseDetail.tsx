import LeadDetails from "../../components/pro/leads/LeadDetails";
import MyLeads from "../../components/pro/leads/MyLeads";
import MyResponses from "../../components/pro/responses/MyResponses";
import ResponsesDetail from "../../components/pro/responses/ResponsesDetail";

function ResponseDetail() {
  return (
    <div className="w-full lg:overflow-y-scroll lg:h-[85vh]">
      <MyResponses />
      <ResponsesDetail />
    </div>
  );
}

export default ResponseDetail;
