import dot from "../../../assets/goldendot.svg";
import { useNotification } from "../../../store/customer/notification-context";
import FullPageLoading from "../../UI/FullPageLoading";
import Heading from "../../UI/Heading";
import { NavLink } from "react-router-dom";

function NotificationContentPro() {
  const {
    data: notification,
    isNotificationLoading,
  } = useNotification();

  return (
    <div className="w-full items-center flex justify-center h-min">
      {isNotificationLoading ? (
        <FullPageLoading className="!h-5" />
      ) : (
        <div className="bg-white py-5 xs:px-5 flex flex-col dark:bg-dimGray rounded-lg w-full max-w-4xl mx-auto xs:w-full dark:text-white overflow-y-scroll h-[58vh] soft-searchbar shadow-md border-t-slate-100 border-t-[0.5px]">
          {notification?.length === 0 ? (
            <Heading
              headingclassname="text-textColor font-poppins text-lg justify-center mx-auto"
              variant="subHeader"
              text="No Notifications"
            />
          ) : (
            <div className="w-full mx-auto flex flex-col items-center gap-3">
              {notification.map((item) => {
                const parts = String(item.message ?? "").split("<br>");
                const primaryText = parts?.[0] ?? "";
                const secondaryText = parts?.[1] ?? "";

                let otherLink = "";
                try {
                  otherLink = `${
                    JSON.parse(item.meta_data)?.other_data?.link ?? ""
                  }${JSON.parse(item.meta_data)?.other_data?.id ?? ""}`;
                } catch {
                  otherLink = "";
                }

                const date = new Date(item?.created_at);
                const timeStr = `${date.getUTCHours()}:${date
                  .getUTCMinutes()
                  .toString()
                  .padStart(2, "0")}:${date
                  .getUTCSeconds()
                  .toString()
                  .padStart(2, "0")}`;
                const dateStr = String(item.created_at ?? "").split("T")[0];

                return (
                  <div key={item.id} className="w-fit mx-auto flex flex-col">

                    <div className="flex items-center gap-3">
                      <img src={dot} alt="" className="shrink-0" />

                      <span className="text-base text-slate-500 dark:text-slate-300 whitespace-nowrap w-[92px] shrink-0">
                        {timeStr}
                      </span>

                      <NavLink
                        className="text-base text-primaryBlue capitalize break-words whitespace-normal leading-snug"
                        to={otherLink}
                      >
                        {primaryText}
                      </NavLink>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="shrink-0" style={{ width: "10px" }} />

                      <span className="text-base text-slate-500 dark:text-slate-300 whitespace-nowrap w-[92px] shrink-0">
                        {dateStr}
                      </span>

                      {secondaryText ? (
                        <div className="text-base text-primaryBlue capitalize break-words whitespace-normal leading-snug">
                          {secondaryText}
                        </div>
                      ) : null}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationContentPro;