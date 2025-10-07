import Close from "../assets/close.svg";
import { Formik } from "formik";
import Modal from "./home/Modal";
import Label from "../components/UI/Label";
import Input from "../components/UI/Input";
import Error from "../components/UI/Error";
import Button from "../components/UI/Button";
import { useAuth } from "../store/customer/auth-context";
import { useState } from "react";

function ForgotPasswordModal({ onCancel }: { onCancel: () => void }) {
  console.log('ForgotPasswordModal rendered');
  const { forgotPassword, isLoading, error } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const validate = (values: any) => {
    const errors: any = {};
    if (!values.email) {
      errors.email = "Please include an email address";
    } else if (!values.email.includes("@")) {
      errors.email = "Please include a valid email address";
    }

    return errors;
  };
  return (
    <Modal
      className="bg-slate-100 opacity-90 rounded-lg xl:w-[470px] md:w-[370px]  dark:bg-modalDarkColor"
      backdropClassName="bg-transparent"
    >
      <button
        className=" absolute top-5 right-5"
        onClick={() => {
          onCancel();
        }}
      >
        <img src={Close} alt="" className="md:h-5 md:w-5 xs:h-4 xs:w-4" />
      </button>
      <div className="flex flex-col items-center xl:w-[450px] md:w-[350px] xl:mt-1 md:mt-2 p-3 gap-2">
        <div className="text-center">
          <h1 className="text-black xl:text-xl md:text-lg xs:text-lg font-bold">
            Forgot Password
          </h1>
        </div>
      </div>
      <Formik
        initialValues={{
          email: "",
        }}
        enableReinitialize
        onSubmit={async (values) => {
          const formData = new FormData(); //initialize formdata
          formData.set("email", values.email);
          await forgotPassword(formData);
          setIsSubmitted(true);
        }}
        validate={validate}
      >
        {(props) => (
          <form className="" onSubmit={props.handleSubmit}>
            <div className="my-5">
              <Label label="Enter Email Address" required className="my-1" />
              <Input
                className="w-full bg-white xl:w-[450px] md:w-[350px]"
                type="text"
                placeholder="Email Address"
                id="email"
                name="email"
                onChange={props.handleChange}
                value={props.values.email}
              />
              {props.touched.email && props.errors.email ? (
                <Error
                  className="text-red-600  "
                  error={props.errors.email}
                ></Error>
              ) : null}
            </div>
            {isSubmitted ? (
              <div className="text-center">
                <p className="text-green-600 mb-4">Password reset email sent successfully!</p>
                <button
                  type="button"
                  className="text-white bg-blue-500 px-8 py-2 rounded-xl"
                  onClick={() => {
                    onCancel();
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex gap-5 xl:w-[450px] md:w-[350px] justify-center">
                <button
                  type="button"
                  onClick={() => onCancel()}
                  className="text-black w-32 border-[#707070] border  xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 "
                >
                  Cancel
                </button>
                <Button
                  loading={isLoading}
                  type="submit"
                  buttonClassName="text-white  bg-[#0003FF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5  mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Continue
                </Button>
              </div>
            )}
          </form>
        )}
        {/* <Error
                    // error={error}
                    className="text-center mt-3  xl:w-[550px] md:w-[450px]"
                /> */}
      </Formik>
    </Modal>
  );
}

export default ForgotPasswordModal;
