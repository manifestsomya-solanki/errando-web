import { NavLink } from "react-router-dom";
import dot from "../../assets/goldendot.svg";
import { useNotification } from "../../store/customer/notification-context";
import FullPageLoading from "../UI/FullPageLoading";
import Heading from "../UI/Heading";
import { useRef, useState } from "react";

function NotificationContent() {
  const {
    data: notification,
    isNotificationLoading,
    handleNextPage,
    currentPage,
    total,
  } = useNotification();
  const divRef = useRef<HTMLDivElement>(null); //ref to set the height
  const [moreloading, setMoreLoading] = useState(false);

  const handleScroll = () => {
    setMoreLoading(true);
    const container = divRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      console.log(scrollTop, clientHeight, scrollHeight);
      const isNearBottom =
        Math.floor(scrollHeight - scrollTop) === clientHeight;

      if (isNearBottom) {
        setMoreLoading(false);
        setInterval(() => handleNextPage(), 100);
      }
    }
  };
  const oldNotifications = [...notification];
  console.log(oldNotifications);
  console.log(Math.ceil(total / 11), "ceil");
  console.log(moreloading, total, currentPage);
  return (
    <div className="w-full items-center flex justify-center ">
      {isNotificationLoading && !moreloading && currentPage === 1 ? (
        <FullPageLoading className="!h-24" />
      ) : (
        <div
          onScroll={
            Math.ceil(total / 13) === currentPage + 1
              ? handleScroll
              : () => {
                  console.log("disbaled");
                }
          }
          className="bg-white py-5  xs:px-5 flex flex-col dark:bg-dimGray rounded-lg xl:w-max xs:w-full dark:text-white overflow-y-scroll h-[58vh] soft-searchbar shadow-md border-t-slate-100 border-t-[0.5px] "
          ref={divRef}
        >
          {total === 0 ? (
            <Heading
              headingclassname="text-textColor font-poppins text-lg justify-center mx-auto"
              variant="subHeader"
              text="No Notifications"
            ></Heading>
          ) : (
            <div className="flex flex-col gap-2">
              {notification.map((item) => {
                return (
                  <div className="md:flex flex-row gap-5">
                    <div className="flex flex-row gap-4">
                      <img src={dot}></img>
                      <div>{`${new Date(
                        item?.created_at
                      ).getUTCHours()}:${new Date(item?.created_at)
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, "0")}:${new Date(item?.created_at)
                        .getUTCSeconds()
                        .toString()
                        .padStart(2, "0")}`}</div>
                      <div>{item.created_at.split("T")[0]}</div>
                    </div>
                    <div className="xs:hidden md:flex">|</div>
                    <div className="sm:flex md:flex flex-row gap-3">
                      <NavLink
                        className="text-primaryBlue capitalize flex-nowrap"
                        to={`${JSON.parse(item.meta_data)?.other_data?.link}${
                          JSON.parse(item.meta_data)?.other_data?.id
                        }`}
                      >
                        {item.message.split("<br>")[0]}
                      </NavLink>
                      <div className=" flex-nowrap">
                        {item.message.split("<br>")[1]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isNotificationLoading && (
            <FullPageLoading className="!h-8 xl:w-[90vh] xs:w-full " />
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationContent;
