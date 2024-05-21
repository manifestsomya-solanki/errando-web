import React, { useState, useContext } from "react";
import { createContext } from "react";

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
  const id = JSON.parse(localStorage.getItem("data") ?? "").id;
  const perPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [completePage, setCompletePage] = useState(1);

  const [url, setUrl] = useState(
    `https://erranddo.com/admin/api/v1/user-requests?page=${currentPage}&per_page=${perPage}&status=PENDING&user_id=${id}`
  );

  const [completeurl, setCompleteUrl] = useState(
    `https://erranddo.com/admin/api/v1/user-requests?page=${completePage}&per_page=${perPage}&status=COMPLETED&user_id=${id}`
  );

  const dummy_data: Request[] = [];
  let current: Request[] = [];
  let complete: Request[] = [];

  const handleNextPage = (key: string) => {
    console.log("here");
    if (key === "current") {
      setCurrentPage((c) => c + 1);
      const params = new URLSearchParams(url);
      params.delete("page");

      params.set("page", `${currentPage + 1}`);
      params.set("per_page", `${perPage}`);
      setUrl(decodeURIComponent(params.toString()));
    } else {
      setCompletePage((c) => c + 1);
      const params = new URLSearchParams(completeurl);

      params.set("page", `${completePage + 1}`);
      params.set("per_page", `${perPage}`);
      setCompleteUrl(decodeURIComponent(params.toString()));
    }
  };

  const handlePrevPage = (key: string) => {
    if (key === "current") {
      setCurrentPage((c) => c - 1);
      const params = new URLSearchParams(url);
      params.delete("page");

      params.set("page", `${currentPage - 1}`);
      params.set("per_page", `${perPage}`);
      setUrl(decodeURIComponent(params.toString()));
    } else {
      setCompletePage((c) => c - 1);
      const params = new URLSearchParams(completeurl);
      params.delete("page");
      params.set("page", `${completePage - 1}`);
      params.set("per_page", `${perPage}`);
      setCompleteUrl(decodeURIComponent(params.toString()));
    }
  };

  //curent
  const {
    data: currentData,
    isLoading: iCurrentLoading,
    mutate: isCurrentMutate,
  } = useSWR(url, fetcher);
  current = currentData?.data || dummy_data;
  const currentNumber = currentData?.total;

  //complete
  const {
    data: completeData,
    isLoading: iCompleteLoading,
    mutate: isCompleteMutate,
  } = useSWR(completeurl, fetcher);
  complete = completeData?.data || dummy_data;
  const completeNumber = completeData?.total;

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
