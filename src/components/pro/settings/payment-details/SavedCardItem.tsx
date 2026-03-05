import React, { useState } from "react";
import { SavedCard } from "./types";
import { buildApiUrl, API_ENDPOINTS } from "../../../../config/api";
import { fetcher } from "../../../../store/customer/home-context";
import useSWR from "swr";

interface SavedCardItemProps {
  card: SavedCard;
  onDelete: () => void;
  onSetDefault: () => void;
  onUpdateNickname: (businessName: string, businessId?: number) => void;
}

function SavedCardItem({ card, onDelete, onSetDefault, onUpdateNickname }: SavedCardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    card.userBusinessId?.toString() || ""
  );
  const [isHovered, setIsHovered] = useState(false);

  // Fetch businesses for dropdown
  const userId = JSON.parse(localStorage.getItem("data") ?? "{}").id;
  const businessesUrl = buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?user_id=${userId}`);
  const { data: businessesData } = useSWR(businessesUrl, fetcher);
  const businesses = businessesData?.data || [];

  const handleSave = () => {
    if (!selectedBusinessId) {
      setIsEditing(false);
      return;
    }
    const selectedBusiness = businesses.find((b: any) => b.id.toString() === selectedBusinessId);
    const businessName = selectedBusiness?.name || "";
    const businessId = selectedBusiness?.id;
    onUpdateNickname(businessName, businessId);
    setIsEditing(false);
  };

  const getCardBackground = (): React.CSSProperties => {
    if (card.type === "paypal") {
      return {
        background: "#fff",
        border: "1.5px solid #ddd",
        color: "#333",
      };
    }
    if (card.type === "debit") {
      return {
        background: "linear-gradient(135deg, #4a6cf7 0%, #e07a7a 100%)",
        color: "#fff",
      };
    }
    return {
      background: "linear-gradient(135deg, #3b3b98 0%, #6a5af9 100%)",
      color: "#fff",
    };
  };

  const renderBrandLogo = () => {
    if (card.brand === "visa") {
      return (
        <div style={{
          background: "#fff",
          borderRadius: "4px",
          padding: "3px 8px",
          display: "inline-flex",
          alignItems: "center",
        }}>
          <svg width="44" height="14" viewBox="0 0 60 20" fill="none">
            <text x="2" y="16" fill="#1A1F71" fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="1">VISA</text>
          </svg>
        </div>
      );
    }
    if (card.brand === "mastercard") {
      return (
        <svg width="36" height="24" viewBox="0 0 40 24" fill="none">
          <circle cx="14" cy="12" r="10" fill="#EB001B" />
          <circle cx="26" cy="12" r="10" fill="#F79E1B" />
          <path d="M20 5.3a9.96 9.96 0 0 0-3.73 6.7A9.96 9.96 0 0 0 20 18.7a9.96 9.96 0 0 0 3.73-6.7A9.96 9.96 0 0 0 20 5.3z" fill="#FF5F00" />
        </svg>
      );
    }
    if (card.brand === "paypal") {
      return (
        <svg width="28" height="32" viewBox="0 0 24 28" fill="none">
          <path d="M20.067 7.517c.08-.54.08-1.083-.024-1.637-.105-.495-.34-.963-.706-1.39C18.54 3.554 17.225 3.08 15.43 3.08h-5.41a.768.768 0 0 0-.758.648L7.07 19.165a.641.641 0 0 0 .633.74h2.554l-.18 1.14-.513 3.255a.56.56 0 0 0 .553.645h2.88a.672.672 0 0 0 .663-.567l.027-.143.525-3.332.034-.183a.672.672 0 0 1 .663-.567h.418c2.705 0 4.823-1.1 5.443-4.28.26-1.328.125-2.437-.56-3.216a2.668 2.668 0 0 0-.765-.548l.003-.024-.018-.01c.24-1.567.242-2.667.036-3.458z" fill="#253B80"/>
          <path d="M20.067 7.517a5.684 5.684 0 0 0-.695-.153 8.834 8.834 0 0 0-1.4-.102h-4.24a.637.637 0 0 0-.63.538l-.9 5.727-.026.166a.768.768 0 0 1 .758-.648h1.578c3.1 0 5.527-1.26 6.235-4.9.021-.108.04-.213.055-.315a3.783 3.783 0 0 0-.735-.313z" fill="#222D65"/>
          <path d="M13.102 13.527a.637.637 0 0 1 .63-.538h4.24c.502 0 .97.033 1.4.102.248.04.488.09.72.153.228.062.44.135.64.22.085-.547.084-1.164-.024-1.87a5.53 5.53 0 0 0-.706-1.39c-.798-.936-2.113-1.41-3.908-1.41h-5.41a.768.768 0 0 0-.758.648L7.735 25.08a.641.641 0 0 0 .633.74h2.554l1.28-8.126.9-5.727z" fill="#253B80"/>
        </svg>
      );
    }
    return null;
  };

  const cardStyle = getCardBackground();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            ...cardStyle,
            borderRadius: "12px",
            padding: "18px 22px",
            width: "280px",
            minHeight: card.type === "paypal" ? "110px" : "160px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
            position: "relative",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!card.isDefault && (
            <button
              type="button"
              onClick={onDelete}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "none",
                border: "none",
                color: card.type === "paypal" ? "#333" : "#fff",
                fontSize: "20px",
                cursor: "pointer",
                fontWeight: "normal",
                padding: "0",
                width: "auto",
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.2s",
                zIndex: 10,
              }}
            >
              &#10005;
            </button>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: "0.5px",
            }}>
              {card.type === "paypal" ? "Connected Account" : card.type === "credit" ? "Credit Card" : "Debit Card"}
            </span>
            {renderBrandLogo()}
          </div>

          {card.type === "paypal" ? (
            <div style={{ marginTop: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: 500 }}>{card.email}</span>
            </div>
          ) : (
            <>
              <div style={{
                margin: "14px 0 10px 0",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "3px",
                fontFamily: "monospace, Arial, sans-serif",
              }}>
                XXXX{"    "}XXXX{"    "}XXXX{"    "}{card.last4}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "8px", opacity: 0.7, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>cardholder name</span>
                  <span style={{ fontSize: "11px", fontWeight: 500 }}>{card.cardholderName}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontSize: "8px", opacity: 0.7, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>expiry date</span>
                  <span style={{ fontSize: "11px", fontWeight: 500 }}>{card.expiryMonth} / {card.expiryYear}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "4px", alignSelf: "flex-end" }}>
          {isEditing ? (
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setSelectedBusinessId(card.userBusinessId?.toString() || "");
                  setIsEditing(false);
                }
              }}
              autoFocus
              style={{
                fontSize: "12px",
                color: "#3F3D56",
                border: "1px solid #3F3D56",
                borderRadius: "4px",
                padding: "2px 8px",
                outline: "none",
                width: "160px",
                cursor: "pointer",
                background: "#fff",
              }}
            >
              <option value="">Select business</option>
              {businesses.map((business: any) => (
                <option key={business.id} value={business.id.toString()}>
                  {business.name}
                </option>
              ))}
            </select>
          ) : (
            <>
              <span style={{
                fontSize: "12px",
                color: "#3F3D56",
                fontStyle: "normal",
              }}>
                {card.businessName || card.nickname || ""}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedBusinessId(card.userBusinessId?.toString() || "");
                  setIsEditing(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  fontSize: "13px",
                  color: "#3F3D56",
                  lineHeight: 1,
                }}
              >
                &#9998;
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "flex-start",
        alignSelf: "center",
      }}>
        {card.isDefault ? (
          <span style={{
            fontSize: "14px",
            color: "#3F3D56",
            fontWeight: 500,
          }}>
            Default
          </span>
        ) : (
          <button
            type="button"
            onClick={onSetDefault}
            style={{
              background: "none",
              border: "none",
              color: "#3F3D56",
              fontSize: "13px",
              cursor: "pointer",
              padding: 0,
              fontWeight: 500,
            }}
          >
            Choose default
          </button>
        )}
      </div>
    </div>
  );
}

export default SavedCardItem;