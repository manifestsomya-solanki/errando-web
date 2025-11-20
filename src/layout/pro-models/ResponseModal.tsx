import { Formik, FormikErrors } from "formik";
import Modal from "../home/Modal";
import Label from "../../components/UI/Label";
import Input from "../../components/UI/Input";
import Error from "../../components/UI/Error";
import { useTheme } from "../../store/theme-context";
import Close from "../../assets/close";
import Button from "../../components/UI/Button";
import { useReview } from "../../store/pro/review-context";

function ResponseModal({
  id,
  businessId,
  serviceId,
  onCancel,
  description,
  rating,
}: {
  id: string;
  businessId: string;
  serviceId: string;
  description: string;
  rating: number;

  onCancel: () => void;
}) {
  const validate = (values: { response: string }) => {
    const errors: FormikErrors<{ response: string }> = {};
    if (!values.response) {
      errors.response = "Please include a response";
    }
    return errors;
  };
  const { theme } = useTheme();
  const { addResponse, isLoading } = useReview();
  return (
    <Modal className="bg-slate-100 dark:bg-modalDarkColor opacity-90  rounded-lg h-max overflow-y-scroll !py-0">
      <button
        className="sticky top-5 right-5 w-full flex justify-end"
        onClick={() => {
          onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>
      <Formik
        initialValues={{
          response: "",
        }}
        enableReinitialize={true}
        onSubmit={async (values) => {
          const formData = new FormData();
          formData.set("response", values.response);
          formData.set("user_business_id", businessId);
          formData.set("service_id", serviceId);
          formData.set("description", description);
          formData.set("rating", rating?.toString());

          try {
            await addResponse(formData, id);
            onCancel();
          } catch (error) {
            console.error("Error saving response:", error);
          }
        }}
        validate={validate}
      >
        {(props) => (
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            <div className="pt-10">
              <Label required label="Enter Response" />
              <Input
                id="response"
                name="response"
                value={props.values.response}
                onChange={props.handleChange}
              />
              {props?.touched?.response && props?.errors?.response ? (
                <Error error={props?.errors?.response} className="mt-2" />
              ) : null}
            </div>
            <div className="flex w-full sticky  bg-slate-100  dark:bg-dimGray py-4 bottom-0 justify-center gap-5 ">
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
                children="Add Response"
                centerClassName="flex justify-center items-center"
                buttonClassName="!px-3 font-poppins py-3 w-full"
              />
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
}

export default ResponseModal;
