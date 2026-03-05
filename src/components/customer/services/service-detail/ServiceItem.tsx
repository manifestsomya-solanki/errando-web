import { useState, useEffect, useRef } from "react";
import Heading from "../../../UI/Heading";
import GoldStar from "../../../../assets/GoldStar.svg";
import Star from "../../../../assets/Star.svg";
import Button from "../../../UI/Button";
import { useTheme } from "../../../../store/theme-context";
import LocationIcon from "../../../../assets/LocationIcon";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Service } from "../../../../models/home";
import ShowInterestModal from "../../../../layout/customer/ShowInterestModal";
import NoImage from "../../../../assets/no-photo.png";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  serverTimestamp,
  getDoc,
  addDoc,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../../Firebase";
import { useAuth } from "../../../../store/customer/auth-context";
import useSWR from "swr";
import { fetcher } from "../../../../store/customer/home-context";
import { UserData } from "../../../../models/user";
import { buildApiUrl, API_ENDPOINTS } from "../../../../config/api";
import MailIcon from "../../../../assets/MailIcon";

function DangerousHTML({
  dangerouslySetInnerHTML,
}: {
  dangerouslySetInnerHTML: { __html: string };
}) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<span class="text-gray-500  !font-normal tracking-wide !text-xs dark:text-darktextColor break-words ">${dangerouslySetInnerHTML.__html}</span>`,
      }}
    />
  );
}

function ServiceCard(props: any) {
  const navigate = useNavigate();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [hasProSentMessage, setHasProSentMessage] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const handleClick = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getDescription = () => {
    if (showFullDescription) {
      return props.description;
    } else {
      return props.description.substring(0, 90);
    }
  };

  const isLongDescription = props.description.length > 100;

  const [showModal, setShowModal] = useState(false);
  const requestId = useParams();

  const { theme } = useTheme();
  const { userData } = useAuth();
  const anotherUserDetailUrl = buildApiUrl(`${API_ENDPOINTS.USER_DETAIL}?user_id=${props?.userId}`);
  const { data: userdata } = useSWR(anotherUserDetailUrl, fetcher);
  const anotherUserDetail: UserData = userdata?.data;
  const user = {
    uid: userData?.id,
    fullName: userData?.full_name,
    photoURL: userData?.img_avatar,
  }; //login user
  const currentUser = {
    uid: anotherUserDetail?.id,
    fullName: anotherUserDetail?.full_name,
    photoURL: props?.icon,
  };

  // Check if pro has sent any messages - using real-time listener
  useEffect(() => {
    // Cleanup previous listener if exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!user?.uid || !currentUser?.uid) {
      setHasProSentMessage(false);
      return;
    }

    let combinedId: any;
    if (user?.uid && currentUser?.uid) {
      combinedId =
        +currentUser?.uid < user?.uid
          ? currentUser?.uid + "-" + user?.uid
          : user?.uid + "-" + currentUser?.uid;
    }
    if (!combinedId) {
      setHasProSentMessage(false);
      return;
    }

    const checkProMessages = async () => {
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

          // Use real-time listener to check if there are any messages from the pro
          // sender_id is stored as the user ID (number or string, depending on how it's saved)
          const proUserId = currentUser?.uid;
          const messagesQuery = query(
            chatRef,
            where("sender_id", "==", proUserId),
            limit(1)
          );
          
          unsubscribeRef.current = onSnapshot(
            messagesQuery,
            (snapshot) => {
              // Check if there are any messages from the pro
              setHasProSentMessage(snapshot?.docs?.length > 0);
            },
            (err) => {
              console.log("Error listening to pro messages:", err);
              setHasProSentMessage(false);
            }
          );
        } else {
          setHasProSentMessage(false);
        }
      } catch (err) {
        console.log("Error checking pro messages:", err);
        setHasProSentMessage(false);
      }
    };

    checkProMessages();

    // Cleanup function to unsubscribe from listener
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user?.uid, currentUser?.uid]);

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    let combinedId: any;
    if (user?.uid && currentUser?.uid) {
      combinedId =
        +currentUser?.uid < user?.uid
          ? currentUser?.uid + "-" + user?.uid
          : user?.uid + "-" + currentUser?.uid;
    }
    if (!combinedId) return;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      const getChatQuery = query(
        collection(db, "chats"),
        where("chat_id", "==", combinedId)
      );
      const getChatDocument = await getDocs(getChatQuery);

      if (!res.exists() && getChatDocument.empty) {
        const usersObject: any = {};
        usersObject[1] = currentUser;
        usersObject[2] = user;

        const loginUser = {
          id: user.uid,
          fullName: user.fullName,
        };

        const otherUser = {
          id: currentUser.uid,
          fullName: currentUser.fullName,
        };
        const chatData = {
          chat_id: combinedId,
          users_ids: [currentUser.uid, user.uid],
          updated_at: serverTimestamp(),
          created_at: serverTimestamp(),
          users: [
            {
              user_id: loginUser.id,
              badge: 0,
              full_name: loginUser.fullName,
            },
            {
              user_id: otherUser.id,
              badge: 0,
              full_name: otherUser.fullName,
            },
          ],
        };
        //create a chat in chats collection
        const temp = await addDoc(collection(db, "chats"), { ...chatData });
        await addDoc(collection(db, "chats", temp.id, "messages"), {
          message: "hello",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const disableEmailsAndLinks = (text: any) => {
    const emailRegex = /\S+@\S+\.\S+/g;
    const urlRegex = /(?:https?|ftp):\/\/[\n\S]+|www\.[\S]+\.[a-z]+/g;
    const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/g;
    const blurredText = text.replace(
      emailRegex,
      '<span class="blur-text">$&</span>'
    );
    const blurredAndLinkedText = blurredText.replace(
      urlRegex,
      '<span class="blur-text">$&</span>'
    );
    const finalText = blurredAndLinkedText.replace(
      phoneRegex,
      '<span class="blur-text">$1$2$3$4</span>'
    );
    return finalText;
  };

  const requestQuote = props?.quote?.find(
    (d: any) => d?.user_request_id == requestId?.id
  );
  console.log(props.location, "loc");
  return (
    <div>
      {showModal && (
        <ShowInterestModal
          onCancel={() => {
            setShowModal(false);
          }}
          id={props.id}
          serviceName={props.serviceName}
          serviceId={props.serviceId}
        />
      )}
      <div className="flex flex-col h-full relative">
        {props.isClientNotInterested && (
          <h1 className="absolute z-[900] top-[40%]  text-red-500 text-center mx-auto w-full font-semibold">
            Pro member is not available to help.
          </h1>
        )}
        <div
          className={`bg-white box-shadow-lg drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)] py-5 px-5 rounded-md flex flex-col dark:bg-dimGray flex-grow cursor-pointer relative ${
            props.isClientNotInterested &&
            "blur-sm  !cursor-not-allowed"
          }`}
        >
          {/* Mail Icon - Show only when Pro has sent message */}
          {props.isResponded && hasProSentMessage && (
            <div className="absolute bottom-4 right-4">
              <MailIcon color={theme === "dark" ? "#3b82f6" : "#3b82f6"} />
            </div>
          )}
          <div
            className="flex gap-2 flex-nowrap"
            onClick={() =>
              !props.isClientNotInterested &&
              navigate(`/services/dealer-detail/${props?.id}`, {
                state: {
                  serviceName: props.serviceName,
                  serviceId: props.serviceId,
                  isInterested: props?.isInterested,
                  userRequestId: requestId?.id,
                  distance: props?.location,
                  page_key: "customer",
                  userId: props?.userId,
                },
              })
            }
          >
            <div className="w-16 h-16">
              {props.icon ? (
                <img
                  src={`https://erranddo.s3.eu-west-2.amazonaws.com/${props?.icon}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <img
                  src={NoImage}
                  className="h-full w-full  rounded-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-1.5 flex-wrap w-fit min-w-min">
              <div className="cursor-pointer">
                <Heading
                  text={props.title}
                  variant="subTitle"
                  headingclassname="text-textColor !font-bold tracking-wide text-md dark:text-darktextColor break-words capitalize"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {props?.subTitle?.map((item: Service, index: number) => {
                  return (
                    <Heading
                      key={index}
                      text={
                        " " +
                        item.name.replace(".", "") +
                        (index !== props.subTitle.length - 1 ? ", " : "")
                      }
                      variant=" "
                      headingclassname="text-textColor !font-semibold tracking-wide !text-xs dark:text-slate-400"
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="my-5">
            {props?.quote?.length > 0 && (
              <div
                className="flex gap-1 items-center "
                onClick={() =>
                  !props.isClientNotInterested &&
                  navigate(`/services/dealer-detail/${props?.id}`, {
                    state: {
                      serviceName: props.serviceName,
                      serviceId: props.serviceId,
                      isInterested: props?.isInterested,
                      userRequestId: requestId?.id,
                      distance: props?.location,
                      page_key: "customer",
                      userId: props?.userId,
                    },
                  })
                }
              >
                <Heading
                  text="Quote:"
                  variant="subTitle"
                  headingclassname="text-primaryYellow !font-semibold tracking-wide !text-base dark:text-darkprimaryYellow"
                />
                <div className="flex gap-1 items-center">
                  <p className="text-primaryYellow font-bold !text-base">£</p>
                  <Heading
                    text={requestQuote?.quote}
                    variant="subTitle"
                    headingclassname="text-primaryYellow !font-semibold tracking-wide !text-base dark:text-darkprimaryYellow"
                  />
                  <Heading
                    text={requestQuote?.payment_type.replace("_", " ")}
                    variant="subTitle"
                    headingclassname="text-primaryYellow !font-semibold tracking-wide !text-base dark:text-darkprimaryYellow"
                  />
                </div>
                {/* <div>{props?.quote[0]?.quote}</div> */}
                {/* <div>{props?.quote[0]?.payment_type.replace("_", " ")}</div> */}
              </div>
            )}
            <DangerousHTML
              dangerouslySetInnerHTML={{
                __html: disableEmailsAndLinks(getDescription()),
              }}
            />
            {isLongDescription && (
              <button
                className="text-primaryBlue hover:underline text-sm"
                onClick={handleClick}
              >
                {showFullDescription ? "read less..." : "...read more"}
              </button>
            )}
          </div>
          <div
            onClick={() =>
              !props.isClientNotInterested &&
              navigate(`/services/dealer-detail/${props?.id}`, {
                state: {
                  serviceName: props.serviceName,
                  serviceId: props.serviceId,
                  isInterested: props?.isInterested,
                  userRequestId: requestId?.id,
                  distance: props?.location,
                  page_key: "customer",
                  userId: props?.userId,
                },
              })
            }
            className=" flex gap-1 text-gray-500 !font-normal tracking-wide !text-xs dark:text-darktextColor"
          >
            {Array.from({ length: props.ratingCount }, () => (
              <img src={GoldStar} alt="Gold Star" />
            ))}
            {Array.from({ length: 5 - props.ratingCount }, () => (
              <img src={Star} alt="Star" />
            ))}
            <Heading
              text={`${props.ratingCount ?? 0} of 5 / ${props.reviewsCount ?? 0}`}
              variant="subHeader"
              headingclassname="text-gray-500 !font-normal tracking-wide !text-xs mx-2 dark:text-slate-400"
            />
          </div>
          <div className="mt-5 flex gap-2 items-center">
            {theme === "light" && (
              <div children={<LocationIcon color="black" />} />
            )}
            {theme === "dark" && (
              <div children={<LocationIcon color="white" />} />
            )}
            <Heading
              text={`${props.location ? Math.round(parseFloat(props.location.toString())) : 0} miles away`}
              variant="subHeader"
              headingclassname="text-textColor !font-semibold tracking-wide !text-xs dark:text-darktextColor"
            />
          </div>
        </div>
        <div className="my-5">
          {props.isInterested ? (
            <div>
              {props.isResponded ? (
                <NavLink
                  to="/messages"
                  state={{
                    id: props?.userId,
                    displayPhoto: props?.icon,
                    name: props.serviceName,
                    quote: `Quote: £${props.quotes} ${props.quoteTypes}`,
                    isQuote: props.quoteTypes ? true : false,
                  }}
                >
                  <Button
                    variant="filled"
                    color="primary"
                    size="normal"
                    children="Messages"
                    centerClassName="flex items-center justify-center"
                    buttonClassName="!px-4  text-sm tracking-wide w-full py-[0.7rem] "
                    onClick={() => {
                      handleSelect();
                    }}
                  />
                </NavLink>
              ) : (
                <Button
                  variant="filled"
                  size="normal"
                  children="Shown Interest"
                  centerClassName="flex items-center justify-center"
                  buttonClassName="!px-4  text-sm tracking-wide w-full py-[0.7rem] bg-slate-400 cursor-not-allowed hover:bg-slate-400"
                />
              )}
            </div>
          ) : (
            <div>
              {props.isResponded ? (
                <NavLink
                  to="/messages"
                  state={{
                    id: props?.userId,
                    displayPhoto: props?.icon,
                    name: props.serviceName,
                    businessName: props.title,
                    quote: `Quote: £${props.quotes} ${props.quoteTypes}`,
                    isQuote: props.quotes ? true : false,
                  }}
                >
                  <Button
                    onClick={() => {
                      handleSelect();
                    }}
                    disabled={props.isClientNotInterested}
                    variant="filled"
                    color="primary"
                    size="normal"
                    children="Messages"
                    centerClassName="flex items-center justify-center"
                    buttonClassName="!px-4  text-sm tracking-wide w-full py-[0.7rem] disabled:bg-slate-400 disabled:text-white"
                  />
                </NavLink>
              ) : (
                <Button
                  disabled={props.isClientNotInterested}
                  onClick={() => setShowModal(!showModal)}
                  color="primary"
                  size="normal"
                  children="Show Interest"
                  centerClassName="flex items-center justify-center"
                  buttonClassName="!px-4  border-0 text-sm tracking-wide w-full py-[0.7rem] disabled:bg-slate-400 disabled:text-white"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
