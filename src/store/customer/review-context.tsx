import React, { useState, useContext } from "react";
import { createContext } from "react";
import { ReviewData } from "../../models/customer/reviewlist";
import { useNavigate, useParams } from "react-router";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "./home-context";
import { toast } from "react-toastify";

type ReviewResponseType = {
  data?: ReviewData[];
  createReview: (formData: FormData) => Promise<void>;
  editReview: (formData: FormData, id: number) => Promise<void>;
  mutate: KeyedMutator<any>;

  deleteReview: (id: number) => Promise<void>;
  closeRequestReview: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  isReviewLoading: boolean;
  filter: (key: string, order?: string) => void;
  error: string;
};

export const ReviewContext = createContext<ReviewResponseType>({
  data: [],
  createReview: async (d) => {
    console.log(d);
  },
  editReview: async (d, a) => {
    console.log(d, a);
  },
  mutate: async () => {
    console.log();
  },
  deleteReview: async (id: number) => {
    console.log(id);
  },
  closeRequestReview: async (d) => {
    console.log(d);
  },
  filter: (key: string, order?: string) => {
    console.log(key, order);
  },
  isLoading: false,
  isReviewLoading: false,

  error: "",
});

const ReviewContextProvider = (props: { children: React.ReactNode }) => {
  const businessId = useParams();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState(
    `https://erranddo.com/admin/api/v1/reviews?page=1&per_page=100&user_business_id=${businessId?.id}`
  );

  const filter = (key: string, order?: string) => {
    setUrl(
      `https://erranddo.com/admin/api/v1/reviews?page=1&per_page=100&user_business_id=${businessId?.id}&sort_field=${key}&sort_order=${order}`
    );
  };
  const { data, isLoading: isReviewLoading, mutate } = useSWR(url, fetcher);
  const businessReview: ReviewData[] = data?.data;
  const createReview = async (formData: FormData) => {
    const token = localStorage.getItem("token") ?? "{}";
    setError("");
    setIsLoading(true);

    const res = await fetch(
      "https://erranddo.com/admin/api/v1/reviews/create",
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

  const closeRequestReview = async (formData: FormData) => {
    const token = localStorage.getItem("token") ?? "{}";
    setError("");
    setIsLoading(true);
    console.log(...formData);

    const res = await fetch(
      "https://erranddo.com/admin/api/v1/reviews/create",
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
        navigate("/projects");
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
    <ReviewContext.Provider
      value={{
        data: businessReview,
        createReview: createReview,
        editReview: editReview,
        deleteReview: deleteReview,
        closeRequestReview: closeRequestReview,
        isLoading: isLoading,
        isReviewLoading: isReviewLoading,
        filter: filter,
        mutate: mutate,
        error: error,
      }}
    >
      {props.children}
    </ReviewContext.Provider>
  );
};

export function useReview() {
  const reviewCtx = useContext(ReviewContext);
  return reviewCtx;
}
export default ReviewContextProvider;
