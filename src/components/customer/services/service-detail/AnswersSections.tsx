import { Request } from "../../../../models/customer/requestlist";
import Heading from "../../../UI/Heading";
import { DangerousHTML } from "../../../pro/dashboard/services/dealer-detail/DealerDetailSection";
import AnswerItem from "./AnswerItem";

function AnswersSections(props: { array: Request[]; location: string }) {
  const questions = props.array[0].answers?.map((d) => d.question.title);
  const answers = props.array[0].answers?.map((d) => d.answer);
  questions.push("Location");
  answers.push(props.location);
  const disableEmailsAndLinks = (text: any) => {
    const emailRegex = /\S+@\S+\.\S+/g;
    const urlRegex = /(?:https?|ftp):\/\/[\n\S]+|www\.[\S]+\.[a-z]+/g;
    const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/g;
    const blurredText = text.replace(
      emailRegex,
      '<span class="blur-text">$&</span>'
    );
    const blurredAndLinkedText = blurredText.replace(
      urlRegex,
      '<span class="blur-text">$&</span>'
    );
    const finalText = blurredAndLinkedText.replace(
      phoneRegex,
      '<span class="blur-text">$1$2$3$4</span>'
    );
    return finalText;
  };
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
        <DangerousHTML
          dangerouslySetInnerHTML={{
            __html: disableEmailsAndLinks(props.array[0].comment),
          }}
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
