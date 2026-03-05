import React, { useState, useEffect } from "react";
import { detectCardBrand, validateLuhn, formatCardNumber, validateExpiryDate, getCvvLength } from "./utils";
import { CardBrand, SavedCard } from "./types";
import Button from "../../../UI/Button";
import { buildApiUrl, API_ENDPOINTS } from "../../../../config/api";
import { fetcher } from "../../../../store/customer/home-context";
import useSWR from "swr";

interface AddCardFormProps {
  paymentMethod: "card" | "paypal";
  onAddCard: (cardData: Omit<SavedCard, "id">) => void;
  isLoading?: boolean;
}

const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 400,
  color: "#000",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  marginBottom: "4px",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #ddd",
  padding: "8px 0",
  fontSize: "14px",
  color: "#000",
  outline: "none",
  background: "transparent",
  fontFamily: "inherit",
};

const errorStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#e74c3c",
  marginTop: "4px",
};

function AddCardForm({ paymentMethod, onAddCard, isLoading }: AddCardFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [cardType, setCardType] = useState<"credit" | "debit">("credit");
  const [detectedBrand, setDetectedBrand] = useState<CardBrand | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch businesses
  const userId = JSON.parse(localStorage.getItem("data") ?? "{}").id;
  const businessesUrl = buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?user_id=${userId}`);
  const { data: businessesData } = useSWR(businessesUrl, fetcher);
  const businesses = businessesData?.data || [];

  useEffect(() => {
    const cleaned = cardNumber.replace(/\D/g, "");
    if (cleaned.length > 0) {
      setDetectedBrand(detectCardBrand(cleaned));
    } else {
      setDetectedBrand(null);
    }
  }, [cardNumber]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedBusinessId) {
      newErrors.business = "Business is required";
    }

    if (paymentMethod === "card") {
      const cleaned = cardNumber.replace(/\D/g, "");

      if (!cleaned) {
        newErrors.cardNumber = "Card number is required";
      } else if (detectedBrand === "rupay") {
        newErrors.cardNumber = "Rupay cards are not supported. Please use Visa, Mastercard, Amex, or Discover.";
      } else if (cleaned.length < 13 || cleaned.length > 19) {
        newErrors.cardNumber = "Card number must be between 13 and 19 digits";
      } else if (!validateLuhn(cleaned)) {
        newErrors.cardNumber = "Invalid card number";
      }

      if (!expiryMonth || !expiryYear) {
        newErrors.expiry = "Expiry date is required";
      } else if (!validateExpiryDate(expiryMonth, expiryYear)) {
        newErrors.expiry = "Card is expired";
      }

      const cvvLen = getCvvLength(detectedBrand);
      if (!cvv) {
        newErrors.cvv = "CVV is required";
      } else if (cvv.length !== cvvLen) {
        newErrors.cvv = "Invalid CVV";
      }

      if (!cardholderName.trim()) {
        newErrors.cardholderName = "Name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const cleaned = cardNumber.replace(/\D/g, "");
    const last4 = cleaned.slice(-4);
    const selectedBusiness = businesses.find((b: any) => b.id.toString() === selectedBusinessId);

    onAddCard({
      type: paymentMethod === "paypal" ? "paypal" : cardType,
      brand: detectedBrand || (paymentMethod === "paypal" ? "paypal" : "visa"),
      last4,
      maskedNumber: "XXXX  XXXX  XXXX  " + last4,
      cardholderName,
      expiryMonth,
      expiryYear,
      nickname,
      isDefault: false,
      userBusinessId: parseInt(selectedBusinessId),
      businessName: selectedBusiness?.name || "",
    });
    
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvv("");
    setCardholderName("");
    setNickname("");
    setSelectedBusinessId("");
    setCardType("credit");
    setDetectedBrand(null);
    setErrors({});
    setIsSubmitting(false);
  };

  if (paymentMethod === "paypal") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 16px" }}>
          <path d="M7.076 21.337H5.47a.641.641 0 0 1-.633-.74L7.128 5.16a.768.768 0 0 1 .758-.648h5.41c1.795 0 3.11.474 3.908 1.41.364.427.6.894.706 1.39.112.518.113 1.135.004 1.886l-.013.08v.713l.556.315c.47.248.845.55 1.127.907.296.376.49.834.575 1.363.088.543.066 1.173-.064 1.87-.15.796-.394 1.49-.727 2.063a4.282 4.282 0 0 1-1.158 1.357 4.466 4.466 0 0 1-1.555.762c-.59.172-1.254.258-1.975.258h-.468a1.448 1.448 0 0 0-1.431 1.222l-.035.183-.592 3.756-.028.135a.165.165 0 0 1-.163.14H7.076z" fill="#253B80" />
          <path d="M19.093 9.016c-.01.065-.022.132-.035.2-.783 4.024-3.462 5.413-6.885 5.413H10.43a.846.846 0 0 0-.836.716l-.889 5.64-.252 1.6a.445.445 0 0 0 .44.516h3.087c.37 0 .683-.268.74-.633l.03-.157.588-3.727.037-.204a.746.746 0 0 1 .738-.632h.466c3.013 0 5.373-1.224 6.063-4.764.288-1.48.14-2.715-.623-3.583a2.98 2.98 0 0 0-.854-.612l.003.027z" fill="#179BD7" />
        </svg>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>PayPal integration coming soon</p>
        <button
          type="button"
          disabled
          style={{
            padding: "10px 30px",
            borderRadius: "20px",
            border: "none",
            background: "#ccc",
            color: "#fff",
            fontSize: "13px",
            cursor: "not-allowed",
          }}
        >
          Connect PayPal
        </button>
      </div>
    );
  }

  // Check if detected brand is Rupay
  const isRupay = detectedBrand === "rupay";

  return (
    <form onSubmit={handleSubmit}>
      {isRupay && cardNumber.length > 0 && (
        <div style={{
          background: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "24px",
          color: "#856404",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{ fontSize: "18px" }}>⚠️</span>
          <span>
            <strong>Rupay cards are not supported.</strong> Please use Visa, Mastercard, Amex, or Discover card.
          </span>
        </div>
      )}

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>SELECT BUSINESS</label>
        <select
          value={selectedBusinessId}
          onChange={(e) => setSelectedBusinessId(e.target.value)}
          style={{
            ...inputStyle,
            cursor: "pointer",
          }}
        >
          <option value="">Select a business</option>
          {businesses.map((business: any) => (
            <option key={business.id} value={business.id.toString()}>
              {business.name}
            </option>
          ))}
        </select>
        {errors.business && <span style={errorStyle}>{errors.business}</span>}
      </div>

      {paymentMethod === "card" && (
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>CARD TYPE</label>
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value as "credit" | "debit")}
            style={{
              ...inputStyle,
              cursor: "pointer",
              borderBottom: errors.cardType ? "1px solid #e74c3c" : "1px solid #ddd",
            }}
          >
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
          </select>
          {errors.cardType && <span style={errorStyle}>{errors.cardType}</span>}
        </div>
      )}

      {paymentMethod === "card" && (
        <>
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>CARD NUMBER</label>
        <input
          type="text"
          value={formatCardNumber(cardNumber)}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            if (raw.length <= 16) setCardNumber(raw);
          }}
          placeholder="1234  5678  3456  4567"
          style={inputStyle}
        />
        {errors.cardNumber && <span style={errorStyle}>{errors.cardNumber}</span>}
      </div>

      <div style={{ display: "flex", gap: "40px", marginBottom: "24px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>EXPIRY DATE</label>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <input
              type="text"
              value={expiryMonth}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                setExpiryMonth(v);
              }}
              placeholder="05"
              maxLength={2}
              style={{ ...inputStyle, width: "36px", textAlign: "center" }}
            />
            <span style={{ color: "#aaa", fontSize: "14px" }}>/</span>
            <input
              type="text"
              value={expiryYear}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                setExpiryYear(v);
              }}
              placeholder="21"
              maxLength={2}
              style={{ ...inputStyle, width: "36px", textAlign: "center" }}
            />
          </div>
          {errors.expiry && <span style={errorStyle}>{errors.expiry}</span>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>CVV</label>
          <input
            type="password"
            value={cvv}
            onChange={(e) => {
              const maxLen = getCvvLength(detectedBrand);
              const v = e.target.value.replace(/\D/g, "").slice(0, maxLen);
              setCvv(v);
            }}
            placeholder="567"
            style={inputStyle}
          />
          {errors.cvv && <span style={errorStyle}>{errors.cvv}</span>}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>CARDHOLDER NAME</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => {
            const v = e.target.value.replace(/[^a-zA-Z\s]/g, "");
            setCardholderName(v);
          }}
          placeholder="John Doe"
          style={inputStyle}
        />
        {errors.cardholderName && <span style={errorStyle}>{errors.cardholderName}</span>}
      </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={labelStyle}>CARD NICKNAME</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Card Nickname (Optional)"
              style={inputStyle}
            />
          </div>
        </>
      )}

      <div className="flex justify-center py-5">
        <Button
          type="submit"
          variant="filled"
          color="primary"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
          buttonClassName="!px-8 !py-3 !rounded-full"
          centerClassName="flex justify-center items-center"
        >
          Add Card
        </Button>
      </div>
    </form>
  );
}

export default AddCardForm;