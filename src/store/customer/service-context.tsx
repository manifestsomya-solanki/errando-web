import React, { ReactNode, useContext, useEffect, useState } from "react";

import useSWR, { mutate } from "swr";
import { fetcher } from "./home-context";
import { Business, Service } from "../../models/customer/businesslist";
import { useParams } from "react-router";
import { toast } from "react-toastify";

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
    `https://erranddo.com/admin/api/v1/businesses?page=1&per_page=100`
  );

  const businessListHandler = async (
    key: number,

    requestId: string,
    link: string
  ) => {
    if (link === "all") {
      setUrl(
        `https://erranddo.com/admin/api/v1/businesses?service_id=${key}&user_request_id=${requestId}`
      );
    } else if (link === "response") {
      setUrl(
        `https://erranddo.com/admin/api/v1/businesses?service_id=${key}&user_request_id=${requestId}&only_responded=1`
      );
    }
  };
  //sort handler
  const sortHandler = async (orderBy: string, key: number) => {
    if (orderBy === "reviews_avg_rating") {
      setUrl(
        `https://erranddo.com/admin/api/v1/businesses?service_id=${key}&sort_field=reviews_avg_rating&sort_order=desc`
      );
    } else if (orderBy === "created_at") {
      setUrl(
        `https://erranddo.com/admin/api/v1/businesses?service_id=${key}&sort_field=created_at&sort_order=desc`
      );
    } else if (orderBy === "highest_rating") {
      setUrl(
        `https://erranddo.com/admin/api/v1/businesses?service_id=${key}&sort_field=highest_rating&sort_order=desc`
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
  const counturl = `https://erranddo.com/admin/api/v1/businesses/count?user_request_id=${userRequestId}`;
  const { mutate: countMutate } = useSWR(counturl, fetcher);

  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);

  const handleShowInterest = async (formData: FormData) => {
    const token = (await localStorage.getItem("token")) ?? "{}";
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://erranddo.com/admin/api/v1/user-requests/show-interest",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleShowInterestToAll = async (formData: FormData) => {
    const token = (await localStorage.getItem("token")) ?? "{}";

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://erranddo.com/admin/api/v1/user-requests/show-interest-all",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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
    const token = (await localStorage.getItem("token")) ?? "{}";
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://erranddo.com/admin/api/v1/user-requests/request-quote",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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
