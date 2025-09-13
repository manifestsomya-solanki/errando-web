import Plumber from "../../assets/plumber.png";
import SignInTopBar from "../../components/customer/home/SignInTopBar";
import Heading from "../../components/UI/Heading";
import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import Error from "../../components/UI/Error";
import Input from "../../components/UI/Input";
import { useAuth } from "../../store/customer/auth-context";
import Button from "../../components/UI/Button";
import { useEffect, useState } from "react";
import Footer from "../../components/customer/home/Footer";
import ForgotPasswordModal from "../../layout/ForgotPasswordModal";
import { userCurrentToken } from "../../Firebase";

const SignInPage = () => {
  const [key, setKey] = useState("");
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const {
    login,
    loginPro,
    error,
    isLoginProLoading,
    isLoginCustomerLoading,
    setError,
  } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: any = {};

      if (values.email.length === 0) {
        errors.email = "Please include an email.";
      }
      if (values.password.length === 0) {
        errors.password = "Please include a password.";
      } else if (values.password.length < 6) {
        errors.password = "Enter password with length more than 6 characters.";
      }

      return errors;
    },
    onSubmit: (values) => {
      console.log(key);
      const formData = new FormData(); //initialize formdata
      formData.set("email", values.email);
      formData.set("password", values.password);
      // formData.set("firebase_id", userCurrentToken);
      if (key === "customer") {
        login(formData);
      } else {
        loginPro(formData);
      }
    },
  });
  useEffect(() => {
    setError("");
  }, []);
  console.log(forgotPasswordModal);

  return (
    <div>
      {forgotPasswordModal && (
        <ForgotPasswordModal
          onCancel={() => {
            setForgotPasswordModal(false);
          }}
        />
      )}
      <div className="lg:mt-0 xs:pt-[9.051474530831099vh]  overflow-hidden  bg-[#E7F0F9] dark:bg-black h-max max-h-max ">
        <div className=" bg-[#E7F0F9] h-full overflow-hidden">
          <SignInTopBar />
          <div className=" lg:pt-16 xs:pt-0 w-screen   lg:dark:bg-dimGray xs:dark:bg-black h-full">
            <div className="flex  lg:flex-row xs:flex-col xl:pt-5  h-full items-center ">
              <div className=" mx-auto xs:my-5">
                <img
                  src={Plumber}
                  alt=""
                  className="!w-[80vh] lg:hidden mt-auto object-cover"
                />
              </div>
              <div className="2xl:pl-48 xl:pl-24 lg:pl-20 md:px-24 xs:px-5 xs:w-full xl:w-auto md:w-full">
                <p className="text-textColor font-poppins-bold p-2 2xl:text-7xl xl:text-6xl md:text-3xl xs:text-3xl font-bold 2xl:w-[540px] xl:w-[450px]  dark:text-darktextColor flex justify-center">
                  Sign In
                </p>
                <p className="p-2 2xl:text-2xl xl:text-xl md:text-lg xs:text-md font-medium 2xl:w-[540px] xl:w-[450px]  dark:text-slate-400 font-poppins flex justify-center">
                  Welcome back! You've been missed
                </p>
                <form>
                  <div className="w-full flex flex-col ">
                    <div className="mt-2 lg:px-10 xs:px-0 w-full">
                      <Input
                        className="rounded-lg bg-white dark:bg-black  dark:text-darktextColor  shadow-md xs:w-full outline-none pl-3 font-poppins"
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
                        className="rounded-lg  bg-white dark:bg-black  dark:text-darktextColor shadow-md xs:w-full outline-none pl-3 font-poppins"
                        type="password"
                        placeholder="Password"
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <Error
                          error={formik.errors.password}
                          className="my-1"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className=" mt-4 lg:px-10 xs:px-0 w-full flex flex-col gap-5">
                    <Button
                      // disabled={key === "pro" ? true : false}
                      onClick={(e: React.FormEvent) => {
                        e.preventDefault();
                        formik.handleSubmit();
                        setKey("customer");
                      }}
                      size="big"
                      loading={isLoginCustomerLoading}
                      type="submit"
                      variant="filled"
                      color="primary"
                      centerClassName="flex justify-center items-center"
                    >
                      Sign In as a Customer
                    </Button>
                    <Button
                      // disabled={key === "customer" ? true : false}
                      onClick={(e: React.FormEvent) => {
                        e.preventDefault();
                        formik.handleSubmit();
                        setKey("pro");
                      }}
                      loading={isLoginProLoading}
                      type="submit"
                      variant="outlined"
                      color="primary"
                      centerClassName="flex justify-center items-center"
                    >
                      Sign In as a Pro
                    </Button>
                    {error && (
                      <Error error={error} className="text-center my-3" />
                    )}
                  </div>
                </form>
                <div className="flex items-center  mt-5 mb-1 gap-3 justify-center">
                  <Heading
                    variant="subHeader"
                    text="Don't have an account?"
                    headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-darktextColor xs:text-xs  md:text-base  flex justify-center"
                  />
                  <NavLink to="/signup-customer">
                    <Heading
                      variant="subHeader"
                      text="Sign Up"
                      headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-primaryBlue  justify-center text-primaryBlue"
                    />
                  </NavLink>
                </div>
                <div className="w-full text-center pb-5">
                  <button onClick={() => setForgotPasswordModal(true)}>
                    <Heading
                      variant="subHeader"
                      text="Forgot Password?"
                      headingclassname="!font-medium !font-poppins-bold tracking-wide dark:text-primaryBlue  justify-center text-primaryBlue"
                    />
                  </button>
                </div>
              </div>
              <div className="place-self-end mx-auto lg:flex h-full  !w-full xs:hidden">
                <img
                  src={Plumber}
                  alt=""
                  className="lg:flex !w-full xs:hidden mt-auto object-cover h-[80vh]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignInPage;
