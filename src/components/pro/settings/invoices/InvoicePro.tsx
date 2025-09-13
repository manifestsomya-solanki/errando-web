import React from "react";
import hello from "../../../../assets/pdf.svg";
import SettingsCard from "../SettingsCardPro";
import DropDown from "./DropDown";
import Pdf from "../../../../pdf/dhwani updated resum.pdf";

const InvoicePro = () => {
  const data = [
    {
      invoiceNumber: "0846436857",
      business: "TV Guru LTD",
      amount: "£28.00",
      download: "18/12/2021",
    },
    {
      invoiceNumber: "0846436857",
      business: "TV Guru LTD",
      amount: "£28.00",
      download: "18/12/2021",
    },
    {
      invoiceNumber: "0846436857",
      business: "TV Guru LTD",
      amount: "£28.00",
      download: "18/12/2021",
    },
    {
      invoiceNumber: "0846436857",
      business: "TV Guru LTD",
      amount: "£28.00",
      download: "18/12/2021",
    },
    {
      invoiceNumber: "0846436857",
      business: "TV Guru LTD",
      amount: "£28.00",
      download: "18/12/2021",
    },
  ];
  const isSmallScreen = window.innerWidth < 640;
  const onButtonClick = () => {
    fetch(Pdf).then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        const alink = document.createElement("a");
        alink;
        alink.href = fileURL;
        alink.download = Pdf;
        alink.click();
      });
    });
  };
  if (isSmallScreen) {
    return (
      <SettingsCard>
        <DropDown />
        {data.map((item, index) => (
          <div key={index} className="my-4 ">
            <div>Date: {item.download}</div>
            <div>Invoice: {item.invoiceNumber}</div>
            <div>Business: {item.business}</div>
            <div>Amount: {item.amount}</div>
            <div className="flex gap-3">
              Download: <img src={hello} alt="PDF Icon" />
            </div>
          </div>
        ))}
      </SettingsCard>
    );
  }

  return (
    <SettingsCard>
      <DropDown />
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
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-red-100 dark:bg-slate-600 "
                      : " dark:bg-slate-400"
                  }
                >
                  <td className="py-2">{item.download}</td>
                  <td className="py-2">{item.invoiceNumber}</td>
                  <td className="py-2">{item.business}</td>
                  <td className="py-2">{item.amount}</td>
                  <td className="py-2 pl-28" onClick={onButtonClick}>
                    <img src={hello} alt="PDF Icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SettingsCard>
  );
};

export default InvoicePro;
