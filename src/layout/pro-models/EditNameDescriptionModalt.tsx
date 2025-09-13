import Modal from "../home/Modal";
import Close from "../../assets/close.tsx";

import Label from "../../components/UI/Label";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { Formik, FormikErrors } from "formik";
import Error from "../../components/UI/Error";
import Heading from "../../components/UI/Heading";
import { useBusiness } from "../../store/pro/dashboard-context";
import { useTheme } from "../../store/theme-context";
import { useParams } from "react-router";
import { useEffect } from "react";
import TextArea from "../../components/UI/TextArea.tsx";

function EditNameDescriptionModal({ onCancel }: { onCancel: () => void }) {
  const id = useParams().id;
  const {
    isLoading,
    error,
    editBusiness,
    detailBusiness,
    businessDetail,
    setError,
  } = useBusiness();

  useEffect(() => {
    detailBusiness(id ? +id : undefined);
  }, []);

  const validate = (values: { name: string; description: string }) => {
    const errors: FormikErrors<{ name: string; description: string }> = {};
    if (!values.name) {
      errors.name = "Please include a name of business";
    }
    if (!values.description) {
      errors.description = "Please include a description of business";
    }

    return errors;
  };
  const { theme } = useTheme();
  useEffect(() => {
    setError("");
  }, []);
  return (
    <Modal className="bg-slate-100 dark:bg-modalDarkColor opacity-90 h-max rounded-lg max-h-[36rem] overflow-y-scroll !py-0">
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
          text="Edit Business Details"
        />
        <Formik<{ name: string; description: string }>
          initialValues={{
            name: businessDetail?.name ?? "",
            description: businessDetail?.description ?? "",
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            const formData = new FormData(); //initialize formdata
            formData.set("name", values.name);
            formData.set("description", values.description);
            editBusiness(formData, id ?? "");
            setTimeout(() => onCancel(), 1000);
          }}
          validate={validate}
        >
          {(props) => (
            <form autoComplete="off" onSubmit={props.handleSubmit}>
              <div className="py-3">
                <Label
                  required
                  label="Edit Business Name"
                  className="!font-medium"
                />

                <Input
                  id="name"
                  name="name"
                  className="!font-normal"
                  value={props.values.name}
                  onChange={props.handleChange}
                />
                {props?.touched?.name && props?.errors?.name ? (
                  <Error error={props?.errors?.name} className="mt-2" />
                ) : null}
              </div>
              <div className="py-3">
                <Label
                  required
                  label="Edit Business Decription"
                  className="!font-medium"
                />
                <TextArea
                  rows="8"
                  cols="50"
                  className="!font-normal"
                  id="description"
                  name="description"
                  value={props.values.description}
                  onChange={props.handleChange}
                />
                {props?.touched?.description && props?.errors?.description ? (
                  <Error error={props?.errors?.description} className="mt-2" />
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
                  children="Edit"
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

export default EditNameDescriptionModal;
