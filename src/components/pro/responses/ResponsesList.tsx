import { useLeadResponse } from "../../../store/pro/response-context";
import TableFooter from "../leads/TableFooter";
import ResponsesListItem from "./ResponsesListItem";

function ResponsesList() {
  const {
    leadsResponse,
    page,
    handlePrevPage,
    handleNextPage,
    setPage,
    total,
  } = useLeadResponse();

  return (
    <div className="flex flex-col gap-3 ">
      {leadsResponse && leadsResponse?.length > 0 ? (
        leadsResponse.map((item, key) => {
          const answers = item?.answers.map((answerItem) => answerItem.answer);
          const createdAt = item?.leads[0]?.created_at
            ? new Date(item?.leads[0]?.created_at)
            : null;

          return (
            <ResponsesListItem
              time={createdAt}
              title={item?.user?.full_name}
              business={
                item?.provider_bussiness[0]?.name
                  ? `${item.provider_bussiness[0].name}`
                  : "No business"
              }
              service={`${item?.service?.name} `}
              answers={answers.length > 0 ? answers : ["No answers"]}
              location={`${item?.user?.city ?? "--"} , ${
                item?.postcode?.name ?? "--"
              }`}
              id={item?.id}
              is_outright={item?.leads[0]?.is_outright ? true : false}
              interested={item?.intrests?.length > 0 ? true : false}
              quoteRequested={item?.quote_requests?.length > 0 ? true : false}
            />
          );
        })
      ) : (
        <div className="justify-center items-center flex font-semibold text-textColor h-[64vh] bg-white dark:bg-dimGray dark:text-darktextColor rounded-lg">
          Oops! There are no responses
        </div>
      )}
      {leadsResponse && leadsResponse?.length > 0 && (
        <TableFooter
          valid={Math.ceil(total / 10) === page ? false : true}
          slice={leadsResponse ?? []}
          page={page}
          prev={handlePrevPage}
          next={handleNextPage}
        />
      )}
    </div>
  );
}

export default ResponsesList;
