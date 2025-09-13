import React from "react";
import Button from "../../components/UI/Button";
import Close from "../../assets/close";
import Modal from "../home/Modal";
import { useTheme } from "../../store/theme-context";

const SendQuoteModal = (props: {
  onCancel: () => void;
  formik: any;
  isLoading: boolean;
}) => {
  const { theme } = useTheme();
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
          Are you sure you want to send quote?
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
            loading={props?.isLoading}
            // onClick={handleBuy}
            variant="filled"
            color="primary"
            type="submit"
            centerClassName="flex justify-center dark:text-white"
            buttonClassName="!px-10"
            onClick={() => {
              props.formik.handleSubmit();
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SendQuoteModal;
