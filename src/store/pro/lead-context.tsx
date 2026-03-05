import React, { useState, useContext } from "react";
import { createContext } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "../customer/home-context";
import { BusinessData } from "../../models/home";
import { ServiceData } from "../../models/pro/business";

import { UserRequestList } from "../../models/pro/userrequestlist";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../config/api";

type LeadResponeType = {
  leads?: UserRequestList[];
  business: BusinessData[];
  service: ServiceData[];
  buyLead: (formData: FormData, key: string) => Promise<void>;
  isBuyLeadLoading: boolean;
  isLoading: boolean;
  isDeleteLoading: boolean;
  isBuyOutrightLoading: boolean;
  error: string;
  handleNextPage: () => void;
  reset: () => void;

  handlePrevPage: () => void;
  filter: (ids: number[]) => void;
  filterByInterest: (filters: { [key: string]: boolean }) => void;
  deleteHandler: (key: string) => void;
  search: (key: string) => void;
  page: number;
  total: number;

  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const LeadContext = createContext<LeadResponeType>({
  leads: [] as UserRequestList[],
  business: [] as BusinessData[],
  service: [] as ServiceData[],
  isLoading: false,
  isDeleteLoading: false,
  isBuyLeadLoading: false,
  isBuyOutrightLoading: false,
  error: "",
  handleNextPage: () => {
    console.log();
  },
  reset: () => {
    console.log();
  },
  handlePrevPage: () => {
    console.log();
  },
  buyLead: async () => {
    console.log();
  },
  filter: (ids) => {
    console.log();
  },
  deleteHandler: (d) => {
    console.log(d);
  },
  search: (d) => {
    console.log(d);
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  filterByInterest: (f) => {},
  page: 0,
  setPage: () => {
    console.log();
  },
  total: 0,
});

const LeadContextProProvider = (props: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const id = JSON.parse(localStorage.getItem("data") ?? "").id;
  const [error, setError] = useState("");
  const perPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [url, setUrl] = useState(
    buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?for_pro=1&page=${currentPage}&per_page=${perPage}`)
  );

  const search = (key: string) => {
    const params = new URLSearchParams(url);
    params.set("search", key);
    setUrl(decodeURIComponent(params.toString()));
  };
  // let baseUrl = "";
  const filterByInterest = (filters: { [key: string]: boolean }) => {
    const params = new URLSearchParams(url);
    Object.keys(filters).map((ky) => {
      params.delete(ky);
      if (filters[ky]) params.set(ky, "1");
    });
    setUrl(decodeURIComponent(params.toString()));
  };

  const filter = (ids: number[]) => {
    const params = new URLSearchParams(url);
    params.set("page", `${1}`);
    params.set("per_page", `${perPage}`);
    ids.forEach((id, i) => {
      params.set(`service_ids[${i}]`, `${id}`);
    });
    setUrl(decodeURIComponent(params.toString()));
  };

  const handleNextPage = () => {
    setCurrentPage((c) => c + 1);
    const params = new URLSearchParams(url);
    params.set("page", `${currentPage + 1}`);
    params.set("per_page", `${perPage}`);
    setUrl(decodeURIComponent(params.toString()));
  };

  const reset = () => {
    setUrl(
      buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?for_pro=1&page=${currentPage}&per_page=${perPage}`)
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const params = new URLSearchParams(url);
      params.set("page", `${currentPage - 1}`);
      params.set("per_page", `${perPage}`);
      setUrl(decodeURIComponent(params.toString()));
    }
  };
  const dummy_data: UserRequestList[] = [];
  let datarender: UserRequestList[] = [];
  const { data, isLoading: isRequestLoading, mutate } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;
  datarender = datarender.filter((item) => item.is_closed != "1");
  const total = data?.total;

  //

  //business
  const businessurl = buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?user_id=${id}`);
  const dummy_business: BusinessData[] = [];
  let datarenderOfBusiness: BusinessData[] = [];
  const { data: businessData } = useSWR(businessurl, fetcher);
  datarenderOfBusiness = businessData?.data || dummy_business;

  //service
  const serviceurl = buildApiUrl(`${API_ENDPOINTS.BUSINESS_SERVICES}?user_id=${id}}`);
  const dummy_service: ServiceData[] = [];
  let datarenderOfService: ServiceData[] = [];
  const { data: serviceData } = useSWR(serviceurl, fetcher);

  datarenderOfService = serviceData?.data || dummy_service;

  //addLead
  const [isBuyLeadLoading, setIsBuyLeadLoading] = useState(false);
  const [isBuyOutrightLoading, setIsBuyOutrightLoading] = useState(false);

  const buyLead = async (formData: FormData, key: string) => {
    const token = localStorage.getItem("token");
    if (key == "lead") {
      setIsBuyLeadLoading(true);
    } else {
      setIsBuyOutrightLoading(true);
    }
    setError("");
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.USER_REQUESTS_SHOW_INTEREST),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (res.status === 200) {
      setIsBuyLeadLoading(false);
      setIsBuyOutrightLoading(false);
      if (data.status === "1") {
        toast.success("Lead Bought successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      } else {
        setError("");
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data: any = await res.json();
      setIsBuyLeadLoading(false);
      setIsBuyOutrightLoading(false);
      setError(data.message);
      toast.error(data.message, {
        hideProgressBar: false,
        position: "bottom-left",
      });
    }
  };

  const navigate = useNavigate();

  const deleteHandler = async (id: string) => {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    const res = await fetch(
      buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS_LEAD_DELETE}/${id}`),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (res.status === 200 && data.status === "1") {
      setIsLoading(false);
      toast.success("Lead deleted successfully");
      // Force revalidate to get fresh data (will exclude deleted lead for this user)
      await mutate({ revalidate: true });
      return true;
    } else {
      setIsLoading(false);
      setError(data.message || "Failed to delete lead");
      toast.error(data.message || "Failed to delete lead");
      return false;
    }
  };

  return (
    <LeadContext.Provider
      value={{
        leads: datarender,
        business: datarenderOfBusiness,
        service: datarenderOfService,
        isLoading: isRequestLoading,
        isBuyLeadLoading: isBuyLeadLoading,
        isBuyOutrightLoading: isBuyOutrightLoading,
        isDeleteLoading: isLoading,
        buyLead: buyLead,
        reset: reset,
        handleNextPage: handleNextPage,
        handlePrevPage: handlePreviousPage,
        filter: filter,
        filterByInterest: filterByInterest,
        deleteHandler: deleteHandler,
        search: search,
        error: error,
        page: currentPage,
        total: total,
        setPage: setCurrentPage,
      }}
    >
      {props.children}
    </LeadContext.Provider>
  );
};

export function useLead() {
  const reviewCtx = useContext(LeadContext);
  return reviewCtx;
}
export default LeadContextProProvider;
