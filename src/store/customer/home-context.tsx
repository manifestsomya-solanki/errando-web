import React, { ReactNode, useContext, useState } from "react";
import { Service } from "../../models/home";
import useSWR from "swr";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";


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
    buildApiUrl(API_ENDPOINTS.SERVICES)
  );

  //search handler
  const searchHandler = (key: string) => {
    setUrl(buildApiUrl(`${API_ENDPOINTS.SERVICES}?search=${key}`));
  };

  const dummy_data: Service[] = [];
  let datarender: Service[] = [];
  // Use publicFetcher for services search (works without token)
  const { data, isLoading } = useSWR(url, publicFetcher);
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

// Public fetcher - works without token (for services search on home page)
export const publicFetcher = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      console.error("API Error:", {
        url,
        status: response.status,
        data,
      });
      return {
        status: "0",
        message: data.message || "Failed to load data",
        data: null,
      };
    }

    return data;
  } catch (error) {
    console.error("Public Fetcher Error:", error);
    return {
      status: "0",
      message: "Network error",
      data: null,
    };
  }
};

// Original fetcher - requires token (for all other authenticated endpoints)
export const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  if (!token || token === "{}") {
    return {
      status: "0",
      message: "No token found",
      data: null,
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      console.error("API Error:", {
        url,
        status: response.status,
        data,
      });
      return {
        status: "0",
        message: data.message || "Failed to load data",
        data: null,
      };
    }

    return data;
  } catch (error) {
    console.error("Fetcher Error:", error);
    return {
      status: "0",
      message: "Network error",
      data: null,
    };
  }
};
