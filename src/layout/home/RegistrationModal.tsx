import { useState } from "react";
import Modal from "./Modal";
import Close from "../../assets/close";
import VerifyMobileModal from "./VerifyMobileModal";
import { useFormik } from "formik";
import { useAuth } from "../../store/customer/auth-context";
import Label from "../../components/UI/Label";
import Input from "../../components/UI/Input";
import Error from "../../components/UI/Error";
import Button from "../../components/UI/Button";
import { useTheme } from "../../store/theme-context";

function RegistrationModal(props: {
  onCancel: () => void;
  open: boolean;
  onCancelAll: () => void;
  name: string;
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const { sendOtp, isLoading, error } = useAuth();
  const [isedit, setIsEdit] = useState(false);
  const { theme } = useTheme();
  const oldEmail = localStorage.getItem("email");
  const oldMobileNumber = localStorage.getItem("mobile_number");
  const formik = useFormik({
    initialValues: {
      email: oldEmail ? oldEmail : "",
      mobile_number: oldMobileNumber ? oldMobileNumber : "",
    },
    validate: (values) => {
      const errors: any = {};

      if (values.email.length === 0) {
        errors.email = "Please include an email.";
      } else if (!values.email.includes("@")) {
        errors.email = "Please include an valid email";
      }
      if (values.mobile_number.length === 0) {
        errors.mobile_number = "Please include a mobile number.";
      }

      return errors;
    },
    onSubmit: (values) => {
      const formData = new FormData(); //initialize formdata
      formData.set("full_name", props.name);
      formData.set("email", values.email);
      formData.set("mobile_number", values.mobile_number);
      if (isedit) {
        formData.set("key", "1");
      }
      localStorage.setItem("email", values.email);
      localStorage.setItem("mobile_number", values.mobile_number);
      sendOtp(formData);
      if (error.length === 0) {
        setTimeout(() => {
          setOpenMenu(true);
        }, 1000);
      }
    },
  });
  return (
    <>
      {
        <VerifyMobileModal
          mobile_number={formik.values.mobile_number}
          email={formik.values.email}
          open={openMenu}
          onCancel={(key: string) => {
            if (key === "1") {
              setIsEdit(true);
            }
            setOpenMenu(false);
            localStorage.removeItem("email"),
              localStorage.removeItem("mobile_number");
          }}
          onCancelAll={() => {
            setOpenMenu(false);
            localStorage.removeItem("email"),
              localStorage.removeItem("mobile_number");
            props.onCancelAll();
          }}
        />
      }
      {props.open && (
        <Modal
          className="bg-slate-100 opacity-90 rounded-lg xl:w-[570px] md:w-[470px]  dark:bg-modalDarkColor h-[28rem]"
          backdropClassName="bg-transparent"
        >
          <button
            className=" absolute top-5 right-5"
            onClick={() => {
              props.onCancelAll();
            }}
          >
            {theme === "light" && <div children={<Close color="black" />} />}
            {theme === "dark" && <div children={<Close color="white" />} />}
          </button>

          <div className="flex flex-col items-center xl:w-[550px] md:w-[450px] xl:mt-1 md:mt-2 p-3 gap-2">
            <div className="text-center">
              <h1 className="text-black dark:text-white xl:text-xl md:text-lg xs:text-lg font-bold pt-5">
                Lets get those quotes in from Pro’s near you
              </h1>
            </div>
          </div>
          <form className="" onSubmit={formik.handleSubmit}>
            <div className="my-5">
              <Label label="Enter Email Address" required className="my-1" />
              <Input
                className="w-full bg-white xl:w-[550px] md:w-[450px]"
                type="text"
                placeholder="Email Address"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <Error
                  className="text-red-600  "
                  error={formik.errors.email}
                ></Error>
              ) : null}
            </div>
            <div className="my-5">
              <Label label="Enter Mobile Number" required className="my-1" />
              <Input
                className="w-full bg-white xl:w-[550px] md:w-[450px]"
                type="text"
                placeholder="Mobile Number"
                id="mobile_number"
                name="mobile_number"
                onChange={formik.handleChange}
                value={formik.values.mobile_number}
              />
              {formik.touched.mobile_number && formik.errors.mobile_number ? (
                <Error
                  className="text-red-600  "
                  error={formik.errors.mobile_number}
                ></Error>
              ) : null}
            </div>
            <Error
              error={error}
              className="text-center mt-3  xl:w-[550px] md:w-[450px]"
            />
            <div className="flex gap-5 xl:w-[550px] md:w-[450px] justify-center pt-4">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("email"),
                    localStorage.removeItem("mobile_number"),
                    props.onCancel();
                }}
                className="text-black dark:text-white w-32 border-[#707070] border  xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 "
              >
                Back
              </button>
              <Button
                loading={isLoading}
                type="submit"
                buttonClassName="text-white  bg-[#0003FF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5  mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Continue
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default RegistrationModal;
