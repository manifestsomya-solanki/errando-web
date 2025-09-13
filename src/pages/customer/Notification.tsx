import { useEffect } from "react";
import NotificationMainPage from "../../components/notifications/NotificationMainPage";
import { useNotification } from "../../store/customer/notification-context";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../config/api";

function Notification() {
  const { setUrl } = useNotification();
  const userId = JSON.parse(localStorage.getItem("data") ?? "").id;
  const role = localStorage.getItem("role");
  useEffect(() => {
    setUrl(
      buildApiUrl(`${API_ENDPOINTS.NOTIFICATION}?user_id=${userId}&is_for_${role}=1&page=${1}&per_page=${13}`)
    );
  }, []);
  return (
    <div>
      <NotificationMainPage />
    </div>
  );
}

export default Notification;
