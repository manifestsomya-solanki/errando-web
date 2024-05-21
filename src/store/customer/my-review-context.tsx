import React, { useState, useContext } from "react";
import { createContext } from "react";
import { ReviewData } from "../../models/customer/reviewlist";
import { useNavigate, useParams } from "react-router";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "./home-context";
import { toast } from "react-toastify";

type MyReviewResponseType = {
  data?: ReviewData[];
  editReview: (formData: FormData, id: number) => Promise<void>;
  mutate: KeyedMutator<any>;
  deleteReview: (id: number) => Promise<void>;

  isLoading: boolean;
  isReviewLoading: boolean;

  error: string;
};

export const MyReviewContext = createContext<MyReviewResponseType>({
  data: [],

  editReview: async (d, a) => {
    console.log(d, a);
  },
  deleteReview: async (id: number) => {
    console.log(id);
  },
  mutate: async () => {
    console.log();
  },
  isLoading: false,
  isReviewLoading: false,

  error: "",
});

const MyReviewContextProvider = (props: { children: React.ReactNode }) => {
  const useId = JSON.parse(localStorage.getItem("data") ?? "").id;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState(
    `https://erranddo.com/admin/api/v1/reviews?page=1&per_page=100&user_id=${useId}`
  );

  const { data, isLoading: isReviewLoading, mutate } = useSWR(url, fetcher);
  const myReview: ReviewData[] = data?.data;

  const editReview = async (formData: FormData, id: number) => {
    const token = localStorage.getItem("token") ?? "{}";
    setError("");
    setIsLoading(true);

    const res = await fetch(
      `https://erranddo.com/admin/api/v1/reviews/${id}/edit`,
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
        toast.success("Review has been edited!", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      } else {
        setError(data.message);
        toast.error(data.error, {
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
  const deleteReview = async (id: number) => {
    const token = localStorage.getItem("token") ?? "{}";
    setError("");
    setIsLoading(true);
    console.log(id, "reviewid");

    const res = await fetch(
      `https://erranddo.com/admin/api/v1/reviews/${id}/delete`,
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
        // toast.success("Email has been successfully sent !");
      } else {
        setError(data.message);
        // toast.error(data.error);
      }
    } else {
      const data: any = await res.json();
      setError(data.message);
      setIsLoading(false);
    }
  };
  return (
    <MyReviewContext.Provider
      value={{
        data: myReview,
        mutate: mutate,
        editReview: editReview,
        deleteReview: deleteReview,

        isLoading: isLoading,
        isReviewLoading: isReviewLoading,

        error: error,
      }}
    >
      {props.children}
    </MyReviewContext.Provider>
  );
};

export function useMyReview() {
  const reviewCtx = useContext(MyReviewContext);
  return reviewCtx;
}
export default MyReviewContextProvider;
