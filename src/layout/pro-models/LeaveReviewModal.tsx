import Modal from "../home/Modal";
import Close from "../../assets/close.tsx";
import { useFormik } from "formik";
import Heading from "../../components/UI/Heading";
import StarRatings from "../../components/UI/StarRatings";
import { useTheme } from "../../store/theme-context";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import useSWR from "swr";
import { fetcher } from "../../store/customer/home-context.tsx";
import {
  ServiceList,
  createReview,
} from "../../models/customer/servicelist.ts";
import { useReview } from "../../store/customer/review-context.tsx";
import Button from "../../components/UI/Button.tsx";
import { useMyReview } from "../../store/customer/my-review-context.tsx";

function LeaveReviewModal(props: {
  onCancel: () => void;
  id?: number;
  dealerId?: number;
}) {
  const dealerId = useParams();

  const url = `https://erranddo.kodecreators.com/api/v1/businesses/${
    props.dealerId ?? dealerId?.id
  }/detail`;
  const { data } = useSWR(url, fetcher);
  const serviceData: ServiceList = data?.data;

  const detailUrl = `https://erranddo.kodecreators.com/api/v1/reviews/${props.id}/detail`;
  const { data: reviewData } = useSWR(props.id ? detailUrl : null, fetcher);
  const { state } = useLocation();
  const [checked, setChecked] = useState(false);
  const [starRating, setStarRating] = useState("");
  const { theme } = useTheme();
  const {
    createReview,
    isLoading: iscreateLoading,
    editReview,
    mutate,
  } = useReview();
  const { editReview: editMyReview, mutate: editMutate } = useMyReview();

  const location = useLocation();
  console.log(props.dealerId);
  const formik = useFormik({
    initialValues: {
      userBusinessId: dealerId?.id,
      serviceId: state?.serviceId,
      description: props.id ? reviewData?.description : "",
      rating: props.id ? reviewData?.rating : "",
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
      if (location.pathname.endsWith("reviews")) {
        console.log("reviews");
        formData.set("description", values.description);
        formData.set("rating", starRating);
        await editMyReview(formData, props.id ?? 0);
        await editMutate();
      } else {
        if (values.userBusinessId)
          formData.set("user_business_id", values.userBusinessId);
        formData.set("service_id", values.serviceId.toString());
        formData.set("description", values.description);
        formData.set("rating", starRating);
        if (!props.id) {
          console.log(props.id, "dffw");
          await createReview(formData);
        } else {
          console.log("jere");

          await editReview(formData, props.id ?? 0);
        }
        await mutate();
      }
      props.onCancel();
    },
  });

  // let starRating:string
  useEffect(() => {
    formik.setFieldValue("rating", starRating);
  }, [starRating]);

  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg xl:w-[470px] md:w-[370px] dark:bg-modalDarkColor">
      <button
        className="absolute top-5 right-5 w-full flex justify-end"
        onClick={() => {
          props.onCancel();
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
                        {serviceData?.name ?? ""}
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
              text={state?.serviceName}
              headingclassname="xs:text-md text-center"
            />
          </div>
          <div className=" xs:w-full xl:pl-0 md:pl-3">
            <div className="flex items-center gap-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {props.id ? reviewData?.description : "Write your review here"}
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
              className="resize-none block p-2.5 w-full text-sm text-gray-900 max-h-40 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              text={
                <label htmlFor="default-checkbox">
                  I confirm the information above is accurate
                </label>
              }
              headingclassname="text-slate-500 text-center xs:text-xs"
            />
          </div>
          <div className="flex  xl:w-[450px] md:w-[350px] justify-around md:pl-0 xs:pl-4">
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
              Cancel
            </Button>
            <Button
              loading={iscreateLoading}
              variant="filled"
              color="primary"
              type="submit"
              centerClassName="flex justify-center dark:text-white"
              buttonClassName=" !px-10   "
              disabled={checked ? false : true}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default LeaveReviewModal;
