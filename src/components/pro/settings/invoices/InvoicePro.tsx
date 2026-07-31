import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import hello from "../../../../assets/pdf.svg";
import ErranddoLogo from "../../../../assets/Group 1@3x.png";
import SettingsCard from "../SettingsCardPro";
import DropDown from "./DropDown";
import { API_ENDPOINTS, buildApiUrl } from "../../../../config/api";
import { fetcher } from "../../../../store/customer/home-context";

type InvoiceItem = {
  id: number;
  invoice_number: string;
  business_name: string;
  amount: number | string;
  date?: string;
  invoice_date?: string;
  created_at?: string;
  // Additional fields for PDF generation
  billed_to_name?: string;
  billed_to_address?: string;
  billed_to_city?: string;
  billed_to_postcode?: string;
  payment_method?: string;
  items?: InvoiceLineItem[];
  subtotal?: number | string;
  discount?: number | string;
  vat?: number | string;
  vat_rate?: number;
  total?: number | string;
};

type InvoiceLineItem = {
  description: string;
  rate: number | string;
  quantity: number | string;
  amount: number | string;
};

type BusinessItem = {
  id: number;
  name: string;
};

type InvoicesResponse = {
  data?: InvoiceItem[];
  businesses?: BusinessItem[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  message?: string;
};

let erranddoLogoDataURLCache: string | null = null;
let erranddoLogoDataURLPromise: Promise<string> | null = null;

const imageUrlToDataURL = async (imageUrl: string): Promise<string> => {
  if (erranddoLogoDataURLCache) return erranddoLogoDataURLCache;
  if (erranddoLogoDataURLPromise) return erranddoLogoDataURLPromise;

  erranddoLogoDataURLPromise = fetch(imageUrl)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read image blob"));
        reader.readAsDataURL(blob);
      });
    })
    .then((dataURL) => {
      erranddoLogoDataURLCache = dataURL;
      return dataURL;
    })
    .finally(() => {
      erranddoLogoDataURLPromise = null;
    });

  return erranddoLogoDataURLPromise;
};

