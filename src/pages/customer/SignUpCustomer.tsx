import Plumber from "../../assets/plumber.png";
import Heading from "../../components/UI/Heading";
import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import Error from "../../components/UI/Error";
import Input from "../../components/UI/Input";
import SignUpTopBar from "../../components/customer/home/SignUpTopBar";
import Button from "../../components/UI/Button";
import { useEffect, useState } from "react";
import OtpVerificationModal from "../../layout/otp-verification/OtpVerificationModal";
import { useAuth } from "../../store/customer/auth-context";

const SignUpCustomer = () => {
  const { sendOtp, isLoading, error, setError } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile_number: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    validate: (values) => {
      const errors: any = {};
      if (values.name.length === 0) {
        errors.name = "Please include your full name.";
      }
      if (values.email.length === 0) {
        errors.email = "Please include an email.";
      }
      if (values.mobile_number.length === 0) {
        errors.mobile_number = "Please include a mobile number.";
      }
      if (!values.password) {
        errors.password = "Please include a password.";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters.";
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password.";
      }
      if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
        errors.confirmPassword = "Both the passwords do not match.";
      }
      if (!values.agree) {
        errors.agree = "You must agree to the Terms & Conditions.";
      }

      return errors;
    },
    onSubmit: (values) => {
      const formData = new FormData(); //initialize formdata
      formData.set("full_name", values.name);
      formData.set("email", values.email);
      formData.set("mobile_number", values.mobile_number);
      formData.set("password", values.password);
      console.log(...formData);
      sendOtp(formData);

      if (error.length === 0)
        setTimeout(() => {
          setOpenModal(true);
        }, 1000);
    },
  });
  useEffect(() => {
    setError("");
  }, []);
  return (
    <div className="lg:mt-0 xs:pt-[9.051474530831099vh]  overflow-hidden  bg-[#E7F0F9] dark:bg-black h-screen max-h-screen ">
      {openModal && (
        <OtpVerificationModal
          onCancel={() => setOpenModal(false)}
          name={formik.values.name}
          email={formik.values.email}
          mobile_number={formik.values.mobile_number}
          role="customer"
        />
      )}
      <div className=" bg-[#E7F0F9] h-full overflow-hidden">
        <SignUpTopBar />
        <div className=" md:pt-16 xs:pt-0 w-screen   lg:dark:bg-dimGray xs:dark:bg-black h-full">
          <div className="flex  lg:flex-row xs:flex-col xl:pt-5  h-full items-center ">
            <div className=" mx-auto xs:my-5">
              <img
                src={Plumber}
                alt=""
                className="  !w-full lg:hidden mt-auto object-cover"
              />
            </div>
            <div className="2xl:pl-48 xl:pl-24 lg:pl-20 md:px-24 xs:px-5 xs:w-full xl:w-auto md:w-full">
              <p className="text-textColor font-poppins-bold p-2 2xl:text-7xl xl:text-6xl md:text-5xl xs:text-3xl font-bold 2xl:w-[540px] xl:w-[450px]  dark:text-darktextColor flex justify-center">
                Sign Up
              </p>
              <p className="p-2 2xl:text-2xl xl:text-xl md:text-xl xs:text-md font-medium 2xl:w-[540px] xl:w-[450px]  dark:text-slate-400 font-poppins flex justify-center">
                Welcome to Erranddo.
              </p>
              <form onSubmit={formik.handleSubmit}>
                <div className="w-full flex flex-col ">
                  <div className="mt-2 lg:px-10 xs:px-0 w-full">
                    <Input
                      className="rounded-lg bg-white dark:bg-black  dark:text-darktextColor  shadow-md xs:w-full outline-none pl-3 "
                      type="name"
                      placeholder="Full Name"
                      id="name"
                      name="name"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <Error error={formik.errors.name} className="my-1" />
                    ) : null}
                  </div>
                  <div className="mt-2 lg:px-10 xs:px-0 w-full">
                    <Input
                      className="rounded-lg bg-white dark:bg-black  dark:text-darktextColor  shadow-md xs:w-full outline-none pl-3 "
                      type="email"
                      placeholder="Email"
                      id="email"
                      name="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <Error error={formik.errors.email} className="my-1" />
                    ) : null}
                  </div>
                  <div className="mt-2 lg:px-10 xs:px-0 w-full">
                    <Input
                      className="rounded-lg bg-white dark:bg-black  dark:text-darktextColor  shadow-md xs:w-full outline-none pl-3 "
                      type="string"
                      placeholder="Phone Number"
                      id="mobile_number"
                      name="mobile_number"
                      onChange={formik.handleChange}
                      value={formik.values.mobile_number}
                    />
                    {formik.touched.mobile_number &&
                    formik.errors.mobile_number ? (
                      <Error
                        error={formik.errors.mobile_number}
                        className="my-1"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="w-full flex flex-col ">
                  <div className="mt-2 lg:px-10 xs:px-0 w-full">
                    <Input
                      className="rounded-lg bg-white dark:bg-black  dark:text-darktextColor  shadow-md xs:w-full outline-none pl-3 "
                      type="password"
                      placeholder="Password"
                      id="password"
                      name="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <Error error={formik.errors.password} className="my-1" />
                    ) : null}
                  </div>
                  <div className="mt-2 lg:px-10 xs:px-0 w-full">
                    <Input
                      className="rounded-lg bg-white dark:bg-black  dark:text-darktextColor  shadow-md xs:w-full outline-none pl-3 "
                      type="password"
                      placeholder="Confirm Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                    />
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                      <Error
                        error={formik.errors.confirmPassword}
                        className="my-1"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="mt-2 lg:px-10 xs:px-0 w-full flex items-center gap-3 justify-start">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    id="agree"
                    name="agree"
                    onChange={formik.handleChange}
                    checked={formik.values.agree}
                  />
                  <label className="flex gap-1 items-center" htmlFor="agree">
                    <Heading
                      variant="smallTitle"
                      text="I agree to the"
                      headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-darktextColor "
                    />
                    <a
                      href="/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white hover:opacity-80 cursor-pointer"
                    >
                      <Heading
                        variant="smallTitle"
                        text="Terms & Conditions"
                        headingclassname="!font-bold !font-poppins-bold tracking-wide"
                      />
                    </a>
                  </label>
                </div>
                {formik.touched.agree && formik.errors.agree ? (
                  <Error
                    error={formik.errors.agree}
                    className="text-center my-2"
                  />
                ) : null}
                <div className=" mt-4 lg:px-10 xs:px-0 w-full">
                  <Button
                    loading={isLoading && !openModal ? true : false}
                    disabled={!formik.values.agree}
                    type="submit"
                    centerClassName="flex justify-center items-center"
                    buttonClassName="bg-primaryBlue !font-bold !font-poppins-bold text-white xl:h-12 lg:h-10 xs:h-10 hover:bg-primaryBlue/80 hover:text-white dark:border-primaryBlue w-full rounded-xl"
                  >
                    Sign Up
                  </Button>
                  {error && !openModal && (
                    <Error error={error} className="text-center my-3" />
                  )}
                </div>
              </form>
              <div className="flex items-center my-5 gap-3 justify-center">
                <Heading
                  variant="subHeader"
                  text="Have an account?"
                  headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-darktextColor   flex justify-center"
                />
                <NavLink to="/sign-in">
                  <Heading
                    variant="subHeader"
                    text="Sign In"
                    headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-primaryBlue  justify-center text-primaryBlue"
                  />
                </NavLink>
              </div>
            </div>
            <div className="place-self-end mx-auto lg:flex h-full  !w-full xs:hidden">
              <img
                src={Plumber}
                alt=""
                className="lg:flex   !w-full xs:hidden mt-auto object-cover  h-[90%]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpCustomer;
