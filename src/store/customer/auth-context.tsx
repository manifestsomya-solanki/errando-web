import React, { useState, useContext, useEffect } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser, SendOtp, UserData, VerifyOtp } from "../../models/user";
import { toast } from "react-toastify";
import useSWR, { KeyedMutator } from "swr";
import { mutate as globalMutate } from "swr";
import { fetcher } from "./home-context";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../config/api";
import { clearAuthStorage, getBearerToken } from "../../utils/authSession";
import { getApiErrorMessage, isRateLimited } from "../../utils/httpErrors";

//auth response type declaration
type AuthResponseType = {
  data?: UserData;
  requestData: RegisterUser;
  userData?: UserData;
  login: (formData: FormData) => void;
  loginPro: (formData: FormData) => void;
  sendOtp: (
    formData: FormData,
    key?: string,
    requestFormData?: FormData
  ) => void;
  register: (formData: FormData) => Promise<number>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  verifyOtp: (
    formData: FormData,

    key: string
  ) => Promise<number>;
  isLoggedIn: boolean;
  isLoading: boolean;
  isDetailLoading: boolean;

  isLoginProLoading: boolean;
  isLoginCustomerLoading: boolean;
  logout: () => void;
  forgotPassword: (formData: FormData) => Promise<void>;
  addRequest: (formData: FormData, tokenFromApi?: string) => Promise<boolean>;
  editRequest: (formData: FormData, id: string) => Promise<boolean>;

  manageLoading: (boolean: boolean) => Promise<void>;
  resetPassword: (formData: FormData) => void;
  profileHandler: (formData: FormData) => void;
  edit: (formData: FormData) => void;
  isProfileLoading: boolean;
  isPasswordLoading: boolean;
  error: string;
  mutate: KeyedMutator<any>;
};

//auth context initialization
export const AuthContext = createContext<AuthResponseType>({
  login: (data) => {
    console.log(data);
  },
  loginPro: (data) => {
    console.log(data);
  },
  sendOtp: (data, key, requestData) => {
    console.log(data, key, requestData);
  },
  register: async (data) => {
    return 0;
  },
  addRequest: async (data) => {
    console.log(data);
    return false;
  },
  editRequest: async (data, id) => {
    console.log(data, id);
    return false;
  },
  verifyOtp: async (data, key) => {
    console.log(data, key);
    return 0;
  },
  setError: {} as React.Dispatch<React.SetStateAction<string>>,
  manageLoading: async (data) => {
    console.log();
  },
  edit: (formData: FormData) => {
    console.log(formData);
  },
  isLoggedIn: false,
  isDetailLoading: false,
  requestData: {} as RegisterUser,
  isLoading: false,
  isLoginProLoading: false,
  isLoginCustomerLoading: false,
  isProfileLoading: false,
  isPasswordLoading: false,
  logout: () => {
    console.log();
  },
  forgotPassword: async (d) => {
    console.log(d);
  },
  resetPassword: (d) => {
    console.log(d);
  },
  profileHandler: (d) => {
    console.log(d);
  },
  error: "",
  mutate: async () => {
    console.log();
  },
});

