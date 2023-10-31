import Heading from "../../../../UI/Heading";
import GoldStar from "../../../../../assets/GoldStar.svg";
import Star from "../../../../../assets/Star.svg";
import Button from "../../../../UI/Button";
import NoImage from "../../../../../assets/no-photo.png";

import { useTheme } from "../../../../../store/theme-context";
import editicon from "../../../../../assets/edit-2-svgrepo-com.svg";
import HomeCard from "../../home/HomeCard";
import DealerDetailSkeleton from "../../../skeleton/Dealer/DealerDetailSkeleton";
import { Service } from "../../../../../models/home";
import { useState } from "react";
import EditNameDescriptionModal from "../../../../../layout/pro-models/EditNameDescriptionModalt";
import "./check.css"; // Replace with your CSS file path

export function DangerousHTML({
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
  icon: any;
  title: string;
  services: Service[];
  description: string;
  year: any;
  ratingCount: number;
}) {
  const isLoading = false;
  const [show, setShow] = useState(false);
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

  return (
    <div>
      {isLoading ? (
        <DealerDetailSkeleton />
      ) : (
        <HomeCard>
          {show && <EditNameDescriptionModal onCancel={() => setShow(false)} />}
          <div className="border-b-slate-300 lg:py-7 xs:py-5 my-4 px-5 items-center ">
            <div className="rounded-full xs:float-left   lg:w-40 xs:w-20 border-slate-200 border-[0.5px] mr-5 ">
              {props.icon ? (
                <img
                  src={`https://erranddo.kodecreators.com/storage/${props?.icon}`}
                  className=" object-cover object-center rounded-full w-40  lg:h-40 xs:h-20"
                />
              ) : (
                <img
                  src={NoImage}
                  className="xs:w-max lg:h-40  xs:h-20  rounded-full object-cover"
                />
              )}
            </div>
            <div className="my-2 relative ">
              <Button
                onClick={() => setShow(true)}
                variant="ghost"
                color="secondary"
                size="normal"
                centerClassName="flex items-center justify-center rounded-full"
                buttonClassName="!px-4 text-sm lg:py-[0.7rem] lg:inline !absolute top-0 right-0 dark:hover:bg-slate-700 hover:bg-slate-100 rounded-full"
              >
                <img src={editicon} />
              </Button>
              <Heading
                text={props.title}
                variant="subTitle"
                headingclassname="text-textColor !font-bold tracking-wide !text-lg dark:text-darktextColor"
              />

              <div className="lg:my-2 xs:my-2 flex gap-1 text-gray-500 !font-normal tracking-wide !text-xs ">
                {Array.from({ length: props.ratingCount }, () => (
                  <img src={GoldStar} />
                ))}
                {Array.from({ length: 5 - props.ratingCount }, () => (
                  <img src={Star} />
                ))}
                <Heading
                  text={`${props.ratingCount} of 5 / 120`}
                  variant="subHeader"
                  headingclassname="text-gray-500 !font-normal tracking-wide !text-xs mx-1 dark:text-darktextColor"
                />
              </div>
              <div className="lg:mt-3 xs:mt-10 lg:flex xs:flex xs:flex-wrap gap-2 ">
                {props.services.map((item, key) => {
                  return (
                    <div className="flex  " key={key}>
                      <Heading
                        text={
                          item?.name?.replace(".", "") +
                          (key !== props.services.length - 1 ? "   | " : "")
                        }
                        variant="subHeader"
                        headingclassname="text-textColor !font-semibold tracking-wide !text-sm dark:text-darktextColor"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 lg:mb-16 flex lg:flex-row gap-2 xs:flex-col">
                <div className="">
                  <Heading
                    text={`Years in Business : ${props.year}`}
                    variant="subHeader"
                    headingclassname="text-primaryYellow !font-semibold tracking-wide lg:text-xs text-md"
                  />
                </div>
              </div>
              <div className="">
                <Heading
                  text=""
                  variant="subHeader"
                  headingclassname="text-gray-500 !font-normal tracking-wide !lg:text-xs xs:text-md h-max dark:text-gray-400 break-all text-justify"
                />
                <div className="">
                  <DangerousHTML
                    dangerouslySetInnerHTML={{
                      __html: disableEmailsAndLinks(props.description),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </HomeCard>
      )}
    </div>
  );
}

export default DealerDetailSection;
