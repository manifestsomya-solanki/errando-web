import React, { useState, useContext } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser, SendOtp, UserData, VerifyOtp } from "../../models/user";
import { toast } from "react-toastify";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "../customer/home-context";

//auth response type declaration
type AuthProResponseType = {
  data?: UserData;
  userData?: UserData;
  login: (formData: FormData) => void;
  loginPro: (formData: FormData) => void;
  sendOtp: (formData: FormData) => void;
  verifyOtp: (
    formData: FormData,
    registerFormData: FormData,
    key: string
  ) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  isLoginProLoading: boolean;
  isLoginCustomerLoading: boolean;
  isDetailLoading: boolean;
  deleteHandler: (key: string) => void;
  logout: () => void;
  forgotPassword: (formData: FormData) => void;
  resetPassword: (formData: FormData) => void;
  isPasswordLoading: boolean;
  profileHandler: (formData: FormData) => Promise<void>;
  isProfileLoading: boolean;
  error: string;
  deleteImageHandler: () => Promise<void>;
  mutate: KeyedMutator<any>;
};

//auth context initialization
export const AuthProContext = createContext<AuthProResponseType>({
  login: (data) => {
    console.log(data);
  },
  loginPro: (data) => {
    console.log(data);
  },
  sendOtp: (data) => {
    console.log(data);
  },
  verifyOtp: (data, formData, key) => {
    console.log(data, formData, key);
  },
  isLoggedIn: false,
  isLoading: false,
  isLoginProLoading: false,
  isLoginCustomerLoading: false,
  isProfileLoading: false,
  isPasswordLoading: false,
  isDetailLoading: false,

  logout: () => {
    console.log();
  },
  forgotPassword: (d) => {
    console.log(d);
  },
  resetPassword: (d) => {
    console.log(d);
  },
  profileHandler: async (d) => {
    console.log(d);
  },
  deleteHandler: (d) => {
    console.log(d);
  },
  deleteImageHandler: async () => {
    console.log();
  },
  error: "",
  mutate: async () => {
    console.log();
  },
});

