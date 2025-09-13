import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

export interface StripeProviderProps {
  children: ReactNode;
}
const stripePromise = loadStripe("sk_test_tR3PYbcVNZZ796tH88S4VQ2u" || "");

export const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
