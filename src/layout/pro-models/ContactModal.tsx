import Close from "../../assets/close.tsx";

import Button from "../../components/UI/Button";
import Modal from "../home/Modal";
import Label from "../../components/UI/Label";
import Input from "../../components/UI/Input";
import { useNavigate, useParams } from "react-router";
import { useTheme } from "../../store/theme-context.tsx";
import Heading from "../../components/UI/Heading.tsx";
import { Formik, FormikErrors } from "formik";
import Error from "../../components/UI/Error.tsx";
import { Contact } from "../../models/pro/business.ts";
import { useBusiness } from "../../store/pro/dashboard-context.tsx";
import { useEffect } from "react";

function ContactModal({ onCancel }: { onCancel: () => void }) {
  const id = useParams().id;
  const {
    isLoading,
    error,
    editBusiness,
    detailBusiness,
    businessDetail,
    setError,
  } = useBusiness();
  const validate = (values: Contact) => {
    const errors: FormikErrors<Contact> = {};
    if (!values.phone_number) {
      errors.phone_number = "Please include a phone number";
    }
    if (values.support && !values.support?.includes("@")) {
      errors.support = "Please include an email";
    }

    return errors;
  };
  useEffect(() => {
    setError("");
  }, []);
  const { theme } = useTheme();
  return (
    <Modal className="bg-slate-100 dark:bg-modalDarkColor opacity-90 h-max rounded-lg max-h-[32rem] overflow-y-scroll !py-0">
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
          text="Edit Contact Details"
        />
        <Formik<Contact>
          initialValues={{
            phone_number: businessDetail?.mobile_number ?? "",
            website: businessDetail?.website_url ?? "",
            support: businessDetail?.email ?? "",
            instagram: businessDetail?.instagram_url ?? "",
            facebook: businessDetail?.facebook_url ?? "",
            twitter: businessDetail?.twitter_url ?? "",
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            const formData = new FormData(); //initialize formdata
            formData.set("mobile_number", values.phone_number.toString());
            formData.set("website_url", values.website);
            formData.set("email", values.support ?? "");
            formData.set("twitter_url", values.twitter);
            formData.set("instagram_url", values.instagram);
            formData.set("facebook_url", values.facebook);
            editBusiness(formData, id ?? "");
            setTimeout(() => onCancel(), 1000);
          }}
          validate={validate}
        >
          {(props) => (
            <form autoComplete="off" onSubmit={props.handleSubmit}>
              <div className="py-3">
                <Label required label="Contact No." />
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={props.values.phone_number}
                  onChange={props.handleChange}
                />
                {props?.touched?.phone_number && props?.errors?.phone_number ? (
                  <Error error={props?.errors?.phone_number} className="mt-2" />
                ) : null}
              </div>
              <div className="py-3">
                <Label label="Website" />
                <Input
                  id="website"
                  name="website"
                  value={props.values.website}
                  onChange={props.handleChange}
                />
              </div>
              <div className="py-3">
                <Label label="Support Email" />
                <Input
                  id="support"
                  name="support"
                  value={props.values.support}
                  onChange={props.handleChange}
                />
                {props?.touched?.support && props?.errors?.support ? (
                  <Error error={props?.errors?.support} className="mt-2" />
                ) : null}
              </div>
              <div className="py-3">
                <Label label="Instagram Link" />
                <Input
                  id="instagram"
                  name="instagram"
                  value={props.values.instagram}
                  onChange={props.handleChange}
                />
              </div>
              <div className="py-3">
                <Label label="Facebook Link" />
                <Input
                  id="facebook"
                  name="facebook"
                  value={props.values.facebook}
                  onChange={props.handleChange}
                />
              </div>
              <div className="py-3">
                <Label label="Twitter Link" />
                <Input
                  id="twitter"
                  name="twitter"
                  value={props.values.twitter}
                  onChange={props.handleChange}
                />
              </div>

              <div className=" sticky  bg-slate-100  dark:bg-modalDarkColor py-4 bottom-0  ">
                <Error error={error} className="text-center mt-3" />
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
    </Modal>
  );
}

export default ContactModal;
