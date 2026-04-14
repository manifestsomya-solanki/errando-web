import Heading from "../../UI/Heading";
import HomeCard from "../dashboard/home/HomeCard";
import { NavLink } from "react-router-dom";
import LocationIcon from "../../../assets/LocationIcon";
import Outright from "../../../assets/outright.svg";

import { useTheme } from "../../../store/theme-context";
import { useState, useEffect, useRef } from "react";
// import Dustbin from "../../../assets/delete.svg";
import Dustbin from "../../../assets/Dustbin";
import DeleteChatModal from "./ChatSection/DeleteChatModal";
import dayjs from "dayjs";
import MailIcon from "../../../assets/MailIcon";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { useAuth } from "../../../store/pro/auth-pro-context";

function getTimeDifferenceString(time: any) {
  const currentTime = dayjs();
  const postTime = dayjs(time);

  const diffInMinutes = currentTime.diff(postTime, "minute");
  const diffInHours = currentTime.diff(postTime, "hour");
  const diffInDays = currentTime.diff(postTime, "day");

  if (diffInMinutes < 1) {
    return "Purchased less than a minute ago";
  } else if (diffInMinutes < 60) {
    return `Purchased ${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"
      } ago`;
  } else if (diffInHours < 24) {
    return `Purchased ${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else {
    return `Purchased ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }
}

