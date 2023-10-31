import Modal from "../home/Modal";
import Close from "../../assets/close.tsx";

import Label from "../../components/UI/Label";
import Button from "../../components/UI/Button";
import { Formik, FormikErrors } from "formik";
import Error from "../../components/UI/Error";
import Heading from "../../components/UI/Heading";
import { AddBusinessService, ServiceData } from "../../models/pro/business";
import { useBusiness } from "../../store/pro/dashboard-context";
import DropdownCompoenet from "../../components/UI/Dropdown";
import useSWR from "swr";
import { fetcher } from "../../store/customer/home-context";
import Input from "../../components/UI/Input";
import { useTheme } from "../../store/theme-context.tsx";

import PostCodeDropDown from "../../components/UI/PostCodeDropDown.tsx";
import { BusinessData } from "../../models/home.ts";
import { useEffect, useState } from "react";
import { useService } from "../../store/pro/service-context.tsx";

function AddServiceModal({
  onCancel,
  businessId,
}: {
  onCancel: () => void;
  businessId?: number;
}) {
  const {
    data,
    isBussinessLoading,
    addServiceBusiness,
    error,
    isLoading,
    setError,
  } = useBusiness();
  //handling service dropdown
  const url = `https://erranddo.kodecreators.com/api/v1/business-services`;
  const dummy_data: ServiceData[] = [];
  let datarender: ServiceData[] = [];
  const { data: dataa, isLoading: isServiceLoading } = useSWR(url, fetcher);
  datarender = dataa?.data || dummy_data;
  const [locationNumber, setlocationNumber] = useState(1);
  let service_name: { value: number; label: string }[] = [];
  datarender?.flatMap((item) =>
    service_name.push({ value: item?.service_id, label: item?.service?.name })
  );
  service_name = service_name.filter((item, index, arr) => {
    // Check if the current item's index is the first occurrence of the name in the array
    return arr.findIndex((obj) => obj.label === item.label) === index;
  });
  service_name = service_name.filter((item) => item?.value);

  //handling business dropdown

  useEffect(() => {
    setError("");
  }, []);
  const { page } = useService();
  const business_name: { value: number; label: string }[] = [];
  if (businessId) {
    const filterData: BusinessData[] | undefined = data?.filter(
      (item) => item.id === businessId
    );
    filterData?.flatMap((item) =>
      business_name?.push({ value: item.id, label: item.name })
    );
  } else {
    data?.flatMap((item) =>
      business_name?.push({ value: item.id, label: item.name })
    );
  }

  const id = JSON.parse(localStorage.getItem("data") ?? "").id;

  const validate = (values: AddBusinessService) => {
    const errors: FormikErrors<AddBusinessService> = {};
    if (!values.user_business_id) {
      errors.user_business_id = "Please include a valid  Business";
    }
    if (!values.service_id) {
      errors.service_id = "Please include a valid  Service";
    }
    if (values.postcode.length === 0) {
      errors.postcode = "Please include a valid  location";
    }

    if (!values.nation_wide && !values.remote_service && !values.radius[0]) {
      errors.radius = "Please include a valid  radius";
    }

    return errors;
  };
  const { theme } = useTheme();
  useEffect(() => {
    setError("");
  }, []);
  return (
    <Modal
      backdropClassName="bg-[rgba(0,0,0,0.6)]"
      className="bg-slate-100 dark:bg-modalDarkColor opacity-90 xs:w-[90vw] rounded-lg max-h-[30rem] h-[30rem]   !py-0  lg:!w-[45vw] lg:!px-0 soft-searchbar"
      overlayClassName="!w-full"
    >
      <button
        className="absolute top-5 right-5 w-full flex justify-end"
        onClick={() => {
          onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>
      <div className="pt-7 h-full lg:!px-5">
        <Heading
          headingclassname="mt-3  text-textColor dark:text-white text-lg !font-semibold"
          variant="subHeader"
          text="Add Service"
        />
        <Formik<AddBusinessService>
          initialValues={{
            user_business_id: 0,
            service_id: 0,
            radius: [],
            postcode: [],
            nation_wide: false,
            remote_service: false,
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            console.log(values);
            const formData = new FormData();
            formData.set(
              "user_business_id",
              values.user_business_id.toString()
            );
            if (values.nation_wide || values.remote_service) {
              formData.set(`data[0][post_code_id]`, values.postcode[0]);
            } else {
              values.postcode.map((code, i) =>
                formData.set(`data[${i}][post_code_id]`, code)
              );
              values.radius.map((code, i) =>
                formData.set(`data[${i}][radius]`, code)
              );
            }
            formData.set("service_id", values.service_id.toString());
            formData.set("remote_service", values.remote_service ? "1" : "0");
            formData.set("nation_wide", values.nation_wide ? "1" : "0");

            const success = await addServiceBusiness(formData);

            if (success) {
              setTimeout(() => onCancel(), 1000);
            }
          }}
          validate={validate}
        >
          {(props) => (
            <form
              autoComplete="off"
              onSubmit={props.handleSubmit}
              className=" w-full overflow-y-scroll h-[25rem] "
            >
              <div className="py-3">
                <Label required label="Choose Business" />
                <DropdownCompoenet
                  className="my-2 !z-30 relative "
                  isImage={true}
                  placeholder={`
                   Select a business
                  `}
                  options={
                    isBussinessLoading
                      ? [{ value: "Please Wait", label: "Please wait" }]
                      : business_name
                  }
                  onChange={(newValue) => {
                    props.setFieldValue("user_business_id", newValue.value);
                  }}
                />
                {props?.touched?.user_business_id &&
                props?.errors?.user_business_id ? (
                  <Error
                    error={props?.errors?.user_business_id}
                    className="mt-2"
                  />
                ) : null}
              </div>
              <div className="pb-3">
                <Label required label="Choose Service" />
                <DropdownCompoenet
                  className="my-2 !z-20 relative"
                  isImage={true}
                  placeholder=" Select a business service"
                  options={
                    isServiceLoading
                      ? [{ value: "Please Wait", label: "Please wait" }]
                      : service_name
                  }
                  onChange={(newValue) => {
                    props.setFieldValue("service_id", newValue.value);
                  }}
                />
                {props?.touched?.service_id && props?.errors?.service_id ? (
                  <Error error={props?.errors?.service_id} className="mt-2" />
                ) : null}
              </div>
              {props.values.nation_wide || props.values.remote_service ? (
                <div>
                  <Label required label="Enter Location" />
                  <PostCodeDropDown
                    className="my-2 !z-10 relative h-max"
                    onChange={(newValue) => {
                      props.setFieldValue("postcode[0]", newValue.value);
                    }}
                  />
                  {props?.touched?.postcode && props?.errors?.postcode ? (
                    <Error error={props?.errors?.postcode} className="mt-2" />
                  ) : null}
                </div>
              ) : (
                <div>
                  <div className="pb-3 grid xl:grid-cols-2 xs:gap-5">
                    <div>
                      <Label required label="Postcode" />
                      <PostCodeDropDown
                        className="my-2 !z-10 relative"
                        onChange={(newValue) => {
                          console.log("here");
                          props.setFieldValue("postcode[0]", newValue.value);
                        }}
                      />
                      {props?.touched?.postcode && props?.errors?.postcode ? (
                        <Error
                          error={props?.errors?.postcode}
                          className="mt-2"
                        />
                      ) : null}
                    </div>
                    <div>
                      <Label required label="Radius (Miles)" />
                      <Input
                        className="border-black my-2 dark:border-white placeholder:dark:text-white !placeholder:text-sm text-sm"
                        placeholder="Enter Radius around the postcode"
                        name="radius[0]"
                        value={props.values.radius[0]}
                        onChange={props.handleChange}
                      />
                      {props?.touched?.radius && props?.errors?.radius ? (
                        <Error error={props?.errors?.radius} className="mt-2" />
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
              {locationNumber > 1 &&
                Array.from({ length: locationNumber - 1 }, () => (
                  <div className="pb-3 grid xl:grid-cols-2 xs:gap-5">
                    <div>
                      <Label label="Postcode" />
                      <PostCodeDropDown
                        className="my-2 !z-5 relative"
                        onChange={(newValue) => {
                          props.setFieldValue(
                            `postcode[${locationNumber - 1}]`,
                            newValue.value
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label label="Radius (Miles)" />
                      <Input
                        className="border-black my-2 dark:border-white  text-sm"
                        placeholder="Enter Radius around the postcode"
                        name={`radius[${locationNumber - 1}]`}
                        value={props.values.radius[locationNumber - 1]}
                        onChange={props.handleChange}
                      />
                    </div>
                  </div>
                ))}
              <Button
                disabled={
                  props.values.nation_wide || props.values.remote_service
                }
                onClick={() => {
                  setlocationNumber((prev) => prev + 1);
                }}
                type="button"
                variant="filled"
                color="secondary"
                children="Add Location"
                centerClassName="flex justify-center items-center"
                buttonClassName="!px-3 font-poppins py-3 mb-3 w-44"
              />
              <div className="pb-3 grid grid-cols-2 gap-5">
                <div>
                  <Label label="Nationwide" />
                  <Input
                    type="checkbox"
                    id="nation_wide"
                    className="border-none !w-fit  !px-0"
                    placeholder="Enter radius around the postcode you cover"
                    name="nation_wide"
                    value={props.values.nation_wide}
                    onChange={props.handleChange}
                  />
                </div>
                <div>
                  <Label label="Remote Service" />
                  <Input
                    type="checkbox"
                    className="border-none !w-fit !px-0 "
                    placeholder="Enter radius around the postcode you cover"
                    name="remote_service"
                    id="remote_service"
                    value={props.values.remote_service}
                    onChange={props.handleChange}
                  />
                </div>
              </div>

              <div className=" sticky  bg-slate-100 bottom-0  border-t-[0.5px] border-t-slate-200 z-0 dark:bg-modalDarkColor">
                <Error error={error} className="text-center  mb-3" />
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
                    children="Add Service"
                    centerClassName="flex justify-center items-center"
                    buttonClassName="!px-3 font-poppins py-3 w-full"
                  />
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default AddServiceModal;
