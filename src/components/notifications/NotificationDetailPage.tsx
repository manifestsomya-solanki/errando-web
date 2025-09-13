import { useNavigate } from "react-router";
import { useTheme } from "../../store/theme-context";
import BackArrow from "../../assets/BackArrow";
import Heading from "../UI/Heading";
import NotificationLinks from "./NotificationLinks";

function NotificationDetailPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <div>
      <div
        className="flex gap-2 items-center pt-6"
        onClick={() => navigate("/home")}
      >
        {theme === "light" && <div children={<BackArrow color="black" />} />}

        {theme === "dark" && <div children={<BackArrow color="white" />} />}
        <Heading
          text="Back"
          variant="smallTitle"
          headingclassname="text-slate-500 !font-semibold tracking-wide dark:text-darktextColor"
        />
      </div>
      <NotificationLinks />
    </div>
  );
}

export default NotificationDetailPage;
