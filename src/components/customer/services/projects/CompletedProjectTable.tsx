import { Request } from "../../../../models/customer/requestlist";
import { useProject } from "../../../../store/customer/project-context";
import TableFooter from "../../../pro/leads/TableFooter";
function CompletedProjectTable(props: { data: Request[] }) {
  const completeRequestData = props?.data;
  const { completeNumber, handleNextPage, handlePrevPage, completePage } =
    useProject();
  return (
    <div>
      <table className="w-full py-5 dark:text-white">
        <tr className=" border-b-[0.5px] border-b-slate-300 dark:border-b-lineColor">
          <th className="py-5 text-left">Date</th>
          <th className="py-5 text-left">Request Type</th>
          <th className="py-5 text-left">Location</th>
          <th className="py-5 text-left">Response</th>
        </tr>
        {completeRequestData?.map((d) => {
          if (d?.status === "COMPLETED") {
            const date = d?.updated_at;
            return (
              <tr className="border-b-[0.5px] border-b-slate-300 dark:border-b-lineColor">
                <td className="py-2 text-left">
                  <button className="w-full p-2 text-left">
                    {date.split("T")[0]}
                  </button>
                </td>
                <td className="py-2 text-left">
                  <button className="w-full p-2 text-left">
                    {d?.service?.name}
                  </button>
                </td>
                <td className="py-2 text-left">
                  <button className="w-full p-2 text-left">
                    {d?.postcode}
                  </button>
                </td>
                <td className="py-2 text-left">
                  <button className="w-full p-2 text-left">
                    {" "}
                    {d?.leads_count < 10
                      ? "0" + d?.leads_count
                      : d?.leads_count}
                  </button>
                </td>
              </tr>
            );
          }
        })}
      </table>
      <div className="w-full">
        <TableFooter
          className="ml-auto"
          valid={Math.ceil(completeNumber / 5) === completePage ? false : true}
          slice={props.data ?? []}
          page={completePage}
          prev={() => handlePrevPage("complete")}
          next={() => handleNextPage("complete")}
        />
      </div>
    </div>
  );
}

export default CompletedProjectTable;
