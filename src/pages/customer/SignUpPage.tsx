import { useFormik } from "formik";
import SignUpTopBar from "../../components/customer/home/SignUpTopBar";
import Heading from "../../components/UI/Heading";
import Error from "../../components/UI/Error";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { useEffect, useState } from "react";
import { useAuth } from "../../store/customer/auth-context";
import OtpVerificationModal from "../../layout/otp-verification/OtpVerificationModal";
import { NavLink } from "react-router-dom";

const SignUpPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const { register, error, isLoading, setError } = useAuth();
  console.log(error);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile_number: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors: any = {};
      if (!values.name) {
        errors.name = "Please include a valid name";
      }
      if (!values.email) {
        errors.email = "Please include a valid email";
      } else if (!values.email.includes("@")) {
        errors.email = "Please include a valid email";
      }
      if (!values.mobile_number) {
        errors.mobile_number = "Please include a valid phone number";
      }
      if (!values.password) {
        errors.password = "Please include a valid password";
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm the password";
      }
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Both the passwords do not match";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const formData = new FormData(); //initialize formdata
      formData.set("full_name", values.name);
      formData.set("email", values.email);
      formData.set("mobile_number", values.mobile_number);
      formData.set("password", values.password);
      const success = await register(formData);

      if (success) {
        setOpenModal(true);
      }
    },
  });
  useEffect(() => {
    setError("");
  }, []);
  console.log(openModal);
  const inputClassName =
    "rounded-lg  bg-white dark:text-darktextColor dark:bg-black shadow-md xs:w-full outline-none pl-3 ";
  return (
    <div className=" !overflow-hidden  h-screen  dark:xs:mt-0 xs:mt-0">
      {openModal && (
        <OtpVerificationModal
          onCancel={() => setOpenModal(false)}
          name={formik.values.name}
          password={formik.values.password}
          email={formik.values.email}
          mobile_number={formik.values.mobile_number}
          role="pro"
        />
      )}
      <SignUpTopBar />
      <div className="bg-[url('assets/SignUpBackground.png')] dark:lg:bg-[url('assets/SignUpBackGroundDark.png')]  bg-cover bg-center bg-no-repeat h-full w-full xs:px-5 md:px-0 flex items-center xl:mt-[3.651474530831099vh] justify-center lg:mt-[4.651474530831099vh] xs:mt-[5.051474530831099vh]">
        <div className="bg-gray-100 dark:bg-dimGray dark:bg-opacity-90 lg:w-[30rem] xs:w-max bg-opacity-90 h-max pb-10 lg:ml-auto xl:mr-16 xs:mr-0 rounded-lg ">
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col items-center px-5 ">
                <div className="my-3 text-center">
                  <Heading
                    variant="bigTitle"
                    text="Sign Up as a Pro"
                    headingclassname="!font-extrabold !font-poppins-bold tracking-wide dark:text-darktextColor  mt-7"
                  />
                  <Heading
                    variant="headingTitle"
                    text="Welcome to Erranddo. DashBoard"
                    headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-darktextColor "
                  />
                </div>
                <div className="mt-2 w-full">
                  <Input
                    className={inputClassName}
                    type="text"
                    placeholder="Full Name"
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <Error
                      className="text-red-600  "
                      error={formik.errors.name}
                    ></Error>
                  ) : null}
                </div>
                <div className="mt-2 w-full">
                  <Input
                    className={inputClassName}
                    type="email"
                    placeholder="Email Address"
                    id="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik?.errors?.email ? (
                    <Error
                      className="text-red-600  "
                      error={formik?.errors?.email}
                    ></Error>
                  ) : null}
                </div>
                <div className="mt-2 w-full">
                  <Input
                    className={inputClassName}
                    type="string"
                    placeholder="Phone Number"
                    id="mobile_number"
                    name="mobile_number"
                    onChange={formik.handleChange}
                    value={formik.values.mobile_number}
                  />
                  {formik.touched.mobile_number &&
                  formik?.errors?.mobile_number ? (
                    <Error
                      className="text-red-600  "
                      error={formik?.errors?.mobile_number}
                    ></Error>
                  ) : null}
                </div>
                <div className="mt-2 w-full">
                  <Input
                    className={inputClassName}
                    type="password"
                    placeholder="Password"
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik?.errors?.password ? (
                    <Error
                      className="text-red-600  "
                      error={formik?.errors?.password}
                    ></Error>
                  ) : null}
                </div>
                <div className="mt-2 w-full">
                  <Input
                    className={inputClassName}
                    type="password"
                    placeholder="Confirm password"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                  />
                  {formik.touched.confirmPassword &&
                  formik?.errors?.confirmPassword ? (
                    <Error
                      className="text-red-600  "
                      error={formik?.errors?.confirmPassword}
                    ></Error>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-5 px-6 my-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  id="agree"
                  name="agree"
                  onChange={formik.handleChange}
                  checked={formik.values.agree}
                ></input>
                <label className="flex gap-1" htmlFor="agree">
                  <Heading
                    variant="smallTitle"
                    text="I agree to the"
                    headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-darktextColor "
                  />
                  <Heading
                    variant="smallTitle"
                    text="Terms & Conditions"
                    headingclassname="!font-bold !font-poppins-bold tracking-wide dark:text-darktextColor "
                  />
                </label>
              </div>
              <div className="px-6 mt-4 w-full">
                <Button
                  loading={isLoading && !openModal ? true : false}
                  disabled={!formik.values.agree}
                  type="submit"
                  variant="filled"
                  color="primary"
                  buttonClassName="w-full py-3 font-poppins "
                  centerClassName="flex justify-center items-center"
                  children="Sign Up As Pro"
                />
                {error && !openModal && (
                  <Error error={error} className="text-center my-3" />
                )}
              </div>
              <div className="flex items-center  mt-5 mb-1 gap-3 justify-center">
                <Heading
                  variant="subHeader"
                  text="Already have an account?"
                  headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-darktextColor xs:text-xs  md:text-base  flex justify-center"
                />
                <NavLink to="/sign-in">
                  <Heading
                    variant="subHeader"
                    text="Sign In"
                    headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-primaryBlue  justify-center text-primaryBlue"
                  />
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const delay = (delayInms: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};
export default SignUpPage;
