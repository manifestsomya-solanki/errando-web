import React, { useState, useContext } from "react";
import { createContext } from "react";
import { AddResponseData, ReviewData } from "../../models/customer/reviewlist";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "../customer/home-context";
import { toast } from "react-toastify";

type ReviewResponseType = {
  data?: ReviewData[];
  deleteReview: (id: number) => Promise<void>;
  flagReview: (id: number) => Promise<void>;

  getBusinessReviews: (id?: number) => void;
  addResponse: (formData: FormData, id: string) => void;
  isLoading: boolean;
  isDeleteReviewLoading: boolean;
  error: string;
  mutate: KeyedMutator<any>;
};

export const ReviewContext = createContext<ReviewResponseType>({
  data: [] as ReviewData[],
  getBusinessReviews: (d) => {
    console.log(d);
  },
  mutate: async () => {
    console.log();
  },
  deleteReview: async (id: number) => {
    console.log(id);
  },
  flagReview: async (id: number) => {
    console.log(id);
  },
  addResponse: (formData: FormData, id: string) => console.log(id, formData),
  isLoading: false,
  isDeleteReviewLoading: false,
  error: "",
});

const ReviewContextProProvider = (props: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [url, setUrl] = useState(
    `https://erranddo.kodecreators.com/api/v1/reviews`
  );
  const getBusinessReviews = (id?: number) => {
    setUrl(
      `https://erranddo.kodecreators.com/api/v1/reviews?user_business_id=${id}`
    );
  };
  const dummy_data: ReviewData[] = [];
  let datarender: ReviewData[] = [];
  const { data, isLoading: isReviewLoading, mutate } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;

  //add business
  const AddResponse = async (formData: FormData, id: string) => {
    console.log(id);
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");
    const res = await fetch(
      `https://erranddo.kodecreators.com/api/v1/reviews/${id}/addresponse`,
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
      const data: AddResponseData = await res.json();

      if (data.status === "0") {
        setError(data.message);
      } else {
        setError("");
        mutate();
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
    }
  };

  const [isDeleteReviewLoading, setIsDeleteReviewLoading] = useState(false);

  const deleteReview = async (id: number) => {
    const token = localStorage.getItem("token") ?? "{}";
    setError("");
    setIsDeleteReviewLoading(true);
    console.log(id, "reviewid");

    const res = await fetch(
      `https://erranddo.kodecreators.com/api/v1/reviews/${id}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      setError("");
      setIsDeleteReviewLoading(false);

      const data: any = await res.json();
      if (data.status === "1") {
        toast.success("Review deleted successfully");
      } else {
        setError(data.message);
        toast.error(data.error);
      }
    } else {
      const data: any = await res.json();
      setError(data.message);
      setIsDeleteReviewLoading(false);
    }
  };
  const flagReview = async (id: number) => {
    const token = localStorage.getItem("token") ?? "{}";
    setError("");
    setIsDeleteReviewLoading(true);

    const res = await fetch(
      `https://erranddo.kodecreators.com/api/v1/reviews/${id}/flag`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      setError("");
      setIsDeleteReviewLoading(false);

      const data: any = await res.json();
      if (data.status === "1") {
        toast.success(data.message);
      } else {
        setError(data.message);
        toast.error(data.error);
      }
    } else {
      const data: any = await res.json();
      setError(data.message);
      setIsDeleteReviewLoading(false);
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        data: datarender,
        deleteReview: deleteReview,
        flagReview: flagReview,
        getBusinessReviews: getBusinessReviews,
        addResponse: AddResponse,
        isLoading: isReviewLoading,
        isDeleteReviewLoading: isDeleteReviewLoading,
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
export default ReviewContextProProvider;
