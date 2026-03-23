import React, { useEffect } from "react";
import NotificationMainPagePro from "../../components/pro/notifications/NotificationMainPagePro";
import { useNotification } from "../../store/customer/notification-context";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

function NotificationPro() {
  const { setUrl } = useNotification();
  const userId = JSON.parse(localStorage.getItem("data") ?? "").id;
  useEffect(() => {
    setUrl(
      // Route is always pro notifications, so never rely on localStorage role (can be stale).
      buildApiUrl(
        `${API_ENDPOINTS.NOTIFICATION}?user_id=${userId}&is_for_pro=1&page=${1}&per_page=${13}`
      )
    );
  }, [userId, setUrl]);
  return (
    <div>
      <NotificationMainPagePro />
    </div>
  );
}

export default NotificationPro;
