import { useState } from "react";
import Modal from "../home/Modal";
import Close from "../../assets/close.tsx";
import { useFormik } from "formik";

import Heading from "../../components/UI/Heading";

import DropdownCompoenet from "../../components/UI/Dropdown";
import ReviewModal from "./ReviewModal";
import { useTheme } from "../../store/theme-context";
import { useNavigate, useParams } from "react-router";
import { useCloseRequest } from "../../store/customer/close-request-context.tsx";
import Button from "../../components/UI/Button.tsx";
import { useProject } from "../../store/customer/project-context.tsx";
function CostModal(props: {
  businessId: string;
  closeAnswer: string;
  serviceId: number;
  onCancel: () => void;
  open: boolean;
  onCancelAll: () => void;
}) {
  const requestId = useParams();
  const { closeRequestHandler, isLoading } = useCloseRequest();
  const { isCompleteMutate, isCurrentMutate } = useProject();

  const formik = useFormik({
    initialValues: {
      price: "",
      price_type: "",
    },

    onSubmit: async (values) => {
      const formData = new FormData();
      formData.set("businessId", props?.businessId);
      formData.set("close_answer", props?.closeAnswer);
      if (values?.price.length === 0) {
        formData.set("price", "0");
      } else {
        formData.set("price", values?.price);
      }
      formData.set("price_type", values?.price_type);
      if (requestId?.id) await closeRequestHandler(formData, +requestId?.id);
      await isCurrentMutate();
      await isCompleteMutate();
    },
  });
  const dropDownOne = [
    "Per hour",
    "Per day",
    "Per day / Per Head",
    "Per week",
    "Per Month",
    "Fixed Price",
  ];
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <>
      {
        <ReviewModal
          businessId={props?.businessId}
          serviceId={props?.serviceId}
          open={openReviewModal}
          onCancel={() => {
            setOpenReviewModal(false);
          }}
          onCancelAll={() => {
            setOpenReviewModal(false);
            props.onCancelAll();
          }}
        />
      }
      {props.open && (
        <Modal
          className="bg-slate-100 opacity-90 rounded-lg xl:w-[470px] md:w-[370px] dark:bg-modalDarkColor"
          backdropClassName="bg-transparent"
        >
          <button
            className=" absolute top-5 right-5"
            onClick={() => {
              props.onCancelAll();
              formik.setFieldValue("businessId", "");
              formik.setFieldValue("closeAnswer", "");
              formik.setFieldValue("price", "");
              formik.setFieldValue("price_type", "");
            }}
          >
            {theme === "light" && <div children={<Close color="black" />} />}

            {theme === "dark" && <div children={<Close color="white" />} />}
          </button>
          <div className="flex flex-col items-center xl:w-[450px] md:w-[350px] xl:mt-1 md:mt-2 p-3 gap-2">
            <div className="flex flex-col items-center xl:w-[450px] md:w-[300px] xl:mt-1 md:mt-2 p-6 gap-2">
              <div className="text-center">
                <Heading variant="bigTitle" text=" Close Request" />
              </div>
            </div>
            <div className="xs:w-full xl:pl-0 md:pl-3">
              <Heading
                variant="headingTitle"
                text="How much did it cost to get the job done?"
                headingclassname="xs:text-md text-center"
              />
            </div>
            <div className="pb-7 xs:w-full xl:pl-0 md:pl-3">
              <Heading
                variant="smallTitle"
                text="We do not disclose this infoirmation, It is used to improve our service"
                headingclassname="text-slate-500 text-center xs:text-xs"
              />
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex  gap-3 xl:w-[450px] md:w-[350px] items-center justify-center pb-12">
                <p>£</p>
                <input
                  onChange={formik.handleChange}
                  id="price"
                  value={formik.values.price}
                  className="focus:outline-none w-36 placeholder:text-md placeholder:font-normal rounded-lg h-11 bg-white dark:bg-black pl-3"
                />
                <DropdownCompoenet
                  menuClassName="soft-searchbar"
                  isImage={true}
                  placeholder="Fixed Price"
                  placeholderClassName="text-xs "
                  options={dropDownOne}
                  onChange={(newValue) => {
                    formik.setFieldValue("price_type", newValue.value);
                  }}
                  className="w-36 "
                />
              </div>
              <div className="flex pb-11 xs:w-full xl:pl-0 md:pl-3 justify-center items-center gap-3">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="default-checkbox">
                  <Heading
                    variant="smallTitle"
                    text="I’d rather not say"
                    headingclassname="text-slate-500 text-center xs:text-xs"
                  />
                </label>
              </div>
              <div className="flex gap-4 xl:w-[450px] md:w-[350px] justify-center">
                <button
                  type="button"
                  onClick={() => {
                    props.onCancel();
                  }}
                  className="text-black dark:text-white w-36 border-[#707070] border  xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 "
                >
                  Back
                </button>
                <Button
                  loading={isLoading}
                  type="submit"
                  onClick={async () => {
                    if (props?.businessId) {
                      setOpenReviewModal(true);
                    } else {
                      setTimeout(() => {
                        navigate("/projects");
                      }, 1000);
                    }
                  }}
                  buttonClassName="text-white w-36 bg-[#0003FF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-2 xs:px-5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Close Request
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}

export default CostModal;
