import { createContext, useContext, useState } from "react";
import { UserRequestList } from "../../models/pro/userrequestlist";
import useSWR from "swr";
import { fetcher } from "../customer/home-context";
import { UserResponseList } from "../../models/pro/userresponselist";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type LeadsResponseType = {
  leadsResponse?: UserResponseList[];
  sendQuote: (formData: FormData) => Promise<void>;
  editQuote: (formData: FormData, quoteId: number) => Promise<void>;
  notes: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  error: string;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  filter: (ids: number[]) => void;
  isQuoteLoading: boolean;
  page: number;
  total: number;
  isNoteLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const LeadResponseContext = createContext<LeadsResponseType>({
  leadsResponse: [] as UserResponseList[],
  isLoading: false,
  error: "",
  sendQuote: async (formData: FormData) => {
    console.log();
  },
  editQuote: async (formData: FormData, quoteId: number) => {
    console.log();
  },
  notes: async (formData: FormData) => {
    console.log();
  },
  handleNextPage: () => {
    console.log();
  },
  handlePrevPage: () => {
    console.log();
  },
  filter: (ids) => {
    console.log();
  },

  isQuoteLoading: false,
  isNoteLoading: false,
  page: 0,
  setPage: () => {
    console.log();
  },
  total: 0,
});

const LeadsResponseProvider = (props: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const perPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [url, setUrl] = useState(
    `https://erranddo.kodecreators.com/api/v1/user-requests?page=${currentPage}&per_page=${perPage}&for_pro=1&with_leads=1`
  );
  // /user-requests?for_pro=1&with_leads=1&page=${currentPage}&per_page=${perPage}
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const params = new URLSearchParams(url);
      params.set("page", `${currentPage - 1}`);
      params.set("per_page", `${perPage}`);
      setUrl(decodeURIComponent(params.toString()));
    }
  };
  const dummy_data: UserResponseList[] = [];
  let datarender: UserResponseList[] = [];
  const { data, isLoading: isRequestLoading } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;
  const total = data?.total;

  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  const sendQuote = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    setIsQuoteLoading(true);
    setError("");
    const res = await fetch(
      `https://erranddo.kodecreators.com/api/v1/quotes/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (res.status === 200) {
      setIsQuoteLoading(false);
      const data: any = await res.json();
      if (data.status === "1") {
        toast.success("Quote sent successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      } else {
        setIsQuoteLoading(false);
        setError(data.message);
        toast.error("Quote already Sent!", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data: any = await res.json();
      setIsQuoteLoading(false);
      setError(data.message);
      toast.error("Quote already Sent!", {
        hideProgressBar: false,
        position: "bottom-left",
      });
    }
  };

  const editQuote = async (formData: FormData, quoteId: number) => {
    const token = localStorage.getItem("token");
    setIsQuoteLoading(true);
    setError("");
    const res = await fetch(
      `https://erranddo.kodecreators.com/api/v1/quotes/${quoteId}/edit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (res.status === 200) {
      setIsQuoteLoading(false);
      const data: any = await res.json();
      if (data.status === "1") {
        toast.success("Quote sent successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      } else {
        setIsQuoteLoading(false);
        setError(data.message);
        toast.error("Quote already Sent!", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data: any = await res.json();
      setIsQuoteLoading(false);
      setError(data.message);
      toast.error("Quote already Sent!", {
        hideProgressBar: false,
        position: "bottom-left",
      });
    }
  };
  const [isNoteLoading, setIsNoteLoading] = useState(false);
  const navigate = useNavigate();
  const notes = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    setIsNoteLoading(true);
    setError("");

    const res = await fetch(
      `https://erranddo.kodecreators.com/api/v1/note/add`,
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
      setIsNoteLoading(false);

      const data: any = await res.json();
      if (data.status === "1") {
        toast.success("Note saved successfully!", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        navigate(-1);
        setIsNoteLoading(false);
      } else {
        setError(data.message);
        toast.error("error", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data: any = await res.json();
      setError(data.message);
      setIsNoteLoading(false);
    }
  };

  return (
    <LeadResponseContext.Provider
      value={{
        leadsResponse: datarender,
        sendQuote: sendQuote,
        editQuote: editQuote,
        isLoading: isRequestLoading,
        notes: notes,
        isNoteLoading: isNoteLoading,
        isQuoteLoading: isQuoteLoading,
        handleNextPage: handleNextPage,
        handlePrevPage: handlePreviousPage,
        filter: filter,
        error: error,
        page: currentPage,
        total: total,
        setPage: setCurrentPage,
      }}
    >
      {props.children}
    </LeadResponseContext.Provider>
  );
};

export function useLeadResponse() {
  const reviewCtx = useContext(LeadResponseContext);
  return reviewCtx;
}
export default LeadsResponseProvider;
