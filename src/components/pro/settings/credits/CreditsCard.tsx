import CreditCard from "../../../../assets/creditspro.jpg";

function CreditsCard(props: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      {/* Card with fixed aspect ratio */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: '62.5%' }}>
        {/* Background Image */}
        <img 
          src={CreditCard} 
          alt="Credit Card" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-3 sm:p-4">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default CreditsCard;