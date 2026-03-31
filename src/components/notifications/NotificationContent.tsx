import { NavLink } from "react-router-dom";
import dot from "../../assets/goldendot.svg";
import { useNotification } from "../../store/customer/notification-context";
import FullPageLoading from "../UI/FullPageLoading";
import Heading from "../UI/Heading";
import { useEffect, useRef, useState } from "react";

function NotificationContent() {
  const {
    data: notification,
    isNotificationLoading,
    handleNextPage,
    currentPage,
    total,
  } = useNotification();
  const divRef = useRef<HTMLDivElement>(null);
  const [moreloading, setMoreLoading] = useState(false);

  useEffect(() => {
    setMoreLoading(false);
  }, [currentPage]);

  const handleScroll = () => {
    const container = divRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom =
        Math.floor(scrollHeight - scrollTop) === clientHeight;

      if (isNearBottom && !moreloading) {
        setMoreLoading(true);
        handleNextPage();
      }
    }
  };

  return (
    <div className="w-full items-center flex justify-center">
      {isNotificationLoading && !moreloading && currentPage === 1 ? (
        <FullPageLoading className="!h-24" />
      ) : (
        <div
          onScroll={
            Math.ceil(total / 13) > currentPage ? handleScroll : undefined
          }
          className="bg-white py-5 xs:px-5 flex flex-col dark:bg-dimGray rounded-lg w-full max-w-4xl mx-auto dark:text-white overflow-y-scroll h-[58vh] soft-searchbar shadow-md border-t-slate-100 border-t-[0.5px]"
          ref={divRef}
        >
          {total === 0 ? (
            <Heading
              headingclassname="text-textColor font-poppins text-lg justify-center mx-auto"
              variant="subHeader"
              text="No Notifications"
            />
          ) : (
            <div className="flex flex-col gap-3">
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
                  <div key={item.id} className="flex flex-col px-2">

                    {/* ✅ ROW 1 — dot + time + primary text all on same line */}
                    <div className="flex items-center gap-3">
                      {/* Dot */}
                      <img src={dot} alt="" className="shrink-0" />

                      {/* Time */}
                      <span className="text-base text-slate-500 dark:text-slate-300 whitespace-nowrap w-[92px] shrink-0">
                        {timeStr}
                      </span>

                      {/* Primary Text */}
                      <NavLink
                        className="text-base text-primaryBlue capitalize break-words whitespace-normal leading-snug"
                        to={otherLink}
                      >
                        {primaryText}
                      </NavLink>
                    </div>

                    {/* ✅ ROW 2 — (dot placeholder) + date + secondary text all on same line */}
                    <div className="flex items-center gap-3">
                      {/* Dot placeholder to keep alignment */}
                      <span className="shrink-0" style={{ width: "10px" }} />

                      {/* Date */}
                      <span className="text-base text-slate-500 dark:text-slate-300 whitespace-nowrap w-[92px] shrink-0">
                        {dateStr}
                      </span>

                      {/* Secondary Text */}
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

          {isNotificationLoading && (
            <FullPageLoading className="!h-8 xl:w-[90vh] xs:w-full" />
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationContent;