import CreditCard from "../../../../assets/creditspro.jpg";

function CreditsCard(props: { children: React.ReactNode }) {
  return (
    <div className="w-full items-center flex justify-center py-5">
      <div className="flex flex-col dark:bg-dimGray xl:w-full xs:w-full dark:text-white relative">
        <img src={CreditCard} alt="Credit Card" />
        <div className="absolute top-0 left-0 right-0 bottom-0">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default CreditsCard;
