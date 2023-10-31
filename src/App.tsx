import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/customer/HomePage";
import Services from "./pages/customer/Services";
import ServiceDetail from "./pages/customer/ServiceDetail";
import DealerDetail from "./pages/customer/DealerDetail";
import Settings from "./pages/customer/Settings";
import SignUpPage from "./pages/customer/SignUpPage";
import PersonalInfo from "./components/customer/settings/personal-info/PersonalInfo";
import ContactDetails from "./components/customer/settings/contact-details/CotactDetails";
import ResetPassword from "./components/customer/settings/reset-password/ResetPassword";
import Projects from "./pages/customer/Projects";
import NotFoundOage from "./pages/customer/NotFoundOage";
import SignInPage from "./pages/customer/SignInPage";
import SignUpCustomer from "./pages/customer/SignUpCustomer";
import Dashboard from "./pages/pro/Dashboard";
import Home from "./pages/pro/Home";
import Notification from "./pages/customer/Notification";
import NotificationContent from "./components/notifications/NotificationContent";
import { useAuth } from "./store/customer/auth-context";
import "react-toastify/dist/ReactToastify.css"; // import first
import { ToastContainer, toast } from "react-toastify";
import DealerDetailPro from "./pages/pro/DealerDetailPro";
import Leads from "./pages/pro/Leads";
import LeadDetail from "./pages/pro/LeadDetail";
import SettingsPro from "./pages/pro/SettingsPro";
import PersonalInfoPro from "./components/pro/settings/personal-info/PersonalInfoPro";
import ContactDetailPro from "./components/pro/settings/contact-details/ContactDetailPro";
import PasswordPro from "./components/pro/settings/password/PasswordPro";
import PaymentDetailPro from "./components/pro/settings/payment-details/PaymentDetailPro";
import CreditsPro from "./components/pro/settings/credits/CreditsPro";
import InvoicePro from "./components/pro/settings/invoices/InvoicePro";
import Responses from "./pages/pro/Responses";
import Chat from "./pages/pro/Chat";
import NotificationSettingDetailSection from "./components/notifications/NotificationSettingDetailSection";
import HomeMainPage from "./components/pro/dashboard/home/HomeMainPage";
import Messages from "./pages/customer/Messages";
import ResponseDetail from "./pages/pro/ResponseDetail";
import Notes from "./pages/pro/Notes";
import { useEffect, useState } from "react";
import { onMessageListener, requestForToken } from "./Firebase";
import NotificationPro from "./pages/pro/NotificationPro";
import NotificationContentPro from "./components/pro/notifications/NotificationContentPro";
import NotificationSettingDetailSectionPro from "./components/pro/notifications/NotificationSettingDetailSectionPro";
import MyReviews from "./components/customer/settings/reviews/MyReviews";

function App() {
  const role = localStorage.getItem("role");
  const { isLoggedIn } = useAuth();
  // const [notification, setNotification] = useState({ title: "", body: "" });
  // requestForToken();
  // onMessageListener()
  //   .then((payload: any) => {
  //     setNotification({
  //       title: payload?.notification?.title,
  //       body: payload?.notification?.body,
  //     });
  //     console.log(payload);
  //   })
  //   .catch((err) => console.log("failed: ", err));

  // const notify = () =>
  //   toast.info(<ToastDisplay />, { className: "dark:bg-black bg-white" });
  // function ToastDisplay() {
  //   return (
  //     <div>
  //       <p>
  //         <b>{notification?.title}</b>
  //       </p>
  //       <p>{notification?.body}</p>
  //     </div>
  //   );
  // }
  // useEffect(() => {
  //   if (notification?.title) {
  //     notify();
  //     setNotification({ title: "", body: "" });
  //   }
  // }, [notification]);
  return (
    <div>
      <Routes>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup-pro" element={<SignUpPage />} />
        <Route path="/signup-customer" element={<SignUpCustomer />} />
        <Route path="/sign-in" element={<SignInPage />} />

        {isLoggedIn && role === "customer" && (
          <Route>
            <Route path="/settings" element={<Settings />}>
              <Route
                index
                element={<Navigate to="/settings/personal-info" replace />}
              />
              <Route
                path="/settings/personal-info"
                element={<PersonalInfo />}
              ></Route>
              <Route
                path="/settings/contact-details"
                element={<ContactDetails />}
              ></Route>
              <Route
                path="/settings/reset-password"
                element={<ResetPassword />}
              ></Route>
              <Route
                path="/settings/my-reviews"
                element={<MyReviews />}
              ></Route>
            </Route>

            <Route path="/projects" element={<Projects />}></Route>
            <Route path="/services" element={<Services />}>
              <Route
                index
                element={<Navigate to="/services/service-detail" replace />}
              />

              <Route
                path="/services/service-detail/:id"
                element={<ServiceDetail />}
              ></Route>
              <Route
                path="/services/dealer-detail/:id"
                element={<DealerDetail />}
              ></Route>
            </Route>
            <Route path="/messages" element={<Messages />}></Route>
          </Route>
        )}
        {isLoggedIn && role === "pro" && (
          <Route path="/pro" element={<Dashboard />}>
            <Route index element={<Navigate to="/pro/dashboard" replace />} />
            <Route path="/pro/dashboard" element={<Home />}>
              <Route index element={<HomeMainPage />} />
              <Route
                path="/pro/dashboard/dealer-detail/:id"
                element={<DealerDetailPro />}
              ></Route>
            </Route>
            <Route path="/pro/leads" element={<Leads />}>
              <Route path="/pro/leads/:id" element={<LeadDetail />}></Route>
            </Route>
            <Route path="/pro/responses" element={<Responses />}>
              <Route
                path="/pro/responses/:id"
                element={<ResponseDetail />}
              ></Route>
              <Route path="/pro/responses/chat" element={<Chat />}></Route>
              <Route
                path="/pro/responses/notes/:id"
                element={<Notes />}
              ></Route>
            </Route>

            <Route>
              <Route path="/pro/settings" element={<SettingsPro />}>
                <Route
                  index
                  element={
                    <Navigate to="/pro/settings/personal-info" replace />
                  }
                />
                <Route
                  path="/pro/settings/personal-info"
                  element={<PersonalInfoPro />}
                ></Route>
                <Route
                  path="/pro/settings/contact-details"
                  element={<ContactDetailPro />}
                ></Route>
                <Route
                  path="/pro/settings/reset-password"
                  element={<PasswordPro />}
                ></Route>
                <Route
                  path="/pro/settings/payment-details"
                  element={<PaymentDetailPro />}
                ></Route>
                <Route
                  path="/pro/settings/credits"
                  element={<CreditsPro />}
                ></Route>
                <Route
                  path="/pro/settings/invoices"
                  element={<InvoicePro />}
                ></Route>
              </Route>
            </Route>
          </Route>
        )}

        <Route path="/pro/notifications" element={<NotificationPro />}>
          <Route
            index
            element={<Navigate to="/pro/notifications/detail" replace />}
          />
          <Route
            path="/pro/notifications/detail"
            element={<NotificationContentPro />}
          ></Route>
          <Route
            path="/pro/notifications/setting"
            element={<NotificationSettingDetailSectionPro />}
          ></Route>
        </Route>

        <Route path="/notifications" element={<Notification />}>
          <Route
            index
            element={<Navigate to="/notifications/detail" replace />}
          />
          <Route
            path="/notifications/detail"
            element={<NotificationContent />}
          ></Route>
          <Route
            path="/notifications/setting"
            element={<NotificationSettingDetailSection />}
          ></Route>
        </Route>
        <Route path="/pro-dashboard" element={<DealerDetail />} />
        <Route path="*" element={<NotFoundOage />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
