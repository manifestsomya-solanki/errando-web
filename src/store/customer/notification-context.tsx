import React, { ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "./home-context";
import { NotificationData } from "../../models/customer/notification";

type NotificationType = {
  data: NotificationData[];
  edit: (formData: FormData) => void;
  create: (formData: FormData) => void;

  isLoading: boolean;
  isNotificationLoading: boolean;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  currentPage: number;
  total: number;
  handleNextPage: () => void;
  mutate: KeyedMutator<any>;
};

export const NotificationContext = React.createContext<NotificationType>({
  data: [],
  edit: (formData: FormData) => {
    console.log(formData);
  },
  create: (formData: FormData) => {
    console.log(formData);
  },
  isLoading: false,
  isNotificationLoading: false,
  setUrl: () => {
    console.log();
  },
  error: "",
  currentPage: 0,
  total: 0,
  handleNextPage: () => {
    console.log();
  },
  mutate: async () => {
    console.log();
  },
});

const NotificationContextProvider = (props: { children: ReactNode }) => {
  let userId;
  const perPage = 100;
  let role;
  if (localStorage.getItem("isLoggedIn") === "true") {
    userId = JSON.parse(localStorage.getItem("data") ?? "").id ?? 0;
    role = localStorage.getItem("role") ?? "";
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [url, setUrl] = useState(
    `https://erranddo.com/admin/api/v1/notification?user_id=${
      userId ?? ""
    }&is_for_${role}=1&page=${currentPage}&per_page=${perPage}`
  );
  const handleNextPage = () => {
    setCurrentPage((c) => c + 1);
    const params = new URLSearchParams(url);
    params.set("page", `${currentPage + 1}`);
    params.set("per_page", `${perPage}`);
    setUrl(decodeURIComponent(params.toString()));
  };

  //list handler
  const dummy_data: NotificationData[] = [];
  let datarender: NotificationData[] = [];
  const { data, isLoading: isDataLoading, mutate } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;
  const total = data?.total;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const create = async (formData: FormData) => {
    setError("");
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://erranddo.com/admin/api/v1/notification/create",
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
        console.log(data.message);
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
    }
  };

  const edit = async (formData: FormData) => {
    setError("");
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://erranddo.com/admin/api/v1/notification/edit",
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
        toast.success("Notification setting updated successfully!", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      } else {
        toast.error(data.message, {
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
  return (
    <NotificationContext.Provider
      value={{
        data: datarender,
        edit: edit,
        create: create,

        setUrl: setUrl,
        isLoading: isLoading,
        isNotificationLoading: isDataLoading,
        handleNextPage: handleNextPage,
        currentPage: currentPage,
        total: total,
        mutate: mutate,
        error: error,
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  const reviewCtx = useContext(NotificationContext);
  return reviewCtx;
}
export default NotificationContextProvider;
