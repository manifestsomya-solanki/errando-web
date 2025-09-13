import { useEffect, useState } from "react";
import dot from "../../../assets/goldendot.svg";
import { useNotification } from "../../../store/customer/notification-context";
import FullPageLoading from "../../UI/FullPageLoading";
import Heading from "../../UI/Heading";
import { NavLink } from "react-router-dom";
function NotificationContentPro() {
  const {
    data: notification,
    isNotificationLoading,
    total,
  } = useNotification();
  console.log(notification.length);
  return (
    <div className="w-full items-center flex justify-center h-min">
      {isNotificationLoading ? (
        <FullPageLoading className="!h-5" />
      ) : (
        <div
          className={`bg-white py-5  xs:px-5 flex flex-col dark:bg-dimGray rounded-lg ${
            total == 0 ? "xl:w-[60vw]" : "xl:w-max"
          } xs:w-full dark:text-white overflow-y-scroll h-[58vh] soft-searchbar shadow-md border-t-slate-100 border-t-[0.5px] `}
        >
          {notification?.length === 0 ? (
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
                        className="text-primaryBlue capitalize"
                        to={`${JSON.parse(item.meta_data)?.other_data?.link}${
                          JSON.parse(item.meta_data)?.other_data?.id
                        }`}
                      >
                        {item.message.split("<br>")[0]}
                      </NavLink>
                      <div>{item.message.split("<br>")[1]}</div>
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
