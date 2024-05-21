import { useEffect } from "react";
import NotificationMainPage from "../../components/notifications/NotificationMainPage";
import { useNotification } from "../../store/customer/notification-context";

function Notification() {
  const { setUrl } = useNotification();
  const userId = JSON.parse(localStorage.getItem("data") ?? "").id;
  const role = localStorage.getItem("role");
  useEffect(() => {
    setUrl(
      `https://erranddo.com/admin/api/v1/notification?user_id=${userId}&is_for_${role}=1&page=${1}&per_page=${13}`
    );
  }, []);
  return (
    <div>
      <NotificationMainPage />
    </div>
  );
}

export default Notification;
