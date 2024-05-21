import { useState } from "react";
import Heading from "../../UI/Heading";
import HomeCard from "../dashboard/home/HomeCard";
import Button from "../../UI/Button";
import { useNavigate, useParams } from "react-router";
import { useLeadResponse } from "../../../store/pro/response-context";
import { Notes } from "../../../models/pro/notes";
import Error from "../../../components/UI/Error";
import { Formik, FormikErrors } from "formik";
import useSWR from "swr";
import { fetcher } from "../../../store/customer/home-context";
import { NotesList } from "../../../models/pro/noteslist";
import FullPageLoading from "../../UI/FullPageLoading";
import BackArrow from "../../../assets/BackArrow";
import { useTheme } from "../../../store/theme-context";

function NotesDetail({ onCancel }: { onCancel: () => void }) {
  const requestId = useParams();
  const { notes, isNoteLoading } = useLeadResponse();

  const loginUser = JSON.parse(localStorage.getItem("data") || "{}");
  console.log(loginUser?.id, "loginUser");

  const url = `https://erranddo.com/admin/api/v1/note?user_request_id=${requestId?.id}&user_id=${loginUser?.id}`;
  const { data, isLoading } = useSWR(url, fetcher);
  const notesDetail: NotesList[] = data?.data ?? "";
  console.log(requestId, "reqid");

  console.log(notesDetail[0]?.note, "notesDetail");

  const validate = (values: Notes) => {
    const errors: FormikErrors<Notes> = {};
    if (!values.note) {
      errors.note = "Please include a note";
    }
    return errors;
  };

  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <div>
      <HomeCard className="rounded-md  px-5 pb-5">
        <div className="py-4 border-b-[0.5px] border-b-slate-200 flex justify-between">
          <div className="flex items-center">
            <div
              className="flex gap-2 items-center"
              onClick={() => navigate(-1)}
            >
              {theme === "light" && (
                <div children={<BackArrow color="black" />} />
              )}

              {theme === "dark" && (
                <div children={<BackArrow color="white" />} />
              )}
              <Heading
                text="Back"
                variant="smallTitle"
                headingclassname="text-textColor !font-semibold tracking-wide dark:text-darktextColor"
              />
            </div>
          </div>
          <div className="flex items-center">
            <Heading
              text={`Notes`}
              variant="subHeader"
              headingclassname="!font-bold text-textColor text-xl tracking-wide dark:text-white"
            />
          </div>
        </div>
        <Formik<Notes>
          initialValues={{
            note: notesDetail[0]?.note,
            user_request_id: requestId?.id ? parseInt(requestId.id) : 0,
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            const formData = new FormData(); //initialize formdata
            formData.set("note", values.note);
            formData.set("user_request_id", String(values.user_request_id));
            notes(formData);
          }}
          validate={validate}
        >
          {(props) => (
            <div>
              {isLoading ? (
                <FullPageLoading />
              ) : (
                <form autoComplete="off" onSubmit={props.handleSubmit}>
                  <div className="flex flex-col gap-3 justify-between py-4">
                    <textarea
                      id="note"
                      name="note"
                      rows={16}
                      className="resize-none block p-2.5 w-full text-sm text-gray-900  bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your thoughts here..."
                      value={props.values.note}
                      onChange={props.handleChange}
                    ></textarea>
                    {props?.touched?.note && props?.errors?.note ? (
                      <Error error={props?.errors?.note} className="mt-2" />
                    ) : null}
                    <div className="ml-auto">
                      <Button
                        loading={isNoteLoading}
                        variant="filled"
                        color="primary"
                        size="normal"
                        children="Submit"
                        buttonClassName="!py-2"
                        centerClassName="flex items-center justify-center"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}
        </Formik>
      </HomeCard>
    </div>
  );
}

export default NotesDetail;
