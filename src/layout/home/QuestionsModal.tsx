import { useEffect, useState } from "react";
import Modal from "./Modal";
import FoundImage from "../../assets/Group 70@3x.png";
import Close from "../../assets/close.tsx";
import { useFormik } from "formik";
import CommentsModal from "./CommentsModal";
import { BusinessData, Question, QuestionData } from "../../models/home";
import useSWR from "swr";
import { fetcher } from "../../store/customer/home-context.tsx";
import FullPageLoading from "../../components/UI/FullPageLoading";
import Error from "../../components/UI/Error";
import NotFoundModal from "./NotFoundModal";
import Button from "../../components/UI/Button";
import { useTheme } from "../../store/theme-context";
import NearlyThere from "./NearlyThere.tsx";
import Input from "../../components/UI/Input.tsx";
import { useAuth } from "../../store/customer/auth-context.tsx";

let ids: { question: number; answer: string; custom: boolean }[] = JSON.parse(
  localStorage.getItem("question") ?? "[]"
);

function QuestionsModal(props: {
  onCancel: () => void;

  open: boolean;
  onCancelAll: () => void;
}) {
  const { requestData } = useAuth();
  const service = localStorage.getItem("service")
    ? JSON.parse(localStorage.getItem("service") ?? "").id
    : "";
  const postCode = localStorage.getItem("post_code");
  const token = localStorage.getItem("token");
  const businessUrl = `https://erranddo.com/admin/api/v1/businesses?post_code_id=${postCode}&service_id=${service}`;
  let datarenderForBusiness: BusinessData[] = [];
  const { data: BusinessData, isLoading: businessLoading } = useSWR(
    businessUrl,
    fetcher
  );
  datarenderForBusiness = BusinessData?.data;
  let error = "";
  if (datarenderForBusiness?.length === 0) {
    error = "No services";
  }
  const url = `https://erranddo.com/admin/api/v1/questions?service_id=${service}&post_code_id=${postCode}&page=1&per_page=10`;
  const dummy_data: Question[] = [];
  let datarender: QuestionData[] = [];
  const {
    data,
    error: ApiError,
    isLoading,
  } = useSWR(error.length === 0 ? url : null, fetcher);
  datarender = data?.data || dummy_data;

  const formik = useFormik({
    initialValues: {
      content: "",
    },

    onSubmit: () => {
      datarender.length - 1 !== questionNumber
        ? setQuestionNumber(questionNumber + 1)
        : setOpenModal(true);
      localStorage.setItem("question", JSON.stringify(ids));
    },
  });
  const [questionNumber, setQuestionNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [extraAnswer, setExtraAnswer] = useState(false);
  const [inputValue, setInputValue] = useState(
    ids.length > 0
      ? ids.map((d) => {
          if (d.question === questionNumber && d.custom === true) {
            console.log("answer", d.answer);
            return d.answer;
          }
        })
      : ""
  );
  useEffect(() => {
    setInputValue(() => {
      const matchingAnswers = ids
        .filter((d) => d.question === questionNumber && d.custom === true)
        .map((d) => d.answer);

      return matchingAnswers;
    });
  }, [ids, questionNumber]);

  const newAnswerHandler = (e: string) => {
    setInputValue(e);
    formik.setFieldValue("content", e);
    if (ids[questionNumber]) {
      ids[questionNumber].answer = e;
    } else {
      ids.push({
        question: questionNumber,
        answer: e,
        custom: true,
      });
    }
  };
  useEffect(() => {
    return () => {
      ids = [];
    };
  }, []);
  const { theme } = useTheme();

  return (
    <>
      {openModal && token ? (
        <CommentsModal
          requestId={requestData?.data?.user_requests?.id}
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
          }}
          onCancelAll={() => {
            setOpenModal(false);
            setQuestionNumber(0);
            props.onCancelAll();
          }}
        />
      ) : (
        <NearlyThere
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
          }}
          onCancelAll={() => {
            setOpenModal(false);
            setQuestionNumber(0);
            props.onCancelAll();
          }}
        />
      )}
      {props.open && (
        <div>
          {!businessLoading ? (
            <div>
              {error.length === 0 ? (
                // {true ? (
                <Modal
                  className="bg-slate-100 opacity-90 rounded-lg xl:w-[570px] md:w-[470px] dark:bg-modalDarkColor"
                  backdropClassName="bg-transparent"
                >
                  <button
                    className=" absolute top-5 right-5"
                    onClick={() => {
                      props.onCancelAll();
                      setQuestionNumber(0);
                    }}
                  >
                    <div className="md:h-5 md:w-5 xs:h-4 xs:w-4">
                      {theme === "light" && (
                        <div children={<Close color="black" />} />
                      )}
                      {theme === "dark" && (
                        <div children={<Close color="white" />} />
                      )}
                    </div>
                  </button>
                  {isLoading ? (
                    <FullPageLoading className="xl:w-[570px] md:w-[470px] !h-[40vh] !bg-transparent dark:!bg-modalDarkColor" />
                  ) : (
                    <div>
                      {ApiError ? (
                        <Error error={ApiError} />
                      ) : (
                        <div>
                          <div className="flex flex-col items-center xl:w-[550px] md:w-[450px] xl:mt-1 md:mt-2 p-3 gap-2">
                            <div>
                              <img
                                src={FoundImage}
                                alt=""
                                className="xl:h-20 xl:w-20 md:h-12 md:w-12 xs:h-12 xs:w-12"
                              />
                            </div>
                            <div className="text-center">
                              <h1 className="text-black xl:text-xl md:text-lg xs:text-md font-bold">
                                <span className="text-[#00BF02]">
                                  Great news!{" "}
                                </span>
                                <span className="dark:text-white">
                                  There are Pro’s available to help
                                </span>
                              </h1>
                            </div>
                          </div>
                          <form onSubmit={formik.handleSubmit}>
                            <div className="">
                              <h1 className=" xl:text-lg  md:text-md xs:text-sm font-medium p-2 mb-3 dark:text-white">
                                {datarender[questionNumber]?.title}
                              </h1>
                              <div className="grid xl:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 items-center gap-3 xl:w-[550px] md:w-[450px] p-2 dark:text-white">
                                {datarender[questionNumber]?.answers?.length >
                                  0 &&
                                  datarender[questionNumber]?.answers?.map(
                                    (d, key) => {
                                      return (
                                        <div
                                          className="flex items-center gap-2"
                                          key={key}
                                        >
                                          <input
                                            key={key}
                                            checked={
                                              d === ids[questionNumber]?.answer
                                                ? true
                                                : false
                                            }
                                            onClick={() => {
                                              setChecked(true);
                                              setInputValue("");
                                              setExtraAnswer(false);
                                              if (
                                                ids[ids.length - 1].question ===
                                                questionNumber
                                              ) {
                                                ids.pop();
                                              } else if (ids[questionNumber]) {
                                                ids[questionNumber].answer = d;
                                                ids[questionNumber].custom =
                                                  false;
                                              }
                                            }}
                                            id={d}
                                            type="radio"
                                            value={d}
                                            name="content"
                                            onChange={() => {
                                              formik.setFieldValue(
                                                "content",
                                                d
                                              );
                                              if (ids[questionNumber]) {
                                                ids[questionNumber].answer = d;
                                              } else {
                                                ids.push({
                                                  question: questionNumber,
                                                  answer: d,
                                                  custom: false,
                                                });
                                              }
                                            }}
                                            className="xl:w-4 xl:h-4 md:w-3 md:h-3 xs:w-3 xs:h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
                                          />
                                          <label
                                            className="xl:mr-3 md:mr-2 xl:text-md  md:text-sm xs:text-xs"
                                            htmlFor={d}
                                          >
                                            {d}
                                          </label>
                                        </div>
                                      );
                                    }
                                  )}

                                <div className="mb-5 flex xl:w-[550px] w-44 justify-center items-center mt-3 gap-3 ">
                                  <input
                                    onClick={() => {
                                      setChecked(false);
                                      setExtraAnswer(true);
                                      if (
                                        ids[ids.length - 1].question ===
                                        questionNumber
                                      ) {
                                        ids.pop();
                                      } else if (ids[questionNumber]) {
                                        ids[questionNumber].answer =
                                          inputValue.toString();
                                        ids[questionNumber].custom = true;
                                      }
                                    }}
                                    checked={extraAnswer}
                                    type="radio"
                                    name="content"
                                    className="xl:w-4 xl:h-4 md:w-3 md:h-3 xs:w-3 xs:h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <Input
                                    type="text"
                                    value={inputValue}
                                    disabled={!extraAnswer}
                                    onChange={(e: any) => {
                                      newAnswerHandler(e.target.value);
                                    }}
                                    className="p-1 pl-2 rounded-lg xl:w-[400px] "
                                    placeholder="Write your own answer"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-5 xl:w-[550px] md:w-[450px] justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  questionNumber > 0
                                    ? setQuestionNumber(questionNumber - 1)
                                    : props.onCancel();
                                }}
                                className="text-black dark:text-white  border-[#707070] border  xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 "
                              >
                                Back
                              </button>
                              <Button
                                disabled={
                                  !ids[questionNumber] || ids.length === 0
                                    ? true
                                    : false
                                }
                                variant="filled"
                                color="primary"
                                type="submit"
                                onClick={() => {
                                  setInputValue("");
                                  setExtraAnswer(false);
                                }}
                                buttonClassName="  xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 disabled:text-slate-600"
                              >
                                Continue
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </Modal>
              ) : (
                <NotFoundModal
                  onCancel={() => {
                    props.onCancel();
                    setOpenModal(false);
                  }}
                />
              )}
            </div>
          ) : (
            <Modal
              className="bg-slate-100 opacity-90 rounded-lg xl:w-[570px] md:w-[470px] dark:!bg-modalDarkColor"
              backdropClassName="bg-transparent"
            >
              <FullPageLoading className="xl:w-[0px] md:w-[0px] !h-[40vh] !bg-transparent dark:!bg-modalDarkColor" />
            </Modal>
          )}
        </div>
      )}
    </>
  );
}

export default QuestionsModal;
