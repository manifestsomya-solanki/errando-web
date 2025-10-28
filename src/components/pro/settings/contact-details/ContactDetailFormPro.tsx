import { Formik, FormikErrors } from "formik";
import Input from "../../../UI/Input";
import Error from "../../../UI/Error";
import Button from "../../../UI/Button";
import Label from "../../../UI/Label";

import { useAuth } from "../../../../store/pro/auth-pro-context";
import Heading from "../../../UI/Heading";
import { useState } from "react";
import EditContactModal from "../../../../layout/home/EditContactModal";
import EmailVerificationLinkModal from "../../../../layout/customer/EmailVerificationLinkModal";

function ContactDetailFormPro() {
  const { userData, profileHandler, isProfileLoading, sendOtp, mutate } =
    useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  //validate the logs entered in the form
  const validate = (values: any) => {
    const errors: FormikErrors<any> = {};
    if (!values.email) {
      errors.email = "Please include an email";
    } else if (!values.email.includes("@")) {
      errors.email = "Please include a valid email address";
    }
    if (!values.mobile_number) {
      errors.mobile_number = "Please include a mobile number";
    }

    return errors;
  };

  const inputClassName =
    "items-center w-full text-md md:w-full text-slate-700 border-slate-500 outline-none  font-medium font-poppins     border rounded-lg    ease-in focus:caret-slate-500  lg:mr-3";
  const buttonClassName =
    "xs:ml-auto lg:mr-auto rounded-lg text-md font-semibold font-poppins border-slate-500";

  return (
    <>
      <Formik
        initialValues={{
          email: userData?.email,
          mobile_number: userData?.mobile_number,
        }}
        enableReinitialize
        onSubmit={async (values) => {
          if (isVerifying) {
            console.log("Auto-save blocked: Verification in progress");
            return;
          }
          
          if (emailChanged && userData?.is_email_verified === "0") {
            console.log("Auto-save blocked: Email changed but not verified");
            return;
          }
          
          if (values.email !== userData?.email && userData?.is_email_verified === "0") {
            console.log("Auto-save blocked: Email different and not verified");
            return;
          }
          
          console.log("Manual save allowed");
          const formData = new FormData();
          if (values.email) {
            formData.set("email", values.email);
          }
          if (values.mobile_number) {
            formData.set("mobile_number", values.mobile_number);
          }
          profileHandler(formData);
          await mutate();
          setEmailChanged(false);
        }}
        validate={validate}
      >
        {(props) => (
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            {openModal && (
              <EditContactModal
                onCancel={() => setOpenModal(false)}
                email={props.values.email ?? ""}
              />
            )}
            {openEmailModal && (
              <EmailVerificationLinkModal
                onCancel={() => setOpenEmailModal(false)}
                email={props.values.email ?? ""}
              />
            )}
            <input className="hidden" autoComplete="false" />
            <div className="my-3">
              <div className="flex flex-row justify-between">
                <Label required label="Email" className="ml-1 text-center" />
                <Button
                  type="button"
                  variant="filled"
                  color="primary"
                  size="normal"
                  buttonClassName={`!py-0.5 !px-5 text-sm ${
                    emailChanged || userData?.is_email_verified === "0"
                      ? "bg-slate-300 text-white hover:bg-slate-400"
                      : "!bg-green-500 !text-white"
                  } rounded-md`}
                  onClick={async () => {
                    setIsVerifying(true);
                    const formData = new FormData();
                    formData.set("email", props.values.email ?? "");
                    formData.set("mobile_number", props.values.mobile_number);
                    formData.set("key", "0");
                    await sendOtp(formData);
                    setOpenEmailModal(!openEmailModal);
                    
                    const checkVerification = setInterval(async () => {
                      await mutate();
                      if (userData?.is_email_verified === "1") {
                        clearInterval(checkVerification);
                        setEmailChanged(false);
                        setIsVerifying(false);
                        console.log("Verification complete - manual save required");
                        setTimeout(async () => {
                          await mutate();
                        }, 1000);
                      }
                    }, 3000);
                    
                    setTimeout(() => {
                      clearInterval(checkVerification);
                      setIsVerifying(false);
                    }, 300000);
                  }}
                >
                  {emailChanged || userData?.is_email_verified === "0" ? "Verify" : "Verified"}
                </Button>
              </div>

              <div className="my-5 flex justify-center">
                <Input
                  id="email"
                  value={props.values.email}
                  className={inputClassName}
                  onChange={(e) => {
                    props.handleChange(e);
                    if (e.target.value !== userData?.email) {
                      setEmailChanged(true);
                    } else {
                      setEmailChanged(false);
                    }
                  }}
                />
                {props.touched.email && props.errors.email ? (
                  <Error error={props?.errors.email} />
                ) : null}
              </div>
            </div>
            <div className="my-3">
              <div className="flex flex-row justify-between">
                <Label required label="Mobile Number" className="text-center" />
                <Button
                  type="button"
                  variant="filled"
                  color="primary"
                  size="normal"
                  buttonClassName={`!py-0.5 !px-5 text-sm xs:hidden lg:flex ${
                    userData?.is_mobile_verified === "0"
                      ? "bg-slate-300 text-white hover:bg-slate-400"
                      : "!bg-green-500 !text-white"
                  } px-3 rounded-md`}
                  onClick={() => {
                    const formData = new FormData(); //initialize formdata
                    formData.set("email", props.values.email ?? "");
                    formData.set("mobile_number", props.values.mobile_number);
                    formData.set("key", "1");
                    sendOtp(formData);
                    setOpenModal(!openModal);
                  }}
                >
                  {userData?.is_mobile_verified === "0" ? "Verify" : "Verified"}
                </Button>
              </div>
              <div className="my-5 flex justify-center">
                <Input
                  id="mobile_number"
                  value={props.values.mobile_number}
                  className={inputClassName}
                  onChange={props.handleChange}
                />
              </div>
              <h6 className="dark:text-gray-400 text-gray-400 text-center text-xs xs:my-1 lg:my-1">
                **Verifing your contact details gives Pro’s confidence your
                request is genuine. **
              </h6>
              {props?.touched?.mobile_number && props?.errors?.mobile_number ? (
                <Error error={props?.errors?.mobile_number} />
              ) : null}
            </div>
            <div className="dark:bg-dimGray bg-white flex w-[100%] py-5 gap-4  ">
              <Button
                disabled={
                  !props.values.email ||
                  !props.values.mobile_number ||
                  (userData &&
                    userData.email === props.values.email &&
                    userData?.mobile_number === props.values.mobile_number) ||
                  (emailChanged && userData?.is_email_verified === "0") ||
                  (props.values.email !== userData?.email && userData?.is_email_verified === "0") ||
                  (props.values.email !== userData?.email && emailChanged)
                }
                loading={isProfileLoading}
                variant="filled"
                color="primary"
                buttonClassName={buttonClassName}
                centerClassName="flex justify-center items-center text-white"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}

export default ContactDetailFormPro;
