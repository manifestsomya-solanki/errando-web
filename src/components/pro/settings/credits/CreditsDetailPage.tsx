import { useState } from "react";
import CreditsDetailItemSection from "./CreditsDetailItemSection";
import Heading from "../../../UI/Heading";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";
import useSWR, { mutate } from "swr";
import { fetcher } from "../../../../store/customer/home-context";
import { buildApiUrl, API_ENDPOINTS } from "../../../../config/api";
import PurchaseCreditsModal from "../../../../layout/pro-models/PurchaseCreditsModal";
import { toast } from "react-toastify";

interface CreditPackage {
  id: number;
  credits: number;
  price: number;
  price_per_credit: number;
  discount_percentage: number;
}

function CreditsDetailPage() {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [customCredits, setCustomCredits] = useState<number | "">("");
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [customDiscount, setCustomDiscount] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [isVerifyingPromo, setIsVerifyingPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  // Fetch available credits
  const url = buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?for_pro=1&show_only_count=1`);
  let { data: count } = useSWR(url, fetcher);
  count = count?.data;
  const availableCredits = count?.user?.available_credits ?? 0;

  // Fetch credit packages
  const packagesUrl = buildApiUrl(API_ENDPOINTS.CREDIT_PACKAGES);
  const { data: packagesData, mutate: mutatePackages, isLoading: isLoadingPackages } = useSWR(packagesUrl, fetcher);
  const packages: CreditPackage[] = packagesData?.data || [];

  // No initial calculation - user must enter credits first

  // Handle package purchase
  const handleBuyPackage = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    setIsPurchaseModalOpen(true);
  };

  // Handle promo code verification
  const handleVerifyPromoCode = async () => {
    if (!promoCode || promoCode.trim() === "") {
      toast.error("Please enter a promo code");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || token === "{}" || token.trim() === "") {
      toast.error("Please login to use promo code");
      return;
    }

    setIsVerifyingPromo(true);
    try {
      let parsedToken = token?.trim();
      try {
        const tokenObj = JSON.parse(token || "{}");
        if (tokenObj && typeof tokenObj === 'object' && tokenObj.token) {
          parsedToken = tokenObj.token;
        }
      } catch (e) {
        parsedToken = token?.trim();
      }

      // Verify promo code
      const response = await fetch(buildApiUrl(API_ENDPOINTS.PROMO_CODE_VERIFY), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ code: promoCode.toUpperCase().trim() }),
      }).catch(() => null);

      if (!response) {
        toast.error("Network error. Please try again.");
        setIsVerifyingPromo(false);
        return;
      }

      const data = await response.json();

      if (response.ok && data.status === "1") {
        setPromoDiscount(data.data.discount || 0);
        setPromoApplied(true);
        toast.success(`Promo code applied! ${data.data.discount}% discount`);
        // Recalculate price with promo discount
        if (customCredits && typeof customCredits === 'number' && customCredits > 0) {
          await handleCalculateCustomPrice();
        }
      } else {
        toast.error(data.message || "Invalid or expired promo code");
        setPromoDiscount(0);
        setPromoApplied(false);
      }
    } catch (error) {
      toast.error("Failed to verify promo code");
      setPromoDiscount(0);
      setPromoApplied(false);
    } finally {
      setIsVerifyingPromo(false);
    }
  };

  // Handle custom credits calculation
  const handleCalculateCustomPrice = async () => {
    if (!customCredits || (typeof customCredits === 'number' && customCredits < 1)) {
      return; // Don't show error for invalid input, just return
    }

    const credits = typeof customCredits === 'number' ? customCredits : parseInt(customCredits.toString()) || 0;
    if (credits < 1) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || token === "{}" || token.trim() === "") {
      // User not logged in, use default calculation
      const basePrice = customCredits * 1.75;
      const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
      const finalPrice = basePrice - (basePrice * discount / 100);
      setCustomPrice(finalPrice);
      setCustomDiscount(`${discount}%`);
      return;
    }

    setIsCalculating(true);
    try {
      let parsedToken = token?.trim();
      try {
        const tokenObj = JSON.parse(token || "{}");
        if (tokenObj && typeof tokenObj === 'object' && tokenObj.token) {
          parsedToken = tokenObj.token;
        }
      } catch (e) {
        parsedToken = token?.trim();
      }

      const response = await fetch(buildApiUrl(API_ENDPOINTS.CREDIT_PACKAGES_CALCULATE), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ 
          credits: credits,
          promo_code: promoApplied ? promoCode.toUpperCase().trim() : null
        }),
      }).catch(() => {
        // Silently catch fetch errors
        return null;
      });

      if (!response) {
        // Use default calculation on network error
        const basePrice = customCredits * 1.75;
        const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
        const finalPrice = basePrice - (basePrice * discount / 100);
        setCustomPrice(finalPrice);
        setCustomDiscount(`${discount}%`);
        setIsCalculating(false);
        return;
      }

      const data = await response.json();

      if (response.ok && data.status === "1") {
        let finalPrice = data.data.final_price;
        let discountPercentage = data.data.discount_percentage;
        
        // Apply promo code discount if applied
        if (promoApplied && promoDiscount > 0) {
          const promoDiscountAmount = (finalPrice * promoDiscount) / 100;
          finalPrice = finalPrice - promoDiscountAmount;
          discountPercentage = discountPercentage + promoDiscount;
        }
        
        setCustomPrice(finalPrice);
        setCustomDiscount(`${discountPercentage.toFixed(2)}%`);
      } else if (response.status === 401) {
        // User not authenticated, use default calculation
        const basePrice = customCredits * 1.75;
        const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
        const finalPrice = basePrice - (basePrice * discount / 100);
        setCustomPrice(finalPrice);
        setCustomDiscount(`${discount}%`);
      } else {
        // Only show error for non-401 errors
        if (response.status !== 401) {
          toast.error(data.message || "Failed to calculate price");
        }
      }
    } catch (error) {
      // Silently handle network errors
      const basePrice = customCredits * 1.75;
      const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
      const finalPrice = basePrice - (basePrice * discount / 100);
      setCustomPrice(finalPrice);
      setCustomDiscount(`${discount}%`);
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle purchase confirmation
  const handleConfirmPurchase = async () => {
    if (!selectedPackage && !customCredits) {
      toast.error("Please select a package or enter custom credits");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || token === "{}" || token.trim() === "") {
      toast.error("Please login to purchase credits");
      setIsPurchaseModalOpen(false);
      return;
    }

    setIsPurchasing(true);
    try {
      let parsedToken = token?.trim();
      try {
        const tokenObj = JSON.parse(token || "{}");
        if (tokenObj && typeof tokenObj === 'object' && tokenObj.token) {
          parsedToken = tokenObj.token;
        }
      } catch (e) {
        parsedToken = token?.trim();
      }

      const requestBody: any = {};
      if (selectedPackage) {
        requestBody.package_id = selectedPackage.id;
      } else {
        const credits = typeof customCredits === 'number' ? customCredits : parseInt(customCredits.toString()) || 0;
        requestBody.credits = credits;
        requestBody.price = customPrice;
      }
      if (promoApplied && promoCode) {
        requestBody.promo_code = promoCode.toUpperCase().trim();
      }

      const response = await fetch(buildApiUrl(API_ENDPOINTS.CREDIT_PACKAGES_PURCHASE), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      }).catch(() => {
        // Silently catch fetch errors
        return null;
      });

      if (!response) {
        toast.error("Network error. Please try again.");
        setIsPurchasing(false);
        return;
      }

      const data = await response.json();

      if (response.ok && data.status === "1") {
        toast.success(`Successfully purchased ${data.data.credits_purchased} credits!`);
        setIsPurchaseModalOpen(false);
        setSelectedPackage(null);
        // Refresh available credits
        mutate(url);
        mutatePackages();
      } else if (response.status === 401) {
        toast.error("Please login to purchase credits");
        setIsPurchaseModalOpen(false);
      } else {
        toast.error(data.message || "Failed to purchase credits");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  // Only use packages from API (admin-set values)
  const displayPackages = packages;

  return (
    <div>
      {isPurchaseModalOpen && (
        <PurchaseCreditsModal
          onCancel={() => {
            setIsPurchaseModalOpen(false);
            setSelectedPackage(null);
          }}
          onConfirm={handleConfirmPurchase}
          credits={selectedPackage?.credits || customCredits}
          price={selectedPackage?.price || customPrice}
          isLoading={isPurchasing}
        />
      )}

      <div className=" tracking-wider px-5 py-2">
        <Heading
          variant="headingTitle"
          text={`Available Credits : ${availableCredits}`}
          headingclassname="!text-xl text-primaryYellow"
        />
      </div>
      <div className="grid xl:grid-cols-4 xs:grid-cols-1 md:grid-cols-2 gap-6">
        {isLoadingPackages ? (
          // Loading state with blur effect only on card content
          Array.from({ length: 8 }).map((_, index) => (
            <CreditsDetailItemSection
              key={index}
              packageId={0}
              creditscore={0}
              amount={0}
              perCreditAmount={0}
              percentage=""
              onBuyClick={() => {}}
              isLoading={true}
            />
          ))
        ) : displayPackages.length > 0 ? (
          displayPackages.map((pkg) => (
            <CreditsDetailItemSection
              key={pkg.id}
              packageId={pkg.id}
              creditscore={pkg.credits}
              amount={pkg.price}
              perCreditAmount={pkg.price_per_credit}
              percentage={pkg.discount_percentage > 0 ? `${pkg.discount_percentage}%` : ""}
              onBuyClick={() => handleBuyPackage(pkg)}
              isLoading={false}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No credit packages available. Please contact admin.
          </div>
        )}
      </div>

      {/* Custom Credit/Price Calculator */}
      <div className="mt-10 px-5">
        <Heading
          variant="subTitle"
          text="Credit/ Price Calculator"
          headingclassname="!text-lg mb-4"
        />
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="calcType"
              checked
              readOnly
              className="cursor-pointer"
        />
            <label className="text-sm font-medium">Credits:</label>
            <Input
              type="number"
              value={customCredits}
              onChange={(e) => {
                const value = e.target.value === "" ? "" : parseInt(e.target.value) || "";
                setCustomCredits(value);
                setPromoApplied(false);
                setPromoDiscount(0);
              }}
              onBlur={() => {
                const credits = typeof customCredits === 'number' ? customCredits : parseInt(customCredits.toString()) || 0;
                if (credits > 0) {
                  handleCalculateCustomPrice();
                }
              }}
              className="w-24"
              min="1"
              placeholder=""
        />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Price:</label>
            <Input
              type="text"
              value={customPrice > 0 ? `£ ${customPrice.toFixed(2)}` : ""}
              readOnly
              placeholder="Enter credits to calculate"
              className="w-40 bg-gray-100"
        />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Discount:</label>
            <span className="text-sm font-bold text-green-600">{customDiscount || "-"}</span>
          </div>
        </div>
        <div className="mb-4 flex gap-3 items-center">
          <Input
            placeholder="Have a promo code?"
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value);
              setPromoApplied(false);
              setPromoDiscount(0);
            }}
            className="bg-slate-200 xs:w-64"
            disabled={isVerifyingPromo}
          />
          <Button 
            onClick={handleVerifyPromoCode}
            buttonClassName="h-10 w-20"
            disabled={isVerifyingPromo || !promoCode.trim()}
            loading={isVerifyingPromo}
          >
            Enter
          </Button>
          {promoApplied && (
            <span className="text-sm font-bold text-green-600">
              Promo Applied: {promoDiscount}% off
            </span>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => {
              setSelectedPackage(null);
              setIsPurchaseModalOpen(true);
            }}
            buttonClassName="bg-primaryBlue hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            disabled={!customCredits || (typeof customCredits === 'number' && customCredits < 1) || isCalculating}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreditsDetailPage;
