import { createContext, useContext, useState } from "react";
import { BusinessData } from "../../models/home";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "../customer/home-context";
import { AddBusinessData, Business } from "../../models/pro/business";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { useService } from "./service-context";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../config/api";

//auth response type declaration
type BusinessResponseType = {
  data?: BusinessData[];
  isBussinessLoading: boolean;
  addBusiness: (formData: FormData) => Promise<number | void>;
  addServiceBusiness: (formData: FormData) => Promise<number>;
  businessDetail?: Business;
  isBussinessDetailLoading: boolean;
  detailBusiness: (id?: number) => void;
  editBusiness: (formData: FormData, serviceId: string) => Promise<number | void>;
  deleteBusiness: (businessId: string) => void;
  deleteServiceBusiness: (businessId: string) => void;

  mutate: KeyedMutator<any>;

  setError: React.Dispatch<React.SetStateAction<string>>;
  editServiceBusiness: (formData: FormData, serviceId: number) => Promise<void | number>;
  deleteImage: (id: number) => Promise<void>;
  isLoading: boolean;
  error: string;
};

export const BusinessContext = createContext<BusinessResponseType>({
  isLoading: false,
  isBussinessLoading: false,
  isBussinessDetailLoading: false,
  addBusiness: async (data) => {
    console.log(data);
  },
  deleteBusiness: (data) => {
    console.log(data);
  },
  deleteServiceBusiness: (data) => {
    console.log(data);
  },
  mutate: async () => {
    console.log();
  },
  addServiceBusiness: async (data) => {
    console.log(data);
    return 0;
  },
  editServiceBusiness: async (data) => {
    console.log(data);
  },
  setError: {} as React.Dispatch<React.SetStateAction<string>>,

  editBusiness: async (data) => {
    console.log(data);
  },
  data: [] as BusinessData[],
  businessDetail: {} as Business,
  detailBusiness: (data) => {
    console.log(data);
  },
  deleteImage: async (id: number) => {
    console.log(id);
  },
  error: "",
});

const BusinessContextProvider = (props: { children: React.ReactNode }) => {
  const id = JSON.parse(localStorage.getItem("data") ?? "").id;
  const bussinessId = useParams().id;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [businessDetailUrl, setBusinessDetailUrl] = useState("");
  const url = buildApiUrl(`${API_ENDPOINTS.BUSINESSES}?user_id=${id}`);

  const dummy_data: BusinessData[] = [];
  let datarender: BusinessData[] = [];
  const { data, mutate, isLoading: isBusinessLoading } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;

  //detail  business
  const DetailBusiness = async (id?: number) => {
    setBusinessDetailUrl(
      buildApiUrl(`${API_ENDPOINTS.BUSINESSES_DETAIL}/${id}`)
    );
  };

  const dummy_detail_data: Business = {} as Business;
  let businessData: Business = {} as Business;
  const {
    data: businessDetailData,
    isLoading: isBusinessDetailLoading,
    mutate: businessMutate,
  } = useSWR(businessDetailUrl, fetcher);
  businessData = businessDetailData?.data || dummy_detail_data;

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
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
        return 0;
      } else {
        setError("");
        toast.success("Business added successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        mutate();
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
    }
  };

  //add service business
  const AddServiceBusiness = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.BUSINESS_SERVICES_CREATE),
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
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
        return 0;
      } else {
        setError("");
        toast.success("Service added successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        mutate();
        serviceMutate();
        businessMutate();
        return 1;
      }
    } else {
      setIsLoading(false);
      const data: any = await res.json();
      setError(data.message);
      return 0;
    }
  };

  //edit service business
  const EditBusiness = async (formData: FormData, businessId: string) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    console.log("herr");
    setError("");
    const res = await fetch(
      buildApiUrl(`${API_ENDPOINTS.BUSINESSES_EDIT}/${businessId}`),
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
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
        return 0;
      } else {
        setError("");
        mutate();
        businessMutate();
        toast.success("Business updated successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
      toast.error("Error", {
        position: "bottom-left",
      });
    }
  };

  const deleteHandler = async (id: string) => {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    const res = await fetch(
      buildApiUrl(`${API_ENDPOINTS.BUSINESSES_DELETE}/${id}`),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      const data = await res.json();

      if (data.status === "1") {
        toast.success("Business delete successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        setIsLoading(false);
        await mutate();
        await serviceMutate();
      } else {
        setError(data.message);
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data = await res.json();
      setIsLoading(false);
      setError(data.message);
      toast.error(data.message, {
        hideProgressBar: false,
        position: "bottom-left",
      });
    }
  };
  const { page } = useService();

  const serviceUrl = buildApiUrl(`${API_ENDPOINTS.BUSINESS_SERVICES}?page=${page}&per_page=${8}&user_id=${id}`);
  const { mutate: serviceMutate } = useSWR(serviceUrl, fetcher);
  //edit service business
  const EditServiceBusiness = async (formData: FormData, serviceId: number) => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");
    const res = await fetch(
      buildApiUrl(`${API_ENDPOINTS.BUSINESS_SERVICES_EDIT}/${serviceId}`),
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
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
        return 0;
      } else {
        setError("");
        toast.success("Service updated successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        serviceMutate();
        mutate();
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
    }
  };

  const deleteServiceHandler = async (id: string) => {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    const res = await fetch(
      buildApiUrl(`${API_ENDPOINTS.BUSINESS_SERVICES_DELETE}/${id}`),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      const data = await res.json();

      if (data.status === "1") {
        toast.success("Business service  deleted successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        setIsLoading(false);
        await serviceMutate();
      } else {
        setError(data.message);
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data = await res.json();
      setIsLoading(false);
      setError(data.message);
      toast.error(data.message, {
        hideProgressBar: false,
        position: "bottom-left",
      });
    }
  };
  const deleteImage = async (id: number) => {
    const token = localStorage.getItem("token") ?? "{}";
    setError("");
    setIsLoading(true);
    console.log(id, "imageIdhvbnkoihugvbnkmlkjbh");

    const res = await fetch(
      buildApiUrl(`${API_ENDPOINTS.BUSINESSES}/${id}/delete-service-image`),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      setError("");
      setIsLoading(false);

      const data: any = await res.json();
      if (data.status === "1") {
        businessMutate();
        toast.success("Image deleted successfully !", {
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
      const data: any = await res.json();
      setError(data.message);
      setIsLoading(false);
    }
  };
  return (
    <BusinessContext.Provider
      value={{
        data: datarender,
        businessDetail: businessData,
        isLoading: isLoading,
        addBusiness: AddBusiness,
        detailBusiness: DetailBusiness,
        addServiceBusiness: AddServiceBusiness,
        editServiceBusiness: EditServiceBusiness,
        deleteServiceBusiness: deleteServiceHandler,
        editBusiness: EditBusiness,
        deleteBusiness: deleteHandler,
        isBussinessLoading: isBusinessLoading,
        isBussinessDetailLoading: isBusinessDetailLoading,
        error: error,
        setError: setError,
        mutate: businessMutate,
        deleteImage: deleteImage,
      }}
    >
      {props.children}
    </BusinessContext.Provider>
  );
};

export default BusinessContextProvider;

export function useBusiness() {
  const homeCtx = useContext(BusinessContext);
  return homeCtx;
}
