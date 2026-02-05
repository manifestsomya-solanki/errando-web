import { useState, useEffect } from "react";
import CreditsDetailItemSection from "./CreditsDetailItemSection";
import Heading from "../../../UI/Heading";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";
import useSWR, { mutate } from "swr";
import { fetcher } from "../../../../store/customer/home-context";
import { buildApiUrl, API_ENDPOINTS } from "../../../../config/api";
import PurchaseCreditsModal from "../../../../layout/pro-models/PurchaseCreditsModal";
import { toast } from "react-toastify";
import CreditIcon from "../../../../assets/Credit.png";

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
  const [basePrice, setBasePrice] = useState<number>(0);
  const [tierDiscountAmount, setTierDiscountAmount] = useState<number>(0);
  const [tierDiscountPercentage, setTierDiscountPercentage] = useState<number>(0);
  const [promoDiscountAmount, setPromoDiscountAmount] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [isVerifyingPromo, setIsVerifyingPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  const url = buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?for_pro=1&show_only_count=1`);
  let { data: count } = useSWR(url, fetcher);
  count = count?.data;
  const availableCredits = count?.user?.available_credits ?? 0;

  const packagesUrl = buildApiUrl(API_ENDPOINTS.CREDIT_PACKAGES);
  const { data: packagesData, mutate: mutatePackages, isLoading: isLoadingPackages } = useSWR(packagesUrl, fetcher);
  const packages: CreditPackage[] = packagesData?.data || [];

  useEffect(() => {
    if (!customCredits || (typeof customCredits === 'string' && customCredits === "") || (typeof customCredits === 'number' && customCredits < 1)) {
      setPromoCode("");
      setPromoApplied(false);
      setPromoDiscount(0);
      setPromoDiscountAmount(0);
    }
  }, [customCredits]);

  useEffect(() => {
    if (basePrice > 0 && customCredits && (typeof customCredits === 'number' ? customCredits > 0 : false)) {
      const priceAfterTierDiscount = basePrice - tierDiscountAmount;
      
      if (promoApplied && promoDiscount > 0) {
        const calculatedPromoDiscountAmount = (priceAfterTierDiscount * promoDiscount) / 100;
        const finalPrice = priceAfterTierDiscount - calculatedPromoDiscountAmount;
        
        setPromoDiscountAmount(calculatedPromoDiscountAmount);
        setCustomPrice(finalPrice);
      } else if (!promoApplied) {
        setPromoDiscountAmount(0);
        setCustomPrice(priceAfterTierDiscount);
      }
    }
  }, [promoApplied, promoDiscount, basePrice, tierDiscountAmount]);

  const handleBuyPackage = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    setIsPurchaseModalOpen(true);
  };

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
        const discountValue = data.data.discount || 0;
        setPromoDiscount(discountValue);
        setPromoApplied(true);
        toast.success(`Promo code applied! ${discountValue}% discount`);
        if (basePrice > 0 && tierDiscountAmount >= 0) {
          const priceAfterTierDiscount = basePrice - tierDiscountAmount;
          const calculatedPromoDiscountAmount = (priceAfterTierDiscount * discountValue) / 100;
          const finalPrice = priceAfterTierDiscount - calculatedPromoDiscountAmount;
          setPromoDiscountAmount(calculatedPromoDiscountAmount);
          setCustomPrice(finalPrice);
        } else if (customCredits && typeof customCredits === 'number' && customCredits > 0) {
          await handleCalculateCustomPrice();
        }
      } else {
        if (data.message && data.message.toLowerCase().includes('expired')) {
          toast.error("Code expired");
        } else {
          toast.error(data.message || "Invalid promo code");
        }
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

  const handleCalculateCustomPrice = async () => {
    if (!customCredits || (typeof customCredits === 'number' && customCredits < 1)) {
      return;
    }

    const credits = typeof customCredits === 'number' ? customCredits : (typeof customCredits === 'string' ? parseInt(customCredits) || 0 : 0);
    if (credits < 1) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || token === "{}" || token.trim() === "") {
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
        return null;
      });

      if (!response) {
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
        const calculatedBasePrice = data.data.base_price || (credits * 1.75);
        const calculatedTierDiscount = data.data.discount_percentage || 0;
        const calculatedTierDiscountAmount = data.data.discount_amount || 0;
        
        setBasePrice(calculatedBasePrice);
        setTierDiscountPercentage(calculatedTierDiscount);
        setTierDiscountAmount(calculatedTierDiscountAmount);
        
        let finalPrice = data.data.final_price;
        let discountPercentage = calculatedTierDiscount;
        
        const priceAfterTierDiscount = finalPrice;
        
        if (promoApplied && promoDiscount > 0) {
          const calculatedPromoDiscountAmount = (priceAfterTierDiscount * promoDiscount) / 100;
          setPromoDiscountAmount(calculatedPromoDiscountAmount);
          finalPrice = priceAfterTierDiscount - calculatedPromoDiscountAmount;
          discountPercentage = discountPercentage + promoDiscount;
        } else {
          setPromoDiscountAmount(0);
        }
        
        setCustomPrice(finalPrice);
        setCustomDiscount(`${discountPercentage.toFixed(2)}%`);
      } else if (response.status === 401) {
        const basePrice = customCredits * 1.75;
        const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
        const finalPrice = basePrice - (basePrice * discount / 100);
        setCustomPrice(finalPrice);
        setCustomDiscount(`${discount}%`);
      } else {
        if (response.status !== 401) {
          toast.error(data.message || "Failed to calculate price");
        }
      }
    } catch (error) {
      const basePrice = customCredits * 1.75;
      const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
      const finalPrice = basePrice - (basePrice * discount / 100);
      setCustomPrice(finalPrice);
      setCustomDiscount(`${discount}%`);
    } finally {
      setIsCalculating(false);
    }
  };

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
        const credits = typeof customCredits === 'number' ? customCredits : (typeof customCredits === 'string' ? parseInt(customCredits) || 0 : 0);
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
          credits={selectedPackage?.credits || (typeof customCredits === 'number' ? customCredits : 0)}
          price={selectedPackage?.price || customPrice}
          basePrice={selectedPackage 
            ? (selectedPackage.discount_percentage > 0 
              ? selectedPackage.price / (1 - selectedPackage.discount_percentage / 100) 
              : selectedPackage.price)
            : basePrice}
          tierDiscountAmount={selectedPackage 
            ? (selectedPackage.discount_percentage > 0 
              ? (selectedPackage.price / (1 - selectedPackage.discount_percentage / 100)) - selectedPackage.price
              : 0)
            : tierDiscountAmount}
          tierDiscountPercentage={selectedPackage ? selectedPackage.discount_percentage : tierDiscountPercentage}
          promoDiscount={promoApplied ? promoDiscount : 0}
          promoCode={promoApplied ? promoCode : ""}
          isLoading={isPurchasing}
        />
      )}

      <div className="tracking-wider px-5 py-2">
        <Heading
          variant="headingTitle"
          text={`Available Credits : ${availableCredits}`}
          headingclassname="!text-xl text-primaryYellow"
        />
      </div>
      <div className="grid xl:grid-cols-4 xs:grid-cols-1 md:grid-cols-2 gap-6">
        {isLoadingPackages ? (
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

      <div className="mt-10 px-5">
        <Heading
          variant="subTitle"
          text="Credit/ Price Calculator"
          headingclassname="!text-lg mb-4 font-bold"
        />
        <div className="flex flex-wrap items-start gap-4 sm:gap-6 mb-4">
  <div className="flex flex-col min-w-[100px]">
    <span className="text-sm ml-6 font-medium text-gray-700 mb-2">Credits</span>
    <div className="flex items-center">
      <img src={CreditIcon} alt="Credit" className="w-5 h-5 mr-1 flex-shrink-0" />
      <input
        type="number"
        value={customCredits}
        onChange={(e) => {
          const value = e.target.value === "" ? "" : parseInt(e.target.value) || "";
          setCustomCredits(value);
          setPromoApplied(false);
          setPromoDiscount(0);
        }}
        onBlur={() => {
          const credits = typeof customCredits === 'number' ? customCredits : (typeof customCredits === 'string' ? parseInt(customCredits) || 0 : 0);
          if (credits > 0) {
            handleCalculateCustomPrice();
          }
        }}
        className="w-16 sm:w-20 h-8 px-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        min="1"
        placeholder=""
      />
    </div>
  </div>
  <span className="text-gray-400 text-lg mt-7">-</span>
  <div className="flex flex-col min-w-[120px]">
    <span className="text-sm ml-3 font-medium text-gray-700 mb-2">Price</span>
    <div className="flex items-center">
      <span className="text-sm font-medium text-gray-700 mr-1 flex-shrink-0">£</span>
      <input
        type="text"
        value={customPrice > 0 ? customPrice.toFixed(2) : ""}
        readOnly
        placeholder=""
        className="w-16 sm:w-20 h-8 px-2 text-center border border-gray-300 rounded bg-gray-50 focus:outline-none"
      />
    </div>
  </div>
  <div className="flex flex-col min-w-[80px]">
    <span className="text-sm font-medium text-gray-700 mb-2">Discount</span>
    <span className="text-sm font-bold text-green-600 h-8 flex items-center">{customDiscount || "-"}</span>
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
              setPromoDiscountAmount(0);
            }}
            className="bg-slate-200 xs:w-64"
            disabled={isVerifyingPromo || !customCredits || (typeof customCredits === 'number' && customCredits < 1) || (typeof customCredits === 'string' && customCredits === "")}
          />
          <Button 
            onClick={handleVerifyPromoCode}
            buttonClassName="h-10 w-20"
            disabled={isVerifyingPromo || !promoCode.trim() || !customCredits || (typeof customCredits === 'number' && customCredits < 1) || (typeof customCredits === 'string' && customCredits === "")}
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
        
        {customCredits && (typeof customCredits === 'number' ? customCredits > 0 : false) && customPrice > 0 && (
          <div className="mb-4 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Base Price</span>
                <span className="text-gray-900 dark:text-white font-medium">£{basePrice.toFixed(2)}</span>
              </div>
              
              {tierDiscountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                  <span>Discount ({tierDiscountPercentage.toFixed(2)}%):</span>
                  <span>-£{tierDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              
              {promoApplied && promoDiscount > 0 && promoDiscountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                  <span>Promo Code ({promoCode}) ({promoDiscount.toFixed(2)}%):</span>
                  <span>-£{promoDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-gray-300 dark:border-gray-600 font-bold text-lg">
                <span className="text-gray-900 dark:text-white">Total Payable Amount:</span>
                <span className="text-primaryBlue dark:text-blue-400">£{customPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => {
              setSelectedPackage(null);
              setIsPurchaseModalOpen(true);
            }}
            buttonClassName="bg-primaryBlue hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            disabled={isPurchasing || !customCredits || (typeof customCredits === 'number' && customCredits < 1) || isCalculating}
            loading={isPurchasing}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreditsDetailPage;