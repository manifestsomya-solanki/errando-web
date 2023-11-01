import Heading from "../../UI/Heading";
import HomeCard from "../dashboard/home/HomeCard";
import GreenTick from "../../../assets/GreenTick.svg";
import GreenRoundTick from "../../../assets/GreenRoundTick.svg";
import BlackRoundTick from "../../../assets/BlackRoundTick.svg";
import MyLeadsSkeleton from "../skeleton/Leads/MyLeadsSkeleton";
import { useParams } from "react-router";
import useSWR from "swr";
import { fetcher } from "../../../store/customer/home-context";
import { UserRequestList } from "../../../models/pro/userrequestlist";
import NoImage from "../../../assets/no-photo.png";
import dayjs from "dayjs";
import Dustbin from "../../../assets/Dustbin";
import { useTheme } from "../../../store/theme-context";
import { useState } from "react";
import DeleteLeadModal from "../../../layout/pro-models/DeleteLeadModal";

function getTimeDifferenceString(time: any) {
  const currentTime = dayjs();
  const postTime = dayjs(time);

  const diffInMinutes = currentTime.diff(postTime, "minute");
  const diffInHours = currentTime.diff(postTime, "hour");
  const diffInDays = currentTime.diff(postTime, "day");

  if (diffInMinutes < 1) {
    return "Posted less than a minute ago";
  } else if (diffInMinutes < 60) {
    return `Posted ${diffInMinutes} minute${
      diffInMinutes === 1 ? "" : "s"
    } ago`;
  } else if (diffInHours < 24) {
    return `Posted ${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else {
    return `Posted ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }
}

function MyLeads(props: any) {
  const leadsId = useParams();
  const dealerdetailurl = `https://erranddo.kodecreators.com/api/v1/user-requests/${leadsId.id}/detail`;
  const { data: leadsDetailData, isLoading } = useSWR(dealerdetailurl, fetcher);
  const leadsDetail: UserRequestList = leadsDetailData?.data;
  const firstTwoDigits =
    leadsDetail?.user?.mobile_number &&
    leadsDetail?.user?.mobile_number.slice(0, 3);
  const lastDigit =
    leadsDetail?.user?.mobile_number &&
    leadsDetail?.user?.mobile_number.slice(-1);

  // Create the masked number string
  const maskedNumber = `${firstTwoDigits}**********${lastDigit}`;

  const firsttwoemail =
    leadsDetail?.user?.email && leadsDetail?.user?.email.slice(0, 3);
  const lastcharinemail =
    leadsDetail?.user?.email && leadsDetail?.user?.email.slice(-3);

  // Create the masked number string
  const email = `${firsttwoemail}**********${lastcharinemail}`;
  const timeDifferenceString = getTimeDifferenceString(leadsDetail?.created_at);

  const { theme } = useTheme();

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div>
      {openMenu && (
        <DeleteLeadModal
          onCancel={() => {
            setOpenMenu(false);
          }}
          id={leadsDetail?.id}
        />
      )}
      {isLoading ? (
        <MyLeadsSkeleton limit={1} />
      ) : (
        <HomeCard className="rounded-md  px-5 pb-5">
          <div className="py-4 border-b-[0.5px] border-b-slate-200">
            <Heading
              text={`My Leads`}
              variant="subHeader"
              headingclassname="!font-bold  text-textColor  text-xl tracking-wide dark:text-white"
            />
          </div>
          <div className="flex xs:flex-col justify-between py-4 border-b-[0.5px] border-b-slate-200 lg:flex-row">
            <div>
              <div className="flex flex-col">
                {leadsDetail?.provider_bussiness[0]?.name ? (
                  <Heading
                    text={leadsDetail?.provider_bussiness[0]?.name}
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
                  variant="subHeader"
                  headingclassname="!font-normal !text-sm mx-1 text-textColor tracking-wide dark:text-white"
                />
              </div>
            </div>
            <div className="xs:flex gap-3 lg:flex-col xs:pt-5 lg:pt-0">
              <div className="flex justify-end">
                <button onClick={() => setOpenMenu(!openMenu)}>
                  {theme === "light" && <Dustbin color="black" />}

                  {theme === "dark" && <Dustbin color="white" />}
                </button>
              </div>
              <Heading
                text={timeDifferenceString}
                variant="subHeader"
                headingclassname="!font-medium !text-sm mt-2 text-primaryBlue tracking-wide dark:text-primaryBlue"
              />
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
                  headingclassname="!font-semibold text-white !text-2xl   tracking-wide dark:text-white px-6 py-4 rounded-full bg-blue-300"
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
                      text={leadsDetail?.user?.full_name.split(" ")[0]}
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

              <div className="flex gap-3">
                <Heading
                  text={`${leadsDetail?.user?.city ?? "--"} , ${
                    leadsDetail?.postcode?.name.split(" ")[0] ?? "--"
                  }`}
                  variant="subHeader"
                  headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
                />
              </div>
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
                    text={maskedNumber}
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
                    text={email}
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
          <div className="pt-4">
            <Heading
              text={`Only 4 Pro’s can reply to this lead`}
              variant="subHeader"
              headingclassname="!font-normal !text-lg mx-1 text-textColor tracking-wide dark:text-white"
            />
            <div className="flex gap-2 my-1 ml-1">
              {Array.from({ length: leadsDetail?.leads_count }, () => (
                <img src={GreenRoundTick} />
              ))}
              {Array.from({ length: 4 - leadsDetail?.leads_count }, () => (
                <img src={BlackRoundTick} />
              ))}
            </div>
          </div>
        </HomeCard>
      )}
    </div>
  );
}

export default MyLeads;
