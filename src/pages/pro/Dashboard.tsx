import { Outlet, useLocation } from "react-router";
import SideBar from "../../components/pro/dashboard/side-bar/SideBar";
import TopBar from "../../components/pro/dashboard/top-bar/TopBar";
import MobileSideBar from "../../components/pro/dashboard/mobile-sidebar/MobileSideBar";
import BusinessContextProvider from "../../store/pro/dashboard-context";
import ServiceContextProvider from "../../store/pro/service-context";
import ReviewContextProProvider from "../../store/pro/review-context";

// const currentPath = window.location.pathname;
// const isPersonalInfoRoute = currentPath === "/pro/settings/personal-info";

function useIsPersonalInfoRoute() {
  const location = useLocation();
  return location.pathname === "/pro/settings/personal-info";
}

function Dashboard() {
  const isPersonalInfoRoute = useIsPersonalInfoRoute();
  return (
    <ServiceContextProvider>
      <BusinessContextProvider>
        <ReviewContextProProvider>
          <div className="overflow-x-hidden">
            <div>
              <TopBar isSettingDisabled={isPersonalInfoRoute ?? false} />
              <div className="h-screen flex flex-row w-screen">
                <SideBar />
                <Outlet />
              </div>
              <MobileSideBar />
            </div>
          </div>
        </ReviewContextProProvider>
      </BusinessContextProvider>
    </ServiceContextProvider>
  );
}

export default Dashboard;
