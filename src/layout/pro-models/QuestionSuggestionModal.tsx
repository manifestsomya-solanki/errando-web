import Modal from "../home/Modal";
import Close from "../../assets/close.tsx";
import { useFormik } from "formik";
import Heading from "../../components/UI/Heading";
import { useTheme } from "../../store/theme-context";
import { useState } from "react";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Error from "../../components/UI/Error";
import { toast } from "react-toastify";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

function QuestionSuggestionModal(props: {
  onCancel: () => void;
  serviceId: number;
  serviceName: string;
}) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<string[]>([""]);

  const addAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const removeAnswer = (index: number) => {
    if (answers.length > 1) {
      const newAnswers = answers.filter((_, i) => i !== index);
      setAnswers(newAnswers);
    }
  };

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const formik = useFormik({
    initialValues: {
      question: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.question || values.question.trim().length === 0) {
        errors.question = "Question is required";
      }
      const validAnswers = answers.filter((answer) => answer && answer.trim() !== "");
      if (validAnswers.length === 0) {
        errors.answers = "At least one answer option is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        setIsLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.set("question", values.question);
        formData.set("service_id", props.serviceId.toString());
        
        // Filter out empty answers
        const validAnswers = answers.filter((answer) => answer && answer.trim() !== "");
        
        // Add answers to formData (using answer_1, answer_2, etc. format)
        validAnswers.forEach((answer, index) => {
          if (index === 0) formData.set("answer_1", answer);
          else if (index === 1) formData.set("answer_2", answer);
          else if (index === 2) formData.set("answer_3", answer);
          else if (index === 3) formData.set("answer_4", answer);
        });

        const res = await fetch(buildApiUrl(API_ENDPOINTS.QUESTIONS_SUGGEST), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        });

        const data: any = await res.json();

        if (res.status === 200 && data.status === "1") {
          toast.success(data.message || "Question suggestion submitted successfully!", {
            hideProgressBar: false,
            position: "bottom-left",
          });
          formik.resetForm();
          setAnswers([""]);
          setTimeout(() => {
            props.onCancel();
          }, 1000);
        } else {
          toast.error(data.message || "Failed to submit suggestion", {
            hideProgressBar: false,
            position: "bottom-left",
          });
        }
      } catch (error: any) {
        console.error("Error submitting question suggestion:", error);
        toast.error("An error occurred. Please try again.", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg xl:w-[600px] md:w-[500px] dark:bg-modalDarkColor">
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
        <div className="flex flex-col items-center xl:w-[580px] md:w-[480px] xl:mt-1 md:mt-2 p-6 gap-4">
          <div className="w-full">
            <Heading
              variant="bigTitle"
              text={`${props.serviceName} Question Suggestion Box`}
              headingclassname="text-center dark:text-white"
            />
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Question <span className="text-red-500">*</span>
            </label>
            <Input
              id="question"
              name="question"
              placeholder="Write here..."
              value={formik.values.question}
              onChange={formik.handleChange}
              className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {formik.touched.question && formik.errors.question ? (
              <Error error={formik.errors.question} className="mt-1" />
            ) : null}
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Answer options <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {answers.map((answer, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Write here...`}
                    value={answer}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateAnswer(index, e.target.value)
                    }
                    className="flex-1 p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {answers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAnswer(index)}
                      className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      title="Remove answer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={addAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200 shadow-sm"
              >
                + Add New Answer
              </button>
            </div>
            {(formik.errors as any).answers && (
              <Error error={(formik.errors as any).answers} className="mt-2" />
            )}
          </div>

          <div className="flex w-full justify-around gap-4 mt-4">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                props.onCancel();
              }}
              type="button"
              centerClassName="flex justify-center dark:text-white"
              buttonClassName="!px-10"
            >
              Cancel
            </Button>
            <Button
              loading={isLoading}
              variant="filled"
              color="primary"
              type="submit"
              centerClassName="flex justify-center dark:text-white"
              buttonClassName="!px-10"
            >
              Submit Suggestion
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default QuestionSuggestionModal;
