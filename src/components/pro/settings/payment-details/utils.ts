import { CardBrand } from "./types";

export function detectCardBrand(cardNumber: string): CardBrand | null {
  const cleaned = cardNumber.replace(/\D/g, "");

  if (cleaned.length === 0) return null;

  const firstDigit = cleaned[0];
  const firstTwo = cleaned.substring(0, 2);
  const firstFour = cleaned.substring(0, 4);

  if (firstDigit === "4") {
    return "visa";
  }

  if (
    (parseInt(firstTwo) >= 51 && parseInt(firstTwo) <= 55) ||
    (parseInt(firstFour) >= 2221 && parseInt(firstFour) <= 2720)
  ) {
    return "mastercard";
  }

  if (firstTwo === "34" || firstTwo === "37") {
    return "amex";
  }

  if (firstFour === "6011" || firstTwo === "65") {
    return "discover";
  }

  if (
    firstTwo === "60" ||
    firstTwo === "65" ||
    firstTwo === "81" ||
    firstTwo === "82"
  ) {
    return "rupay";
  }

  return null;
}

export function validateLuhn(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, "");

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  const formatted = cleaned.match(/.{1,4}/g)?.join("  ") || cleaned;
  return formatted;
}

export function validateExpiryDate(month: string, year: string): boolean {
  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return false;
  }

  const monthNum = parseInt(month);
  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const yearNum = parseInt(year);

  if (yearNum < currentYear) {
    return false;
  }

  if (yearNum === currentYear && monthNum < currentMonth) {
    return false;
  }

  return true;
}

export function getCvvLength(brand: CardBrand | null): number {
  if (brand === "amex") {
    return 4;
  }
  return 3;
}