import { useNotification } from "../../store/customer/notification-context";
import TogglerBar from "../UI/ToggleBar";

function NotificationSetting(props: {
  question: string;
  appStatus: boolean;
  emailStatus: boolean;
  appKey: string;
  emailKey: string;
}) {
  const userId = JSON.parse(localStorage.getItem("data") ?? "").id;
  const { edit } = useNotification();
  return (
    <div className="w-full items-center flex justify-center ">
      <div className="bg-white py-2 lg:px-16 sm:px-10 flex flex-col dark:bg-dimGray xl:w-3/5 xs:w-full dark:text-white">
        <div className="border-b-2">
          <div className="flex flex-row justify-between pb-2">
            <div>{props.question}</div>
            <div className="flex flex-row space-x-10">
              <div>
                <TogglerBar
                  status={props.appStatus}
                  key={props.appKey}
                  onChange={(status) => {
                    const formData = new FormData();
                    formData.set("user_id", userId);
                    formData.set(props.appKey, status ? "1" : "0");
                    edit(formData);
                  }}
                />
              </div>
              <div>
                <TogglerBar
                  status={props.emailStatus}
                  key={props.emailKey}
                  onChange={(status) => {
                    const formData = new FormData();
                    formData.set("user_id", userId);
                    formData.set(props.emailKey, status ? "1" : "0");
                    edit(formData);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationSetting;
