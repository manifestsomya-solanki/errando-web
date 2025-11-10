import { useLocation, useParams } from "react-router";
import Button from "../../../UI/Button";
import Heading from "../../../UI/Heading";
import { useState, useEffect } from "react";
import ShowInterestModal from "../../../../layout/customer/ShowInterestModal";
import RequestQuoteModal from "../../../../layout/customer/RequestQuoteModal";

function PhotosTitle(props: any) {
  const businessId = useParams();
  const location = useLocation();
  const state = location.state;
  const userIntrests = props?.data?.user_request_intrests;
  const userRequestId = useLocation()?.state?.userRequestId;
  const currentUserRequestId = state?.userRequestId || userRequestId;
  
  const [showModal, setShowModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Check if interest exists in API data
  const apiInterestExists = userIntrests && Array.isArray(userIntrests) && userIntrests.length > 0 && userIntrests.some((d: any) => {
    const interestRequestId = String(d?.user_request_id || '');
    const currentRequestId = String(currentUserRequestId || '');
    return interestRequestId === currentRequestId;
  });

  // Check localStorage for interest shown (for cross-page sync)
  const getLocalStorageInterestKey = () => {
    if (!businessId?.id || !currentUserRequestId) return null;
    return `interest_shown_${businessId.id}_${currentUserRequestId}`;
  };

  const localStorageInterestShown = getLocalStorageInterestKey() 
    ? localStorage.getItem(getLocalStorageInterestKey()!) === 'true'
    : false;

  // Initialize localStorage when API confirms interest
  useEffect(() => {
    const key = getLocalStorageInterestKey();
    if (apiInterestExists && key) {
      localStorage.setItem(key, 'true');
      // Close modal if it's open and interest already exists
      if (showModal) {
        setShowModal(false);
      }
    }
  }, [apiInterestExists, showModal, businessId?.id, currentUserRequestId]);

  // Combined check: either API shows interest OR localStorage shows interest
  const isInterested = apiInterestExists || localStorageInterestShown;

  // Prevent modal from opening if interest already shown
  const handleShowInterestClick = () => {
    if (!isInterested) {
      setShowModal(true);
    }
  };
  
  const isQuote = props?.data?.requested_quotes_on_business?.length > 0 || props?.data?.request_quotes?.length > 0;

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
          onSuccess={() => {
            const key = getLocalStorageInterestKey();
            if (key) {
              localStorage.setItem(key, 'true');
            }
            setShowModal(false);
          }}
          id={businessId?.id}
          userRequestId={state?.userRequestId}
          mutate={props.mutate}
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
        {isQuote ? (
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
        {isInterested ? (
          <Button
            disabled={true}
            variant="filled"
            color="primary"
            size="normal"
            children="Shown interest"
            buttonClassName="!px-4 py-2 text-sm tracking-wide bg-slate-400 cursor-not-allowed hover:bg-slate-400 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:text-white"
          />
        ) : (
          <Button
            disabled={props.page_key !== "customer" || isInterested}
            onClick={handleShowInterestClick}
            variant="filled"
            color="primary"
            size="normal"
            children="Show interest"
            buttonClassName="!px-4 py-2 text-sm tracking-wide disabled:text-white disabled:bg-slate-400 disabled:cursor-not-allowed"
          />
        )}
      </div>
    </div>
  );
}

export default PhotosTitle;
