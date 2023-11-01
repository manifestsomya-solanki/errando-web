import { useLocation, useParams } from "react-router";
import Button from "../../../UI/Button";
import Heading from "../../../UI/Heading";
import { useState } from "react";
import ShowInterestModal from "../../../../layout/customer/ShowInterestModal";
import RequestQuoteModal from "../../../../layout/customer/RequestQuoteModal";

function PhotosTitle(props: any) {
  const businessId = useParams();
  const location = useLocation();
  const state = location.state;
  const userIntrests = props?.data?.user_request_intrests;
  const userRequestId = useLocation()?.state?.userRequestId;
  console.log(props.data);
  const isInterested = userIntrests?.filter((d: any) => {
    return d?.user_request_id == state?.userRequestId;
  });
  const isQuote = userIntrests?.filter((d: any) => {
    ("");
  });

  const [showModal, setShowModal] = useState(false);

  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <div className="flex  xs:flex-col lg:flex-row justify-between lg:py-5 xs:py-4 lg:items-center xs:gap-5">
      {showQuoteModal && (
        <RequestQuoteModal
          mutate={props.mutate}
          onCancel={() => {
            setShowQuoteModal(false);
          }}
          id={businessId?.id}
          requestId={userRequestId}
        />
      )}
      {showModal && (
        <ShowInterestModal
          onCancel={() => {
            setShowModal(false);
          }}
          id={businessId?.id}
          userRequestId={state?.userRequestId}
        />
      )}
      <div>
        <Heading
          variant="headingTitle"
          text="Photos"
          headingclassname="text-textColor !font-extrabold !font-poppins-bold tracking-wide dark:text-darktextColor"
        />
      </div>
      <div className=" items-center flex gap-2">
        {isQuote?.length > 0 ? (
          <Button
            disabled={props.page_key !== "customer"}
            variant="filled"
            color="secondary"
            size="normal"
            children="Quote Requested"
            buttonClassName="!px-4 py-2 text-sm tracking-wide  bg-slate-400 cursor-not-allowed hover:bg-slate-400"
          />
        ) : (
          <Button
            disabled={
              (props?.data?.requested_quotes_on_business?.length > 0 ||
                props?.data?.request_quotes?.length > 0 ||
                props.page_key !== "customer") ??
              false
            }
            onClick={() => setShowQuoteModal(!showQuoteModal)}
            variant="filled"
            color="secondary"
            size="normal"
            children={
              props?.data?.requested_quotes_on_business?.length > 0
                ? "Quote Requested"
                : "Request Quote"
            }
            buttonClassName="!px-4 py-2 text-sm tracking-wide "
          />
        )}
        {isInterested?.length > 0 ? (
          <Button
            variant="filled"
            color="primary"
            size="normal"
            children="Shown interest"
            buttonClassName="!px-4 py-2 text-sm tracking-wide  bg-slate-400 cursor-not-allowed hover:bg-slate-400"
          />
        ) : (
          <Button
            disabled={props.page_key !== "customer"}
            onClick={() => setShowModal(!showModal)}
            variant="filled"
            color="primary"
            size="normal"
            children="Show interest"
            buttonClassName="!px-4 py-2 text-sm tracking-wide disabled:text-white "
          />
        )}
      </div>
    </div>
  );
}

export default PhotosTitle;
