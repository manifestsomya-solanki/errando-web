import Modal from "../home/Modal";
import Button from "../../components/UI/Button";
import { useNavigate } from "react-router";

const NavigateSettingsModal = () => {
  const navigate = useNavigate();
  return (
    <Modal
      className="bg-slate-100 opacity-90 rounded-lg  dark:bg-modalDarkColor "
      backdropClassName="bg-[rgba(0,0,0,0.65)]"
    >
      <div className="flex flex-col w-full gap-5 ">
        <h1 className="text-black dark:text-white xl:text-lg md:text-md font-bold text-center mt-7 mb-3 ">
          To register as a Pro, complete your profile page information
        </h1>

        <div className="flex gap-2 items-center justify-center px-5 ">
          <Button
            variant="filled"
            onClick={() => {
              navigate("/pro/settings");
            }}
            type="button"
            centerClassName="flex justify-center dark:text-white"
            buttonClassName=" !px-10  bg-primaryGreen hover:bg-primaryGreen/50 border-none flex-wrap"
          >
            Go to Settings
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NavigateSettingsModal;
