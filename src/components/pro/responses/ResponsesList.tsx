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
              location={(() => {
                const city = item?.user?.city ? String(item.user.city).trim() : undefined;
                let postcode: string | undefined;
                
                if (typeof item?.postcode === 'string') {
                  postcode = item.postcode.trim();
                } else if (item?.postcode && typeof item.postcode === 'object' && 'name' in item.postcode) {
                  const postcodeName = (item.postcode as { name: string }).name;
                  postcode = postcodeName ? String(postcodeName).trim() : undefined;
                }
                
                if (city && city.length > 0 && postcode && postcode.length > 0) {
                  return `${city}, ${postcode}`;
                } else if (postcode && postcode.length > 0) {
                  return postcode;
                } else if (city && city.length > 0) {
                  return city;
                }
                return "--";
              })()}
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
