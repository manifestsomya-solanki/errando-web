import TopBar from "../dashboard/top-bar/TopBar";
import NotificationDetailPagePro from "./NotificationDetailPagePro";
import { Outlet } from "react-router";

function NotificationMainPagePro() {
  return (
    <div>
      <TopBar isNotificationDisabled={true} />
      <div className="xl:mt-[8.651474530831099vh]  lg:mt-[9.651474530831099vh] xs:mt-[9.051474530831099vh] xl:px-36 lg:px-32 xs:px-5">
        <NotificationDetailPagePro />
        <Outlet />
      </div>
    </div>
  );
}

export default NotificationMainPagePro;
