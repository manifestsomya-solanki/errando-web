import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Close from "../../assets/close.tsx";

import { useFormik } from "formik";

import ConfirmServiceModal from "./ConfirmServiceModal";
import Input from "../../components/UI/Input";
import Error from "../../components/UI/Error";

import { useAuth } from "../../store/customer/auth-context.tsx";
import Button from "../../components/UI/Button";
import { useTheme } from "../../store/theme-context";
import useSWR from "swr";
import { fetcher } from "../../store/customer/home-context.tsx";

function CommentsModal(props: {
  onCancel: () => void;
  open: boolean;
  onCancelAll: () => void;
  requestId?: number;
}) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const { isLoading, error, addRequest, setError, editRequest } = useAuth();
  const formik = useFormik<{ comment: string; img: File | undefined }>({
    initialValues: {
      comment: "",
      img: undefined,
    },
    validate: (values) => {
      const errors: any = {};

      if (values.comment.toString().length === 0) {
        errors.comment = "Please enter at least a word to complete";
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (isLoggedIn) {
        const formData = new FormData();
        const id = JSON.parse(localStorage.getItem("data") ?? "").id;

        const serviceid = JSON.parse(localStorage.getItem("service") ?? "").id;

        const postCodeid = localStorage.getItem("post_code");

        const questions: { question: number; answer: "" }[] = JSON.parse(
          localStorage.getItem("question") ?? ""
        );

        formData.set("user_id", id);
        formData.set("postcode_id", postCodeid?.toString() ?? "");
        formData.set("service_id", serviceid?.toString() ?? "");
        if (values?.img) formData.set("file", values?.img);
        formData.set("comment", values.comment);
        for (let i = 0; i < questions.length; i++) {
          formData.set(
            `data[${i}][question_id]`,
            (questions[i].question + 1).toString()
          );
          formData.set(`data[${i}][answer]`, questions[i].answer.toString());
        }

        await addRequest(formData);
      } else {
        console.log(props.requestId, "id of request");
        const formData = new FormData();

        if (values?.img) formData.set("file", values?.img);
        formData.set("comment", values.comment);

        await editRequest(formData, props.requestId?.toString() ?? "");
      }
      props.onCancelAll();
    },
  });
  useEffect(() => {
    setError("");
  }, []);
  const [openModal, setOpenModal] = useState(false);
  const { theme } = useTheme();
  return (
    <>
      {props.open && (
        <Modal
          className="bg-slate-100 opacity-90 rounded-lg xl:w-[570px] md:w-[470px] dark:bg-modalDarkColor"
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
          <form
            className="flex flex-col items-center xl:w-[550px] md:w-[450px] xl:mt-1 md:mt-2 p-3 gap-2"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col items-center xl:w-[550px] md:w-[400px] xl:mt-1 md:mt-2 p-6 gap-2">
              <div className="text-center">
                <h1 className="text-black xl:text-xl md:text-lg xs:text-lg font-bold dark:text-white">
                  Give the Pro as much information as possible for them to
                  understand your requirement(s)/ quote precisely?
                </h1>
              </div>
            </div>
            <div className="pt-3 xl:w-[550px] md:w-[400px] xs:w-full xl:pl-0 ">
              <Input
                id="comment"
                name="comment"
                onChange={formik.handleChange}
                value={formik.values.comment}
                className="rounded-lg bg-white  py-1 xs:w-full outline-none px-3 dark:bg-transparent"
                type="text"
                placeholder="Is there anything the Pro needs to know?"
              />
              {formik.touched.comment && formik.errors.comment ? (
                <Error
                  className="text-red-600  "
                  error={formik.errors.comment}
                ></Error>
              ) : null}
            </div>
            <div className="my-3 xl:w-[550px] md:w-[400px] xs:w-full relative">
              <button
                type="button"
                className=" absolute top-2 right-2 dark:text-white"
                onClick={() => {
                  console.log(formik?.values?.img);
                  formik.setFieldValue("img", undefined);
                }}
              >
                Delete
              </button>
              <label className="flex justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                {formik?.values?.img ? (
                  <div className="flex items-center space-x-2 dark:text-white">
                    {formik.values.img.name}
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
                    <span className="font-medium text-gray-600 dark:text-white  xs:text-center">
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
                      formik.setFieldValue("img", ev?.target?.files[0]);
                    }
                  }}
                  type="file"
                  name="img"
                  id="img"
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex gap-5 xl:w-[550px] md:w-[450px] justify-center">
              <button
                type="button"
                className="text-black dark:text-white w-32 border-[#707070] border  xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 "
                onClick={() => props.onCancel()}
              >
                Back
              </button>
              <Button
                loading={isLoading}
                type="submit"
                buttonClassName="text-white w-32 bg-[#0003FF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-6 xs:px-5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </Button>
            </div>
            <Error
              error={error}
              className="text-center mt-3  xl:w-[550px] md:w-[450px]"
            />
          </form>
        </Modal>
      )}
    </>
  );
}

export default CommentsModal;
