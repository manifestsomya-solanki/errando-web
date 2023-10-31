import Modal from "../home/Modal";
import Close from "../../assets/close.tsx";

import Label from "../../components/UI/Label";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { Formik, FormikErrors } from "formik";
import Error from "../../components/UI/Error";
import Heading from "../../components/UI/Heading";
import { AddBusiness } from "../../models/pro/business";
import { useBusiness } from "../../store/pro/dashboard-context";
import { useTheme } from "../../store/theme-context";
import { useEffect, useState } from "react";
import TextArea from "../../components/UI/TextArea.tsx";
import PostCodeDetails from "../../components/UI/PostCodeDetails.tsx";

function EditBusinessModal({
  onCancel,
  id,
}: {
  onCancel: () => void;
  id: number;
}) {
  const [deleteImage, setDeleteImage] = useState(false);
  const [deleteServiceImage, setDeleteServiceImage] = useState(false);
  const {
    detailBusiness,
    businessDetail,
    isLoading,
    error,
    editBusiness,
    setError,
  } = useBusiness();
  useEffect(() => {
    detailBusiness(id);
  }, []);
  const validate = (values: AddBusiness) => {
    const errors: FormikErrors<AddBusiness> = {};
    if (!values.name) {
      errors.name = "Please include a valid name of Business";
    }
    if (!values.profile_picture && !businessDetail?.image) {
      errors.profile_picture = "Please include a profile picture";
    }

    return errors;
  };
  const { theme } = useTheme();
  useEffect(() => {
    setError("");
  }, []);
  return (
    <Modal className="bg-slate-100 dark:bg-modalDarkColor opacity-90 h-[32rem] rounded-lg max-h-[36rem] overflow-y-scroll !py-0">
      <button
        className="sticky top-5 right-5 w-full flex justify-end"
        onClick={() => {
          onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>

      <div className="pt-7">
        <Heading
          headingclassname="mt-3  text-textColor dark:text-white text-lg !font-semibold"
          variant="subHeader"
          text="Edit Business"
        />
        <Formik<AddBusiness>
          initialValues={{
            name: businessDetail?.name ?? "",
            profile_picture: undefined,
            description: businessDetail?.description ?? "",
            service_images: undefined,
            postcode_id: 0,
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            const files = values.service_images
              ? [...values.service_images]
              : [];

            const formData = new FormData(); //initialize formdata
            formData.set("name", values.name);
            formData.set("postcode_id", values.postcode_id.toString());

            formData.set("description", values.description);
            if (values.profile_picture)
              formData.set("image", values.profile_picture);

            if (values.service_images) {
              files.forEach((file, i) => {
                formData.set(`service_images[${i}]`, file);
              });
            }
            editBusiness(formData, id.toString() ?? "");
            setTimeout(() => onCancel(), 1000);
            console.log(...formData);
          }}
          validate={validate}
        >
          {(props) => (
            <form autoComplete="off" onSubmit={props.handleSubmit}>
              <div className="py-3">
                <Label required label="Upload Business Logo" />
                <label className=" relative flex justify-center w-full h-32 px-4  mt-3 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none dark:bg-black ">
                  {(businessDetail && businessDetail.image && !deleteImage) ||
                  props.values.profile_picture ? (
                    <div className="flex flex-col items-center space-x-2 dark:text-white justify-center">
                      {"1 File Selected"}
                      <span className="text-xs text-primaryBlue">
                        Click to upload new images
                      </span>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="font-medium text-gray-600 dark:text-slate-400">
                        Drop files to Attach, or
                        <span className="text-blue-600 underline mx-2">
                          browse
                        </span>
                      </span>
                    </span>
                  )}
                  <Input
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                      if (ev?.target?.files?.length) {
                        props.setFieldValue(
                          "profile_picture",
                          ev?.target?.files[0]
                        );
                      }
                    }}
                    type="file"
                    name="profile_picture"
                    id="profile_picture"
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 dark:text-slate-400"
                    onClick={() => {
                      setDeleteImage(true);
                      if (deleteImage) {
                        props.setFieldValue("profile_picture", "");
                      }
                    }}
                  >
                    Delete
                  </button>
                </label>

                {props?.touched?.profile_picture &&
                props?.errors?.profile_picture ? (
                  <Error
                    error={props?.errors?.profile_picture}
                    className="mt-2"
                  />
                ) : null}
              </div>

              <div className="py-0">
                <Label required label="Enter Business Name" />
                <Input
                  id="name"
                  name="name"
                  value={props.values.name}
                  onChange={props.handleChange}
                />
                {props?.touched?.name && props?.errors?.name ? (
                  <Error error={props?.errors?.name} className="mt-2" />
                ) : null}
              </div>
              <div className="py-3">
                <Label required label="Enter Business Postcode " />
                <PostCodeDetails
                  initialValue={props?.values?.postcode_id}
                  inputClass="border-gray-200"
                  type="text"
                  id="postcode_id"
                  name="postcode_id"
                  onChange={(ev: any) => {
                    props.setFieldValue("postcode_id", ev);
                  }}
                />
                {props?.touched?.postcode_id && props?.errors?.postcode_id ? (
                  <Error error={props?.errors?.postcode_id} className="mt-2" />
                ) : null}
              </div>
              <div className="py-3">
                <Label required label="Enter Business Description " />
                <TextArea
                  rows="8"
                  cols="50"
                  id="description"
                  name="description"
                  value={props.values.description}
                  onChange={props.handleChange}
                />
                {props?.touched?.description && props?.errors?.description ? (
                  <Error error={props?.errors?.description} />
                ) : null}
              </div>

              <div className="py-3">
                <Label label="Upload Service Images" />
                <label className=" relative flex justify-center w-full h-32 px-4  mt-3 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none dark:bg-black">
                  {(businessDetail &&
                    businessDetail?.files?.length > 0 &&
                    !deleteServiceImage) ||
                  props?.values?.service_images ? (
                    <div className="flex justify-center  items-center flex-col space-x-2 dark:text-slate-400">
                      {(props.values.service_images?.length ??
                        businessDetail?.files?.length) + " items selected"}
                      <span className="text-xs text-primaryBlue">
                        Click to upload new images
                      </span>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="font-medium text-gray-600 dark:text-slate-400">
                        Drop files to Attach, or
                        <span className="text-blue-600 underline mx-2">
                          browse
                        </span>
                      </span>
                    </span>
                  )}
                  <Input
                    multiple
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                      if (ev?.target?.files?.length) {
                        props.setFieldValue(
                          "service_images",
                          ev?.target?.files
                        );
                      }
                    }}
                    type="file"
                    name="service_images"
                    id="service_images"
                    className="hidden"
                    accept=".png, .jpeg, .jpg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 dark:text-slate-400"
                    onClick={() => {
                      setDeleteServiceImage(true);
                      props.setFieldValue("service_images", "");
                    }}
                  >
                    Delete
                  </button>
                </label>

                {props?.touched?.service_images &&
                props?.errors?.service_images ? (
                  <Error
                    error={props?.errors?.service_images}
                    className="mt-2"
                  />
                ) : null}
              </div>
              <Error error={error} className="text-center mt-3" />
              <div className="flex w-full sticky  bg-slate-100  dark:bg-modalDarkColor py-4 bottom-0 justify-center gap-5 border-t-[0.5px] border-t-slate-200">
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
                  children="Save Changes"
                  centerClassName="flex justify-center items-center"
                  buttonClassName="!px-3 font-poppins py-3 w-full"
                />
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default EditBusinessModal;
