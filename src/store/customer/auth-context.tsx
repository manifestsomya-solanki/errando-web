import React, { useState, useContext } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser, SendOtp, UserData, VerifyOtp } from "../../models/user";
import { toast } from "react-toastify";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "./home-context";

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
  addRequest: (formData: FormData, tokenFromApi?: string) => Promise<void>;
  editRequest: (formData: FormData, id: string) => Promise<void>;

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
  },
  editRequest: async (data, id) => {
    console.log(data, id);
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
  const userDetailUrl = `https://erranddo.kodecreators.com/api/v1/user/detail?user_id=${id}`;
  const {
    data: userdata,
    isLoading: detailLoading,
    mutate,
  } = useSWR(userDetailUrl, fetcher);

  // const url = `https://erranddo.kodecreators.com/api/v1/user-requests?page=${currentPage}&per_page=${perPage}&status=PENDING&user_id=${id}`;
  const userData: UserData = userdata?.data;

  //Manage Loading
  const manageLoading = async (boolean: boolean) => {
    setIsLoading(boolean);
  };

  //login
  const login = async (formData: FormData) => {
    setIsCustomerLoading(true);
    setError("");
    const res = await fetch(
      "https://erranddo.kodecreators.com/api/v1/user/login",
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
      const data: any = await res.json();
      setIsCustomerLoading(false);
      setError(data.message);
    }
  };

  //login pro

  const loginPro = async (formData: FormData) => {
    setIsProLoading(true);
    setError("");
    const res = await fetch(
      "https://erranddo.kodecreators.com/api/v1/user/login",
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
      const data: any = await res.json();
      setIsProLoading(false);
      setError(data.message);
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
    const res = await fetch(
      "https://erranddo.kodecreators.com/api/v1/user/send-otp",
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
        if (key && requestFormData) {
          requestFormData.set("user_id", data.data.id.toString());
          addRequest(requestFormData, data?.token);
        }
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
    }
  };

  //verfiy otp
  const verifyOtp = async (formData: FormData, key: string) => {
    setIsLoading(true);
    setError("");
    const res = await fetch(
      "https://erranddo.kodecreators.com/api/v1/user/verify-otp",
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      const data: VerifyOtp = await res.json();
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
        if (key === "customer") {
          setIsLoggedIn(true);
          localStorage.setItem("role", "customer");
          localStorage.setItem("isLoggedIn", "true");
          navigate("/home");
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
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
      return 0;
    }
  };

  const register = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    const res = await fetch(
      "https://erranddo.kodecreators.com/api/v1/user/register",
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
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
      return 0;
    }
  };

  //forgot-password
  const forgotPassword = async (formData: FormData) => {
    setError("");
    setIsLoading(true);

    const res = await fetch(
      "https://erranddo.kodecreators.com/api/v1/user/forgot-password",
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
      const data: any = await res.json();
      setError(data.message);
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
      "https://erranddo.kodecreators.com/api/v1/settings/change-password",
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
      const data: any = await res.json();
      setIsPasswordLoading(false);
      setError(data.message);
      toast.error("Error", {
        position: "bottom-left",
      });
    }
  };

  //logout
  const logoutHandler = async () => {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://erranddo.kodecreators.com/api/v1/user/logout",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      setIsLoading(false);
      if (data.status === "1") {
        // on success
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("data");

          localStorage.setItem("isLoggedIn", "false");
          setIsLoggedIn(false);
          setIsLoading(false);
          navigate("/sign-in");
        }, 1000);
      } else {
        setError(data.message);
      }
    } else {
      const data = await res.json();
      setIsLoading(false);
    }
  };

  //profile update
  const profileHandler = async (formData: FormData) => {
    setIsProfileLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://erranddo.kodecreators.com/api/v1/user/edit",
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
      "https://erranddo.kodecreators.com/api/v1/notification/edit",
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

  const addRequest = async (formData: FormData, tokenFromApi?: string) => {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token") ?? tokenFromApi;

    const res = await fetch(
      "https://erranddo.kodecreators.com/api/v1/user-requests/add",
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
      setrequestData(await res.json());
      if (requestData.status === "0") {
        setError(requestData.message);
      } else {
        if (!tokenFromApi) {
          setIsLoggedIn(true);
          localStorage.setItem("role", "customer");
          localStorage.setItem("isLoggedIn", "true");
          localStorage.removeItem("service");
          localStorage.removeItem("post_code");
          localStorage.removeItem("question");
          navigate("/projects");
          await mutate("project_contect_api");
        }
      }
    } else {
      setIsLoading(false);
      const data: any = await res.json();
      setError(data.message);
    }
  };
  console.log(requestData);
  const editRequest = async (formData: FormData, id: string) => {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://erranddo.kodecreators.com/api/v1/user-requests/${id}/edit`,
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
      } else {
        setIsLoggedIn(true);
        localStorage.removeItem("service");
        localStorage.removeItem("post_code");
        localStorage.removeItem("question");
        localStorage.setItem("role", "customer");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/projects");
        await mutate("project_contect_api");
      }
    } else {
      setIsLoading(false);
      const data: any = await res.json();

      setError(data.message);
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
