import { useState } from "react";
import { useParams } from "react-router";
import Close from "../../assets/close.tsx";
import Button from "../../components/UI/Button";
import { useTheme } from "../../store/theme-context.tsx";
import Modal from "../home/Modal.tsx";
import { useServices } from "../../store/customer/service-context.tsx";

function ShowInterestModal(props: any) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const requestId = useParams()?.id;
  const { handleShowInterest } = useServices();
  
  const handleShowInterestAsync = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (props?.userRequestId) {
        formData.set("user_request_id", props?.userRequestId ?? "");
      } else {
        formData.set("user_request_id", requestId ?? "");
      }
      formData.set("user_business_id", props?.id ?? "");

      await handleShowInterest(formData);
      
      // Call onSuccess callback if provided (for optimistic UI update)
      if (props?.onSuccess) {
        props.onSuccess();
      }
      
      setIsLoading(false);
      
      // Try to refresh data, but don't fail if it errors
      if (props?.mutate) {
        try {
          await props.mutate();
        } catch (mutateError) {
          console.warn("Failed to refresh data, but interest was shown:", mutateError);
        }
      }
      
      // Close modal after a brief delay
      setTimeout(() => {
        props.onCancel();
      }, 300);
    } catch (error) {
      setIsLoading(false);
      console.error("Show interest error:", error);
    }
  };
  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg dark:bg-modalDarkColor">
      <button
        className="absolute top-5 right-5"
        onClick={() => {
          props.onCancel();
        }}
      >
        {theme === "light" && <Close color="black" />}
        {theme === "dark" && <Close color="white" />}
      </button>
      <div className="flex flex-col w-full gap-5">
        <h1 className="text-black dark:text-white xl:text-lg md:text-md font-medium text-center mt-7 mb-3">
          Are you sure you want to show interest?
        </h1>

        <div className="flex gap-2 items-center justify-center px-5">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              props.onCancel();
            }}
            type="button"
            centerClassName="flex justify-center dark:text-white"
            buttonClassName="!px-10"
          >
            Cancel
          </Button>
          <Button
            loading={isLoading}
            onClick={handleShowInterestAsync}
            variant="filled"
            color="primary"
            type="button"
            centerClassName="flex justify-center dark:text-white"
            buttonClassName="!px-10"
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ShowInterestModal;
