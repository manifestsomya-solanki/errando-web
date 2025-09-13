import RightArrow from "../../../../assets/right-arrow.svg";
import Heading from "../../../UI/Heading";

function AnswerItem(props: { question: string; answer: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="">
        <img src={RightArrow} className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-1">
        <Heading
          text={props.question}
          variant="smallTitle"
          headingclassname="text-slate-500 !font-normal tracking-wide lg:text-xs xl:text-sm dark:text-slate-400"
        />
        <Heading
          text={props.answer}
          variant="subHeader"
          headingclassname="text-textColor !font-semibold tracking-wide dark:text-darktextColor"
        />
      </div>
    </div>
  );
}

export default AnswerItem;
