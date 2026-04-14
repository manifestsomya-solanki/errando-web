import { createContext, useContext, useMemo, useState } from "react";
import { UserRequestList } from "../../models/pro/userrequestlist";
import useSWR from "swr";
import { fetcher } from "../customer/home-context";
import { UserResponseList } from "../../models/pro/userresponselist";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

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
  search: (key: string) => void;
  /** false = all purchased responses, true = closed-only responses */
  showClosedLeads: boolean;
  setShowClosedLeads: (closed: boolean) => void;
  deleteHandler: (key: string) => Promise<boolean>;
  isDeleteLoading: boolean;

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
  search: (d) => {
    console.log(d);
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
  showClosedLeads: false,
  setShowClosedLeads: () => {
    console.log();
  },
  deleteHandler: async (key: string) => {
    console.log(key);
    return false;
  },
  isDeleteLoading: false,
});

const LeadsResponseProvider = (props: { children: React.ReactNode }) => {
  const [error, setError] = useState("");
  const perPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [showClosedLeads, setShowClosedLeadsState] = useState(false);
  const [serviceIds, setServiceIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const url = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("per_page", String(perPage));
    params.set("for_pro", "1");
    params.set("with_leads", "1");
    // Default tab: no is_closed filter, so purchased responses include open + closed.
    if (showClosedLeads) {
      params.set("is_closed", "1");
    }
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    serviceIds.forEach((id, i) => {
      params.set(`service_ids[${i}]`, String(id));
    });
    return buildApiUrl(
      `${API_ENDPOINTS.USER_REQUESTS}?${params.toString()}`
    );
  }, [currentPage, perPage, showClosedLeads, searchQuery, serviceIds]);

  const setShowClosedLeads = (closed: boolean) => {
    setShowClosedLeadsState(closed);
    setCurrentPage(1);
  };

  const search = (key: string) => {
    setSearchQuery(key);
    setCurrentPage(1);
  };
  const filter = (ids: number[]) => {
    setServiceIds(ids);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((c) => c + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((c) => (c > 1 ? c - 1 : 1));
  };
  const dummy_data: UserResponseList[] = [];
  let datarender: UserResponseList[] = [];
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { data, isLoading: isRequestLoading, mutate } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;
  const total = datarender?.filter((item) => item?.is_outright).length;

  const sendQuote = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    setIsQuoteLoading(true);
    setError("");
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.QUOTES_CREATE),
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
      buildApiUrl(`${API_ENDPOINTS.QUOTES_EDIT}/${quoteId}`),
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
      buildApiUrl(API_ENDPOINTS.NOTE_ADD),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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
        // Don't navigate immediately, let the user see the success message
        setTimeout(() => {
          navigate(-1);
        }, 1000);
        setIsNoteLoading(false);
      } else {
        setError(data.message);
        toast.error(data.message || "Failed to save note", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data: any = await res.json();
      setError(data.message || "Failed to save note");
      setIsNoteLoading(false);
      toast.error(data.message || "Failed to save note", {
        hideProgressBar: false,
        position: "bottom-left",
      });
    }
  };

  const deleteHandler = async (id: string) => {
    setIsDeleteLoading(true);
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

    const resData = await res.json();

    if (res.status === 200 && resData.status === "1") {
      setIsDeleteLoading(false);
      toast.success("Lead deleted successfully");
      await mutate();
      return true;
    } else {
      setIsDeleteLoading(false);
      setError(resData.message || "Failed to delete lead");
      toast.error(resData.message || "Failed to delete lead");
      return false;
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
        search: search,
        setPage: setCurrentPage,
        showClosedLeads,
        setShowClosedLeads,
        deleteHandler,
        isDeleteLoading,
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
