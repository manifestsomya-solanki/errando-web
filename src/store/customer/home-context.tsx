import React, { ReactNode, useContext, useState } from "react";
import { Service } from "../../models/home";
import useSWR from "swr";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";
import { handleAuthExpired } from "../../utils/authSession";


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

// Public fetcher - works without token, but sends token if available (for services search on home page)
export const publicFetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  let parsedToken = null;
  
  if (token && token !== "{}" && token.trim() !== "") {
    try {
      const tokenObj = JSON.parse(token);
      if (tokenObj && typeof tokenObj === 'object' && tokenObj.token) {
        parsedToken = tokenObj.token;
      } else {
        parsedToken = token.trim();
      }
    } catch (e) {
      parsedToken = token.trim();
    }
  }

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (parsedToken) {
    headers.Authorization = `Bearer ${parsedToken}`;
  }

  try {
    const response = await fetch(url, {
      headers,
    });

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      // Don't log 401 errors to console as they're expected when user is not authenticated
      if (response.status !== 401) {
        console.error("API Error:", {
          url,
          status: response.status,
          data,
        });
      }
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
  if (!url) {
    return {
      status: "0",
      message: "Invalid URL",
      data: null,
    };
  }

  const token = localStorage.getItem("token");
  if (!token || token === "{}" || token.trim() === "") {
    return {
      status: "0",
      message: "No token found",
      data: null,
    };
  }

  let parsedToken = token.trim();
  try {
    const tokenObj = JSON.parse(token);
    if (tokenObj && typeof tokenObj === 'object' && tokenObj.token) {
      parsedToken = tokenObj.token;
    }
  } catch (e) {
    parsedToken = token.trim();
  }

  if (!parsedToken || parsedToken === "{}" || parsedToken.trim() === "") {
    return {
      status: "0",
      message: "Invalid token format",
      data: null,
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        Accept: "application/json",
      },
    }).catch(() => {
      // Silently catch fetch errors (network issues, 401s, etc.)
      return null;
    });

    if (!response) {
      return {
        status: "0",
        message: "Network error",
        data: null,
      };
    }

    const data = await response.json();

    // Handle error responses - silently for 401
    if (!response.ok) {
      // Silently handle 401 errors (user not authenticated or token expired)
      if (response.status === 401) {
        handleAuthExpired();
        return {
          status: "0",
          message: "Unauthorized",
          data: null,
        };
      }
      // Log other errors only
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
    // Silently handle all errors - don't log to console
    return {
      status: "0",
      message: "Network error",
      data: null,
    };
  }
};
