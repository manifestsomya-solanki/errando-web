import Modal from "./Modal";
import Close from "../../assets/close.svg";
import { useFormik } from "formik";

import Heading from "../../components/UI/Heading";
function ConfirmServiceModal(props: {
  onCancel: () => void;
  open: boolean;
  onCancelAll: () => void;
}) {
  const formik = useFormik({
    initialValues: {
      postCode: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (values.postCode.toString().length === 0) {
        errors.postCode = "Required";
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <>
      {props.open && (
        <Modal className="bg-slate-100 opacity-90 rounded-lg xl:w-[570px] md:w-[470px]  dark:bg-modalDarkColor">
          <button
            className=" absolute top-5 right-5"
            onClick={() => {
              props.onCancelAll();
            }}
          >
            <img src={Close} alt="" className="md:h-5 md:w-5 xs:h-4 xs:w-4" />
          </button>
          <div className="flex flex-col items-center xl:w-[550px] md:w-[450px] xl:mt-1 md:mt-2 p-3 gap-2">
            <div className="flex flex-col items-center xl:w-[550px] md:w-[400px] xl:mt-1 md:mt-2 p-6 gap-2">
              <div className="text-center">
                <Heading variant="bigTitle" text=" You are almost done" />
              </div>
            </div>
            <div className="pb-7 xs:w-full xl:pl-0 md:pl-3">
              <Heading
                variant="headingTitle"
                text="We just need a few more details in order to get you
                                free quotes in minutes."
              />
            </div>
            <div className="flex gap-5 xl:w-[550px] md:w-[450px] justify-center pl-2">
              <button
                type="button"
                className="text-white md:w-48 xs:w-36 xs:text-sm bg-red-500  xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 "
                onClick={() => props.onCancelAll()}
              >
                I Want to Quit
              </button>
              <button
                type="submit"
                className="text-white md:w-48 xs:w-36 xs:text-sm bg-green-500  xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 "
              >
                Continue
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ConfirmServiceModal;
