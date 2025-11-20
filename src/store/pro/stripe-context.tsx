import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

export interface StripeProviderProps {
  children: ReactNode;
}

// Only load Stripe if a valid publishable key is provided
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""; // Set this to your Stripe key when you want to enable Stripe
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : Promise.resolve(null);

export const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Always wrap in Elements to provide context
  // Components should check for stripe/elements availability before using PaymentElement
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
