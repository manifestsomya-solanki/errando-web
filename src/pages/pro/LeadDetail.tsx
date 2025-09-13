import LeadDetails from "../../components/pro/leads/LeadDetails";
import MyLeads from "../../components/pro/leads/MyLeads";

function LeadDetail() {
  return (
    <div className="w-full lg:overflow-y-scroll lg:h-[85vh]">
      <MyLeads />
      <LeadDetails />
    </div>
  );
}

export default LeadDetail;