function ResponsesListItem(props: {
  id: number;
  time: any;
  title: string;
  business: string;
  service: string;
  // subTitle: string[];
  answers: string[];
  location: string;
  is_outright: boolean;
  interested: boolean;
  quoteRequested: boolean;
  userId?: number;
}) {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const [hasCustomerSentMessage, setHasCustomerSentMessage] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Check if customer has sent any messages - using real-time listener
  useEffect(() => {
    // Cleanup previous listener if exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!userData?.id || !props?.userId) {
      setHasCustomerSentMessage(false);
      return;
    }

    let combinedId: any;
    if (userData?.id && props?.userId) {
      combinedId =
        +props.userId < userData.id
          ? props.userId + "-" + userData.id
          : userData.id + "-" + props.userId;
    }
    if (!combinedId) {
      setHasCustomerSentMessage(false);
      return;
    }

    const checkCustomerMessages = async () => {
      try {
        const getChatQuery = query(
          collection(db, "chats"),
          where("chat_id", "==", combinedId)
        );
        const getChatDocument = await getDocs(getChatQuery);

        if (getChatDocument?.docs?.length > 0) {
          const chatRef = collection(
            db,
            "chats",
            getChatDocument.docs[0].id,
            "messages"
          );

          // Use real-time listener to check if there are any messages from the customer
          // Listen to all messages and filter in JavaScript to handle type mismatches
          const customerUserId = props.userId;
          const customerUserIdStr = String(customerUserId);
          const customerUserIdNum = Number(customerUserId);

          unsubscribeRef.current = onSnapshot(
            chatRef,
            (snapshot) => {
              // Check if any message has sender_id matching customer (try both string and number)
              const hasMessage = snapshot.docs.some((doc) => {
                const data = doc.data();
                const senderId = data.sender_id;
                // Compare with both string and number formats
                return (
                  senderId === customerUserId ||
                  senderId === customerUserIdStr ||
                  senderId === customerUserIdNum ||
                  String(senderId) === customerUserIdStr ||
                  Number(senderId) === customerUserIdNum
                );
              });
              setHasCustomerSentMessage(hasMessage);
            },
            (err) => {
              console.log("Error listening to customer messages:", err, {
                customerUserId,
                customerUserIdStr,
                customerUserIdNum,
                combinedId
              });
              setHasCustomerSentMessage(false);
            }
          );
        } else {
          setHasCustomerSentMessage(false);
        }
      } catch (err) {
        console.log("Error checking customer messages:", err, {
          userId: props.userId,
          userDataId: userData?.id,
          combinedId
        });
        setHasCustomerSentMessage(false);
      }
    };

    checkCustomerMessages();

    // Cleanup function to unsubscribe from listener
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [userData?.id, props?.userId]);
  // const handleSelect = async () => {
  //   //check whether the group(chats in firestore) exists, if not create
  //   let combinedId: any
  //   if (currentUser?.uid) {
  //     combinedId = currentUser?.uid < +user?.uid
  //       ? currentUser?.uid + "-" + user?.uid
  //       : user?.uid + "-" + currentUser?.uid;
  //   }

  //   try {
  //     const res = await getDoc(doc(db, "chats", combinedId));
  //     const getChatQuery = query(
  //       collection(db, "chats"),
  //       where("chat_id", "==", combinedId)
  //     );
  //     const getChatDocument = await getDocs(getChatQuery);

  //     if (!res.exists() && getChatDocument.empty) {
  //       const usersObject: any = {};
  //       usersObject[1] = currentUser;
  //       usersObject[2] = user;
  //       const loginUser = {
  //         id: "loginUserId",
  //         fullName: "John Doe",
  //       };

  //       const otherUser = {
  //         id: "otherUserId",
  //         fullName: "Jane Smith",
  //       };
  //       const chatData = {
  //         chat_id: combinedId,
  //         users_ids: [currentUser.uid, user.uid],
  //         updated_at: serverTimestamp(),
  //         created_at: serverTimestamp(),
  //         users: [
  //           {
  //             user_id: loginUser.id,
  //             badge: 0,
  //             full_name: loginUser.fullName,
  //           },
  //           {
  //             user_id: otherUser.id,
  //             badge: 0,
  //             full_name: otherUser.fullName,
  //           },
  //         ],
  //       };
  //       //create a chat in chats collection
  //       const temp = await addDoc(collection(db, "chats"), { ...chatData });
  //       await addDoc(collection(db, "chats", temp.id, "messages"), {
  //         message: "hello",
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   // setUser(null);
  //   // setUsername("")
  // };
  const [openMenu, setOpenMenu] = useState(false);
  const timeDifferenceString = getTimeDifferenceString(props?.time);

  return (
    <NavLink
      to={`/pro/responses/${props?.id}`}
      style={({ isActive }) =>
        isActive ? { color: "#DF994F" } : { color: "black" }
      }
    // onClick={handleSelect}
    >
      <HomeCard className="px-3 pt-5 pb-3 relative">
        {openMenu && (
          <DeleteChatModal
            onCancel={() => {
              setOpenMenu(false);
            }}
            lead_id={props.id}
          />
        )}

        <div className="flex w-full justify-between items-center">
          <Heading
            text={props.title ?? "--"}
            variant="subTitle"
            headingclassname="!font-bold  !text-base mx-1 tracking-wide dark:text-white"
          />

          <div className="flex items-center gap-4">
            <Heading
              text={timeDifferenceString}
              variant="subHeader"
              headingclassname="!font-medium !text-xs mx-1 text-primaryBlue tracking-wide dark:text-slate-400"
            />
            <button onClick={() => setOpenMenu(!openMenu)}>
              {theme === "light" && <Dustbin color="black" />}

              {theme === "dark" && <Dustbin color="white" />}
            </button>
          </div>
        </div>
        <div className="flex flex-col mt-3 gap-2">
          <div className="flex flex-wrap">
            <Heading
              text={`${props.business.replace(".", "")} - `}
              variant="smallTitle"
              headingclassname="!font-semibold !text-md tracking-wide text-textColor dark:text-white"
            />

            <Heading
              text={`${props.service}`}
              variant="smallTitle"
              headingclassname="!font-semibold !text-md tracking-wide  ml-1 text-textColor dark:text-white"
            />
          </div>
          <div className="flex flex-wrap">
            {props.answers.map((item, key) => {
              return (
                <div className="flex">
                  <Heading
                    text={`${item} `}
                    variant="smallTitle"
                    headingclassname="!font-light !text-xs   tracking-wide dark:text-slate-400 text-textColor"
                  />
                  {key !== props.answers.length - 1 && (
                    <Heading
                      text={`-`}
                      variant="smallTitle"
                      headingclassname="font-light !text-xs mx-2 tracking-wide dark:text-slate-400 text-textColor"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center my-1 gap-2">
            {theme === "light" && (
              <div children={<LocationIcon color="black" />} />
            )}

            {theme === "dark" && (
              <div children={<LocationIcon color="white" />} />
            )}
            <Heading
              text={`${props.location}`}
              variant="smallTitle"
              headingclassname="!font-extralight text-slate-400 !text-xs  tracking-wide dark:text-white "
            />
          </div>
          {props.is_outright && (
            <div className="flex justify-between w-full items-center mt-2">
              <div className="flex gap-1 ">
                <div className="w-5 h-5 mt-1 rounded-full">
                  <img src={Outright} />
                </div>
                <Heading
                  text={props.is_outright ? `Bought Outright` : ""}
                  variant="smallTitle"
                  headingclassname="!font-semibold !text-xs   tracking-wide text-primaryGreen dark:text-primaryGreen"
                />
              </div>
            </div>
          )}

          {/* Bottom status row: Requested quote | Mail icon | Interest shown */}
          {(props.quoteRequested || props.interested || hasCustomerSentMessage) && (
            <div className="flex items-center border-t-[0.5px] border-t-slate-200 mt-2 pt-2 justify-between gap-4">
              {/* Left: Requested quote */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                {props.quoteRequested && (
                  <>
                    <div className="w-2 h-2 bg-green-500 text-transparent rounded-full"></div>
                    <Heading
                      text={`Requested quote`}
                      variant="smallTitle"
                      headingclassname="!font-semibold !text-xs tracking-wide dark:text-green-500 text-green-500 py-1 rounded-lg whitespace-nowrap"
                    />
                  </>
                )}
              </div>

              {/* Center: Mail icon (only when customer has sent message) */}
              {hasCustomerSentMessage && (
                <div className="flex-shrink-0 mx-2">
                  <MailIcon color={theme === "dark" ? "#3b82f6" : "#3b82f6"} />
                </div>
              )}

              {/* Right: Interest shown */}
              <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
                {props.interested && (
                  <>
                    <div className="w-2 h-2 bg-green-500 text-transparent rounded-full"></div>
                    <Heading
                      text={`Interest shown`}
                      variant="smallTitle"
                      headingclassname="!font-semibold !text-xs tracking-wide dark:text-green-500 text-green-500 py-1 rounded-lg whitespace-nowrap text-right"
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </HomeCard>
    </NavLink>
  );
}

export default ResponsesListItem;
