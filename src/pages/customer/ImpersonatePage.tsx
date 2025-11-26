import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Error from "../../components/UI/Error";
import { API_BASE_URL } from "../../config/api";

/**
 * Impersonate Page - Secure impersonation flow
 * This page exchanges the one-time impersonation token for a real login token
 * NO real tokens are exposed in the URL
 */
const ImpersonatePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exchangeToken = async () => {
      try {
        // Get impersonation token from URL (one-time use, expires in 10 seconds)
        const impersonationToken = searchParams.get("token");

        if (!impersonationToken) {
          setError("Invalid impersonation token");
          setLoading(false);
          return;
        }

        // Exchange impersonation token for real login token
        // Use API_BASE_URL from config (environment-based)
        // API_BASE_URL already includes /api/v1 or /v1 based on environment
        const exchangeUrl = `${API_BASE_URL}/auth/exchange-impersonation`;
        
        const response = await fetch(exchangeUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ token: impersonationToken }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Exchange error:', response.status, errorText);
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }
          setError(errorMessage);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (response.ok && data.status === "1" && data.token && data.data) {
          const realToken = data.token;
          const userData = data.data;
          const role = userData.role === "pro" ? "pro" : "customer";

          // Store real login token in localStorage (NOT in URL)
          localStorage.setItem("token", realToken);
          localStorage.setItem("data", JSON.stringify(userData));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", role);

          // Clear URL parameters (remove impersonation token from URL)
          window.history.replaceState({}, document.title, "/impersonate");

          // Navigate based on role
          if (role === "pro") {
            navigate("/pro");
          } else {
            navigate("/home");
          }
        } else {
          setError(data.message || "Invalid or expired impersonation token");
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Error exchanging impersonation token:", error);
        const errorMessage = error?.message || "Failed to exchange impersonation token. Please try again.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    exchangeToken();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto"></div>
          <p className="mt-4 text-gray-600">Logging you in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Error error={error} />
          <button
            onClick={() => navigate("/sign-in")}
            className="mt-4 px-4 py-2 bg-primaryBlue text-white rounded hover:bg-blue-600"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ImpersonatePage;

