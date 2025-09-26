import { useNavigate } from "react-router";
import { Request } from "../../../../models/customer/requestlist";
import TableFooter from "../../../pro/leads/TableFooter";
import { useProject } from "../../../../store/customer/project-context";

function CurrentProjectTable(props: { data: Request[] }) {
  const requestData = props?.data;
  const { currentNumber, handleNextPage, handlePrevPage, currentPage } =
    useProject();
  const navigate = useNavigate();
  return (
    <div>
      <table className="w-full py-5 dark:text-white">
        <thead>
          <tr className=" border-b-[0.5px] border-b-slate-300 dark:border-b-lineColor">
            <th className="py-5 text-left">Date</th>
            <th className="py-5 text-left">Request Type</th>
            <th className="py-5 text-left">Location</th>
            <th className="py-5 text-left">Response</th>
          </tr>
        </thead>
        <tbody>
        {requestData?.map((d, key) => {
          if (d?.status === "PENDING") {
            const date = d?.created_at;
            return (
              <tr
                className="border-b-[0.5px] border-b-slate-300 dark:border-b-lineColor"
                key={key}
              >
                <td className="py-2 text-left">
                  <button
                    className="w-full p-2 text-left"
                    onClick={() =>
                      navigate(`/services/service-detail/${d?.id}`)
                    }
                  >
                    {date.split("T")[0]}
                  </button>
                </td>
                <td className="py-2 text-left">
                  <button
                    className="w-full p-2 text-left"
                    onClick={() =>
                      navigate(`/services/service-detail/${d?.id}`)
                    }
                  >
                    {d?.service?.name}
                  </button>
                </td>
                <td className="py-2 text-left">
                  <button className="w-full p-2 text-left">
                    {d?.postcode?.name}
                  </button>
                </td>
                <td className="py-2 text-left">
                  <button
                    className="w-full p-2 text-left"
                    onClick={() =>
                      navigate(`/services/service-detail/${d?.id}`)
                    }
                  >
                    {d?.leads_count < 10
                      ? "0" + d?.leads_count
                      : d?.leads_count}
                  </button>
                </td>
              </tr>
            );
          }
        })}
        </tbody>
      </table>
      <div className="w-full">
        <TableFooter
          className="ml-auto"
          valid={Math.ceil(currentNumber / 5) === currentPage ? false : true}
          slice={props.data ?? []}
          page={currentPage}
          prev={() => handlePrevPage("current")}
          next={() => handleNextPage("current")}
        />
      </div>
    </div>
  );
}

export default CurrentProjectTable;
