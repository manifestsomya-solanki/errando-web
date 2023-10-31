import Modal from "../home/Modal";
import Close from "../../assets/close.tsx";

import Label from "../../components/UI/Label";
import Button from "../../components/UI/Button";
import { Formik, FormikErrors } from "formik";
import Error from "../../components/UI/Error";
import Heading from "../../components/UI/Heading";
import { EditBusinessService, ServiceData } from "../../models/pro/business";
import { useBusiness } from "../../store/pro/dashboard-context";

import useSWR from "swr";
import { fetcher } from "../../store/customer/home-context";
import Input from "../../components/UI/Input";

import { ServiceDataDetail } from "../../models/pro/service";
import EditDropdownCompoenet from "../../components/UI/EditDropdown";
import DropdownCompoenet from "../../components/UI/Dropdown";
import { useService } from "../../store/pro/service-context";
import { useEffect, useState } from "react";
import PostCodeDropDown from "../../components/UI/PostCodeDropDown";
import FullPageLoading from "../../components/UI/FullPageLoading";
import { useTheme } from "../../store/theme-context";

function EditServiceModal({
  onCancel,
  serviceId,
}: {
  onCancel: () => void;
  serviceId: number;
}) {
  const serviceDataUrl = `https://erranddo.kodecreators.com/api/v1/business-services/${serviceId}/detail`;
  const { data: oldData, isLoading: isDetailLoading } = useSWR(
    serviceDataUrl,
    fetcher
  );
  const oldServiceData: ServiceDataDetail = oldData?.data;
  const oldPostCodeData: { label: string; value: string }[] = [];
  const oldRadiusData: string[] = [];
  if (oldServiceData) {
    oldServiceData?.post_codes?.map((d) =>
      oldPostCodeData.push({
        label: d?.postcode?.name,
        value: d?.postcode?.id.toString(),
      })
    );
    oldServiceData?.post_codes?.map((d) => oldRadiusData.push(d?.radius));
  }

  //handling business dropdown
  const { data, editServiceBusiness, error, isLoading, setError } =
    useBusiness();
  useEffect(() => {
    setError("");
  }, []);
  const { data: serviceData, page } = useService();
  const id = JSON.parse(localStorage.getItem("data") ?? "").id;
  const validate = (values: EditBusinessService) => {
    const errors: FormikErrors<EditBusinessService> = {};
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

  const business = data?.filter(
    (item) => item.id === oldServiceData?.user_business_id
  );

  const serviceBusiness = serviceData?.filter(
    (item: any) => item.id === oldServiceData?.id
  );
  useEffect(() => {
    setError("");
  }, []);
  const { theme } = useTheme();
  const [locationNumber, setlocationNumber] = useState(
    oldServiceData?.post_codes?.length ?? 1
  );
  console.log(locationNumber, oldPostCodeData.length);
  return (
    <Modal
      className="bg-slate-100 dark:bg-modalDarkColor opacity-90 xs:w-[90vw] rounded-lg max-h-[30rem] h-[30rem]  overflow-y-scroll !py-0  lg:!w-[45vw] lg:!px-0 "
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
      {isDetailLoading ? (
        <FullPageLoading className="!h-[30rem] !bg-transparent" />
      ) : (
        <div className="pt-7 h-full lg:!px-5">
          <Heading
            headingclassname="mt-3  text-textColor text-lg !font-semibold dark:text-white"
            variant="subHeader"
            text={serviceBusiness && serviceBusiness[0]?.service?.name}
          />
          <Formik<EditBusinessService>
            initialValues={{
              user_business_id: oldServiceData?.user_business_id,
              service_id: oldServiceData?.service_id,
              radius: [...oldRadiusData],
              postcode: [...oldPostCodeData],
              nation_wide: oldServiceData?.nation_wide === 0 ? false : true,
              remote_service:
                oldServiceData?.remote_service === 0 ? false : true,
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
                formData.set(
                  `data[${0}][post_code_id]`,
                  values.postcode[0].value
                );
              } else {
                values.postcode.map((code, i) =>
                  formData.set(`data[${i}][post_code_id]`, code.value)
                );
                values.radius.map((code, i) =>
                  formData.set(`data[${i}][radius]`, code)
                );
              }
              // formData.set("service_id", values.service_id.toString());
              formData.set("remote_service", values.remote_service ? "1" : "0");
              formData.set("nation_wide", values.nation_wide ? "1" : "0");
              formData.set("businesses_service_id", serviceId.toString());

              console.log(...formData);
              editServiceBusiness(formData, serviceId);

              onCancel();
            }}
            validate={validate}
          >
            {(props) => (
              <form
                autoComplete="off"
                onSubmit={props.handleSubmit}
                className="h-full w-full"
              >
                <div className="py-3">
                  <Label required label="Update Business" />
                  <DropdownCompoenet
                    value={
                      business
                        ? { value: business[0]?.id, label: business[0]?.name }
                        : undefined
                    }
                    className="my-2 !z-40 relative dark:bg-black"
                    isImage={true}
                    placeholder={
                      props.values.user_business_id && data
                        ? data[0].name
                        : "Select a business"
                    }
                    options={
                      data?.map((item) => ({
                        value: item.id,
                        label: item.name,
                      })) || []
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

                {props.values.nation_wide || props.values.remote_service ? (
                  <div>
                    <Label required label="Enter Location" />
                    <PostCodeDropDown
                      value={
                        props?.values?.postcode[0]
                          ? {
                              label: props?.values?.postcode[0].label,
                              value: props?.values?.postcode[0].value,
                            }
                          : undefined
                      }
                      className="my-2 !z-20 relative h-max"
                      onChange={(newValue) => {
                        console.log("mwdwdwrhg", newValue);
                        props.setFieldValue("postcode[0]", {
                          label: newValue.label,
                          value: newValue.value,
                        });
                      }}
                    />

                    {props?.touched?.postcode && props?.errors?.postcode ? (
                      <Error error={props?.errors?.postcode} className="mt-2" />
                    ) : null}
                  </div>
                ) : (
                  <div>
                    {locationNumber > 0 &&
                      Array.from({ length: locationNumber }, (_, index) => (
                        <div className="pb-3 grid xl:grid-cols-2 xs:gap-5">
                          <div className="">
                            <Label label="Update Postcode " />
                            <PostCodeDropDown
                              value={
                                props?.values?.postcode[index]
                                  ? {
                                      label:
                                        props?.values?.postcode[index].label,
                                      value:
                                        props?.values?.postcode[index].value,
                                    }
                                  : undefined
                              }
                              className="my-2 !z-10 h-min relative"
                              onChange={(newValue) => {
                                props.setFieldValue(`postcode[${index}]`, {
                                  label: newValue?.label,
                                  value: newValue?.value,
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label label="Update Radius " />
                            <Input
                              className="border-black"
                              placeholder="Enter Radius"
                              name={`radius[${index}]`}
                              value={props.values.radius[index]}
                              onChange={props.handleChange}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                <Button
                  onClick={() => {
                    setlocationNumber((prev) => prev + 1);
                  }}
                  loading={isLoading}
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
                      className="border-none !w-fit !px-0"
                      name="nation_wide"
                      checked={props.values.nation_wide}
                      value={props.values.nation_wide}
                      onChange={props.handleChange}
                    />
                  </div>
                  <div>
                    <Label label="Remote Service" />
                    <Input
                      type="checkbox"
                      className="border-none !w-fit !px-0 "
                      name="remote_service"
                      checked={props.values.remote_service}
                      value={props.values.remote_service}
                      onChange={props.handleChange}
                    />
                  </div>
                </div>
                <div className=" bg-slate-100 py-4  border-t-[0.5px] border-t-slate-200  dark:bg-modalDarkColor !z-50 overflow-hidden">
                  <Error error={error} className="text-center my-1" />
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
                      children="Save Changes"
                      centerClassName="flex justify-center items-center"
                      buttonClassName="!px-3 font-poppins py-3 w-full"
                    />
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      )}
    </Modal>
  );
}

export default EditServiceModal;
