import Heading from "../../UI/Heading";
import HomeCard from "../dashboard/home/HomeCard";
import ProfileImage from "../../../assets/service-image-one.png";
import GreenTick from "../../../assets/GreenTick.svg";
import GreenRoundTick from "../../../assets/GreenRoundTick.svg";
import BlackRoundTick from "../../../assets/BlackRoundTick.svg";
import MyLeadsSkeleton from "../skeleton/Leads/MyLeadsSkeleton";
import NoImage from "../../../assets/no-photo.png";
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
import { db } from "../../../Firebase";
import Button from "../../UI/Button";
import { useNavigate, useParams } from "react-router";
import useSWR from "swr";
import { fetcher } from "../../../store/customer/home-context";
import { UserRequestList } from "../../../models/pro/userrequestlist";
import DropdownCompoenet from "../../UI/Dropdown";
import { useFormik } from "formik";
import { useLeadResponse } from "../../../store/pro/response-context";
import Error from "../../../components/UI/Error";
import { useEffect, useState } from "react";
import SendQuoteModal from "../../../layout/pro-models/SendQuoteModal";
import { useAuthPro } from "../../../store/pro/auth-pro-context";
import Outright from "../../../assets/outright.svg";
import Flagman from "../../../assets/flagman.jpg";
import dayjs from "dayjs";

function getTimeDifferenceString(time: any) {
  const currentTime = dayjs();
  const postTime = dayjs(time);

  const diffInMinutes = currentTime.diff(postTime, "minute");
  const diffInHours = currentTime.diff(postTime, "hour");
  const diffInDays = currentTime.diff(postTime, "day");

  if (diffInMinutes < 1) {
    return "Purchased less than a minute ago";
  } else if (diffInMinutes < 60) {
    return `Purchased ${diffInMinutes} minute${
      diffInMinutes === 1 ? "" : "s"
    } ago`;
  } else if (diffInHours < 24) {
    return `Purchased ${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else {
    return `Purchased ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }
}

