import { useEffect } from "react";
import NotificationMainPage from "../../components/notifications/NotificationMainPage";
import { useNotification } from "../../store/customer/notification-context";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

function Notification() {
  const { setUrl } = useNotification();
  const userId = JSON.parse(localStorage.getItem("data") ?? "").id;
  useEffect(() => {
    setUrl(
      // Route is always customer notifications, so never rely on localStorage role (can be stale).
      buildApiUrl(
        `${API_ENDPOINTS.NOTIFICATION}?user_id=${userId}&is_for_customer=1&page=${1}&per_page=${13}`
      )
    );
  }, [userId, setUrl]);
  return (
    <div>
      <NotificationMainPage />
    </div>
  );
}

export default Notification;
