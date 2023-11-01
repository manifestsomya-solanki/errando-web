import Heading from "../../../UI/Heading";
import GoldStar from "../../../../assets/GoldStar.svg";
import Star from "../../../../assets/Star.svg";
import Button from "../../../UI/Button";
import LeftArrow from "../../../../assets/right-arrow.svg";
import LocationIcon from "../../../../assets/LocationIcon";
import { useTheme } from "../../../../store/theme-context";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../../Firebase";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../../../store/customer/auth-context";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "../../../../store/customer/home-context";
import { UserData } from "../../../../models/user";

function DangerousHTML({
  dangerouslySetInnerHTML,
}: {
  dangerouslySetInnerHTML: { __html: string };
}) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<span class="text-gray-500 !font-normal tracking-wide !lg:text-xs xs:text-md">${dangerouslySetInnerHTML.__html}</span>`,
      }}
    />
  );
}

function DealerDetailSection(props: {
  userBusinessId?: number;
  businessName: string;
  icon: any;
  title: string;
  subTitle: string;
  description: string;
  location: number;
  ratingCount: number;
  quote: number | string;
  quoteType: string;
  service: string;
  page_key: string;
  requestId: number;
}) {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const anotherUserDetailUrl = `https://erranddo.kodecreators.com/api/v1/user/detail?user_id=${props?.userBusinessId}`;
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
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    let combinedId: any;
    if (user?.uid) {
      combinedId =
        +currentUser?.uid < user?.uid
          ? currentUser?.uid + "-" + user?.uid
          : user?.uid + "-" + currentUser?.uid;
    }
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

  const subServices = props.subTitle?.split(",") ?? [];
  return (
    <>
      <div className="border-b-[0.5px] border-b-slate-300 lg:py-10 xs:py-5 ">
        <img
          src={props.icon}
          className="lg:w-48 xs:w-20 float-left mr-5 lg:h-48 xs:h-20 rounded-full object-cover"
        />
        <div className=" my-2 relative">
          <NavLink
            to="/messages"
            state={{
              id: props?.userBusinessId,
              displayPhoto: props?.icon,
              name: props.service,
              quote: `Quote: £${props.quote} ${props.quoteType}`,
              isQuote: props.quote ? true : false,
              requestId: props?.requestId,
              businessName: props.businessName,
            }}
          >
            <Button
              disabled={props.page_key !== "customer"}
              variant="filled"
              color="primary"
              size="normal"
              children="Messages"
              centerClassName="flex items-center justify-center"
              buttonClassName="!px-4  text-sm tracking-wide py-[0.7rem] xs:hidden lg:inline !absolute top-0 right-0 disabled:text-white"
              onClick={() => {
                handleSelect();
              }}
            />
          </NavLink>
          <Heading
            text={props.title}
            variant="subTitle"
            headingclassname="text-textColor !font-bold tracking-wide !text-lg dark:text-darktextColor capitalize"
          />

          <div className="lg:my-3 xs:my-2 flex gap-1 text-gray-500 !font-normal tracking-wide !text-xs ">
            {Array.from({ length: props.ratingCount }, () => (
              <img src={GoldStar} />
            ))}
            {Array.from({ length: 5 - props.ratingCount }, () => (
              <img src={Star} />
            ))}
            <Heading
              text={`${props.ratingCount} of 5 / 120`}
              variant="subHeader"
              headingclassname="text-gray-500 !font-normal tracking-wide !text-xs mx-2 dark:text-darktextColor"
            />
            {props.quote && props.quoteType ? (
              <div className="xs:hidden lg:flex">
                <Heading
                  text={`Quote: £${props.quote} ${props.quoteType}`}
                  variant="subHeader"
                  headingclassname="text-primaryYellow !font-semibold tracking-wide lg:text-xs text-md"
                />
              </div>
            ) : null}
          </div>
          <div className="lg:my-3 xs:mt-10 lg:flex xs:flex xs:flex-wrap gap-2">
            {subServices.map((item, key) => {
              return (
                <div className="flex gap-2">
                  <Heading
                    text={
                      item.replace(".", "") +
                      (key !== subServices?.length - 1 ? "   | " : "")
                    }
                    variant="subHeader"
                    headingclassname="text-textColor !font-semibold tracking-wide !text-sm dark:text-darktextColor"
                  />
                </div>
              );
            })}
          </div>
          <div className="my-3">
            <div className="">
              <DangerousHTML
                dangerouslySetInnerHTML={{
                  __html: disableEmailsAndLinks(props.description),
                }}
              />
            </div>
          </div>
          <div className="mt-7 lg:mb-7 flex lg:flex-row gap-2 lg:items-center xs:flex-col">
            <div className="flex gap-2">
              <img src={LeftArrow} className="w-3 lg:hidden" />
              <Heading
                text={`Response Time : 34 min`}
                variant="subHeader"
                headingclassname="text-primaryYellow !font-semibold tracking-wide lg:text-xs text-md"
              />
            </div>
            <Heading
              text={`|`}
              variant="subHeader"
              headingclassname="text-primaryYellow !font-normal tracking-wide !text-sm xs:hidden lg:inline"
            />
            <div className="flex gap-2">
              <img src={LeftArrow} className="w-3 lg:hidden " />
              <Heading
                text={`Years in Business : 7`}
                variant="subHeader"
                headingclassname="text-primaryYellow !font-semibold tracking-wide lg:text-xs text-md "
              />
            </div>

            <Heading
              text={`|`}
              variant="subHeader"
              headingclassname="text-primaryYellow !font-normal tracking-wide !text-sm xs:hidden lg:inline"
            />
            <div className="flex gap-2">
              <img src={LeftArrow} className="w-3 lg:hidden" />
              <Heading
                text={`Erranddo Hires : 25`}
                variant="subHeader"
                headingclassname="text-primaryYellow !font-semibold tracking-wide lg:text-xs text-md "
              />
            </div>
            <Heading
              text={`|`}
              variant="subHeader"
              headingclassname="text-primaryYellow !font-normal tracking-wide !text-sm xs:hidden lg:inline "
            />
            <div className="flex gap-2">
              <img src={LeftArrow} className="w-3 lg:hidden" />
              <div className=" flex gap-2 items-center">
                {theme === "light" && (
                  <div children={<LocationIcon color="black" />} />
                )}

                {theme === "dark" && (
                  <div children={<LocationIcon color="white" />} />
                )}
                <Heading
                  text={`${props.location ?? 0} miles away`}
                  variant="subHeader"
                  headingclassname="text-primaryYellow !font-semibold tracking-wide lg:text-xs text-md "
                />
              </div>
            </div>
            {props.quote && props.quoteType ? (
              <div className="lg:hidden">
                <Heading
                  text={`Quote: £${props.quote} ${props.quoteType}`}
                  variant="subHeader"
                  headingclassname="text-primaryYellow !font-semibold tracking-wide lg:text-xs text-md"
                />
              </div>
            ) : null}
            <div className=" mt-3">
              <NavLink
                to="/messages"
                state={{
                  id: props?.userBusinessId,
                  displayPhoto: props?.icon,
                  name: props.service,
                  quote: `Quote: ${props.quote} ${props.quoteType}`,
                  isQuote: props.quote ? true : false,
                }}
              >
                <Button
                  variant="filled"
                  color="primary"
                  size="normal"
                  children="Messages"
                  centerClassName="flex items-center justify-center"
                  buttonClassName="!px-4  text-sm tracking-wide py-[0.7rem] lg:hidden w-full"
                  onClick={() => console.log("click")}
                />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DealerDetailSection;
