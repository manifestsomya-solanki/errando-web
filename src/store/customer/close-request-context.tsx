import React, { ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";

type CloseRequestType = {
  closeRequestHandler: (formData: FormData, requestId: number) => Promise<void>;
  isLoading: boolean;
  error: string;
};

export const CloseRequestContext = React.createContext<CloseRequestType>({
  closeRequestHandler: async (formData: FormData, requestId: number) => {
    console.log(formData);
  },
  isLoading: false,
  error: "",
});

const CloseRequestProvider = (props: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const closeRequestHandler = async (formData: FormData, requestId: number) => {
    const token = localStorage.getItem("token") ?? "{}";
    setError("");
    setIsLoading(true);
    const res = await fetch(
      `https://erranddo.com/admin/api/v1/user-requests/${requestId}/close`,
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
      setIsLoading(false);
      const data: any = await res.json();
      if (data.status === "1") {
        toast.success(data.message);
      } else {
        setError(data.message);
        toast.error(data.error);
      }
    } else {
      const data: any = await res.json();
      setError(data.message);
      setIsLoading(false);
    }
  };
  return (
    <CloseRequestContext.Provider
      value={{
        closeRequestHandler: closeRequestHandler,
        isLoading: isLoading,
        error: error,
      }}
    >
      {props.children}
    </CloseRequestContext.Provider>
  );
};

export function useCloseRequest() {
  const reviewCtx = useContext(CloseRequestContext);
  return reviewCtx;
}
export default CloseRequestProvider;
