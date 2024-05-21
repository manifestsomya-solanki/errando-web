import { Formik, FormikErrors } from "formik";
import { useState } from "react";
import useSWR from "swr";
import DeleteAccountModal from "../../../../layout/pro-models/DeleteAccountModal";
import { UserData } from "../../../../models/user";
import { fetcher } from "../../../../store/customer/home-context";
import { useAuthPro } from "../../../../store/pro/auth-pro-context";
import Button from "../../../UI/Button";
import Error from "../../../UI/Error";
import Input from "../../../UI/Input";
import Label from "../../../UI/Label";
import PostCodeDetails from "../../../UI/PostCodeDetails";
import TextArea from "../../../UI/TextArea";
import { useAuth } from "../../../../store/customer/auth-context";

function PersonalInfoFormPro() {
  const token = localStorage.getItem("data");
  const { mutate } = useAuth();
  let userData: any;
  if (token) {
    userData = JSON.parse(token);
  }
  const url = `https://erranddo.com/admin/api/v1/user/detail?user_id=${userData?.id}`;
  const { data, isLoading } = useSWR(url, fetcher);
  const profileData: UserData = data?.data ?? "";

  const { profileHandler, isProfileLoading } = useAuthPro();
  //validate the logs entered in the form
  const validate = (values: any) => {
    const errors: FormikErrors<any> = {};
    if (!values.name) {
      errors.name = "Please include a name";
    } else if (!/^[A-Za-z\s]+$/i.test(values.name)) {
      errors.name = "Please enter only alphabetic characters";
    }

    if (!values.post_code) {
      errors.post_code = "Please include a postcode";
    }

    if (!values.address) {
      errors.address = "Please include a address";
    }

    if (!values.city) {
      errors.city = "Please include a valid city";
    } else if (!/^[A-Za-z\s]+$/i.test(values.name)) {
      errors.city = "Please enter only alphabetic characters";
    }
    return errors;
  };

  const inputClassName =
    "items-center w-full text-md md:w-full text-slate-700 border-slate-500 outline-none  font-medium font-poppins     border rounded-lg    ease-in focus:caret-slate-500  lg:mr-3";
  const buttonClassName =
    "px-6 py-2 w-40 xs:mx-auto md:mx-0 rounded-lg text-md font-semibold font-poppins border-slate-500";

  const [deleteHandler, setDeleteHandler] = useState(false);

  return (
    <div>
      {deleteHandler && (
        <DeleteAccountModal
          onCancel={() => {
            setDeleteHandler(false);
          }}
          id={profileData?.id}
        />
      )}
      <Formik
        initialValues={{
          name: profileData?.full_name,
          address: profileData?.address,
          city: profileData?.city,
          post_code: profileData?.postcode_id,
        }}
        enableReinitialize
        onSubmit={(values) => {
          const formData = new FormData();
          formData.set("full_name", values.name);
          formData.set("address", values.address);
          formData.set("city", values.city);
          formData.set("postcode_id", values.post_code);
          mutate();
          profileHandler(formData);
        }}
        validate={validate}
      >
        {(props) => (
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            <input className="hidden" autoComplete="false" />
            <div className="my-5">
              <Label required label="Full Name" className="ml-1" />
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
              <Label required label="Address" className="ml-1" />
              <TextArea
                rows="6"
                cols="50"
                id="address"
                name="address"
                value={props.values.address}
                onChange={props.handleChange}
                className="border-slate-500"
              />
              {props.touched.address && props.errors.address ? (
                <Error error={props?.errors.address} />
              ) : null}
            </div>

            <div className="my-5">
              <Label required label="Town/City" className="ml-1" />
              <Input
                id="city"
                value={props.values.city}
                className={inputClassName}
                onChange={props.handleChange}
              />
              {props.touched.city && props.errors.city ? (
                <Error error={props?.errors.city} />
              ) : null}
            </div>
            <div className="my-5 relative">
              <Label required label="Postcode" className="ml-1" />
              <PostCodeDetails
                id="post_code"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(ev: number) => {
                  props.setFieldValue("post_code", ev);
                }}
                initialValue={props.values.post_code}
                className="mt-0 !w-full"
              />
              <h6 className="dark:text-gray-400 text-gray-400 text-center text-xs xs:my-1 lg:my-1">
                **This will be the default postcode when you place a request**
              </h6>
              {props?.touched?.post_code && props?.errors?.post_code ? (
                <Error error={props?.errors?.post_code} />
              ) : null}
            </div>
            <div className="dark:bg-dimGray bg-white flex justify-center w-[100%] py-5 gap-4  ">
              <Button
                type="button"
                variant="ghost"
                color="gray"
                buttonClassName={buttonClassName}
                centerClassName="flex justify-center items-center"
                onClick={() => {
                  setDeleteHandler(!deleteHandler);
                }}
              >
                Delete Account
              </Button>
              <Button
                loading={isProfileLoading}
                variant="filled"
                color="primary"
                buttonClassName={buttonClassName}
                centerClassName="flex justify-center items-center"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default PersonalInfoFormPro;
