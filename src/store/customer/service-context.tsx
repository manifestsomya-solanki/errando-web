import React, { ReactNode, useContext, useEffect, useState } from "react";

import useSWR, { mutate as globalMutate } from "swr";
import { fetcher } from "./home-context";
import { Business, Service } from "../../models/customer/businesslist";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../config/api";

type ServiceDetailsType = {
  datarender: Business[];
  businessListHandler: (
    key: number,
    requestId: string,
    link: string
  ) => Promise<void>;
  sortHandler: (orderBy: string, key: number) => Promise<void>;
  isLoading: boolean;
  isRequestQuoteLoading: boolean;

  to_show_interest: boolean;

  handleShowInterest: (formData: FormData) => Promise<void>;
  handleRequestQuote: (formData: FormData) => Promise<void>;
  handleShowInterestToAll: (formData: FormData) => void;
};

export const ServiceContext = React.createContext<ServiceDetailsType>({
  datarender: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  businessListHandler: async (key: number, requestId: string, link: string) => {
    console.log();
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  sortHandler: async (orderBy: string, key: number) => {},
  isLoading: true,
  isRequestQuoteLoading: true,

  to_show_interest: true,

  handleShowInterest: async (d) => {
    console.log(d);
  },
  handleRequestQuote: async (d) => {
    console.log(d);
  },

  handleShowInterestToAll: (d) => {
    console.log(d);
  },
});

const ServiceContextProvider = (props: { children: ReactNode }) => {
  const [url, setUrl] = useState(
    buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?page=1&per_page=100`)
  );

  const businessListHandler = async (
    key: number,

    requestId: string,
    link: string
  ) => {
    if (link === "all") {
      setUrl(
        buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?service_id=${key}&user_request_id=${requestId}`)
      );
    } else if (link === "response") {
      setUrl(
        buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?service_id=${key}&user_request_id=${requestId}&only_responded=1`)
      );
    }
  };
  //sort handler
  const sortHandler = async (orderBy: string, key: number) => {
    if (orderBy === "reviews_avg_rating") {
      setUrl(
        buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?service_id=${key}&sort_field=reviews_avg_rating&sort_order=desc`)
      );
    } else if (orderBy === "created_at") {
      setUrl(
        buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?service_id=${key}&sort_field=created_at&sort_order=desc`)
      );
    } else if (orderBy === "highest_rating") {
      setUrl(
        buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?service_id=${key}&sort_field=highest_rating&sort_order=desc`)
      );
    }
  };

  const dummy_data: Business[] = [];
  let datarender: Business[] = [];
  const { data, isLoading, mutate } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;

  const to_show_interest =
    datarender.filter((item) => item.is_interest === false).length > 0
      ? false
      : true;

  const userRequestId = useParams().id;
  const counturl = `${API_BASE_URL}/businesses/count?user_request_id=${userRequestId}`;
  const { mutate: countMutate } = useSWR(counturl, fetcher);

  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);

  const handleShowInterest = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    if (!token || token === "{}") {
      setError("Authentication required. Please login again.");
      setIsLoading(false);
      return;
    }

    let parsedToken = token;
    try {
      const tokenObj = JSON.parse(token);
      if (tokenObj && tokenObj.token) {
        parsedToken = tokenObj.token;
      }
    } catch (e) {
      parsedToken = token;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        buildApiUrl("user-requests/show-interest"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        setError("Invalid response from server");
        setIsLoading(false);
        toast.error("Invalid response from server", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        return;
      }

      if (res.status === 200) {
        setIsLoading(false);
        if (data.status === "1") {
          setError("");
          
          const formDataUserRequestId = formData.get("user_request_id")?.toString();
          const formDataBusinessId = formData.get("user_business_id")?.toString();
          
          // Store in localStorage for cross-page sync
          if (formDataBusinessId && formDataUserRequestId) {
            localStorage.setItem(`interest_shown_${formDataBusinessId}_${formDataUserRequestId}`, 'true');
          }
          
          // Revalidate business list (service list page)
          mutate();
          countMutate();
          
          // Revalidate specific business detail page
          if (formDataBusinessId) {
            // Build URL with and without user_request_id to match both cases
            const businessDetailUrlWithRequest = buildApiUrl(
              `${API_ENDPOINTS.BUSINESSES_DETAIL}/${formDataBusinessId}${formDataUserRequestId ? `?user_request_id=${formDataUserRequestId}` : ''}`
            );
            const businessDetailUrlWithoutRequest = buildApiUrl(
              `${API_ENDPOINTS.BUSINESSES_DETAIL}/${formDataBusinessId}`
            );
            
            // Revalidate both URL variations
            await Promise.all([
              globalMutate(businessDetailUrlWithRequest, undefined, { revalidate: true }),
              globalMutate(businessDetailUrlWithoutRequest, undefined, { revalidate: true })
            ]);
          }
          
          // Revalidate all business detail pages using pattern matching
          // Match URLs containing "businesses/detail/" (works with full URLs)
          await globalMutate(
            (key) => {
              if (typeof key !== 'string') return false;
              // Match both the endpoint pattern and full URL pattern
              const endpointPattern = `${API_ENDPOINTS.BUSINESSES_DETAIL}/`;
              const fullUrlPattern = `/businesses/detail/`;
              return key.includes(endpointPattern) || key.includes(fullUrlPattern);
            },
            undefined,
            { revalidate: true }
          );
          
          // Revalidate business list pages
          await globalMutate(
            (key) => {
              if (typeof key !== 'string') return false;
              const endpointPattern = `${API_ENDPOINTS.BUSINESSES}?`;
              const fullUrlPattern = `/businesses?`;
              return key.includes(endpointPattern) || key.includes(fullUrlPattern);
            },
            undefined,
            { revalidate: true }
          );
          
          toast.success("Successful", {
            hideProgressBar: false,
            position: "bottom-left",
          });
        } else {
          // Check if interest already exists - this is actually a success case
          const message = data.message || "";
          if (message.toLowerCase().includes("already exists") || message.toLowerCase().includes("intrest_already_exists")) {
            // Interest already shown, treat as success
            setError("");
            
            const formDataUserRequestId = formData.get("user_request_id")?.toString();
            const formDataBusinessId = formData.get("user_business_id")?.toString();
            
            // Store in localStorage for cross-page sync
            if (formDataBusinessId && formDataUserRequestId) {
              localStorage.setItem(`interest_shown_${formDataBusinessId}_${formDataUserRequestId}`, 'true');
            }
            
            // Still revalidate cache
            if (formDataBusinessId) {
              const businessDetailUrl = buildApiUrl(
                `${API_ENDPOINTS.BUSINESSES_DETAIL}/${formDataBusinessId}${formDataUserRequestId ? `?user_request_id=${formDataUserRequestId}` : ''}`
              );
              await globalMutate(businessDetailUrl, undefined, { revalidate: true });
            }
            
            toast.success("Interest already shown", {
              hideProgressBar: false,
              position: "bottom-left",
            });
          } else {
            setError(message || "Failed to show interest");
            toast.error(message || "Failed to show interest", {
              hideProgressBar: false,
              position: "bottom-left",
            });
          }
        }
      } else if (res.status === 500) {
        const errorMessage = data?.message || "Server error occurred. Please try again later.";
        setError(errorMessage);
        setIsLoading(false);
        toast.error(errorMessage, {
          hideProgressBar: false,
          position: "bottom-left",
        });
      } else {
        const errorMessage = data?.message || data?.error || `Server error (${res.status})`;
        setError(errorMessage);
        setIsLoading(false);
        toast.error(errorMessage, {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } catch (error) {
      console.error(error, "ygh98yg");
      setError("Network error. Please try again.");
      setIsLoading(false);
      toast.error("Network error. Please try again.", {
        hideProgressBar: false,
        position: "bottom-left",
      });
    }
  };

  const handleShowInterestToAll = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    if (!token || token === "{}") {
      setError("Authentication required. Please login again.");
      setIsLoading(false);
      return;
    }

    let parsedToken = token;
    try {
      const tokenObj = JSON.parse(token);
      if (tokenObj && tokenObj.token) {
        parsedToken = tokenObj.token;
      }
    } catch (e) {
      parsedToken = token;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        buildApiUrl("user-requests/show-interest-all"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Response data:", data);

      if (res.status === 200) {
        setError("");
        setIsLoading(false);
        if (data.status === "1") {
          mutate();
          countMutate();
        } else {
          setError(data.message);
        }
      } else {
        setError(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error, "ygh98yg");
      setError("Failed to show interest.");
      setIsLoading(false);
    }
  };

  const handleRequestQuote = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    if (!token || token === "{}") {
      setError("Authentication required. Please login again.");
      setIsLoading(false);
      return;
    }

    let parsedToken = token;
    try {
      const tokenObj = JSON.parse(token);
      if (tokenObj && tokenObj.token) {
        parsedToken = tokenObj.token;
      }
    } catch (e) {
      parsedToken = token;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        buildApiUrl("user-requests/request-quote"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.status === 200) {
        setError("");
        setIsLoading(false);
        if (data.status === "1") {
          mutate();
          countMutate();
          toast.success("Successful", {
            hideProgressBar: false,
            position: "bottom-left",
          });
        } else {
          setError(data.message);
          toast.error(data.message, {
            hideProgressBar: false,
            position: "bottom-left",
          });
        }
      } else {
        setError(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error, "ygh98yg");
      setError("Failed to show interest.");
      setIsLoading(false);
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        datarender: datarender,
        businessListHandler: businessListHandler,
        handleShowInterest: handleShowInterest,
        handleRequestQuote: handleRequestQuote,
        handleShowInterestToAll: handleShowInterestToAll,
        sortHandler: sortHandler,
        to_show_interest: to_show_interest,
        isLoading: isLoading,
        isRequestQuoteLoading: loading,
      }}
    >
      {props.children}
    </ServiceContext.Provider>
  );
};

export function useServices() {
  const homeCtx = useContext(ServiceContext);
  return homeCtx;
}

export default ServiceContextProvider;
