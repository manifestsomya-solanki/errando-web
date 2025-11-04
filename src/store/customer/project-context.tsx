import React, { useState, useContext, useEffect } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

import { Request } from "../../models/customer/requestlist";
import useSWR, { KeyedMutator, MutatorOptions, SWRResponse } from "swr";
import { fetcher } from "./home-context";

//auth response type declaration
type ProjectResponseType = {
  current: Request[];
  complete: Request[];
  currentNumber: number;
  completeNumber: number;
  isCurrentLoading: boolean;
  isCompleteLoading: boolean;
  handleNextPage: (d: string) => void;
  handlePrevPage: (d: string) => void;
  currentPage: number;
  isCurrentMutate: KeyedMutator<any>;
  isCompleteMutate: KeyedMutator<any>;

  completePage: number;
};

//auth context initialization
export const ProjectContext = createContext<ProjectResponseType>({
  current: [],
  complete: [],
  currentNumber: 0,
  completeNumber: 0,
  isCurrentLoading: false,
  isCompleteLoading: false,
  handleNextPage: (d: string) => {
    console.log();
  },
  handlePrevPage: (d: string) => {
    console.log();
  },

  isCurrentMutate: async () => {
    console.log();
  },
  isCompleteMutate: async () => {
    console.log();
  },
  currentPage: 0,
  completePage: 0,
});

const ProjectContextProvider = (props: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const perPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [completePage, setCompletePage] = useState(1);

  // Read user ID reactively from localStorage
  useEffect(() => {
    const readUserData = () => {
      try {
        const userData = localStorage.getItem("data");
        if (userData) {
          const parsed = JSON.parse(userData);
          if (parsed?.id) {
            setUserId(parsed.id);
            return;
          }
        }
        setUserId(null);
      } catch (error) {
        console.error("Error reading user data from localStorage:", error);
        setUserId(null);
      }
    };

    // Read initially
    readUserData();

    // Listen for storage changes (when localStorage is updated from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "data") {
        readUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically (in case same-tab updates don't trigger storage event)
    const interval = setInterval(readUserData, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Update URLs when userId or page changes
  const [url, setUrl] = useState<string | null>(null);
  const [completeurl, setCompleteUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setUrl(
        buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?page=${currentPage}&per_page=${perPage}&status=PENDING&user_id=${userId}`)
      );
      setCompleteUrl(
        buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?page=${completePage}&per_page=${perPage}&status=COMPLETED&user_id=${userId}`)
      );
    } else {
      setUrl(null);
      setCompleteUrl(null);
    }
  }, [userId, currentPage, completePage]);

  const dummy_data: Request[] = [];
  let current: Request[] = [];
  let complete: Request[] = [];

  const handleNextPage = (key: string) => {
    if (key === "current") {
      setCurrentPage((c) => c + 1);
      // URL will be updated automatically by useEffect when currentPage changes
    } else {
      setCompletePage((c) => c + 1);
      // URL will be updated automatically by useEffect when completePage changes
    }
  };

  const handlePrevPage = (key: string) => {
    if (key === "current") {
      setCurrentPage((c) => Math.max(1, c - 1));
      // URL will be updated automatically by useEffect when currentPage changes
    } else {
      setCompletePage((c) => Math.max(1, c - 1));
      // URL will be updated automatically by useEffect when completePage changes
    }
  };

  //current - only fetch if URL is available
  const {
    data: currentData,
    isLoading: iCurrentLoading,
    mutate: isCurrentMutate,
  } = useSWR(url, fetcher);
  current = currentData?.data || dummy_data;
  const currentNumber = currentData?.total || 0;

  //complete - only fetch if URL is available
  const {
    data: completeData,
    isLoading: iCompleteLoading,
    mutate: isCompleteMutate,
  } = useSWR(completeurl, fetcher);
  complete = completeData?.data || dummy_data;
  const completeNumber = completeData?.total || 0;

  return (
    <ProjectContext.Provider
      value={{
        current: current,
        complete: complete,
        completeNumber: completeNumber,
        currentNumber: currentNumber,
        isCurrentLoading: iCurrentLoading,
        isCompleteLoading: iCompleteLoading,
        isCurrentMutate: isCurrentMutate,
        isCompleteMutate: isCompleteMutate,
        handleNextPage: handleNextPage,
        handlePrevPage: handlePrevPage,
        currentPage: currentPage,
        completePage: completePage,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  const projectCtx = useContext(ProjectContext);
  return projectCtx;
}
export default ProjectContextProvider;
