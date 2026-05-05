import { useLeadResponse } from "../../../store/pro/response-context";
import TableFooter from "../leads/TableFooter";
import ResponsesListItem from "./ResponsesListItem";
import { formatUKPostcode } from "../../../utils/postcodeFormatter";

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
                const city = item?.user?.city
                  ? String(item.user.city).trim()
                  : undefined;
                const townName = item?.town_name
                  ? String(item.town_name).trim()
                  : undefined;
                let postcode: string | undefined;

                if (typeof item?.postcode === "string") {
                  postcode = item.postcode.trim();
                } else if (
                  item?.postcode &&
                  typeof item.postcode === "object" &&
                  "name" in item.postcode
                ) {
                  const postcodeName = (item.postcode as { name: string }).name;
                  postcode = postcodeName ? String(postcodeName).trim() : undefined;
                }

                const formattedPostcode = formatUKPostcode(postcode);
                const postcodeDisplay = formattedPostcode
                  ? formattedPostcode.replace(/\s+/g, " ").trim()
                  : "";

                if (townName && postcodeDisplay) {
                  if (city && city.length > 0) {
                    return `${city}, ${townName}, ${postcodeDisplay}`;
                  }
                  return `${townName}, ${postcodeDisplay}`;
                }

                if (city && city.length > 0 && postcodeDisplay) {
                  return `${city}, ${postcodeDisplay}`;
                } else if (postcodeDisplay) {
                  return postcodeDisplay;
                } else if (city && city.length > 0) {
                  return city;
                }
                return "--";
              })()}
              id={item?.id}
              userId={item?.user?.id}
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
