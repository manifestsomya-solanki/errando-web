import React, { ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

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
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found");
      setIsLoading(false);
      toast.error("Please login again");
      return;
    }

    try {
      console.log("Closing request:", requestId, "FormData:", Object.fromEntries(formData));
      
      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}/${requestId}/close`),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );
      
      console.log("Response status:", res.status, "Content-Type:", res.headers.get("content-type"));
      
      let data: any = {};
      const contentType = res.headers.get("content-type");
      
      // Try to parse JSON response
      if (contentType && contentType.includes("application/json")) {
        try {
          const responseText = await res.text();
          console.log("Response body:", responseText);
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          data = { message: "Invalid response from server", status: "0" };
        }
      } else {
        // If not JSON, get text response
        const text = await res.text();
        console.error("Non-JSON response:", text);
        data = { message: text || `Server error occurred (${res.status})`, status: "0" };
      }
      
      console.log("Parsed data:", data);
      
      if (res.status === 200 && data.status === "1") {
        setError("");
        setIsLoading(false);
        toast.success(data.message || "Request closed successfully");
      } else {
        const errorMessage = data.message || data.error || `Failed to close request (Status: ${res.status})`;
        setError(errorMessage);
        setIsLoading(false);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Close request error:", error);
      const errorMessage = error.message || "Network error occurred";
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
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
