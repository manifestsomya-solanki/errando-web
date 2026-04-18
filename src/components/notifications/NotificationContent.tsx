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
          className="bg-white py-5 xs:px-36 flex flex-col dark:bg-dimGray rounded-lg w-full max-w-6xl mx-auto dark:text-white overflow-y-scroll h-[58vh] soft-searchbar shadow-md border-t-slate-100 border-t-[0.5px]"
          ref={divRef}
        >
          {total === 0 ? (
            <Heading
              headingclassname="text-textColor font-poppins text-lg justify-center mx-auto"
              variant="subHeader"
              text="No Notifications"
            />
          ) : (
            <div className="w-full flex flex-col gap-3">
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
                  <div
                    key={item.id}
                    className="w-full grid grid-cols-[8px_92px_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-1 items-start text-left"
                  >
                    <img
                      src={dot}
                      alt=""
                      className="w-2 h-2 shrink-0 row-span-2 col-start-1 self-start mt-1.5"
                    />
                    <span className="col-start-2 row-start-1 text-base text-slate-500 dark:text-slate-300 whitespace-nowrap shrink-0">
                      {timeStr}
                    </span>
                    <NavLink
                      className="col-start-3 row-start-1 text-base text-primaryBlue capitalize break-words whitespace-normal leading-snug min-w-0"
                      to={otherLink}
                    >
                      {primaryText}
                    </NavLink>
                    <span className="col-start-2 row-start-2 text-base text-slate-500 dark:text-slate-300 whitespace-nowrap shrink-0">
                      {dateStr}
                    </span>
                    {secondaryText ? (
                      <div className="col-start-3 row-start-2 text-base text-primaryBlue capitalize break-words whitespace-normal leading-snug min-w-0">
                        {secondaryText}
                      </div>
                    ) : null}
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
