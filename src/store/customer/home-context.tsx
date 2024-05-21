import React, { ReactNode, useContext, useState } from "react";
import { Service } from "../../models/home";
import useSWR from "swr";

type HomeServiceDetailsType = {
  datarender: Service[];
  searchHandler: (key: string) => void;
  isLoading: boolean;
};

export const HomeServiceContext = React.createContext<HomeServiceDetailsType>({
  datarender: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  searchHandler: (key) => {},
  isLoading: true,
});

const HomeServiceContextProvider = (props: { children: ReactNode }) => {
  const [url, setUrl] = useState(
    "https://erranddo.com/admin/api/v1/services"
  );

  //search handler
  const searchHandler = (key: string) => {
    setUrl(`https://erranddo.com/admin/api/v1/services?search=${key}`);
  };

  const dummy_data: Service[] = [];
  let datarender: Service[] = [];
  const { data, isLoading } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;

  return (
    <HomeServiceContext.Provider
      value={{
        datarender: datarender,
        searchHandler: searchHandler,
        isLoading: isLoading,
      }}
    >
      {props.children}
    </HomeServiceContext.Provider>
  );
};

export function useHomeServices() {
  const homeCtx = useContext(HomeServiceContext);
  return homeCtx;
}

export default HomeServiceContextProvider;

export const fetcher = async (url: string) => {
  const token = localStorage.getItem("token") ?? "{}";
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((r) => r.json());
};
