import SideNavBarItem from "./SideBarItem";
import Home from "../../../../assets/Home.tsx";
import Filter from "../../../../assets/Filter.tsx";
import Response from "../../../../assets/Resolve.tsx";
import Settings from "../../../../assets/Settings.tsx";
import { useLocation } from "react-router";
import Question from "../../../../assets/Question.tsx";
import SidebarImage from "../../../../assets/top-bar-image.png";
import { useTheme } from "../../../../store/theme-context.tsx";

function SideBar() {
  const { theme } = useTheme();

  const location = useLocation().pathname;
  return (
    <div
      className={`
        lg:w-60 fixed left-0 dark:bg-dimGray bg-white xl:top-[8.651474530831099vh]  lg:top-[9.651474530831099vh]   z-40 lg:flex xs:hidden shadow-lg h-full   flex-col justify-between`}
    >
      <div className="px-3">
        <SideNavBarItem
          link="/pro/dashboard"
          text="Dashboard"
          img={
            theme === "light" ? (
              <Home
                color={`${
                  location.startsWith("/pro/dashboard") ? "white" : "black"
                }`}
              />
            ) : (
              <Home
                color={`${
                  location.startsWith("/pro/dashboard") ? "white" : "#DF994F"
                }`}
              />
            )
          }
        />
        <SideNavBarItem
          link="/pro/leads"
          text="Leads"
          isNumber={true}
          number={99}
          img={
            theme === "light" ? (
              <Filter
                color={`${
                  location.startsWith("/pro/leads") ? "white" : "black"
                }`}
              />
            ) : (
              <Filter
                color={`${
                  location.startsWith("/pro/leads") ? "white" : "#DF994F"
                }`}
              />
            )
          }
        />
        <SideNavBarItem
          link="/pro/responses"
          text="Responses"
          isNumber={true}
          number={99}
          img={
            theme === "light" ? (
              <Response
                color={`${
                  location.startsWith("/pro/responses") ? "white" : "black"
                }`}
              />
            ) : (
              <Response
                color={`${
                  location.startsWith("/pro/responses") ? "white" : "#DF994F"
                }`}
              />
            )
          }
        />
        <SideNavBarItem
          link="/pro/settings"
          text="Settings"
          isNumber={true}
          img={
            theme === "light" ? (
              <Settings
                color={`${
                  location.startsWith("/pro/settings") ? "white" : "black"
                }`}
              />
            ) : (
              <Settings
                color={`${
                  location.startsWith("/pro/settings") ? "white" : "#df994f"
                }`}
              />
            )
          }
        />
      </div>
      <div className="mt-auto mb-16">
        <div className="px-3">
          <SideNavBarItem
            link="/pro/help"
            text="Help"
            isNumber={true}
            img={
              theme === "light" ? (
                <Question
                  color={`${location === "/pro/help" ? "white" : "black"}`}
                />
              ) : (
                <Question
                  color={`${location === "/pro/help" ? "white" : "#DF994F"}`}
                />
              )
            }
          />
        </div>
        <div className="rounded-sm">
          <img src={SidebarImage} />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
