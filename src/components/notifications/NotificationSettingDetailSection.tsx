import { useAuth } from "../../store/customer/auth-context";
import FullPageLoading from "../UI/FullPageLoading";
import NotificationSetting from "./NotificationSetting";
import NotificationSettingHeading from "./NotificationSettingHeading";

function NotificationSettingDetailSection() {
  const { userData, isDetailLoading } = useAuth();
  return (
    <div>
      {!isDetailLoading ? (
        <div>
          <NotificationSettingHeading />

          <NotificationSetting
            appStatus={
              userData?.metadata?.is_app_request_creation_notification_on == 1
                ? true
                : false
            }
            emailStatus={
              userData?.metadata?.is_email_request_creation_notification_on == 1
                ? true
                : false
            }
            question={"When a request has been created or closed"}
            appKey="is_app_request_creation_notification_on"
            emailKey="is_email_request_creation_notification_on"
          />

          <NotificationSetting
            appStatus={
              userData?.metadata?.is_app_recieved_quote_notification_on == 1
                ? true
                : false
            }
            emailStatus={
              userData?.metadata?.is_email_recieved_quote_notification_on == 1
                ? true
                : false
            }
            question={"When I receive a message or quote"}
            appKey="is_app_recieved_quote_notification_on"
            emailKey="is_email_recieved_quote_notification_on"
          />

          <NotificationSetting
            appStatus={
              userData?.metadata?.is_app_promotion_mail_notification_on == 1
                ? true
                : false
            }
            emailStatus={
              userData?.metadata?.is_email_promotion_mail_notification_on == 1
                ? true
                : false
            }
            question={"Occasional promotion and updates"}
            appKey="is_app_promotion_mail_notification_on"
            emailKey="is_email_promotion_mail_notification_on"
          />
        </div>
      ) : (
        <FullPageLoading className="!h-24" />
      )}
    </div>
  );
}

export default NotificationSettingDetailSection;
