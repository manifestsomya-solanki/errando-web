import { useEffect, useState } from "react";
import Modal from "./Modal";
import Close from "../../assets/close.tsx";
import QuestionsModal from "./QuestionsModal";
import { useFormik } from "formik";
import ValidatedPostcodeInput from "../../components/UI/ValidatedPostcodeInput";

import { useTheme } from "../../store/theme-context";
import Label from "../../components/UI/Label.tsx";

function PostCodeModal(props: {
  onCancel: () => void;
  open: boolean;
  onCancelAll: () => void;
}) {
  const [openModal, setOpenModal] = useState(false);
  const token = localStorage.getItem("token");
  
  // Track the current postcode value to check API status
  const [currentPostcode, setCurrentPostcode] = useState("");
  const [apiStatus, setApiStatus] = useState("");
  const [isPostcodeValid, setIsPostcodeValid] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      postCode: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.postCode || values.postCode.toString().length === 0) {
        errors.postCode = "Required";
      }
      return errors;
    },
    onSubmit: (values) => {
      localStorage.setItem("post_code", values.postCode);
      // Add small delay to ensure postcode is saved before opening questions
      setTimeout(() => {
        setOpenModal(true);
      }, 100);
    },
  });
  
  // Update current postcode when formik value changes
  useEffect(() => {
    setCurrentPostcode(formik.values.postCode);
  }, [formik.values.postCode]);
  
  useEffect(() => {
    return () => {
      formik.setFieldValue("postCode", "");
    };
  }, []);
  
  const { theme } = useTheme();
  
  return (
    <>
      {openModal && (
        <QuestionsModal
          open={openModal}
          onCancel={() => {
            formik.setFieldValue("postCode", null);
            localStorage.removeItem("question");
            setOpenModal(false);
          }}
          onCancelAll={() => {
            formik.setFieldValue("postCode", null);
            setOpenModal(false);
            props.onCancelAll();
          }}
        />
      )}

      {props.open && (
        <Modal className="bg-gray-100 opacity-100 rounded-lg dark:bg-modalDarkColor">
          <button
            className=" absolute top-5 right-5"
            onClick={() => {
              formik.setFieldValue("postCode", null);
              props.onCancelAll();
            }}
          >
            {theme === "light" && <div children={<Close color="black" />} />}
            {theme === "dark" && <div children={<Close color="white" />} />}
          </button>
          
          <div className="flex flex-col ">
            <div className="flex xl:mt-1 md:mt-2">
              <Label
                label="Enter PostCode"
                required
                className="my-1 !font-semibold"
              />
            </div>
            
            <form autoComplete="off" onSubmit={formik.handleSubmit}>
              <div className="w-full">
                <div className="flex gap-2 items-center w-full">
                  <div className="flex-1">
                    <ValidatedPostcodeInput
                      className="rounded-lg w-full outline-none pl-3 text-[#707070]"
                      placeholder="Post Code"
                      id="postCode"
                      name="postCode"
                      value={formik.values.postCode}
                      onChange={(value) => {
                        formik.setFieldValue("postCode", value);
                      }}
                      onValidationChange={(isValid, status) => {
                        setIsPostcodeValid(isValid);
                        setApiStatus(status);
                      }}
                      showValidationMessage={false}
                    />
                  </div>

                  {/* Search button - positioned next to the input field */}
                  <button
                    disabled={
                      formik.errors.postCode || 
                      !formik.values.postCode ||
                      formik.values.postCode.length < 4
                    }
                    type="submit"
                    className="text-white bg-[#0003FF] hover:bg-blue-800 focus:ring-4 disabled:bg-gray-300 disabled:text-slate-500 dark:text-black focus:outline-none focus:ring-blue-300 xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Search
                  </button>
                </div>
              </div>
              
              {formik.errors.postCode && formik.touched.postCode ? (
                <div className="text-red-600 my-1 font-semibold">
                  {formik.errors.postCode}
                </div>
              ) : null}
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}

export default PostCodeModal;
