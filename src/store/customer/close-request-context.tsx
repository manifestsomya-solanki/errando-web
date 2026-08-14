import React, { ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

type CloseRequestType = {
  closeRequestHandler: (
    formData: FormData,
    requestId: number
  ) => Promise<boolean>;
  isLoading: boolean;
  error: string;
};

async function refreshProjectLists() {
  try {
    await mutate(
      (key) =>
        typeof key === "string" &&
        key.includes(API_ENDPOINTS.USER_REQUESTS) &&
        key.includes("user_id="),
      undefined,
      { revalidate: true }
    );
  } catch {
    // Ignore cache refresh errors; close already succeeded.
  }
}

export const CloseRequestContext = React.createContext<CloseRequestType>({
  closeRequestHandler: async () => false,
  isLoading: false,
  error: "",
});

const CloseRequestProvider = (props: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const closeRequestHandler = async (
    formData: FormData,
    requestId: number
  ): Promise<boolean> => {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found");
      setIsLoading(false);
      toast.error("Please login again");
      return false;
    }

    try {
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

      let data: any = {};
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = { message: "Invalid response from server", status: "0" };
        }
      } else {
        const text = await res.text();
        data = {
          message: text || `Server error occurred (${res.status})`,
          status: "0",
        };
      }

      if (res.status === 200 && data.status === "1") {
        setError("");
        setIsLoading(false);
        await refreshProjectLists();
        toast.success(data.message || "Request closed successfully");
        return true;
      }

      const errorMessage =
        data.message ||
        data.error ||
        `Failed to close request (Status: ${res.status})`;
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
      return false;
    } catch (error: any) {
      const errorMessage = error.message || "Network error occurred";
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
      return false;
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