function MyResponses() {
  const navigate = useNavigate();
  const leadsId = useParams();
  const dealerdetailurl = `https://erranddo.kodecreators.com/api/v1/user-requests/${leadsId.id}/detail`;
  const {
    data: leadsDetailData,
    isLoading,
    mutate,
  } = useSWR(dealerdetailurl, fetcher);
  const leadsDetail: UserRequestList = leadsDetailData?.data;

  const { leadsResponse, sendQuote, isQuoteLoading, editQuote } =
    useLeadResponse();
  const dropDownOne = [
    "Per hour",
    "Per day",
    "Per day / Per Head",
    "Per week",
    "Per Month",
    "Fixed Price",
  ];

  const [showModal, setShowModal] = useState(false);
  const userBusinessId = leadsResponse
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    ?.filter((d) => d?.id === +leadsId?.id)
    ?.map((d) => d?.leads[0]?.user_business_id)[0];
  const formik = useFormik({
    initialValues: {
      quote:
        leadsDetail?.request_quotes?.length > 0
          ? leadsDetail?.request_quotes[0]?.quote.toString()
          : "",
      payment_type: "Fixed Price",
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors: any = {};
      if (values.quote.toString().length === 0) {
        errors.quote = "Required";
      }
      if (values.payment_type.length === 0) {
        errors.payment_type = "Required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      if (leadsId?.id) formData.set("user_request_id", leadsId?.id?.toString());
      if (userBusinessId)
        formData.set("user_business_id", userBusinessId.toString());
      if (values?.quote.length === 0) {
        formData.set("quote", "0");
      } else {
        formData.set("quote", values?.quote);
      }
      formData.set("payment_type", values?.payment_type);
      if (leadsDetail?.request_quotes.length > 0) {
        await editQuote(formData, leadsDetail?.request_quotes[0]?.id);
        await mutate();
      } else {
        await sendQuote(formData);
        await mutate();
        formik.resetForm();
      }
      setShowModal(false);
    },
  });

  const { userData } = useAuthPro();
  const user = {
    uid: userData?.id,
    fullName: userData?.full_name,
    photoURL: userData?.img_avatar,
  }; //login user
  const currentUser = {
    uid: leadsDetail?.user?.id,
    fullName: leadsDetail?.user?.full_name,
    photoURL: leadsDetail?.user?.img_avatar,
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
          id: "loginUserId",
          fullName: "John Doe",
        };

        const otherUser = {
          id: "otherUserId",
          fullName: "Jane Smith",
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
    // setUser(null);
    // setUsername("")
  };
  console.log(leadsDetail?.user?.img_avatar, "dw");

  const timeDifferenceString = getTimeDifferenceString(
    leadsDetail?.leads[0]?.created_at
  );

  return (
    <div>
      {showModal && (
        <SendQuoteModal
          onCancel={() => {
            setShowModal(false);
          }}
          formik={formik}
          isLoading={isQuoteLoading}
        />
      )}
      {isLoading ? (
        <MyLeadsSkeleton limit={1} />
      ) : (
        <HomeCard className="rounded-md  px-5 pb-5">
          <div className="py-4 border-b-[0.5px] border-b-slate-200">
            <Heading
              text={`My Responses`}
              variant="subHeader"
              headingclassname="!font-bold  text-textColor  text-xl tracking-wide dark:text-white"
            />
          </div>
          <div className="flex justify-between lg:items-center py-4 border-b-[0.5px] border-b-slate-200 xs:flex-col lg:flex-row">
            <div>
              {/* <img src={ProfileImage} className="" /> */}

              <div className="flex flex-col">
                {leadsDetail?.provider_bussiness[0]?.name ? (
                  <Heading
                    text={leadsDetail?.provider_bussiness[0].name}
                    variant="subTitle"
                    headingclassname="!font-semibold  !text-lg mx-1 tracking-wide dark:text-white capitalize"
                  />
                ) : (
                  <Heading
                    text="--"
                    variant="subHeader"
                    headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                  />
                )}
                <Heading
                  text={leadsDetail?.service?.name}
                  // text={"Platic Items"}
                  variant="subHeader"
                  headingclassname="!font-normal !text-sm mx-1 text-textColor tracking-wide dark:text-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Heading
                text={timeDifferenceString}
                variant="subHeader"
                headingclassname="!font-medium !text-sm mt-2 text-primaryBlue tracking-wide dark:text-primaryBlue lg:ml-auto"
              />
              <div className="flex gap-2 ">
                <Button
                  variant="filled"
                  color="primary"
                  size="normal"
                  children="Message"
                  centerClassName="flex justify-center items-center text-center "
                  buttonClassName="!px-4 h-9 flex items-center "
                  onClick={() => {
                    handleSelect();
                    navigate(`/pro/responses/chat`, {
                      state: {
                        businessId: leadsDetail?.user_bussiness?.id,
                        userId: leadsDetail?.user?.id,
                        fullName: leadsDetail?.user?.full_name,
                        imgAvatar: leadsDetail?.user?.img_avatar,
                      },
                    });
                  }}
                />

                <Button
                  centerClassName="flex justify-center items-center text-center "
                  variant="outlined"
                  color="primary"
                  size="normal"
                  children="Notes"
                  buttonClassName="!px-6 h-9 flex items-center "
                  onClick={() =>
                    navigate(`/pro/responses/notes/${leadsDetail?.id}`)
                  }
                />
              </div>
            </div>
          </div>
          <div className="py-4 grid lg:grid-cols-2 xs:gap-3 lg:gap-0">
            <div className="flex items-center gap-2">
              {leadsDetail?.user?.img_avatar ? (
                <img
                  src={`https://erranddo.kodecreators.com/storage/${leadsDetail?.user?.img_avatar}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <Heading
                  text={leadsDetail?.user?.full_name.slice(0, 1)}
                  variant="subTitle"
                  headingclassname="!font-semibold text-slate-400 !text-2xl   tracking-wide dark:text-white px-6 py-4 rounded-full bg-slate-300"
                />
              )}
              <div>
                <Heading
                  text={"Name"}
                  variant="subTitle"
                  headingclassname="!font-semibold text-slate-400 !text-sm  mx-1 tracking-wide dark:text-white "
                />
                {leadsDetail?.user?.full_name ? (
                  <div className="flex gap-3">
                    <Heading
                      text={leadsDetail?.user?.full_name}
                      variant="subHeader"
                      headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                    />
                  </div>
                ) : (
                  <Heading
                    text="--"
                    variant="subHeader"
                    headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                  />
                )}
              </div>
            </div>
            <div>
              <Heading
                text={"Location"}
                variant="subTitle"
                headingclassname="!font-semibold text-slate-400 !text-sm  mx-1 tracking-wide dark:text-white "
              />
              {leadsDetail?.user?.city &&
              leadsDetail?.user?.postcode_id &&
              !null ? (
                <div className="flex gap-3">
                  <Heading
                    text={`${leadsDetail?.user?.city} ,${leadsDetail?.postcode?.name}`}
                    variant="subHeader"
                    headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                  />
                </div>
              ) : (
                <Heading
                  text="--"
                  variant="subHeader"
                  headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                />
              )}
            </div>
          </div>
          <div className="lg:py-4 grid lg:grid-cols-2 border-b-[0.5px] border-b-slate-200 xs:gap-3 lg:gap-0 xs:pb-4 lg:pb-4">
            <div>
              <Heading
                text={"Tel"}
                variant="subTitle"
                headingclassname="!font-semibold text-slate-400 !text-sm  mx-1 tracking-wide dark:text-white "
              />
              {leadsDetail?.user?.mobile_number ? (
                <div className="flex gap-3">
                  <Heading
                    text={leadsDetail?.user?.mobile_number}
                    variant="subHeader"
                    headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                  />
                  {leadsDetail?.user?.is_mobile_verified === "1" && (
                    <img src={GreenTick} alt="Green Tick" />
                  )}
                </div>
              ) : (
                <Heading
                  text="--"
                  variant="subHeader"
                  headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                />
              )}
            </div>
            <div>
              <Heading
                text={"Email"}
                variant="subTitle"
                headingclassname="!font-semibold text-slate-400 !text-sm  mx-1 tracking-wide dark:text-white "
              />
              {leadsDetail?.user?.email ? (
                <div className="flex gap-3">
                  <Heading
                    text={leadsDetail?.user?.email}
                    variant="subHeader"
                    headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                  />
                  {leadsDetail?.user?.is_email_verified === "1" && (
                    <img src={GreenTick} alt="Green Tick" />
                  )}
                </div>
              ) : (
                <Heading
                  text="--"
                  variant="subHeader"
                  headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                />
              )}
            </div>
          </div>
          <div className="lg:flex justify-between pt-4">
            <div>
              {leadsDetail?.is_outright ? (
                <div className="my-2">
                  <div className="flex">
                    <div className=" hover:bg-slate-100 w-8 h-8 flex items-center justify-center">
                      <img src={Outright} />
                    </div>
                    <Heading
                      text={`Bought Outright`}
                      variant="subHeader"
                      headingclassname="!font-semibold my-1 text-primaryGreen  tracking-wide ml-2 "
                    />
                  </div>
                  <div className="flex gap-2">
                    <Heading
                      text={`No one else can reply to this lead`}
                      variant="subHeader"
                      headingclassname="!font-semibold text-sm my-1 text-slate-400 tracking-wide "
                    />
                    <div className=" hover:bg-slate-100 w-5 h-5 flex items-center justify-center rounded-full">
                      <img src={Flagman} />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Heading
                    text={`Only 4 Pro’s can reply to this lead`}
                    variant="subHeader"
                    headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                  />
                  <div className="flex gap-2 my-1 ml-1">
                    {Array.from({ length: leadsDetail?.leads_count }, () => (
                      <img src={GreenRoundTick} />
                    ))}
                    {Array.from(
                      { length: 4 - leadsDetail?.leads_count },
                      () => (
                        <img src={BlackRoundTick} />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col">
                <div className="flex  gap-3 xl:w-[450px] md:w-[350px] items-center justify-center">
                  <p>£</p>
                  <div>
                    <input
                      type="number"
                      onChange={formik.handleChange}
                      id="quote"
                      value={formik.values.quote}
                      // placeholder={leadsDetail?.request_quotes[0]?.quote.toString()}
                      className="focus:outline-none w-36 placeholder:text-md placeholder:font-normal rounded-lg h-11 bg-slate-100 dark:bg-black pl-3"
                    />
                    {formik.touched.payment_type &&
                    formik.errors.payment_type ? (
                      <Error
                        className="text-red-600  text-center"
                        error={formik.errors.payment_type}
                      ></Error>
                    ) : null}
                  </div>
                  <div>
                    <DropdownCompoenet
                      isImage={true}
                      placeholder={
                        leadsDetail?.request_quotes[0]?.payment_type ??
                        "Fixed Price"
                      }
                      menuClassName=" h-max soft-searchbar"
                      placeholderClassName="text-xs "
                      options={dropDownOne}
                      className="w-36"
                      onChange={function (newValue: any): void {
                        formik.setFieldValue("payment_type", newValue.value);
                      }}
                    />
                    {formik.touched.payment_type &&
                    formik.errors.payment_type ? (
                      <Error
                        className="text-red-600  text-center"
                        error={formik.errors.payment_type}
                      ></Error>
                    ) : null}
                  </div>
                </div>
                <div className="flex justify-end py-5">
                  {/* <div className="w-full"></div> */}
                  {leadsDetail?.request_quotes.length > 0 ? (
                    <Button
                      disabled={
                        formik.values.quote && formik.values.payment_type
                          ? false
                          : true
                      }
                      loading={isQuoteLoading}
                      variant="filled"
                      color="secondary"
                      size="normal"
                      // type="submit"
                      type="button"
                      children="Edit Quotation"
                      buttonClassName="!px-6 h-10 flex items-center "
                      onClick={() => setShowModal(true)}
                    />
                  ) : (
                    <Button
                      disabled={
                        formik.values.quote && formik.values.payment_type
                          ? false
                          : true
                      }
                      loading={isQuoteLoading}
                      variant="filled"
                      color="secondary"
                      size="normal"
                      // type="submit"
                      type="button"
                      children="Send Quotation"
                      buttonClassName="!px-6 h-10 flex items-center "
                      onClick={() => setShowModal(true)}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </HomeCard>
      )}
    </div>
  );
}

export default MyResponses;
