import { useEffect, useState } from "react";
import Modal from "./Modal";
import Close from "../../assets/close.tsx";
import QuestionsModal from "./QuestionsModal";
import { useFormik } from "formik";
import PostCodeDetails from "../../components/UI/PostCodeDetails";

import { useTheme } from "../../store/theme-context";
import Label from "../../components/UI/Label.tsx";

function PostCodeModal(props: {
  onCancel: () => void;
  open: boolean;
  onCancelAll: () => void;
}) {
  const [openModal, setOpenModal] = useState(false);
  const token = localStorage.getItem("token");
  const formik = useFormik({
    initialValues: {
      postCode: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (values.postCode.toString().length === 0) {
        errors.postCode = "Required";
      }
      return errors;
    },
    onSubmit: (values) => {
      localStorage.setItem("post_code", values.postCode);

      setOpenModal(true);
    },
  });
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
              <div className="flex gap-2 items-center w-full justify-between">
                <PostCodeDetails
                  className="rounded-lg md:w-96 lg:w-80 xl:w-96 xs:w-64 outline-none pl-3 text-[#707070]  "
                  type="text"
                  placeholder="Post Code"
                  id="postCode"
                  name="postCode"
                  onChange={(ev: any) => {
                    formik.setFieldValue("postCode", ev);
                  }}
                />

                <button
                  disabled={
                    formik.errors.postCode || !formik.values.postCode
                      ? true
                      : false
                  }
                  type="submit"
                  className="text-white bg-[#0003FF] hover:bg-blue-800 focus:ring-4 disabled:bg-gray-300 disabled:text-slate-500 dark:text-black focus:outline-none focus:ring-blue-300 xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
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
