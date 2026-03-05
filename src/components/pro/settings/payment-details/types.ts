export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "rupay" | "paypal";
export type CardType = "credit" | "debit" | "paypal";

export interface SavedCard {
  id: string;
  type: CardType;
  brand: CardBrand;
  last4: string;
  maskedNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  nickname: string;
  isDefault: boolean;
  email?: string;
  businessName?: string;
  userBusinessId?: number;
}