import { useNavigate } from "react-router";
import BackArrow from "../../assets/BackArrow";
import { useTheme } from "../../store/theme-context";
import Button from "./Button";
import Heading from "./Heading";

function NavigationPro(props: { isButton: boolean }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <div className="py-1 flex justify-between">
      <div
        className="flex gap-2 items-center"
        onClick={() => navigate("/pro/dashboard")}
      >
        {theme === "light" && <div children={<BackArrow color="black" />} />}
        {theme === "dark" && <div children={<BackArrow color="white" />} />}
        <Heading
          text="Back"
          variant="smallTitle"
          headingclassname="text-textColor !font-bold tracking-wide dark:text-darktextColor"
        />
      </div>
      <div></div>
    </div>
  );
}

export default NavigationPro;
