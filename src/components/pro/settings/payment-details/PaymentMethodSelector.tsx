interface PaymentMethodSelectorProps {
  selectedMethod: "card" | "paypal";
  onMethodChange: (method: "card" | "paypal") => void;
}

function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        marginBottom: "32px",
      }}
      role="radiogroup"
      aria-label="Payment Method Selector"
    >
      <button
        type="button"
        role="radio"
        aria-checked={selectedMethod === "card"}
        aria-label="Pay with Card"
        onClick={() => onMethodChange("card")}
        style={{
          background: "none",
          border: "none",
          outline: "none",
          cursor: "pointer",
          padding: "8px 4px 12px 4px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: selectedMethod === "card" ? "2.5px solid #3F3D56" : "2.5px solid transparent",
          transition: "border-color 0.2s",
        }}
      >
        <svg width="60" height="20" viewBox="0 0 200 65" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="65" rx="6" fill="#1A1F71"/>
          <text x="100" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="3">
            VISA
          </text>
        </svg>

        <svg width="40" height="26" viewBox="0 0 100 62" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="62" rx="8" fill="#F7F7F7"/>
          <circle cx="38" cy="31" r="22" fill="#EB001B"/>
          <circle cx="62" cy="31" r="22" fill="#F79E1B"/>
          <path d="M50 14.5a22 22 0 0 0-8.2 16.5A22 22 0 0 0 50 47.5a22 22 0 0 0 8.2-16.5A22 22 0 0 0 50 14.5z" fill="#FF5F00"/>
        </svg>
      </button>

      <div
        style={{
          width: "1px",
          height: "32px",
          background: "#ccc",
        }}
        aria-hidden="true"
      ></div>

      <button
        type="button"
        role="radio"
        aria-checked={selectedMethod === "paypal"}
        aria-label="Pay with PayPal"
        onClick={() => onMethodChange("paypal")}
        style={{
          background: "none",
          border: "none",
          outline: "none",
          cursor: "pointer",
          padding: "8px 4px 12px 4px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: selectedMethod === "paypal" ? "2.5px solid #3F3D56" : "2.5px solid transparent",
          transition: "border-color 0.2s",
        }}
      >
        <div style={{
          background: "#f5f5f5",
          borderRadius: "4px",
          padding: "3px 6px",
          display: "inline-flex",
          alignItems: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M7.076 21.337H5.47a.641.641 0 0 1-.633-.74L7.128 5.16a.768.768 0 0 1 .758-.648h5.41c1.795 0 3.11.474 3.908 1.41.364.427.6.894.706 1.39.112.518.113 1.135.004 1.886l-.013.08v.713l.556.315c.47.248.845.55 1.127.907.296.376.49.834.575 1.363.088.543.066 1.173-.064 1.87-.15.796-.394 1.49-.727 2.063a4.282 4.282 0 0 1-1.158 1.357 4.466 4.466 0 0 1-1.555.762c-.59.172-1.254.258-1.975.258h-.468a1.448 1.448 0 0 0-1.431 1.222l-.035.183-.592 3.756-.028.135a.165.165 0 0 1-.163.14H7.076z" fill="#253B80" />
            <path d="M19.093 9.016c-.01.065-.022.132-.035.2-.783 4.024-3.462 5.413-6.885 5.413H10.43a.846.846 0 0 0-.836.716l-.889 5.64-.252 1.6a.445.445 0 0 0 .44.516h3.087c.37 0 .683-.268.74-.633l.03-.157.588-3.727.037-.204a.746.746 0 0 1 .738-.632h.466c3.013 0 5.373-1.224 6.063-4.764.288-1.48.14-2.715-.623-3.583a2.98 2.98 0 0 0-.854-.612l.003.027z" fill="#179BD7" />
          </svg>
        </div>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#253B80" }}>PayPal</span>
      </button>
    </div>
  );
}

export default PaymentMethodSelector;