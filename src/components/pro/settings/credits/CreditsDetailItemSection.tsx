import CreditsCard from "./CreditsCard";
import Outright from "../../../../assets/outrightcredits.svg";
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
    <div>
      <div className="relative">
        <CreditsCard
          children={
            <div className={props.isLoading ? "blur-sm" : ""}>
              <div className="relative xs:py-6 md:py-8 lg:py-8 xl:py-5 2xl:py-7">
                {props.percentage && (
                <div className="absolute top-6 right-6 transform translate-x-3 -translate-y-3 rotate-45">
                  <Heading
                    text={`${props.percentage}`}
                    variant="subTitle"
                    headingclassname="text-white xl:text-md md:text-sm px-1 py-0.5 font-bold"
                  />
                </div>
                )}
              </div>
              <div className="flex flex-col gap-4 items-center">
                <div className="flex felx-wrap gap-3">
                  <Heading
                    variant="subTitle"
                    headingclassname="w-auto text-white dark:text-white"
                    text={`${props.creditscore} Credits`}
                  />
                  <Heading
                    variant="subTitle"
                    headingclassname="w-auto text-white dark:text-white"
                    text={"-"}
                  />
                  <Heading
                    variant="subTitle"
                    headingclassname="w-auto text-white dark:text-white"
                    text={`$${props.amount}`}
                  />
                </div>
                <div className="flex gap-3">
                  <Heading
                    variant="smallTitle"
                    headingclassname="w-auto text-white dark:text-slate-100"
                    text={"1 Credit "}
                  />
                  <Heading
                    variant="smallTitle"
                    headingclassname="w-auto text-white dark:text-slate-100"
                    text={"/"}
                  />
                  <Heading
                    variant="smallTitle"
                    headingclassname="w-auto text-white dark:text-slate-100"
                    text={`£${props.perCreditAmount}`}
                  />
                </div>
              </div>
            </div>
          }
        />
        {props.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-pulse text-white font-bold">Loading...</div>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <button
          onClick={props.onBuyClick}
          disabled={props.isLoading}
          className="bg-primaryBlue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default CreditsDetailItemSection;
