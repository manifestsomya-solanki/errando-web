import React, { useState, useContext } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import { UserData } from "../../models/user";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

//auth response type declaration
type ContactResponseType = {
  data?: UserData;
  contactUpdate: (formData: FormData) => void;
  verification: (formData: FormData) => void;
  isLoading: boolean;
  error: string;
};

//auth context initialization
export const ContactContext = createContext<ContactResponseType>({
  contactUpdate: (d) => {
    console.log(d);
  },
  verification: (d) => {
    console.log(d);
  },
  isLoading: false,
  error: "",
});

const ContactContextProvider = (props: { children: React.ReactNode }) => {
  const initialToken = localStorage.getItem("token");
  const [data, setData] = useState(
    initialToken ? JSON.parse(initialToken) : undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //forgot-password
  const sendOtp = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.USER_SEND_OTP),
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      setError("");
      setTimeout(() => {
        setIsLoading(false);
      });
      const data: any = await res.json();
      if (data.status === "1") {
        // toast.success("Email has been successfully sent !");
      } else {
        setError(data.message);
        // toast.error(data.error);
      }
    } else {
      const data: any = await res.json();
      setError(data.message);
      setIsLoading(false);
      // toast.error(data.message);
    }
  };

  //reset-password
  const resetPassword = async (formData: FormData) => {
    setIsLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.SETTINGS_CHANGE_PASSWORD),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (res.status === 200) {
      setError("");
      setTimeout(() => {
        setIsLoading(false);
      });
      const data: any = await res.json();
      if (data.status === "1") {
        // navigate("/home");
        // toast.success("Password has been  successfully changed !");
      } else {
        // toast.error(data.message);
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      // toast.error(data.message);
    }
  };

  return (
    <ContactContext.Provider
      value={{
        data: data,
        isLoading: isLoading,
        contactUpdate: sendOtp,
        verification: resetPassword,
        error: error,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export function useContact() {
  const contactCtx = useContext(ContactContext);
  return contactCtx;
}
export default ContactContextProvider;
