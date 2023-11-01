import { useLead } from "../../../store/pro/lead-context";
import TableFooter from "./TableFooter";
import LeadsListItem from "./LeadsListItem";

function LeadsList() {
  const { leads, page, handlePrevPage, handleNextPage, total } = useLead();

  //handling max next page
  const min = new Date().getMinutes();

  return (
    <div className="flex flex-col gap-3 ">
      {leads && leads?.length > 0 ? (
        leads.map((item, key) => {
          const answers = item?.answers.map((answerItem) => answerItem.answer);

          const createdAt = item?.created_at ? new Date(item.created_at) : null;
          return (
            <LeadsListItem
              key={key}
              time={createdAt}
              title={item?.user?.full_name?.split(" ")[0] ?? "--"}
              business={
                item?.provider_bussiness[0]?.name
                  ? `${item.provider_bussiness[0]?.name}`
                  : "No business"
              }
              service={`${item?.service?.name} `}
              answers={answers.length > 0 ? answers : ["No answers"]}
              location={`${item?.user?.city ?? "--"} , ${
                item?.postcode?.name?.slice(0, 3) ?? "--"
              }`}
              mincredits={6}
              maxcredits={3}
              id={item?.id}
              leads_count={item?.leads_count}
              interested={item?.intrests?.length > 0 ? true : false}
              quoteRequested={item?.quote_requests?.length > 0 ? true : false}
              is_read={item?.is_read == false}
              is_messaged={item?.is_messaged ?? false}
              is_email_verified={
                item?.user?.is_email_verified == "1" ? true : false
              }
              is_mobile_verified={
                item?.user?.is_mobile_verified == "1" ? true : false
              }
            />
          );
        })
      ) : (
        <div className="justify-center items-center flex font-semibold text-textColor h-[64vh] bg-white dark:bg-dimGray dark:text-darktextColor rounded-lg">
          Oops! There are no leads
        </div>
      )}
      {leads && leads?.length > 0 && (
        <TableFooter
          valid={Math.ceil(total / 10) === page ? false : true}
          slice={leads ?? []}
          page={page}
          prev={handlePrevPage}
          next={handleNextPage}
        />
      )}
    </div>
  );
}

export default LeadsList;
