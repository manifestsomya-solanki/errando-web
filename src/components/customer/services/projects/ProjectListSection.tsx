import CurrentProjects from "../../../../assets/green-box.svg";
import CompletedProjects from "../../../../assets/yellow-box.svg";
import Heading from "../../../UI/Heading";
import CompletedProjectTable from "./CompletedProjectTable";
import CurrentProjectTable from "./CurrentProjectTable";
import DataNotFound from "../../../../assets/dataNotFound.png";

import TableFooter from "../../../pro/leads/TableFooter";
import { useProject } from "../../../../store/customer/project-context";

import FullPageLoading from "../../../UI/FullPageLoading";
import { useTheme } from "../../../../store/theme-context";

function ProjectListSection() {
  const {
    currentNumber,
    completeNumber,
    current,
    complete,
    isCurrentLoading,
    isCompleteLoading,
  } = useProject();
  const theme = useTheme();
  const headingClass =
    "!font-extrabold !font-poppins-bold tracking-wide dark:text-darktextColor !lg:text-2xl";
  return (
    <div className="flex xs:flex-col lg:flex-row w-full justify-between lg:gap-10 dark:text-white">
      <div className="lg:w-3/6 xs:w-full">
        <div className="py-5 flex items-center justify-center  border-b-[0.5px] dark:border-b-lineColor border-b-slate-300">
          <div className="flex items-center gap-6">
            <img src={CurrentProjects} className="lg:w-12 xs:w-8" />
            <Heading
              variant="headingTitle"
              text={`Current Projects (${
                currentNumber?.toString().length < 2
                  ? "0" + currentNumber
                  : currentNumber ?? "00"
              })`}
              headingclassname={`text-primaryGreen dark:text-primaryGreen ${headingClass}`}
            />
          </div>
        </div>
        {currentNumber > 0 && !isCurrentLoading ? (
          <CurrentProjectTable data={current} />
        ) : (
          <div>
            {isCurrentLoading ? (
              <FullPageLoading
                className="!h-64 !bg-transparent"
                fill={theme.theme === "light" ? "#000" : "#ffffff"}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-max xs:py-10 ">
                <img src={DataNotFound} className="" />
                <Heading
                  text="Data Not Found"
                  variant="subTitle"
                  headingclassname="text-primaryGreen dark:text-primaryGreen !font-bold tracking-wide text-md"
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="lg:w-3/6 xs:w-full">
        <div className="py-5 flex items-center justify-center  border-b-[0.5px] dark:border-b-lineColor border-b-slate-300">
          <div className="flex items-center gap-6">
            <img src={CompletedProjects} className="lg:w-12 xs:w-8" />
            <Heading
              variant="headingTitle"
              text={`Completed Projects (${
                completeNumber?.toString().length < 2
                  ? "0" + completeNumber
                  : completeNumber ?? "00"
              })`}
              headingclassname={`text-primaryYellow dark:text-primaryYellow ${headingClass}`}
            />
          </div>
        </div>
        {completeNumber > 0 ? (
          <CompletedProjectTable data={complete} />
        ) : (
          <div>
            {isCompleteLoading ? (
              <FullPageLoading
                className="!h-64 !bg-transparent"
                fill={theme.theme === "light" ? "#000" : "#ffffff"}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-max xs:py-10 ">
                <img src={DataNotFound} className="" />
                <Heading
                  text="Data Not Found"
                  variant="subTitle"
                  headingclassname="text-primaryGreen dark:text-primaryGreen !font-bold tracking-wide text-md"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectListSection;
