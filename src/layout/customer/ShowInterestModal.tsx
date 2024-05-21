import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Close from "../../assets/close.tsx";
import Button from "../../components/UI/Button";
import { useTheme } from "../../store/theme-context.tsx";
import Modal from "../home/Modal.tsx";
import { useServices } from "../../store/customer/service-context.tsx";
import useSWR, { mutate } from "swr";
import { fetcher } from "../../store/customer/home-context.tsx";

function ShowInterestModal(props: any) {
  const { theme } = useTheme();

  const requestId = useParams()?.id;
  const { handleShowInterest, isLoading } = useServices();
  const url = `https://erranddo.com/admin/api/v1/businesses/${props?.id}/detail`;
  const { mutate } = useSWR(url, fetcher);
  const handleShowInterestAsync = async () => {
    const formData = new FormData();
    if (props?.userRequestId) {
      formData.set("user_request_id", props?.userRequestId ?? "");
    } else {
      formData.set("user_request_id", requestId ?? "");
    }
    formData.set("user_business_id", props?.id ?? "");

    await handleShowInterest(formData);
    await props.onCancel();
    if (props?.userRequestId) {
      await mutate();
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
