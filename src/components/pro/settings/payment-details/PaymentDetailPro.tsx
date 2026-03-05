import { useState } from "react";
import SettingsCardPro from "../SettingsCardPro";
import PaymentMethodSelector from "./PaymentMethodSelector";
import AddCardForm from "./AddCardForm";
import SavedCardsList from "./SavedCardsList";
import { SavedCard } from "./types";
import { buildApiUrl, API_ENDPOINTS } from "../../../../config/api";
import { fetcher } from "../../../../store/customer/home-context";
import useSWR from "swr";
import { toast } from "react-toastify";

function PaymentDetailPro() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cards from API
  const cardsUrl = buildApiUrl(API_ENDPOINTS.CARD_DETAILS);
  const { data: cardsData, mutate: mutateCards, isLoading: isCardsLoading } = useSWR(cardsUrl, fetcher);
  
  // Transform API data to SavedCard format
  const savedCards: SavedCard[] = (cardsData?.data || []).map((card: any) => ({
    id: card.id.toString(),
    type: card.type,
    brand: card.brand,
    last4: card.last4 || "",
    maskedNumber: card.masked_number || `XXXX  XXXX  XXXX  ${card.last4 || ""}`,
    cardholderName: card.cardholder_name || "",
    expiryMonth: card.expiry_month || "",
    expiryYear: card.expiry_year || "",
    nickname: card.nickname || "",
    isDefault: card.is_default || false,
    email: card.email,
    businessName: card.business_name,
    userBusinessId: card.user_business_id,
  }));

  const handleAddCard = async (cardData: Omit<SavedCard, "id">) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const formData = new FormData();
      formData.append("user_business_id", cardData.userBusinessId?.toString() || "");
      formData.append("type", cardData.type);
      if (cardData.brand) formData.append("brand", cardData.brand);
      if (cardData.last4) formData.append("last4", cardData.last4);
      if (cardData.maskedNumber) formData.append("masked_number", cardData.maskedNumber);
      if (cardData.cardholderName) formData.append("cardholder_name", cardData.cardholderName);
      if (cardData.expiryMonth) formData.append("expiry_month", cardData.expiryMonth);
      if (cardData.expiryYear) formData.append("expiry_year", cardData.expiryYear);
      if (cardData.businessName) formData.append("business_name", cardData.businessName);
      if (cardData.nickname) formData.append("nickname", cardData.nickname);
      formData.append("is_default", cardData.isDefault ? "1" : "0");
      if (cardData.email) formData.append("email", cardData.email);

      const response = await fetch(buildApiUrl(API_ENDPOINTS.CARD_DETAILS_CREATE), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === "1") {
        toast.success("Card added successfully", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        await mutateCards();
      } else {
        toast.error(result.message || "Failed to add card", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } catch (error) {
      toast.error("Failed to add card", {
        hideProgressBar: false,
        position: "bottom-left",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(buildApiUrl(`${API_ENDPOINTS.CARD_DETAILS_DELETE}/${cardId}/delete`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.status === "1") {
        toast.success("Card deleted successfully", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        await mutateCards();
      } else {
        toast.error(result.message || "Failed to delete card", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } catch (error) {
      toast.error("Failed to delete card", {
        hideProgressBar: false,
        position: "bottom-left",
      });
    } finally {
      setIsLoading(false);
      setDeleteCardId(null);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const formData = new FormData();
      formData.append("is_default", "1");

      const response = await fetch(buildApiUrl(`${API_ENDPOINTS.CARD_DETAILS_UPDATE}/${cardId}/update`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === "1") {
        toast.success("Default card updated", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        await mutateCards();
      } else {
        toast.error(result.message || "Failed to update default card", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } catch (error) {
      toast.error("Failed to update default card", {
        hideProgressBar: false,
        position: "bottom-left",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNickname = async (cardId: string, businessName: string, businessId?: number) => {
    const token = localStorage.getItem("token");
    
    try {
      const formData = new FormData();
      formData.append("business_name", businessName);
      if (businessId) {
        formData.append("user_business_id", businessId.toString());
      }

      const response = await fetch(buildApiUrl(`${API_ENDPOINTS.CARD_DETAILS_UPDATE}/${cardId}/update`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === "1") {
        await mutateCards();
      }
    } catch (error) {
      console.error("Failed to update business:", error);
    }
  };

  return (
    <SettingsCardPro>
      <div style={{ width: "100%", paddingLeft: "40px" }}>
        <div style={{ display: "flex", gap: "80px" }}>
          <div style={{ flex: "0 0 42%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "480px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />
              </div>
              <AddCardForm
                paymentMethod={paymentMethod}
                onAddCard={handleAddCard}
                isLoading={isLoading}
              />
            </div>
          </div>
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <SavedCardsList
              cards={savedCards}
              onDeleteCard={(id) => setDeleteCardId(id)}
              onSetDefault={handleSetDefault}
              onUpdateNickname={handleUpdateNickname}
              deleteCardId={deleteCardId}
              onConfirmDelete={handleDeleteCard}
              onCancelDelete={() => setDeleteCardId(null)}
              isLoading={isCardsLoading || isLoading}
            />
          </div>
        </div>
      </div>
    </SettingsCardPro>
  );
}

export default PaymentDetailPro;
