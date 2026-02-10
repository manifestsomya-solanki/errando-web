import CreditsCard from "./CreditsCard";
import Heading from "../../../UI/Heading";

function CreditsDetailItemSection(props: {
  packageId?: number;
  creditscore: number;
  amount: number;
  perCreditAmount: number;
  percentage: string;
  onBuyClick?: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="w-full">
      <div className="relative">
        <CreditsCard>
          <div className={props.isLoading ? "blur-sm" : ""}>
            
            {/* Rotated Discount Badge - Top Right Corner (Like Original) */}
            {props.percentage && (
              <div className="absolute -top-1 -right-1 sm:top-0 sm:right-0 overflow-hidden w-16 h-16 sm:w-20 sm:h-20">
                <div className="absolute top-3 -right-6 sm:top-4 sm:-right-7 transform rotate-45  text-white text-[10px] sm:text-xs font-bold py-0.5 sm:py-1 px-6 sm:px-8 shadow-md">
                  {props.percentage}
                </div>
              </div>
            )}

            {/* Main Content - Centered */}
            <div className="flex flex-col gap-1 sm:gap-2 items-center text-center">
              {/* Credits and Price Row */}
              <div className="flex flex-wrap gap-1 sm:gap-2 items-center justify-center">
                <span className="text-white px-1 sm:px-2 py-0.5 text-xs sm:text-sm font-medium">
                  {props.creditscore} Credits
                </span>
                <span className="text-white text-xs sm:text-sm">-</span>
                <span className="text-white px-1 sm:px-2 py-0.5 text-xs sm:text-sm font-medium">
                  £{Number(props.amount).toFixed(2)}
                </span>
              </div>
              
              {/* Price per Credit Row */}
              <div className="flex gap-1 sm:gap-2 items-center">
                <span className="text-white/90 text-[10px] sm:text-xs">1 Credit</span>
                <span className="text-white/90 text-[10px] sm:text-xs">/</span>
                <span className="text-white/90 px-1 sm:px-2 py-0.5 text-[10px] sm:text-xs">
                  £{Number(props.perCreditAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CreditsCard>
        
        {/* Loading Overlay */}
        {props.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-pulse text-white font-bold">Loading...</div>
          </div>
        )}
      </div>
      
      {/* Buy Now Button */}
      <div className="flex justify-center mt-3">
        <button
          onClick={props.onBuyClick}
          disabled={props.isLoading}
          className="bg-primaryBlue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default CreditsDetailItemSection;