import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import ThemeContextProvider from "./store/theme-context.tsx";
import React from "react";
import AuthContextProvider from "./store/customer/auth-context.tsx";
import HomeServiceContextProvider from "./store/customer/home-context.tsx";
import AuthProContextProvider from "./store/pro/auth-pro-context.tsx";
import { StripeProvider } from "./store/pro/stripe-context.tsx";
import ServiceContextProvider from "./store/customer/service-context.tsx";
import NotificationContextProvider from "./store/customer/notification-context.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <HomeServiceContextProvider>
      <AuthContextProvider>
        <AuthProContextProvider>
          <ThemeContextProvider>
            <ServiceContextProvider>
              <StripeProvider>
                <NotificationContextProvider>
                  <React.StrictMode>
                    <App />
                  </React.StrictMode>
                </NotificationContextProvider>
              </StripeProvider>
            </ServiceContextProvider>
          </ThemeContextProvider>
        </AuthProContextProvider>
      </AuthContextProvider>
    </HomeServiceContextProvider>
  </Router>
);
