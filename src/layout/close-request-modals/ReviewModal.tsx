import Modal from "../home/Modal";
import Close from "../../assets/close.tsx";
import { useFormik } from "formik";
import Heading from "../../components/UI/Heading";
import StarRatings from "../../components/UI/StarRatings";
import { useTheme } from "../../store/theme-context";
import { useReview } from "../../store/customer/review-context.tsx";
import {
  ServiceList,
  createReview,
} from "../../models/customer/servicelist.ts";
import { useEffect, useState } from "react";
import Button from "../../components/UI/Button.tsx";
import useSWR from "swr";
import { fetcher } from "../../store/customer/home-context.tsx";

function ReviewModal(props: {
  businessId: string;
  serviceId: number;
  onCancel: () => void;
  open: boolean;
  onCancelAll: () => void;
}) {
  const { closeRequestReview } = useReview();
  const [starRating, setStarRating] = useState("");
  const [checked, setChecked] = useState(false);
  const url = `https://erranddo.com/admin/api/v1/businesses/${props?.businessId}/detail`;
  const { data, isLoading } = useSWR(url, fetcher);
  const serviceData: ServiceList = data?.data;

  const formik = useFormik({
    initialValues: {
      userBusinessId: "",
      serviceId: 0,
      description: "",
      rating: "",
    },
    validate: (values: createReview) => {
      const errors: any = {};
      if (values.description.length === 0) {
        errors.description = "Required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.set("user_business_id", props?.businessId);
      formData.set("service_id", props?.serviceId.toString());
      formData.set("description", values.description);
      formData.set("rating", starRating);
      console.log(...formData);
      await closeRequestReview(formData);
      // await mutate();
      // setTimeout(() => {
      //   props.onCancel();
      // }, 1000);
    },
  });
  // let starRating:string
  useEffect(() => {
    formik.setFieldValue("rating", starRating);
  }, [starRating]);
  const { theme } = useTheme();
  return (
    <>
      {props.open && (
        <Modal
          className="bg-slate-100 opacity-90 rounded-lg xl:w-[470px] md:w-[370px] dark:bg-modalDarkColor"
          backdropClassName="bg-transparent"
        >
          <button
            className=" absolute top-5 right-5"
            onClick={() => {
              props.onCancelAll();
            }}
          >
            {theme === "light" && <div children={<Close color="black" />} />}

            {theme === "dark" && <div children={<Close color="white" />} />}
          </button>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col items-center xl:w-[450px] md:w-[350px] xl:mt-1 md:mt-2 p-3 gap-2">
              <div className="flex flex-col items-center xl:w-[450px] md:w-[300px] xl:mt-1 md:mt-2 p-6 gap-2">
                <div className="text-center">
                  <Heading
                    variant="bigTitle"
                    text={
                      <div>
                        Leave{" "}
                        {
                          <span className="text-primaryYellow">
                            {serviceData.name}
                          </span>
                        }{" "}
                        a review
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 xl:w-[450px] justify-center items-center xs:w-[350px]">
                <StarRatings
                  onClick={(key: number) => {
                    setStarRating(key.toString());
                  }}
                />
              </div>
              <div className="pb-7 xs:w-full xl:pl-0 md:pl-3">
                <Heading
                  variant="headingTitle"
                  text={""}
                  headingclassname="xs:text-md text-center"
                />
              </div>

              <div className=" xs:w-full xl:pl-0 md:pl-3">
                <div className="flex items-center gap-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Write your review here
                  </label>
                  {formik.touched.description && formik.errors.description ? (
                    <p className="text-red-600 text-xs mb-2">
                      {formik.errors.description}
                    </p>
                  ) : null}
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  rows={4}
                  className="resize-none block p-2.5 w-full text-sm text-gray-900 max-h-40  bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  onChange={formik.handleChange}
                ></textarea>
              </div>
              <div className="flex pb-5 xs:w-full xl:pl-0 md:pl-3 justify-center items-center gap-3">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  onChange={() => setChecked(!checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Heading
                  variant="smallTitle"
                  text="I confirm the information above is accurate"
                  headingclassname="text-slate-500 text-center xs:text-xs"
                />
              </div>
              <div className="flex gap-5 xl:w-[450px] md:w-[350px] justify-around md:pl-0 xs:pl-4">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    props.onCancel();
                  }}
                  type="button"
                  centerClassName="flex justify-center dark:text-white"
                  buttonClassName=" !px-10 "
                >
                  Back
                </Button>
                <Button
                  // loading={isLoading}
                  variant="filled"
                  color="primary"
                  type="submit"
                  centerClassName="flex justify-center dark:text-white"
                  buttonClassName=" !px-3   "
                  disabled={checked ? false : true}
                >
                  Close Request
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default ReviewModal;
