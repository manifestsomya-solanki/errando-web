import Modal from "../home/Modal";

import Close from "../../assets/close.tsx";
import GreenTick from "../../assets/GreenRoundTick.svg";

import Heading from "../../components/UI/Heading";

import { useTheme } from "../../store/theme-context";

function EmailVerificationLinkModal({
  onCancel,
  email,
}: {
  onCancel: () => void;
  email: string;
}) {
  const { theme } = useTheme();
  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg dark:bg-modalDarkColor">
      <button
        className=" absolute top-5 right-5"
        onClick={() => {
          onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>

      <div className="py-7 text-center">
        <img src={GreenTick} className="w-20 h-20 my-5 mx-auto" />
        <Heading
          headingclassname="my-3  text-textColor !font-semibold"
          variant="subHeader"
          text={`A verification link has been sent to ${email}`}
        />
      </div>
    </Modal>
  );
}

export default EmailVerificationLinkModal;
