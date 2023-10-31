import Heading from "../../../UI/Heading";
import GoldStar from "../../../../assets/GoldStar.svg";
import Star from "../../../../assets/Star.svg";
import Edit from "../../../../assets/edit.svg";
import Delete from "../../../../assets/delete.svg";

import { useState } from "react";
import LeaveReviewModal from "../../../../layout/pro-models/LeaveReviewModal";
import { useAuth } from "../../../../store/customer/auth-context";
import DeleteReviewModal from "../../../../layout/customer/DeleteReviewModal";

function CommentItem(props: {
  id: number;
  name: string;
  subTitle: string;
  description: string;
  date: string;
  ratingCount: number;
  comment: string;
  user_id: number;
  user_business_id?: number;
  page_key: string;
}) {
  const { userData } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  console.log(props.page_key);
  return (
    <div>
      {openModal && (
        <LeaveReviewModal
          id={props.id}
          onCancel={() => setOpenModal(false)}
          dealerId={props.user_business_id ?? 0}
        />
      )}
      {openDeleteModal && (
        <DeleteReviewModal
          onCancel={() => {
            setOpenDeleteModal(false);
          }}
          reviewId={props.id}
          page_key={props.page_key}
        />
      )}
      <div className="flex flex-col gap-3 border-b-[0.5px] border-b-slate-300 py-5">
        <div className="flex flex-row justify-between font-poppins">
          <Heading
            text={props.name}
            variant="subTitle"
            headingclassname="text-textColor !font-bold tracking-wide text-md dark:text-darktextColor"
          />
          {props.user_id === userData?.id && (
            <div className="flex gap-5 items-center">
              <img
                src={Edit}
                className=""
                onClick={() => {
                  setOpenModal(true);
                }}
              />
              <img
                src={Delete}
                className="w-6 h-6"
                onClick={() => {
                  setOpenDeleteModal(true);
                }}
              />
            </div>
          )}
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
            headingclassname="text-primaryBlue my-1 !font-semibold tracking-wide !text-xs"
          />
          <Heading
            text={props.description}
            variant="subHeader"
            headingclassname="text-slate-600 !font-normal tracking-wide !text-md dark:text-slate-400"
          />
        </div>
        {props.comment && (
          <div>
            <Heading
              text={"Response from the business owner"}
              variant="smallTitle"
              headingclassname="text-textColor my-1 !font-semibold tracking-wide !text-md dark:text-darktextColor"
            />
            <Heading
              text={props.comment}
              variant="subHeader"
              headingclassname="text-slate-600 !font-normal tracking-wide capitalize !text-xs dark:text-slate-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