const AuthProContextProvider = (props: { children: React.ReactNode }) => {
  const initialToken = localStorage.getItem("data");
  const [data, setData] = useState(
    initialToken ? JSON.parse(initialToken) : undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isProLoading, setIsProLoading] = useState(false);
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(initialToken ? true : false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  let id;
  if (initialToken) {
    id = JSON.parse(initialToken).id;
  }
  const userDetailUrl = `https://erranddo.com/admin/api/v1/user/detail?user_id=${id}`;
  const {
    data: userdata,
    isLoading: detailLoading,
    mutate,
  } = useSWR(userDetailUrl, fetcher);

  // const url = `https://erranddo.com/admin/api/v1/user-requests?page=${currentPage}&per_page=${perPage}&status=PENDING&user_id=${id}`;
  const userData: UserData = userdata?.data;

  //login
  const login = async (formData: FormData) => {
    setIsCustomerLoading(true);
    setError("");
    const res = await fetch(
      "https://erranddo.com/admin/api/v1/user/login",
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
      "https://erranddo.com/admin/api/v1/user/login",
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
  const sendOtp = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    const res = await fetch(
      "https://erranddo.com/admin/api/v1/user/send-otp",
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      setIsLoading(false);
      const data: SendOtp = await res.json();

      if (data.status === "0") {
        setError(data.message);
      } else {
        setError("");
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
    }
  };

  //verfiy otp
  const verifyOtp = async (
    formData: FormData,
    registerFormData: FormData,
    key: string
  ) => {
    setIsLoading(true);
    setError("");
    console.log("here");
    const res = await fetch(
      "https://erranddo.com/admin/api/v1/user/verify-otp",
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      const data: VerifyOtp = await res.json();
      console.log("edfe", data);
      if (data.status === "0") {
        console.log("wdwdw");
        setIsLoading(false);
        setError(data?.message);
      } else {
        console.log("wwdw");
        if (data.data.is_email_verified !== "1") {
          setIsLoading(false);
          setError("Please enter a correct email otp");
        } else if (data.data.is_mobile_verified !== "1") {
          setIsLoading(false);
          setError("Please enter a correct mobile otp");
        } else {
          setIsLoading(true);

          setError("");
        }
        localStorage.setItem("token", data.token);
        const res = await fetch(
          "https://erranddo.com/admin/api/v1/user/register",
          {
            method: "POST",
            body: registerFormData,
          }
        );
        if (res.status === 200) {
          const data: RegisterUser = await res.json();
          setIsLoading(false);
          if (data.status === "0") {
            setError(data.message);
          } else {
            setData(data.data.user);
            setIsLoggedIn(true);
            localStorage.setItem("data", JSON.stringify(data?.data?.user));
            localStorage.setItem("isLoggedIn", "true");
            if (key === "customer") {
              localStorage.setItem("role", "customer");
              navigate("/home");
            } else if (key === "pro") {
              localStorage.setItem("role", "pro");
              navigate("/pro/dashboard");
            }

            setError("");
          }
        }
      }
    } else {
      const data: any = await res.json();
      setIsLoading(false);
      setError(data.message);
    }
  };

  //forgot-password
  const forgotPassword = async (formData: FormData) => {
    setError("");
    setIsLoading(true);

    const res = await fetch("http://127.0.0.1:8000/api/v1/forgot-password", {
      method: "POST",
      body: formData,
    });
    if (res.status === 200) {
      setError("");
      setTimeout(() => {
        setIsLoading(false);
      });
      const data: any = await res.json();
      if (data.status === "1") {
        // toast.success("Email has been successfully sent !");
      } else {
        setError(data.message);
        // toast.error(data.error);
      }
    } else {
      const data: any = await res.json();
      setError(data.message);
      setIsLoading(false);
      // toast.error(data.message);
    }
  };

  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  //reset-password
  const resetPassword = async (formData: FormData) => {
    setIsPasswordLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://erranddo.com/admin/api/v1/settings/change-password",
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
        navigate("/pro/dashboard");
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
      "https://erranddo.com/admin/api/v1/user/logout",
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
      "https://erranddo.com/admin/api/v1/user/edit",
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
        toast.success("Profile has been updated successfully !", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log("successful");
      } else {
        toast.error("Error", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log("ntosuccessful");
      }
    } else {
      const data: any = await res.json();
      setIsProfileLoading(false);
      // toast.error(data.message);
    }
  };

  const deleteImageHandler = async () => {
    setIsDeleting(true);
    setError("");

    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://erranddo.com/admin/api/v1/user/delete-profile`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      const data = await res.json();
      setIsDeleting(false);

      if (data.status === "1") {
        // Deletion successful
        // Perform any additional logic as needed
      } else {
        setError(data.message);
      }
    } else {
      const data = await res.json();
      setIsDeleting(false);
      setError(data.message);
    }
  };

  const deleteHandler = async (id: string) => {
    setIsLoading(true);
    setIsDeleting(true);
    setError("");

    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://erranddo.com/admin/api/v1/user/${id}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      const data = await res.json();
      setIsDeleting(false);

      if (data.status === "1") {
        localStorage.removeItem("token");
        localStorage.setItem("isLoggedIn", "false");
        setIsLoggedIn(false);
        setIsLoading(false);
        navigate("/signup-customer");
      } else {
        setError(data.message);
      }
    } else {
      const data = await res.json();
      setIsDeleting(false);
      setError(data.message);
    }
  };

  return (
    <AuthProContext.Provider
      value={{
        data: data,
        userData: userData,
        login: login,
        loginPro: loginPro,
        logout: logoutHandler,
        resetPassword: resetPassword,
        forgotPassword: forgotPassword,
        profileHandler: profileHandler,
        isDetailLoading: detailLoading,
        isPasswordLoading: isPasswordLoading,
        isLoading: isLoading,
        isLoginCustomerLoading: isCustomerLoading,
        isLoginProLoading: isProLoading,
        isLoggedIn: isLoggedIn,
        isProfileLoading: isProfileLoading,
        sendOtp: sendOtp,
        verifyOtp: verifyOtp,
        deleteHandler: deleteHandler,
        deleteImageHandler: deleteImageHandler,
        error: error,
        mutate: mutate,
      }}
    >
      {props.children}
    </AuthProContext.Provider>
  );
};

export function useAuthPro() {
  const authProCtx = useContext(AuthProContext);
  return authProCtx;
}
export default AuthProContextProvider;
