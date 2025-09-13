import Modal from "../home/Modal";

import Close from "../../assets/close.tsx";
import Label from "../../components/UI/Label";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { Formik, FormikErrors } from "formik";
import { OtpValues } from "../../models/user";
import Error from "../../components/UI/Error";
import Heading from "../../components/UI/Heading";
import { useAuth } from "../../store/customer/auth-context.tsx";
import { useTheme } from "../../store/theme-context";

function OtpVerificationModal({
  onCancel,
  email,
  role,
}: {
  onCancel: () => void;
  email: string;
  mobile_number: string;
  name: string;
  role: string;
  password?: string;
}) {
  const { verifyOtp, isLoading, error } = useAuth();
  const validate = (values: OtpValues) => {
    const errors: FormikErrors<OtpValues> = {};

    if (!values.mobile_number) {
      errors.mobile_number = "Please include a valid Otp of mobile number";
    }
    return errors;
  };
  const { theme } = useTheme();
  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg dark:bg-modalDarkColor">
      <button
        className=" absolute top-5 right-5"
        onClick={() => {
          onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>

      <div className="py-5">
        <Heading
          headingclassname="my-3  text-primaryGreen !font-semibold"
          variant="subHeader"
          text="Please check your phone number for the One Time Password(OTP)"
        />
        <Formik<OtpValues>
          initialValues={{
            mobile_number: "",
          }}
          enableReinitialize
          onSubmit={async (values) => {
            console.log("submit");
            const formData = new FormData(); //initialize formdata
            formData.set("otp", values.mobile_number);
            formData.set("email", email);
            const success = await verifyOtp(formData, role);
          }}
          validate={validate}
        >
          {(props) => (
            <form autoComplete="off" onSubmit={props.handleSubmit}>
              <div className="py-3">
                <Label required label="Enter OTP for Mobile Number" />
                <Input
                  id="mobile_number"
                  value={props.values.mobile_number}
                  onChange={props.handleChange}
                />
                {props?.touched?.mobile_number &&
                props?.errors?.mobile_number ? (
                  <Error error={props?.errors?.mobile_number} />
                ) : null}
              </div>

              <div className="flex w-full justify-center gap-5">
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  children="Cancel"
                  onClick={() => onCancel()}
                  centerClassName="flex justify-center items-center"
                  buttonClassName="!px-3 font-poppins py-3 w-full"
                />
                <Button
                  loading={isLoading}
                  type="submit"
                  variant="filled"
                  color="primary"
                  children="Verify OTP"
                  centerClassName="flex justify-center items-center"
                  buttonClassName="!px-3 font-poppins py-3 w-full"
                />
              </div>
              <Error error={error} className="text-center mt-3" />
            </form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default OtpVerificationModal;
