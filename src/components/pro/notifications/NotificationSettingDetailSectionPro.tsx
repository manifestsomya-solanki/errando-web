import NotificationSettingPro from "./NotificationSettingPro";
import NotificationSettingHeadingPro from "./NotificationSettingHeadingPro";
import { useAuth } from "../../../store/pro/auth-pro-context";
import FullPageLoading from "../../UI/FullPageLoading";

function NotificationSettingDetailSectionPro() {
  const { userData, isDetailLoading } = useAuth();

  return (
    <div>
      <NotificationSettingHeadingPro />
      {!isDetailLoading ? (
        <div>
          <NotificationSettingPro
            appStatus={
              userData?.metadata?.is_app_lead_notification_on == 1
                ? true
                : false
            }
            emailStatus={
              userData?.metadata?.is_email_lead_notification_on == 1
                ? true
                : false
            }
            question={"When a new lead is posted that matches my niche "}
            appKey="is_app_lead_notification_on"
            emailKey="is_email_lead_notification_on"
          />
          <NotificationSettingPro
            appStatus={
              userData?.metadata?.is_app_request_quote_notification_on == 1
                ? true
                : false
            }
            emailStatus={
              userData?.metadata?.is_email_request_quote_notification_on == 1
                ? true
                : false
            }
            question={"When a customer requests a quote"}
            appKey="is_app_request_quote_notification_on"
            emailKey="is_email_request_quote_notification_on"
          />
          <NotificationSettingPro
            appStatus={
              userData?.metadata?.is_app_show_interest_notification_on == 1
                ? true
                : false
            }
            emailStatus={
              userData?.metadata?.is_email_show_interest_notification_on == 1
                ? true
                : false
            }
            question={"When a customer shows interest"}
            appKey="is_app_show_interest_notification_on"
            emailKey="is_email_show_interest_notification_on"
          />
          <NotificationSettingPro
            appStatus={
              userData?.metadata?.is_app_review_notification_on == 1
                ? true
                : false
            }
            emailStatus={
              userData?.metadata?.is_email_review_notification_on == 1
                ? true
                : false
            }
            question={"When a review has been received "}
            appKey="is_app_review_notification_on"
            emailKey="is_email_review_notification_on"
          />
          <NotificationSettingPro
            appStatus={
              userData?.metadata?.is_app_customer_sends_message_on == 1
                ? true
                : false
            }
            emailStatus={
              userData?.metadata?.is_email_customer_sends_message_on == 1
                ? true
                : false
            }
            question={"When a customer sends a message"}
            appKey="is_app_customer_sends_message_on"
            emailKey="is_email_customer_sends_message_on"
          />
          <NotificationSettingPro
            appStatus={
              userData?.metadata?.is_app_close_request_notification_on == 1
                ? true
                : false
            }
            emailStatus={
              userData?.metadata?.is_email_close_request_notification_on == 1
                ? true
                : false
            }
            question={"When a customer closes a request I have purchased "}
            appKey="is_app_close_request_notification_on"
            emailKey="is_email_close_request_notification_on"
          />
          <NotificationSettingPro
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
            question={"Occasional promotional emails"}
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

export default NotificationSettingDetailSectionPro;