const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const initialToken = localStorage.getItem("data");
  const [data, setData] = useState(
    initialToken ? JSON.parse(initialToken) : undefined
  );
  const [requestData, setrequestData] = useState(
    initialToken ? JSON.parse(initialToken) : undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isProLoading, setIsProLoading] = useState(false);
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(initialToken ? true : false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  let id;
  if (initialToken) {
    id = JSON.parse(initialToken).id;
  }
  const userDetailUrl = id
    ? buildApiUrl(`${API_ENDPOINTS.USER_DETAIL}?user_id=${id}`)
    : null;
  const {
    data: userdata,
    isLoading: detailLoading,
    mutate,
  } = useSWR(userDetailUrl, fetcher);

  // const url = buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS}?page=${currentPage}&per_page=${perPage}&status=PENDING&user_id=${id}`);
  const userData: UserData = userdata?.data;

  // Expired / invalid server session → force local logout
  useEffect(() => {
    const onExpired = () => {
      setData(undefined);
      setIsLoggedIn(false);
      navigate("/sign-in");
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [navigate]);

  useEffect(() => {
    if (!id || !userdata) return;
    if (
      userdata.status === "0" &&
      (userdata.message === "Unauthorized" ||
        userdata.message === "No token found" ||
        userdata.message === "Invalid token format")
    ) {
      clearAuthStorage();
      setData(undefined);
      setIsLoggedIn(false);
      navigate("/sign-in");
    }
  }, [userdata, id, navigate]);

  const handleAuthHttpError = async (res: Response): Promise<string> => {
    let data: { message?: string; error?: string } = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    const message = getApiErrorMessage(res, data);
    if (isRateLimited(res)) {
      toast.error(message);
    }
    return message;
  };

  //Manage Loading
  const manageLoading = async (boolean: boolean) => {
    setIsLoading(boolean);
  };

  //login
  const login = async (formData: FormData) => {
    setIsCustomerLoading(true);
    setError("");
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.USER_LOGIN),
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.status === 200) {
      setIsCustomerLoading(false);
      const data: VerifyOtp = await res.json();

      if (data.status === "0") {
        setError(data.message);
      } else {
        setData(data.data);
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token);
        localStorage.setItem("data", JSON.stringify(data?.data));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "customer");
        navigate("/home");
        setError("");
      }
    } else {
      const message = await handleAuthHttpError(res);
      setIsCustomerLoading(false);
      setError(message);
    }
  };

  //login pro

  const loginPro = async (formData: FormData) => {
    setIsProLoading(true);
    setError("");
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.USER_LOGIN),
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.status === 200) {
      setIsProLoading(false);
      const data: VerifyOtp = await res.json();

      if (data.status === "0") {
        setError(data.message);
      } else {
        setData(data.data);
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token);
        localStorage.setItem("data", JSON.stringify(data?.data));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "pro");
        navigate("/pro");
        setError("");
      }
    } else {
      const message = await handleAuthHttpError(res);
      setIsProLoading(false);
      setError(message);
    }
  };

  //sendotp
  const sendOtp = async (
    formData: FormData,
    key?: string,
    requestFormData?: FormData
  ) => {
    setIsLoading(true);
    setError("");
    
    // If registration flow, clear old token and data first to prevent stale data
    if (key === "registration") {
      localStorage.removeItem("token");
      localStorage.removeItem("data");
    }
    
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.USER_SEND_OTP),
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      setIsLoading(false);
      const data: SendOtp = await res.json();

      if (data.status === "0") {
        setIsLoading(false);
        setError(data.message);
      } else {
        setIsLoading(false);
        console.log(data);
        setError("");
        
        // For registration flow, store requestFormData and token temporarily
        // Don't call addRequest immediately - wait for OTP verification
        if (key === "registration" && requestFormData && data?.token) {
          // Store requestFormData and token for later use after OTP verification
          requestFormData.set("user_id", data.data.id.toString());
          
          // Convert FormData to a storable format
          const formDataObj: Record<string, string> = {};
          requestFormData.forEach((value, key) => {
            formDataObj[key] = value.toString();
          });
          
          localStorage.setItem("pending_request_data", JSON.stringify(formDataObj));
          localStorage.setItem("pending_request_token", data.token);
          // Don't call addRequest here - wait for OTP verification
        } else if (key && requestFormData && key !== "registration") {
          // For non-registration flows, keep the old behavior
          requestFormData.set("user_id", data.data.id.toString());
          addRequest(requestFormData, data?.token);
        }
      }
    } else {
      const message = await handleAuthHttpError(res);
      setIsLoading(false);
      setError(message);
    }
  };

  //verfiy otp
  const verifyOtp = async (formData: FormData, key: string) => {
    setIsLoading(true);
    setError("");
    
    // Debug logging
    console.log('OTP Verification Debug:', {
      otp: formData.get('otp'),
      email: formData.get('email'),
      key: key
    });
    
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.USER_VERIFY_OTP),
      {
        method: "POST",
        body: formData,
      }
    );
    
    console.log('OTP Response Status:', res.status);
    
    if (res.status === 200) {
      const data: VerifyOtp = await res.json();
      console.log('OTP Response Data:', data);
      
      if (data.status == "0") {
        setError(data.message ?? "The otp is not valid");
        setIsLoading(false);
        return 0;
      } else {
        setIsLoading(false);
        setError("");
        setData(data.data);
        localStorage.setItem("data", JSON.stringify(data.data));
        localStorage.setItem("token", data.token);
        
        // Check if this is registration flow (pending request data exists)
        const isRegistrationFlow = localStorage.getItem("pending_request_data") !== null;
        
        if (key === "customer") {
          setIsLoggedIn(true);
          localStorage.setItem("role", "customer");
          localStorage.setItem("isLoggedIn", "true");
          
          // Don't navigate to /home if registration flow - CommentsModal will open
          if (!isRegistrationFlow) {
            navigate("/home");
          }
        } else if (key === "pro") {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", "pro");
          navigate("/pro/dashboard");
        } else if (key === "register") {
          setIsLoggedIn(false);
        }
        return 1;
      }
    } else {
      const message = await handleAuthHttpError(res);
      console.log('OTP Error Response:', message);
      setIsLoading(false);
      setError(message);
      return 0;
    }
  };

  const register = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.USER_REGISTER),
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.status === 200) {
      const data: RegisterUser = await res.json();
      setIsLoading(false);
      if (data.status === "0") {
        setError(data.message);
        return 0;
      } else {
        setError("");
        return 1;
      }
    } else {
      const message = await handleAuthHttpError(res);
      setIsLoading(false);
      setError(message);
      return 0;
    }
  };

  //forgot-password
  const forgotPassword = async (formData: FormData) => {
    setError("");
    setIsLoading(true);

    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.FORGOT_PASSWORD),
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      setError("");
      setTimeout(() => {
        setIsLoading(false);
      });
      const data: any = await res.json();
      if (data.status === "1") {
        console.log("foogot password");
      } else {
        setError(data.message);
      }
    } else {
      const message = await handleAuthHttpError(res);
      setError(message);
      setIsLoading(false);
    }
  };

  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  //reset-password
  const resetPassword = async (formData: FormData) => {
    setIsPasswordLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.SETTINGS_CHANGE_PASSWORD),
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
      setTimeout(() => {
        setIsPasswordLoading(false);
      });
      const data: any = await res.json();

      if (data?.status === "1") {
        toast.success("Password reset successfull!", {
          hideProgressBar: false,
          position: "bottom-left",
        });
        navigate("/home");
      } else {
        setError(data?.message);
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const message = await handleAuthHttpError(res);
      setIsPasswordLoading(false);
      setError(message);
      toast.error(message, {
        position: "bottom-left",
      });
    }
  };

  //logout — always clear local session (token may already be gone server-side)
  const logoutHandler = async () => {
    setIsLoading(true);
    setError("");
    const bearer = getBearerToken();

    try {
      if (bearer) {
        await fetch(buildApiUrl(API_ENDPOINTS.USER_LOGOUT), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearer}`,
            Accept: "application/json",
          },
        });
      }
    } catch {
      // ignore network / 401 — local logout still proceeds
    } finally {
      clearAuthStorage();
      setIsLoggedIn(false);
      setData(undefined);
      setIsLoading(false);
      navigate("/sign-in");
    }
  };

  //profile update
  const profileHandler = async (formData: FormData) => {
    setIsProfileLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.USER_EDIT),
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
      setTimeout(() => {
        setIsProfileLoading(false);
      });
      const data: any = await res.json();
      if (data.status === "1") {
        mutate();
        toast.success("Profile updated successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      } else {
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data: any = await res.json();
      setIsProfileLoading(false);
      setError(data.message);
      toast.error("Error", {
        position: "bottom-left",
      });
    }
  };

  //profile update
  const edit = async (formData: FormData) => {
    setError("");

    const token = localStorage.getItem("token");
    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.NOTIFICATION_EDIT),
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
      setTimeout(() => {
        setIsProfileLoading(false);
      });
      const data: any = await res.json();
      if (data.status === "1") {
        // navigate("/home");
        toast.success("Profile updated successfully !", {
          hideProgressBar: false,
          position: "bottom-left",
        });
      } else {
        toast.error(data.message, {
          hideProgressBar: false,
          position: "bottom-left",
        });
      }
    } else {
      const data: any = await res.json();
      setIsProfileLoading(false);
      setError(data.message);
      toast.error("Error", {
        position: "bottom-left",
      });
    }
  };

  const addRequest = async (formData: FormData, tokenFromApi?: string): Promise<boolean> => {
    setIsLoading(true);
    setError("");
    
    // Prioritize tokenFromApi (passed from CommentsModal) over localStorage token
    // CommentsModal passes the latest token from verifyOtp, not old pending token
    const token = tokenFromApi || localStorage.getItem("token");
    
    if (!token) {
      setError("No authentication token available");
      setIsLoading(false);
      return false;
    }

    const res = await fetch(
      buildApiUrl(API_ENDPOINTS.USER_REQUESTS_ADD),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      }
    );

    if (res.status === 200) {
      const responseData = await res.json();
      setIsLoading(false);
      setrequestData(responseData);
      if (responseData.status === "0") {
        setError(responseData.message);
        return false;
      } else {
        // Auto-login after successful request submission
        if (responseData.data?.token) {
          // Update localStorage first - ensure all data is saved
          const newToken = responseData.data.token;
          const oldToken = localStorage.getItem("token");
          
          console.log("Token Update:", {
            oldToken: oldToken?.substring(0, 20) + "...",
            newToken: newToken?.substring(0, 20) + "...",
            updated: newToken !== oldToken
          });
          
          localStorage.setItem("token", newToken);
          localStorage.setItem("data", JSON.stringify(responseData.data.user));
          localStorage.setItem("role", "customer");
          localStorage.setItem("isLoggedIn", "true");
          
          // Clear service flow data
          localStorage.removeItem("service");
          localStorage.removeItem("post_code");
          localStorage.removeItem("question");
          
          // Update state
          setIsLoggedIn(true);
          setData(responseData.data.user);
          
          // Small delay to ensure localStorage is written and project context can read it
          await new Promise(resolve => setTimeout(resolve, 150));
          
          // Navigate to projects page
          console.log("Navigating to /projects after successful request submission");
          navigate("/projects");
          
          // Refresh project data by mutating all USER_REQUESTS related SWR keys
          // This will trigger revalidation of project context data
          await globalMutate(
            (key) => typeof key === 'string' && key.includes(API_ENDPOINTS.USER_REQUESTS),
            undefined,
            { revalidate: true }
          );
        } else {
          console.log("No token received in response:", responseData);
        }
        return true;
      }
    } else {
      const message = await handleAuthHttpError(res);
      setIsLoading(false);
      setError(message);
      return false;
    }
  };
  const editRequest = async (formData: FormData, id: string): Promise<boolean> => {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    const res = await fetch(
      buildApiUrl(`${API_ENDPOINTS.USER_REQUESTS_EDIT}/${id}`),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      }
    );

    if (res.status === 200) {
      setIsLoading(false);
      const data: RegisterUser = await res.json();
      if (data.status === "0") {
        setError(data.message);
        return false;
      } else {
        setIsLoggedIn(true);
        localStorage.removeItem("service");
        localStorage.removeItem("post_code");
        localStorage.removeItem("question");
        localStorage.setItem("role", "customer");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/projects");
        await mutate("project_contect_api");
        return true;
      }
    } else {
      setIsLoading(false);
      const data: any = await res.json();

      setError(data.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        data: data,
        userData: userData,
        requestData: requestData,
        login: login,
        loginPro: loginPro,
        logout: logoutHandler,
        resetPassword: resetPassword,
        forgotPassword: forgotPassword,
        profileHandler: profileHandler,
        isProfileLoading: isProfileLoading,
        isPasswordLoading: isPasswordLoading,
        isLoading: isLoading,
        isDetailLoading: detailLoading,
        isLoginCustomerLoading: isCustomerLoading,
        isLoginProLoading: isProLoading,
        isLoggedIn: isLoggedIn,
        manageLoading: manageLoading,
        sendOtp: sendOtp,
        register: register,
        verifyOtp: verifyOtp,
        error: error,
        edit: edit,
        editRequest: editRequest,
        addRequest: addRequest,
        setError: setError,
        mutate: mutate,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
export default AuthContextProvider;
