import Heading from "../../../../UI/Heading";
import GoldStar from "../../../../../assets/GoldStar.svg";
import Star from "../../../../../assets/Star.svg";
import ResponseSection from "./ResponseSection";
import Flag from "../../../../../assets/flag-svgrepo-com.svg";
import FlagFill from "../../../../../assets/flag-fill.svg";

import Reply from "../../../../../assets/reply.svg";
import { useState } from "react";
import ResponseModal from "../../../../../layout/pro-models/ResponseModal";

import DeleteReviewModal from "../../../../../layout/pro-models/DeleteReviewModal";
import FlagReviewModal from "../../../../../layout/pro-models/FlagReviewModal";

function CommentItem(props: {
  reviewId: number;
  id: string;
  service_id: string;
  business_id: string;
  name: string;
  subTitle: string;
  description: string;
  date: string;
  ratingCount: number;
  comment: string;
  is_flagged?: number;
}) {
  const [response, setResponse] = useState(false);

  const [flagModal, setFlagModal] = useState(false);
  return (
    <>
      {flagModal && (
        <FlagReviewModal
          onCancel={() => {
            setFlagModal(false);
          }}
          reviewId={props.reviewId}
        />
      )}
      <div className="flex flex-col gap-3 py-5 border-b-[0.5px] border-b-slate-300">
        {response && (
          <ResponseModal
            id={props.id}
            onCancel={() => setResponse(false)}
            businessId={props.business_id ?? ""}
            serviceId={props.service_id ?? ""}
            description={props.description ?? ""}
            rating={props.ratingCount ?? ""}
          />
        )}
        <div className="flex flex-row justify-between font-poppins">
          <Heading
            text={props.name}
            variant="subTitle"
            headingclassname="text-textColor !font-bold tracking-wide text-md dark:text-darktextColor"
          />
          <div onClick={() => setFlagModal(true)}>
            {props.is_flagged ? (
              <img src={FlagFill} className="" />
            ) : (
              <img src={Flag} className="" />
            )}
          </div>
        </div>
        <div className=" flex gap-1 text-gray-500 !font-normal tracking-wide !text-xs">
          {Array.from({ length: props.ratingCount }, () => (
            <img src={GoldStar} />
          ))}
          {Array.from({ length: 5 - props.ratingCount }, () => (
            <img src={Star} />
          ))}
          <Heading
            text={`${props.date}`}
            variant="subHeader"
            headingclassname="text-gray-500 !font-normal tracking-wide !text-xs mx-2 dark:text-darktextColor"
          />
        </div>
        <div>
          <Heading
            text={props.subTitle}
            variant="subHeader"
            headingclassname="text-primaryBlue mb-1 !font-normal tracking-wide !text-sm dark:text-white"
          />
          <Heading
            text={props.description}
            variant="subHeader"
            headingclassname="text-slate-600 !font-normal tracking-wide !text-xs dark:text-slate-400"
          />
        </div>
        <div>
          {props.comment ? (
            <ResponseSection
              comment={props.comment}
              reviewId={props.reviewId}
              id={props.id}
              service_id={props.service_id}
              business_id={props.business_id}
              name={props.name}
              subTitle={props.description}
              description={props.comment}
              date={props.date}
              ratingCount={props.ratingCount}
            />
          ) : (
            <div
              className="flex gap-3 cursor-pointer"
              onClick={() => setResponse(true)}
            >
              <img src={Reply} />
              <Heading
                text="Reply"
                variant="smallTitle"
                headingclassname={`tracking-wide text-primaryBlue !font-bold`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CommentItem;
