import { Request } from "../../../../models/customer/requestlist";
import Heading from "../../../UI/Heading";
import AnswerItem from "./AnswerItem";

function AnswersSections(props: { array: Request[]; location: string }) {
  const questions = props.array[0].answers?.map((d) => d.question.title);
  const answers = props.array[0].answers?.map((d) => d.answer);
  questions.push("Location");
  answers.push(props.location);
  return (
    <>
      <div className="py-4 grid lg:grid-cols-4 gap-7 w-full xs:grid-cols-1 ">
        {questions.map((item, key) => {
          return (
            <div>
              <AnswerItem question={item} answer={answers[key]} />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 xs:my-3">
        <Heading
          text={"Comment :"}
          variant="subHeader"
          headingclassname="text-primaryYellow !font-semibold tracking-wide dark:text-darktextColor "
        />
        <Heading
          text={props.array[0].comment || ""}
          variant="subHeader"
          headingclassname="text-textColor !font-semibold tracking-wide dark:text-darktextColor"
        />
        {/* <Heading
          text={`${props.array[0].comment}`}
          variant="subHeader"
          headingclassname="text-textColor !font-semibold tracking-wide dark:text-darktextColor"
        /> */}
      </div>
    </>
  );
}

export default AnswersSections;
