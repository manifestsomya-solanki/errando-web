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
  basePrice?: number;
  tierDiscountAmount?: number;
  tierDiscountPercentage?: number;
  promoDiscount?: number;
  promoCode?: string;
  isLoading?: boolean;
}) {
  const { theme } = useTheme();

  // Calculate values - ensure all values are numbers
  const basePriceValue = Number(props.basePrice || props.price) || 0;
  const tierDiscount = Number(props.tierDiscountAmount || 0) || 0;
  const tierDiscountPercent = Number(props.tierDiscountPercentage || 0) || 0;
  const promoDiscountPercent = Number(props.promoDiscount || 0) || 0;
  const promoDiscountAmount = props.promoCode && promoDiscountPercent > 0 
    ? ((basePriceValue - tierDiscount) * promoDiscountPercent) / 100 
    : 0;
  const totalPrice = Number(props.price) || 0;

  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg xl:w-[550px] md:w-[550px] dark:bg-modalDarkColor">
      <button
        className="absolute top-5 right-5 w-full flex justify-end"
        onClick={() => {
          props.onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>
      <div className="flex flex-col items-center xl:w-[500px] md:w-[500px] xl:mt-1 md:mt-2 p-5 gap-4">
        <div className="pb-2 xs:w-full xl:pl-0 md:pl-3">
          <Heading
            variant="subTitle"
            headingclassname="text-center font-bold text-lg"
            text="Payment Summary"
          />
        </div>
        
        {/* Payment Details List */}
        <div className="w-full space-y-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Credits:</span>
            <span className="text-gray-900 dark:text-white font-semibold">{props.credits}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Base Price:</span>
            <span className="text-gray-900 dark:text-white">£{basePriceValue.toFixed(2)}</span>
          </div>
          
          {tierDiscount > 0 && (
            <div className="flex justify-between items-center text-green-600 dark:text-green-400">
              <span>Discount ({tierDiscountPercent.toFixed(2)}%):</span>
              <span>-£{tierDiscount.toFixed(2)}</span>
            </div>
          )}
          
          {props.promoCode && promoDiscountPercent > 0 && (
            <div className="flex justify-between items-center text-green-600 dark:text-green-400">
              <span>Promo Code ({props.promoCode}) ({promoDiscountPercent.toFixed(2)}%):</span>
              <span>-£{promoDiscountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300 dark:border-gray-600 font-bold text-lg">
            <span className="text-gray-900 dark:text-white">Total Payment:</span>
            <span className="text-primaryBlue dark:text-blue-400">£{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-5 xl:w-[500px] md:w-[500px] justify-center pl-2 pt-2">
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
            Pay Now
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default PurchaseCreditsModal;

