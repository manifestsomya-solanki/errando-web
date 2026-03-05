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
import { SavedCard } from "../payment-details/types";

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
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isCardDropdownOpen, setIsCardDropdownOpen] = useState(false);
  const [autoTopUp, setAutoTopUp] = useState(false);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const transactionsPerPage = 10; // Fixed at 10 items per page as requested

  const url = buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?for_pro=1&show_only_count=1`);
  let { data: count } = useSWR(url, fetcher);
  count = count?.data;
  const availableCredits = count?.user?.available_credits ?? 0;

  const packagesUrl = buildApiUrl(API_ENDPOINTS.CREDIT_PACKAGES);
  const { data: packagesData, mutate: mutatePackages, isLoading: isLoadingPackages } = useSWR(packagesUrl, fetcher);
  const packages: CreditPackage[] = packagesData?.data || [];

  const cardsUrl = buildApiUrl(API_ENDPOINTS.CARD_DETAILS);
  const { data: cardsData } = useSWR(cardsUrl, fetcher);

  // Fetch transactions
  const transactionsUrl = buildApiUrl(`${API_ENDPOINTS.TRANSACTIONS}?page=${transactionsPage}&per_page=${transactionsPerPage}`);
  const { data: transactionsData, isLoading: isLoadingTransactions } = useSWR(
    isTransactionsOpen ? transactionsUrl : null,
    fetcher
  );
  const transactions = transactionsData?.data || [];
  const transactionsTotal = transactionsData?.total || 0;
  const transactionsLastPage = transactionsData?.last_page || 1;

  const savedCards: SavedCard[] = (cardsData?.data || []).map((card: any) => ({
    id: card.id.toString(),
    type: card.type,
    brand: card.brand,
    last4: card.last4 || "",
    maskedNumber: card.masked_number || `XXXX  XXXX  XXXX  ${card.last4 || ""}`,
    cardholderName: card.cardholder_name || "",
    expiryMonth: card.expiry_month || "",
    expiryYear: card.expiry_year || "",
    nickname: card.nickname || "",
    isDefault: card.is_default || false,
    email: card.email,
    businessName: card.business_name,
    userBusinessId: card.user_business_id,
  }));

  // Initialize selectedCardId with default card when cards are loaded
  useEffect(() => {
    if (savedCards.length > 0 && !selectedCardId) {
      const defaultCard = savedCards.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCardId(defaultCard.id);
      } else if (savedCards[0]) {
        setSelectedCardId(savedCards[0].id);
      }
    }
  }, [savedCards, selectedCardId]);

  // Sort cards: selected card first, then default, then others
  const sortedCards = [...savedCards].sort((a, b) => {
    if (selectedCardId) {
      if (a.id === selectedCardId) return -1;
      if (b.id === selectedCardId) return 1;
    }
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });

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
    if (credits < 1) return;
    const token = localStorage.getItem("token");
    if (!token || token === "{}" || token.trim() === "") {
      const bp = customCredits * 1.75;
      const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
      const finalPrice = bp - (bp * discount / 100);
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
      }).catch(() => null);
      if (!response) {
        const bp = customCredits * 1.75;
        const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
        const finalPrice = bp - (bp * discount / 100);
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
        const bp = customCredits * 1.75;
        const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
        const finalPrice = bp - (bp * discount / 100);
        setCustomPrice(finalPrice);
        setCustomDiscount(`${discount}%`);
      } else {
        if (response.status !== 401) {
          toast.error(data.message || "Failed to calculate price");
        }
      }
    } catch (error) {
      const bp = customCredits * 1.75;
      const discount = customCredits >= 126 ? 16 : customCredits >= 90 ? 14 : customCredits >= 60 ? 12 : customCredits >= 44 ? 8 : customCredits >= 30 ? 5 : 0;
      const finalPrice = bp - (bp * discount / 100);
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
      }).catch(() => null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCardDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown-container]')) {
          setIsCardDropdownOpen(false);
        }
      }
    };

    if (isCardDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCardDropdownOpen]);

  const renderBrandBadge = (brand: string) => {
    switch (brand) {
      case "visa":
        return (
          <span style={{
            background: "#1A1F71",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: "3px",
            fontFamily: "Arial, sans-serif",
            letterSpacing: "1px",
          }}>VISA</span>
        );
      case "mastercard":
        return (
          <svg width="28" height="18" viewBox="0 0 40 24" fill="none">
            <circle cx="14" cy="12" r="10" fill="#EB001B" />
            <circle cx="26" cy="12" r="10" fill="#F79E1B" />
            <path d="M20 5.3a9.96 9.96 0 0 0-3.73 6.7A9.96 9.96 0 0 0 20 18.7a9.96 9.96 0 0 0 3.73-6.7A9.96 9.96 0 0 0 20 5.3z" fill="#FF5F00" />
          </svg>
        );
      case "paypal":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "1px" }}>
            <svg width="14" height="16" viewBox="0 0 24 28" fill="none">
              <path d="M20.067 7.517c.08-.54.08-1.083-.024-1.637-.105-.495-.34-.963-.706-1.39C18.54 3.554 17.225 3.08 15.43 3.08h-5.41a.768.768 0 0 0-.758.648L7.07 19.165a.641.641 0 0 0 .633.74h2.554l-.18 1.14-.513 3.255a.56.56 0 0 0 .553.645h2.88a.672.672 0 0 0 .663-.567l.027-.143.525-3.332.034-.183a.672.672 0 0 1 .663-.567h.418c2.705 0 4.823-1.1 5.443-4.28.26-1.328.125-2.437-.56-3.216a2.668 2.668 0 0 0-.765-.548l.003-.024-.018-.01c.24-1.567.242-2.667.036-3.458z" fill="#253B80"/>
              <path d="M20.067 7.517a5.684 5.684 0 0 0-.695-.153 8.834 8.834 0 0 0-1.4-.102h-4.24a.637.637 0 0 0-.63.538l-.9 5.727-.026.166a.768.768 0 0 1 .758-.648h1.578c3.1 0 5.527-1.26 6.235-4.9.021-.108.04-.213.055-.315a3.783 3.783 0 0 0-.735-.313z" fill="#222D65"/>
            </svg>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#253B80" }}>Pay</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#179BD7" }}>Pal</span>
          </span>
        );
      case "amex":
        return (
          <span style={{
            background: "#006FCF",
            color: "#fff",
            fontSize: "9px",
            fontWeight: 800,
            padding: "2px 6px",
            borderRadius: "3px",
            fontFamily: "Arial, sans-serif",
          }}>AMEX</span>
        );
      case "discover":
        return (
          <span style={{
            background: "#FF6000",
            color: "#fff",
            fontSize: "9px",
            fontWeight: 800,
            padding: "2px 6px",
            borderRadius: "3px",
            fontFamily: "Arial, sans-serif",
          }}>DISCOVER</span>
        );
      default:
        return <span style={{ fontSize: "11px", fontWeight: 700, color: "#333" }}>{brand}</span>;
    }
  };

  return (
    <div className="px-4 sm:px-5">

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

      <div className="tracking-wider py-2 mb-4">
        <Heading
          variant="headingTitle"
          text={`Available Credits : ${availableCredits}`}
          headingclassname="!text-xl text-primaryYellow"
        />
      </div>

      <div className="rounded-lg py-4">
        {isLoadingPackages ? (
          <div className="text-center py-10 text-gray-500">Loading packages...</div>
        ) : displayPackages.length > 0 ? (
          <div
            className="grid gap-4 sm:gap-5 md:gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
          >
            {displayPackages.map((pkg, index) => {
              const actualPrice = pkg.discount_percentage > 0
                ? pkg.price / (1 - pkg.discount_percentage / 100)
                : pkg.price;
              return (
                <CreditsDetailItemSection
                  key={pkg.id}
                  packageId={pkg.id}
                  creditscore={pkg.credits}
                  amount={actualPrice}
                  perCreditAmount={pkg.price_per_credit}
                  percentage={index === 0 ? "" : (pkg.discount_percentage > 0 ? `${pkg.discount_percentage}%` : "")}
                  onBuyClick={() => handleBuyPackage(pkg)}
                  isLoading={false}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">No credit packages available. Please contact admin.</div>
        )}
      </div>

      <div className="mt-10">
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
                  if (credits > 0) handleCalculateCustomPrice();
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
                value={basePrice > 0 ? basePrice.toFixed(2) : (customPrice > 0 ? customPrice.toFixed(2) : "")}
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

        <div className="mb-4 flex flex-wrap gap-3 items-center">
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
            className="bg-slate-200 w-full xs:w-64"
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
            <span className="text-sm font-bold text-green-600">Promo Applied: {promoDiscount}% off</span>
          )}
        </div>

        {customCredits && (typeof customCredits === 'number' ? customCredits > 0 : false) && customPrice > 0 && (
          <div className="mb-4 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">Payment Summary</h3>
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

      <div style={{ 
        marginTop: "32px", 
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "clamp(40px, 8vw, 350px)", 
        alignItems: "flex-start"
      }}>
        {/* Left Side - Credits Transactions Button and Table */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "fit-content" }}>
          {/* Button Container - Fixed Width */}
          <div style={{ width: "180px", flexShrink: 0 }}>
            <Button
              onClick={() => setIsTransactionsOpen(!isTransactionsOpen)}
              buttonClassName="bg-primaryBlue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
            >
              Credits Transactions
            </Button>
            <span style={{ fontSize: "12px", color: "#888", marginTop: "6px", display: "block" }}>
              See how your credits have been used
            </span>
          </div>

          {/* Transactions Table - Separate container, can expand independently */}
          {isTransactionsOpen && (
            <div style={{ marginTop: "16px", border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff", width: "100%", minWidth: "600px", maxWidth: "800px", flexShrink: 0 }}>
              <div style={{ padding: "12px", borderBottom: "1px solid #e0e0e0", backgroundColor: "#f8f9fa" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>Transaction History</h3>
              </div>
              
              {isLoadingTransactions ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>No transactions found</div>
              ) : (
                <>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e0e0e0" }}>
                          <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#555", textTransform: "uppercase" }}>ID</th>
                          <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#555", textTransform: "uppercase" }}>Type</th>
                          <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#555", textTransform: "uppercase" }}>Credits</th>
                          <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#555", textTransform: "uppercase" }}>Message</th>
                          <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#555", textTransform: "uppercase" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction: any) => (
                          <tr key={transaction.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                            <td style={{ padding: "10px 12px", fontSize: "13px", color: "#333" }}>{transaction.id}</td>
                            <td style={{ padding: "10px 12px", fontSize: "13px" }}>
                              <span style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 600,
                                backgroundColor: transaction.status === "CREDIT" ? "#d4edda" : "#f8d7da",
                                color: transaction.status === "CREDIT" ? "#155724" : "#721c24"
                              }}>
                                {transaction.status}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: "13px", color: transaction.status === "CREDIT" ? "#28a745" : "#dc3545", fontWeight: 600 }}>
                              {transaction.status === "CREDIT" ? "+" : "-"}{transaction.credits}
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: "13px", color: "#666" }}>{transaction.message || "-"}</td>
                            <td style={{ padding: "10px 12px", fontSize: "13px", color: "#666" }}>
                              {new Date(transaction.created_at).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {transactionsLastPage > 1 && (
                    <div style={{ padding: "12px", borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Showing {((transactionsPage - 1) * transactionsPerPage) + 1} to {Math.min(transactionsPage * transactionsPerPage, transactionsTotal)} of {transactionsTotal} transactions
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          onClick={() => setTransactionsPage(1)}
                          disabled={transactionsPage === 1}
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: transactionsPage === 1 ? "#f5f5f5" : "#fff",
                            color: transactionsPage === 1 ? "#999" : "#333",
                            cursor: transactionsPage === 1 ? "not-allowed" : "pointer"
                          }}
                        >
                          First
                        </button>
                        <button
                          onClick={() => setTransactionsPage(prev => Math.max(1, prev - 1))}
                          disabled={transactionsPage === 1}
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: transactionsPage === 1 ? "#f5f5f5" : "#fff",
                            color: transactionsPage === 1 ? "#999" : "#333",
                            cursor: transactionsPage === 1 ? "not-allowed" : "pointer"
                          }}
                        >
                          Prev
                        </button>
                        <span style={{ fontSize: "12px", color: "#666", padding: "0 8px" }}>
                          Page {transactionsPage} of {transactionsLastPage}
                        </span>
                        <button
                          onClick={() => setTransactionsPage(prev => Math.min(transactionsLastPage, prev + 1))}
                          disabled={transactionsPage === transactionsLastPage}
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: transactionsPage === transactionsLastPage ? "#f5f5f5" : "#fff",
                            color: transactionsPage === transactionsLastPage ? "#999" : "#333",
                            cursor: transactionsPage === transactionsLastPage ? "not-allowed" : "pointer"
                          }}
                        >
                          Next
                        </button>
                        <button
                          onClick={() => setTransactionsPage(transactionsLastPage)}
                          disabled={transactionsPage === transactionsLastPage}
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: transactionsPage === transactionsLastPage ? "#f5f5f5" : "#fff",
                            color: transactionsPage === transactionsLastPage ? "#999" : "#333",
                            cursor: transactionsPage === transactionsLastPage ? "not-allowed" : "pointer"
                          }}
                        >
                          Last
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Side - Payment Card / Method Section (Fixed position on right) */}
        <div style={{ 
          minWidth: "300px", 
          maxWidth: "500px",
          width: "100%",
          justifySelf: "end"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px", gap: "8px" }}>
            <input
              type="checkbox"
              id="autoTopUpCheck"
              checked={autoTopUp}
              onChange={(e) => setAutoTopUp(e.target.checked)}
              style={{ width: "15px", height: "15px", accentColor: "#3F3D56" }}
            />
            <label htmlFor="autoTopUpCheck" style={{ fontSize: "13px", color: "#555", fontWeight: 500 }}>
              Auto Top up chosen package
            </label>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "#3F3D56",
                padding: "0 2px",
              }}
            >
              &#9998;
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", position: "relative" }}>
            <span style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#333",
              whiteSpace: "nowrap",
              paddingTop: "10px",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}>
              Payment Card / Method
            </span>

            <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
              {savedCards.length === 0 ? (
                <div style={{ textAlign: "center", padding: "16px 0", color: "#999", fontSize: "13px" }}>
                  No payment methods saved.
                </div>
              ) : (
                <div style={{ border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "visible", position: "relative" }}>
                  {sortedCards.map((card, index) => {
                    const isFirstCard = index === 0;
                    return (
                    <div
                      key={card.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 14px",
                        borderBottom: index < sortedCards.length - 1 ? "1px solid #e0e0e0" : "none",
                        background: selectedCardId === card.id ? "#f0f4ff" : "#fff",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onClick={() => setSelectedCardId(card.id)}
                    >
                      <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                        {renderBrandBadge(card.brand)}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, minWidth: 0 }}>
                        {card.type === "paypal" && card.email ? (
                          <span style={{
                            fontSize: "13px",
                            color: "#555",
                            fontFamily: "monospace, Arial, sans-serif",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {card.email}
                          </span>
                        ) : (
                          <span style={{
                            fontSize: "13px",
                            color: "#555",
                            fontFamily: "monospace, Arial, sans-serif",
                            letterSpacing: "1px",
                            flexShrink: 0,
                          }}>
                            ****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;{card.last4}
                          </span>
                        )}

                        {card.businessName && (
                          <span style={{
                            fontSize: "12px",
                            color: "#999",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "150px",
                          }} title={card.businessName}>
                            ( {card.businessName} )
                          </span>
                        )}
                      </div>

                      {isFirstCard && (
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }} data-dropdown-container>
                          {card.isDefault && (
                            <span style={{
                              fontSize: "12px",
                              color: "#3F3D56",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}>
                              Default
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsCardDropdownOpen(!isCardDropdownOpen);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "0 2px",
                              color: "#777",
                              lineHeight: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                          {isCardDropdownOpen && (
                            <div style={{
                              position: "absolute",
                              right: 0,
                              top: "100%",
                              marginTop: "4px",
                              width: "280px",
                              backgroundColor: "#fff",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              zIndex: 9999,
                              maxHeight: "150px",
                              overflowY: "auto",
                            }}>
                              {[...savedCards].sort((a, b) => {
                                // Selected card first
                                if (selectedCardId === a.id) return -1;
                                if (selectedCardId === b.id) return 1;
                                // Then default card
                                if (a.isDefault) return -1;
                                if (b.isDefault) return 1;
                                return 0;
                              }).map((dropdownCard, index, sortedArray) => (
                                <button
                                  key={dropdownCard.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCardId(dropdownCard.id);
                                    setIsCardDropdownOpen(false);
                                  }}
                                  style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "6px 10px",
                                    border: "none",
                                    background: selectedCardId === dropdownCard.id ? "#f0f4ff" : "#fff",
                                    cursor: "pointer",
                                    borderBottom: index < sortedArray.length - 1 ? "1px solid #e0e0e0" : "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <div style={{ flexShrink: 0 }}>
                                    {renderBrandBadge(dropdownCard.brand)}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    {dropdownCard.type === "paypal" && dropdownCard.email ? (
                                      <div style={{ fontSize: "12px", color: "#555" }}>{dropdownCard.email}</div>
                                    ) : (
                                      <div style={{ fontSize: "12px", color: "#555", fontFamily: "monospace" }}>
                                        ****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;{dropdownCard.last4}
                                      </div>
                                    )}
                                    {dropdownCard.businessName && (
                                      <div style={{ fontSize: "10px", color: "#999", marginTop: "1px" }}>
                                        ({dropdownCard.businessName})
                                      </div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        )}
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: "80px" }}></div>
    </div>
  );
}

export default CreditsDetailPage;