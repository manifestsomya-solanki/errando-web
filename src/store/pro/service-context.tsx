import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../customer/home-context";
import { AddBusinessData, ServiceData } from "../../models/pro/business";
import { toast } from "react-toastify";
import { Postcode } from "../../models/pro/service";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../config/api";

//auth response type declaration
type ServiceResponseType = {
  data?: ServiceData[];
  isServiceLoading: boolean;
  addBusiness: (formData: FormData) => void;
  getAllBusiness: (k: number) => void;
  isLoading: boolean;
  error: string;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  page: number;
  total: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const ServiceContext = createContext<ServiceResponseType>({
  isLoading: false,
  isServiceLoading: false,
  addBusiness: (data) => {
    console.log(data);
  },
  getAllBusiness: (data) => {
    console.log(data);
  },
  data: [] as ServiceData[],

  error: "",
  handleNextPage: () => {
    console.log();
  },
  handlePrevPage: () => {
    console.log();
  },
  page: 0,
  setPage: () => {
    console.log();
  },
  total: 0,
});

const ServiceContextProvider = (props: { children: React.ReactNode }) => {
  const id = JSON.parse(localStorage.getItem("data") ?? "").id;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const perPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [url, setUrl] = useState(
    buildApiUrl(`${API_ENDPOINTS.BUSINESS_SERVICES}?page=${currentPage}&per_page=${perPage}&user_id=${id}`)
  );
  const getAllServies = (perPage: number) => {
    setUrl(
      buildApiUrl(`${API_ENDPOINTS.BUSINESS_SERVICES}?page=1&per_page=${perPage}`)
    );
  };

  const handleNextPage = () => {
    setCurrentPage((c) => c + 1);
    const params = new URLSearchParams(url);
    params.set("page", `${currentPage + 1}`);
    params.set("per_page", `${perPage}`);
    setUrl(decodeURIComponent(params.toString()));
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
  const dummy_data: ServiceData[] = [];
  let datarender: ServiceData[] = [];
  const { data, mutate, isLoading: isServiceLoading } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;
  const total = data?.total ?? 0;

  //add business
  const AddBusiness = async (formData: FormData) => {
    console.log(...formData);
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.BUSINESSES_CREATE),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (res.status === 200) {
      setIsLoading(false);
      const data: AddBusinessData = await res.json();

      if (data.status === "0") {
        setError(data.message);
      } else {
        setError("");
        mutate();
        toast.success("Bussiness is succesffuly added ");
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        data: datarender,
        isLoading: isLoading,
        addBusiness: AddBusiness,
        getAllBusiness: getAllServies,
        isServiceLoading: isServiceLoading,
        error: error,
        handleNextPage: handleNextPage,
        handlePrevPage: handlePreviousPage,
        page: currentPage,
        total: total,
        setPage: setCurrentPage,
      }}
    >
      {props.children}
    </ServiceContext.Provider>
  );
};

export default ServiceContextProvider;

export function useService() {
  const homeCtx = useContext(ServiceContext);
  return homeCtx;
}
