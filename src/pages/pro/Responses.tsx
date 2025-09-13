import { Outlet, useLocation, useParams } from "react-router";
import ResponsesBar from "../../components/pro/responses/ResponsesBar";
import LeadContextProProvider from "../../store/pro/lead-context";
import LeadsResponseProvider from "../../store/pro/response-context";
import Heading from "../../components/UI/Heading";
import Credit from "../../assets/Credit.png";
import NavigateSettingsModal from "../../layout/pro-models/NavigateSettingsModal";
import { useAuth } from "../../store/customer/auth-context";

function Responses() {
  const id = useParams();
  const location = useLocation();
  const { userData, isDetailLoading } = useAuth();
  return (
    <LeadContextProProvider>
      <LeadsResponseProvider>
        <div className="xl:mt-[8.651474530831099vh] lg:fixed lg:mt-[9.651474530831099vh] xs:mt-[9.051474530831099vh] lg:pl-60 xs:px-5 lg:px-0 bg-gray-100  dark:bg-black  w-screen h-full pb-20 !lg:overflow-y-hidden xs:overflow-y-scroll">
          {(!userData?.address || !userData?.city || !userData?.postcode_id) &&
            !isDetailLoading && <>{<NavigateSettingsModal />}</>}
          <div className="mt-5 lg:mx-5 flex gap-5">
            <div
              className={`lg:w-3/6 lg:inline xs:w-full  ${
                id.id ? "xs:hidden " : "xs:inline  "
              }`}
            >
              <ResponsesBar />
            </div>
            <div
              className={`lg:inline  ${
                !id.id ? "xs:hidden" : "xs:inline"
              } xs:w-full`}
            >
              {location.pathname === "/pro/responses" ? (
                <div className="lg:h-[85vh] dark:bg-dimGray bg-white rounded-lg flex  flex-col justify-center items-center gap-5">
                  <img src={Credit} className="animate-bounce w-44" />
                  <Heading
                    text={`Please click on a lead to view its details.`}
                    variant="subHeader"
                    headingclassname="!font-semibold my-2  text-slate-900 dark:text-white  tracking-wide !text-xl"
                  />
                </div>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </div>
      </LeadsResponseProvider>
    </LeadContextProProvider>
  );
}

export default Responses;
