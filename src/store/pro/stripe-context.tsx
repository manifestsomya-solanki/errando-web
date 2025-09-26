import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

export interface StripeProviderProps {
  children: ReactNode;
}

// Only load Stripe if a valid publishable key is provided
const STRIPE_PUBLISHABLE_KEY = ""; // Set this to your Stripe key when you want to enable Stripe
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

export const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // If no Stripe key is provided, just return children without Stripe Elements
  if (!stripePromise) {
    return <>{children}</>;
  }
  
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
