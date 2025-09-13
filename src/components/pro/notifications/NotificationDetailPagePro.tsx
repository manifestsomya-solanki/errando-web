import { useNavigate } from "react-router";
import BackArrow from "../../../assets/BackArrow";
import Heading from "../../UI/Heading";
import NotificationLinksPro from "./NotificationLinksPro";
import { useTheme } from "../../../store/theme-context";

function NotificationDetailPagePro() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <div>
      <div
        className="flex gap-2 items-center pt-6"
        onClick={() => navigate("/pro/dashboard")}
      >
        {theme === "light" && <div children={<BackArrow color="black" />} />}

        {theme === "dark" && <div children={<BackArrow color="white" />} />}
        <Heading
          text="Back"
          variant="smallTitle"
          headingclassname="text-slate-500 !font-semibold tracking-wide dark:text-darktextColor"
        />
      </div>
      <NotificationLinksPro />
    </div>
  );
}

export default NotificationDetailPagePro;
