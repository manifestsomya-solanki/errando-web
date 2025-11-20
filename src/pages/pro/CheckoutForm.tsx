import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return (
      <div className="p-4 text-center">
        <p className="text-textColor dark:text-white">
          Stripe payment is not configured. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <form>
      <PaymentElement />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CheckoutForm;
