import useSWR from "swr";
import Close from "../../assets/close.tsx";
import Button from "../../components/UI/Button.tsx";
import { fetcher } from "../../store/customer/home-context.tsx";
import { useServices } from "../../store/customer/service-context.tsx";
import { useTheme } from "../../store/theme-context.tsx";
import Modal from "../home/Modal.tsx";
import { useParams } from "react-router";

function RequestQuoteModal(props: any) {
  const { theme } = useTheme();

  const { handleRequestQuote, isRequestQuoteLoading } = useServices();

  const handleRequestQuoteAsync = async () => {
    const formData = new FormData();
    formData.set("user_request_id", props?.requestId ?? "");
    formData.set("user_business_id", props?.id ?? "");
    await handleRequestQuote(formData);
    await props.onCancel();

    await props.mutate();
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
          Are you sure you want to request quote?
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
            loading={isRequestQuoteLoading}
            onClick={handleRequestQuoteAsync}
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

export default RequestQuoteModal;