const InvoicePro = () => {
  const [businessFilter, setBusinessFilter] = useState<number | "all">("all");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const [invoicesPage, setInvoicesPage] = useState(1);
  const invoicesPerPage = 10;

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setInvoicesPage(1);
  }, [businessFilter]);

  const invoicesApiUrl = buildApiUrl(
    `${API_ENDPOINTS.INVOICES}?page=${invoicesPage}&per_page=${invoicesPerPage}${
      businessFilter !== "all" ? `&business_id=${businessFilter}` : ""
    }`
  );

  const { data: response, isLoading } = useSWR<InvoicesResponse>(
    invoicesApiUrl,
    fetcher
  );

  const invoices = response?.data || [];
  const businesses = response?.businesses || [];
  const currentPage = response?.current_page ?? 1;
  const lastPage = response?.last_page ?? 1;
  const totalInvoices = response?.total ?? invoices.length;

  const dropdownOptions = useMemo(
    () => [
      { id: "all" as const, name: "All Businesses" },
      ...businesses.map((business) => ({
        id: business.id,
        name: business.name,
      })),
    ],
    [businesses]
  );

  const formatAmount = (amount: number | string) => {
    const numericAmount =
      typeof amount === "number"
        ? amount
        : Number(String(amount).replace(/[^\d.-]/g, ""));

    if (Number.isNaN(numericAmount)) return "£0.00";
    return `£${numericAmount.toFixed(2)}`;
  };

  const formatAmountPDF = (amount: number | string): string => {
    const numericAmount =
      typeof amount === "number"
        ? amount
        : Number(String(amount).replace(/[^\d.-]/g, ""));

    if (Number.isNaN(numericAmount)) return "£ 0.00";
    return `£${numericAmount.toFixed(2)}`;
  };

  const formatDate = (invoice: InvoiceItem) => {
    const rawDate = invoice.date || invoice.invoice_date || invoice.created_at;
    if (!rawDate) return "-";

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return rawDate;

    return parsed.toLocaleDateString("en-GB");
  };

  const formatDatePDF = (invoice: InvoiceItem): string => {
    const rawDate = invoice.date || invoice.invoice_date || invoice.created_at;
    if (!rawDate) return "-";

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return rawDate;

    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = parsed.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ─── Draw the Errando Logo ───
  const drawLogo = (doc: jsPDF, x: number, y: number) => {
    // Draw the 3 orange horizontal lines (like a menu/hamburger icon with slant)
    doc.setDrawColor(232, 119, 34); // Orange
    doc.setFillColor(232, 119, 34);
    doc.setLineWidth(1.8);

    // Three orange lines (slightly angled)
    doc.line(x, y + 2, x + 18, y);
    doc.line(x, y + 7, x + 18, y + 5);
    doc.line(x, y + 12, x + 18, y + 10);

    // "ERRANDO" text in orange
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(232, 119, 34);
    doc.text("ERRANDO", x + 22, y + 12);

    // Running man icon in blue (simplified)
    const manX = x + 85;
    const manY = y + 1;
    doc.setDrawColor(0, 51, 153); // Blue
    doc.setFillColor(0, 51, 153);

    // Head (circle)
    doc.circle(manX + 2, manY + 1.5, 2, "F");

    // Body line
    doc.setLineWidth(0.8);
    doc.line(manX + 2, manY + 3.5, manX + 1, manY + 9);

    // Arms
    doc.line(manX - 1, manY + 5, manX + 5, manY + 6);

    // Legs
    doc.line(manX + 1, manY + 9, manX - 2, manY + 13);
    doc.line(manX + 1, manY + 9, manX + 4, manY + 13);
  };

  // ─── Generate PDF matching the exact Errando invoice layout ───
  const generateInvoicePDF = async (invoice: InvoiceItem) => {
    const doc = new jsPDF("p", "mm", "a4");
    const leftMargin = 20;
    const rightMargin = 190;

    // ════════════════════════════════════════════
    // HEADER SECTION - Logo + Company Info
    // ════════════════════════════════════════════

    // Draw logo image (left side), fallback to custom draw on failure.
    try {
      const logoDataURL = await imageUrlToDataURL(ErranddoLogo);
      doc.addImage(logoDataURL, "PNG", leftMargin, 16, 50, 8);
    } catch {
      drawLogo(doc, leftMargin, 15);
    }

    // Company Info (right side)
    const rightTextX = rightMargin;
    let rightY = 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    // "Errando.com" clickable link
    doc.setTextColor(0, 51, 153); // Blue for links
    const websiteText = "Errando.com";
    const websiteWidth = doc.getTextWidth(websiteText);
    const websiteStartX = rightTextX - websiteWidth;
    doc.textWithLink(websiteText, websiteStartX, rightY, {
      url: "https://erranddo.com/",
    });
    rightY += 4.5;

    doc.setTextColor(60, 60, 60);
    doc.text("24 Albert Embankment", rightTextX, rightY, { align: "right" });
    rightY += 4.5;
    doc.text("London", rightTextX, rightY, { align: "right" });
    rightY += 4.5;
    doc.text("SE1 7GJ", rightTextX, rightY, { align: "right" });
    rightY += 4.5;

    doc.setTextColor(0, 51, 153);
    const emailText = "support@erranddo.com";
    const emailWidth = doc.getTextWidth(emailText);
    const emailStartX = rightTextX - emailWidth;
    doc.textWithLink(emailText, emailStartX, rightY, {
      url: "mailto:support@erranddo.com",
    });
    rightY += 4.5;

    doc.setTextColor(60, 60, 60);
    doc.text("Phone: +447957014082", rightTextX, rightY, { align: "right" });

    // ════════════════════════════════════════════
    // BILLING INFO SECTION
    // ════════════════════════════════════════════

    const billingHeaderY = 58;

    // "Billed To" / "Date Issued" / "Invoice Number" headers (row 1)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text("Billed To", leftMargin, billingHeaderY);

    const dateLabelX = 90;
    doc.text("Date Issued", dateLabelX, billingHeaderY);

    const invoiceNumLabelX = 145;
    doc.text("Invoice Number", invoiceNumLabelX, billingHeaderY);

    // Values (row 2)
    const billingFirstLineY = billingHeaderY + 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    const billedToName = invoice.billed_to_name || invoice.business_name || "-";
    const billedToCity = invoice.billed_to_city || "";
    const billedToPostcode = invoice.billed_to_postcode || "";

    doc.text(billedToName, leftMargin, billingFirstLineY);
    doc.text(formatDatePDF(invoice), dateLabelX, billingFirstLineY);
    doc.text(invoice.invoice_number || "-", invoiceNumLabelX, billingFirstLineY);

    // Payment Method (dedicated rows, so it never overlaps Date Issued)
    const paymentHeaderY = billingFirstLineY + 6;
    const paymentValueY = paymentHeaderY + 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text("Payment Method", dateLabelX, paymentHeaderY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(invoice.payment_method || "Visa ****0478", dateLabelX, paymentValueY);

    // Billed To left details (city/postcode)
    let billedToLeftY = billingFirstLineY + 5;
    if (billedToCity) {
      doc.text(billedToCity, leftMargin, billedToLeftY);
      billedToLeftY += 5;
    }
    if (billedToPostcode) {
      doc.text(billedToPostcode, leftMargin, billedToLeftY);
      billedToLeftY += 5;
    }

    const billingBottomY = Math.max(billedToLeftY, paymentValueY);

    // ════════════════════════════════════════════
    // LINE ITEMS TABLE
    // ════════════════════════════════════════════

    let tableY = billingBottomY + 10;

    // Horizontal line above header
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, tableY, rightMargin, tableY);

    tableY += 7;

    // Table headers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);

    const colDescription = leftMargin;
    const colRate = 95;
    const colQuantity = 125;
    const colAmount = 165;

    doc.text("DESCRIPTION", colDescription, tableY);
    doc.text("RATE", colRate, tableY);
    doc.text("QUANTITY", colQuantity, tableY);
    doc.text("AMOUNT", colAmount, tableY);

    tableY += 4;

    // Horizontal line below header
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, tableY, rightMargin, tableY);

    tableY += 8;

    // Table rows
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    const lineItems: InvoiceLineItem[] = invoice.items || [
      {
        description: "Errando Credits",
        rate: invoice.subtotal
          ? (
              Number(
                typeof invoice.subtotal === "string"
                  ? invoice.subtotal.replace(/[^\d.-]/g, "")
                  : invoice.subtotal
              ) / 30
            ).toFixed(2)
          : "1.09",
        quantity: "30",
        amount: invoice.subtotal || invoice.amount,
      },
    ];

    lineItems.forEach((item) => {
      doc.text(String(item.description), colDescription, tableY);
      doc.text(String(item.rate), colRate, tableY);
      doc.text(String(item.quantity), colQuantity, tableY);
      doc.text(formatAmountPDF(item.amount), colAmount, tableY);
      tableY += 7;
    });

    // ════════════════════════════════════════════
    // TOTALS SECTION
    // ════════════════════════════════════════════

    tableY += 5;

    // Horizontal line above totals
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, tableY, rightMargin, tableY);

    tableY += 10;

    const labelX = 125;
    const valueX = rightMargin;

    // Subtotal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text("Subtotal", labelX, tableY, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(
      formatAmountPDF(invoice.subtotal || invoice.amount),
      valueX,
      tableY,
      { align: "right" }
    );

    tableY += 6;

    // Discount
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Discount", labelX, tableY, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(
      formatAmountPDF(invoice.discount || 0),
      valueX,
      tableY,
      { align: "right" }
    );

    tableY += 6;

    // VAT
    const vatRate = invoice.vat_rate || 20;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`VAT (${vatRate}%)`, labelX, tableY, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const subtotalNum =
      typeof invoice.subtotal === "number"
        ? invoice.subtotal
        : Number(
            String(invoice.subtotal || invoice.amount).replace(/[^\d.-]/g, "")
          );
    const discountNum =
      typeof invoice.discount === "number"
        ? invoice.discount
        : Number(String(invoice.discount || 0).replace(/[^\d.-]/g, ""));
    const vatAmount =
      invoice.vat !== undefined
        ? invoice.vat
        : ((subtotalNum - discountNum) * vatRate) / 100;

    doc.text(formatAmountPDF(vatAmount), valueX, tableY, {
      align: "right",
    });

    tableY += 3;

    // Blue line above total
    doc.setDrawColor(0, 51, 153);
    doc.setLineWidth(0.5);
    doc.line(labelX - 10, tableY, rightMargin, tableY);

    tableY += 7;

    // TOTAL
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("TOTAL", labelX, tableY, { align: "right" });

    const totalAmount =
      invoice.total !== undefined
        ? invoice.total
        : subtotalNum - discountNum + Number(vatAmount);
    doc.text(formatAmountPDF(totalAmount), valueX, tableY, {
      align: "right",
    });

    // ════════════════════════════════════════════
    // FOOTER
    // ════════════════════════════════════════════

    const footerY = 270;

    // Orange horizontal line
    doc.setDrawColor(232, 119, 34);
    doc.setLineWidth(0.8);
    doc.line(leftMargin, footerY, rightMargin, footerY);

    // "Thank you for your business" text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(232, 119, 34);
    doc.text("Thank you for your business", leftMargin, footerY + 10);

    // Save
    const fileName = `invoice-${invoice.invoice_number || invoice.id}.pdf`;
    doc.save(fileName);
  };

  // ─── Fetch invoice detail and generate PDF ───
  const getParsedToken = () => {
    const token = localStorage.getItem("token");
    if (!token || token === "{}" || token.trim() === "") return null;

    try {
      const tokenObj = JSON.parse(token);
      if (tokenObj && typeof tokenObj === "object" && tokenObj.token) {
        return tokenObj.token;
      }
      return token.trim();
    } catch {
      return token.trim();
    }
  };

  const onDownloadInvoice = async (id: number) => {
    try {
      const parsedToken = getParsedToken();
      if (!parsedToken) {
        toast.error("Unable to download invoice. Please login again.");
        return;
      }

      // Try to fetch detailed invoice data first
      try {
        const detailResponse = await fetch(
          buildApiUrl(`${API_ENDPOINTS.INVOICES}/${id}`),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${parsedToken}`,
              Accept: "application/json",
            },
          }
        );

        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          const invoiceDetail = detailData?.data || detailData;

          // Merge with our list data
          const listInvoice = invoices.find((inv) => inv.id === id);
          const mergedInvoice = {
            ...listInvoice,
            ...invoiceDetail,
          } as InvoiceItem;

          await generateInvoicePDF(mergedInvoice);
          return;
        }
      } catch {
        // Fall through to use list data
      }

      // Fallback: use the data we already have from the list
      const invoiceFromList = invoices.find((inv) => inv.id === id);
      if (invoiceFromList) {
        await generateInvoicePDF(invoiceFromList);
      } else {
        toast.error("Invoice data not found.");
      }
    } catch {
      toast.error("Failed to download invoice. Please try again.");
    }
  };

  const shouldShowPagination = totalInvoices > invoicesPerPage;
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= lastPage;
  const rangeStart = totalInvoices === 0 ? 0 : (currentPage - 1) * invoicesPerPage + 1;
  const rangeEnd = Math.min(currentPage * invoicesPerPage, totalInvoices);

  const buttonBaseClass =
    "h-[38px] min-w-[38px] px-3 flex items-center justify-center text-sm font-medium transition-colors rounded-md border border-slate-200 dark:border-dimGray bg-gray-100 dark:bg-dimGray text-black dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed";

  if (isSmallScreen) {
    return (
      <SettingsCard>
        <DropDown
          options={dropdownOptions}
          value={businessFilter}
          onChange={setBusinessFilter}
        />
        {isLoading ? (
          <div className="my-6 text-center text-gray-500">
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="my-6 text-center text-gray-500">
            No invoices found for the selected business.
          </div>
        ) : (
          invoices.map((item) => (
            <div
              key={item.id}
              className="my-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-700"
            >
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Date:
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  {formatDate(item)}
                </span>
              </div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Invoice:
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  {item.invoice_number || "-"}
                </span>
              </div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Business:
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  {item.business_name || "-"}
                </span>
              </div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Amount:
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {formatAmount(item.amount)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Download:
                </span>
                <img
                  src={hello}
                  alt="PDF Icon"
                  className="h-8 w-8 cursor-pointer transition-transform hover:scale-110"
                  onClick={() => onDownloadInvoice(item.id)}
                />
              </div>
            </div>
          ))
        )}
        {shouldShowPagination && (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <button
              className={buttonBaseClass}
              onClick={() => setInvoicesPage(1)}
              disabled={isFirstPage}
              aria-label="First page"
            >
              {"<<"}
            </button>
            <button
              className={buttonBaseClass}
              onClick={() => setInvoicesPage((prev) => Math.max(1, prev - 1))}
              disabled={isFirstPage}
              aria-label="Previous page"
            >
              {"<"}
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
              {rangeStart} to {rangeEnd} of {totalInvoices}
            </span>
            <button
              className={buttonBaseClass}
              onClick={() => setInvoicesPage((prev) => Math.min(lastPage, prev + 1))}
              disabled={isLastPage}
              aria-label="Next page"
            >
              {">"}
            </button>
            <button
              className={buttonBaseClass}
              onClick={() => setInvoicesPage(lastPage)}
              disabled={isLastPage}
              aria-label="Last page"
            >
              {">>"}
            </button>
          </div>
        )}
      </SettingsCard>
    );
  }

  return (
    <SettingsCard>
      <DropDown
        options={dropdownOptions}
        value={businessFilter}
        onChange={setBusinessFilter}
      />
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Invoice Number</th>
                <th className="py-2">Business</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Download</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {isLoading ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={5}>
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={5}>
                    No invoices found for the selected business.
                  </td>
                </tr>
              ) : (
                invoices.map((item, index) => (
                  <tr
                    key={item.id}
                    className={
                      index % 2 === 0
                        ? "bg-red-100 dark:bg-slate-600"
                        : "dark:bg-slate-400"
                    }
                  >
                    <td className="py-2">{formatDate(item)}</td>
                    <td className="py-2">{item.invoice_number || "-"}</td>
                    <td className="py-2">{item.business_name || "-"}</td>
                    <td className="py-2">{formatAmount(item.amount)}</td>
                    <td className="py-2 flex justify-center">
                      <img
                        src={hello}
                        alt="PDF Icon"
                        className="h-8 w-8 cursor-pointer transition-transform hover:scale-110"
                        onClick={() => onDownloadInvoice(item.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {shouldShowPagination && (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <button
              className={buttonBaseClass}
              onClick={() => setInvoicesPage(1)}
              disabled={isFirstPage}
              aria-label="First page"
            >
              {"<<"}
            </button>
            <button
              className={buttonBaseClass}
              onClick={() => setInvoicesPage((prev) => Math.max(1, prev - 1))}
              disabled={isFirstPage}
              aria-label="Previous page"
            >
              {"<"}
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
              {rangeStart} to {rangeEnd} of {totalInvoices}
            </span>
            <button
              className={buttonBaseClass}
              onClick={() => setInvoicesPage((prev) => Math.min(lastPage, prev + 1))}
              disabled={isLastPage}
              aria-label="Next page"
            >
              {">"}
            </button>
            <button
              className={buttonBaseClass}
              onClick={() => setInvoicesPage(lastPage)}
              disabled={isLastPage}
              aria-label="Last page"
            >
              {">>"}
            </button>
          </div>
        )}
      </div>
    </SettingsCard>
  );
};

export default InvoicePro;