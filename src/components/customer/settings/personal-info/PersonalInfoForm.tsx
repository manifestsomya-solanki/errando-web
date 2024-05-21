import { Formik, FormikErrors } from "formik";
import Input from "../../../UI/Input";
import Error from "../../../UI/Error";
import Button from "../../../UI/Button";
import Label from "../../../UI/Label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../store/customer/auth-context";
import useSWR from "swr";
import { fetcher } from "../../../../store/customer/home-context";
import { UserData } from "../../../../models/user";
import PostCodeDetails from "../../../UI/PostCodeDetails";

function PersonalInfoForm() {
  const navigate = useNavigate();
  const token = localStorage.getItem("data");
  let userData: any;
  if (token) {
    userData = JSON.parse(token);
  }

  const url = `https://erranddo.com/admin/api/v1/user/detail?user_id=${userData?.id}`;
  const { data, error } = useSWR(url, fetcher);
  const profileData: UserData = data?.data ?? "";

  const { profileHandler, isProfileLoading } = useAuth();
  //validate the logs entered in the form
  const validate = (values: any) => {
    const errors: FormikErrors<any> = {};
    if (!values.name) {
      errors.name = "Please include a name";
    }

    if (!values.post_code) {
      errors.post_code = "Please include a postcode";
    }

    if (!values.bio) {
      errors.bio = "Please include a valid bio";
    }
    return errors;
  };
  const inputClassName =
    "items-center w-full text-md md:w-full text-slate-700 border-slate-500 outline-none  font-medium font-poppins     border rounded-lg    ease-in focus:caret-slate-500  lg:mr-3";
  const buttonClassName =
    "px-6 py-2   w-full   xs:mx-auto md:mx-0  rounded-lg text-md font-semibold font-poppins border-slate-500";
  return (
    <Formik
      initialValues={{
        name: profileData?.full_name,
        post_code: profileData?.postcode_id,
        bio: profileData?.bio,
      }}
      enableReinitialize
      onSubmit={(values) => {
        const formData = new FormData();
        formData.set("full_name", values.name);
        formData.set("postcode_id", values.post_code);
        formData.set("bio", values.bio);
        profileHandler(formData);
      }}
      validate={validate}
    >
      {(props) => (
        <form autoComplete="off" onSubmit={props.handleSubmit}>
          <input className="hidden" autoComplete="false" />
          <div className="my-5">
            <Label required label="Name" className="ml-1" />
            <Input
              id="name"
              value={props.values.name}
              className={inputClassName}
              onChange={props.handleChange}
            />
            {props.touched.name && props.errors.name ? (
              <Error error={props?.errors.name} />
            ) : null}
          </div>
          <div className="my-5">
            <Label required label="Postcode" className="ml-1" />
            {/* <Input
              id="post_code"
              value={props.values.post_code}
              className={inputClassName}
              onChange={props.handleChange}
            /> */}
            <PostCodeDetails
              id="post_code"
              onChange={(ev: any) => {
                props.setFieldValue("post_code", ev);
              }}
              initialValue={props.values.post_code}
            />
            <h6 className="dark:text-gray-400 text-gray-400 text-center text-xs xs:my-1 lg:my-1">
              **This will be the default postcode when you place a request**
            </h6>
            {props?.touched?.post_code && props?.errors?.post_code ? (
              <Error error={props?.errors?.post_code} />
            ) : null}
          </div>
          <div className="my-5">
            <Label required label="Bio" className="ml-1" />
            <Input
              id="bio"
              value={props.values.bio}
              className={inputClassName}
              onChange={props.handleChange}
            />
            {props?.touched?.bio && props?.errors?.bio ? (
              <Error error={props?.errors?.bio} />
            ) : null}
          </div>

          <div className="dark:bg-dimGray bg-white flex w-[100%] py-5 gap-4  ">
            <Button
              variant="ghost"
              color="gray"
              buttonClassName={buttonClassName}
              centerClassName="flex justify-center items-center"
              onClick={() => navigate("/home")}
            >
              Cancel
            </Button>
            <Button
              loading={isProfileLoading}
              variant="filled"
              color="primary"
              buttonClassName={buttonClassName}
              centerClassName="flex justify-center items-center"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default PersonalInfoForm;
