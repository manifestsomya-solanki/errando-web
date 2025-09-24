import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

export interface StripeProviderProps {
  children: ReactNode;
}

// Get Stripe publishable key from environment variables (Vite format)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Only create stripe promise if we have a valid publishable key
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

export const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // If no Stripe key is provided, just render children without Stripe Elements
  if (!STRIPE_PUBLISHABLE_KEY || !stripePromise) {
    return <>{children}</>;
  }
  
  return <Elements stripe={stripePromise}>{children}</Elements>;
};