import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "../../components/customer/services/top-bar/TopBar";
import SettingsLink from "../../components/customer/settings/SettingsLink";
import Heading from "../../components/UI/Heading";
import { useTheme } from "../../store/theme-context";
import BackArrow from "../../assets/BackArrow";

function Settings() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <div className="overflow-x-hidden h-max pb-20">
      <TopBar isSettingDisabled={true} />
      <div className="xl:mt-[8.651474530831099vh]  lg:mt-[9.651474530831099vh] xs:mt-[9.051474530831099vh] lg:px-32 xs:px-5">
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
        <SettingsLink />
        <Outlet />
      </div>
    </div>
  );
}

export default Settings;
