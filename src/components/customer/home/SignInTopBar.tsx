import ErranddoLogo from "../../../assets/Group 1@3x.png";
import { useNavigate } from "react-router";
import Button from "../../UI/Button";

function SignInTopBar() {
  const navigate = useNavigate();
  const topbarClassName =
    "bg-white dark:bg-black fixed top-0 py-4 xl:px-36 lg:px-20 xs:px-5 flex shadow-md justify-between w-screen items-center lg:h-[9.651474530831099vh] xl:h-[8.651474530831099vh] xs:h-[9.051474530831099vh] z-[100]";
  return (
    <div className={topbarClassName}>
      <div className="  xs:w-3/6 lg:w-max">
        <button onClick={() => navigate("/home")}>
          <img
            src={ErranddoLogo}
            className="lg:w-80 xs:w-full object-contain"
          />
        </button>
      </div>
      <div className="flex items-center md:gap-5 gap-1">
        <div className="flex gap-3 flex-col xs:text-xs xl:text-lg md:text-sm border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-black dark:text-semibold">
          <Button
            variant="outlined"
            buttonClassName="text-[#707070]  dark:text-white border-none py-2 xs:px-1 md:px-3 xs:text-xs  md:text-lg"
            onClick={() => navigate("/signup-customer")}
          >
            <p className="font-normal font-poppins">Sign Up</p>
          </Button>
        </div>
        <div className="">
          <Button
            variant="filled"
            color="primary"
            type="button"
            buttonClassName=" xs:text-xs  md:text-lg rounded-lg py-2 text-center  md:mr-0 xs:px-1 md:px-3 "
            onClick={() => navigate("/signup-pro")}
          >
            Register as a Pro
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignInTopBar;
