import SavedCardItem from "./SavedCardItem";
import { SavedCard } from "./types";

interface SavedCardsListProps {
  cards: SavedCard[];
  onDeleteCard: (id: string) => void;
  onSetDefault: (id: string) => void;
  onUpdateNickname: (id: string, businessName: string, businessId?: number) => void;
  deleteCardId: string | null;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
  isLoading?: boolean;
}

function SavedCardsList({
  cards,
  onDeleteCard,
  onSetDefault,
  onUpdateNickname,
  deleteCardId,
  onConfirmDelete,
  onCancelDelete,
  isLoading,
}: SavedCardsListProps) {
  return (
    <div>
      <h3 style={{
        fontSize: "16px",
        fontWeight: 600,
        color: "#3F3D56",
        marginBottom: "24px",
        textAlign: "center",
      }}>
        Saved Cards
      </h3>

      {isLoading ? (
        <p style={{ color: "#aaa", textAlign: "center", padding: "40px 0", fontSize: "14px" }}>
          Loading cards...
        </p>
      ) : cards.length === 0 ? (
        <p style={{ color: "#aaa", textAlign: "center", padding: "40px 0", fontSize: "14px" }}>
          No saved cards yet.
        </p>
      ) : (
        cards.map((card) => (
          <SavedCardItem
            key={card.id}
            card={card}
            onDelete={() => onDeleteCard(card.id)}
            onSetDefault={() => onSetDefault(card.id)}
                onUpdateNickname={(businessName: string, businessId?: number) => onUpdateNickname(card.id.toString(), businessName, businessId)}
          />
        ))
      )}

      {deleteCardId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "32px",
              width: "420px",
              maxWidth: "90vw",
              textAlign: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={onCancelDelete}
              style={{
                position: "absolute",
                top: "12px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#999",
                lineHeight: 1,
              }}
            >
              &#10005;
            </button>
            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#333",
              marginBottom: "28px",
              marginTop: "8px",
              lineHeight: 1.5,
            }}>
              Are you sure you want to delete this card?
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={onCancelDelete}
                style={{
                  padding: "10px 32px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#e74c3c",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onConfirmDelete(deleteCardId)}
                style={{
                  padding: "10px 32px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#27ae60",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedCardsList;