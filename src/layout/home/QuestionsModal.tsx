import { useEffect, useState } from "react";
import Modal from "./Modal";
import FoundImage from "../../assets/Group 70@3x.png";
import Close from "../../assets/close.tsx";
import { useFormik } from "formik";
import CommentsModal from "./CommentsModal";
import { BusinessData, Question, QuestionData } from "../../models/home";
import useSWR from "swr";
import { fetcher, publicFetcher } from "../../store/customer/home-context.tsx";
import FullPageLoading from "../../components/UI/FullPageLoading";
import Error from "../../components/UI/Error";
import NotFoundModal from "./NotFoundModal";
import Button from "../../components/UI/Button";
import { useTheme } from "../../store/theme-context";
import NearlyThere from "./NearlyThere.tsx";
import Input from "../../components/UI/Input.tsx";
import { useAuth } from "../../store/customer/auth-context.tsx";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../config/api";

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
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const businessUrl = buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?postcode=${postCode}&service_id=${service}`);
  let datarenderForBusiness: BusinessData[] = [];
  // Use publicFetcher for businesses (works without token - public endpoint)
  const { data: BusinessData, isLoading: businessLoading } = useSWR(
    service && postCode ? businessUrl : null,
    publicFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute deduplication
    }
  );
  datarenderForBusiness = BusinessData?.data;
  let error = "";
  if (datarenderForBusiness?.length === 0) {
    error = "No services";
  }
  const url = buildApiUrl(`${API_ENDPOINTS.QUESTIONS}?service_id=${service}&postcode=${postCode}&page=1&per_page=10`);
  const dummy_data: Question[] = [];
  let datarender: QuestionData[] = [];
  
  // Use publicFetcher for questions (works without token - public endpoint)
  const {
    data,
    error: ApiError,
    isLoading,
  } = useSWR(
    error.length === 0 && service && postCode ? url : null, 
    publicFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute deduplication
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      loadingTimeout: 5000, // 5 second timeout
    }
  );
  datarender = data?.data || dummy_data;

  const formik = useFormik({
    initialValues: {
      content: "",
    },

    onSubmit: () => {
      if (questionNumber < datarender.length - 1) {
        setQuestionNumber(questionNumber + 1);
      } else {
        setOpenModal(true);
      }
      localStorage.setItem("question", JSON.stringify(ids));
    },
  });
  const [questionNumber, setQuestionNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [extraAnswer, setExtraAnswer] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    ids.length > 0
      ? ids.find((d) => d.question === (datarender[questionNumber]?.id || questionNumber) && d.custom === true)?.answer || ""
      : ""
  );
  useEffect(() => {
    setInputValue(() => {
      const currentQuestionId = datarender[questionNumber]?.id || questionNumber;
      const matchingAnswer = ids.find((d) => d.question === currentQuestionId && d.custom === true)?.answer;
      return matchingAnswer || "";
    });
  }, [ids, questionNumber, datarender]);

  const newAnswerHandler = (e: string) => {
    setInputValue(e);
    formik.setFieldValue("content", e);
    
    // Find existing answer for this question
    const currentQuestionId = datarender[questionNumber]?.id || questionNumber;
    const existingIndex = ids.findIndex(item => item.question === currentQuestionId);
    
    if (existingIndex !== -1) {
      // Update existing answer
      ids[existingIndex].answer = e;
    } else {
      // Add new answer
      ids.push({
        question: datarender[questionNumber]?.id || questionNumber,
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
      {openModal && isLoggedIn ? (
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
      ) : openModal && !isLoggedIn ? (
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
      ) : null}
      {props.open && (
        <div>
          {/* Loading State - Show immediately */}
          {businessLoading ? (
            <Modal className="bg-gray-100 opacity-100 rounded-lg dark:bg-modalDarkColor">
              <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg font-semibold text-gray-700 dark:text-white">
                  Loading Questions...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Please wait while we prepare your questions
                </p>
              </div>
            </Modal>
          ) : (
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
                                              d === ids.find(item => item.question === (datarender[questionNumber]?.id || questionNumber))?.answer
                                                ? true
                                                : false
                                            }
                                            onClick={() => {
                                              setChecked(true);
                                              setInputValue("");
                                              setExtraAnswer(false);
                                              const currentQuestionId = datarender[questionNumber]?.id || questionNumber;
                                              const existingIndex = ids.findIndex(item => item.question === currentQuestionId);
                                              
                                              if (existingIndex !== -1) {
                                                ids[existingIndex].answer = d;
                                                ids[existingIndex].custom = false;
                                              } else {
                                                ids.push({
                                                  question: currentQuestionId,
                                                  answer: d,
                                                  custom: false,
                                                });
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
                                                  question: datarender[questionNumber]?.id || questionNumber,
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
                              </div>
                               
                              <div className="mt-4 p-2 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-3">
                                  <input
                                    onClick={() => {
                                      setChecked(false);
                                      setExtraAnswer(true);
                                      if (
                                        ids.length > 0 &&
                                        ids[ids.length - 1]?.question ===
                                        questionNumber
                                      ) {
                                        ids.pop();
                                      } else {
                                        const currentQuestionId = datarender[questionNumber]?.id || questionNumber;
                                        const existingIndex = ids.findIndex(item => item.question === currentQuestionId);
                                        
                                        if (existingIndex !== -1) {
                                          ids[existingIndex].answer = inputValue.toString();
                                          ids[existingIndex].custom = true;
                                        } else {
                                          ids.push({
                                            question: currentQuestionId,
                                            answer: inputValue.toString(),
                                            custom: true,
                                          });
                                        }
                                      }
                                    }}
                                    checked={ids.find(item => item.question === (datarender[questionNumber]?.id || questionNumber))?.custom || false}
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
                                    className="p-1 pl-2 rounded-lg w-full"
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
          )}
        </div>
      )}
    </>
  );
}

export default QuestionsModal;
