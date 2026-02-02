import Modal from "../../layout/home/Modal";
import Close from "../../assets/close.tsx";
import Heading from "../../components/UI/Heading";
import { useTheme } from "../../store/theme-context";
import Button from "../../components/UI/Button.tsx";

function PurchaseCreditsModal(props: {
  onCancel: () => void;
  onConfirm: () => void;
  credits: number;
  price: number;
  isLoading?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg xl:w-[470px] md:w-[470px] dark:bg-modalDarkColor">
      <button
        className="absolute top-5 right-5 w-full flex justify-end"
        onClick={() => {
          props.onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>
      <div className="flex flex-col items-center xl:w-[420px] md:w-[450px] xl:mt-1 md:mt-2 p-3 gap-2">
        <div className="pb-7 xs:w-full xl:pl-0 md:pl-3">
          <Heading
            variant="subTitle"
            headingclassname="text-center"
            text={`Purchase ${props.credits} Credits for $${props.price}?`}
          />
        </div>
        <div className="flex gap-5 xl:w-[550px] md:w-[420px] justify-center pl-2">
          <button
            type="button"
            className="text-white md:w-40 xs:w-36 xs:text-sm bg-red-500 xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0"
            onClick={() => props.onCancel()}
            disabled={props.isLoading}
          >
            Cancel
          </button>
          <Button
            color="success"
            loading={props.isLoading}
            type="submit"
            onClick={props.onConfirm}
            centerClassName="flex justify-center items-center"
            buttonClassName="text-white w-48 xs:w-36 xs:text-sm bg-green-500 focus:ring-4 focus:outline-none focus:ring-blue-300 xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Confirm Purchase
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default PurchaseCreditsModal;

