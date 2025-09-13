import ErranddoLogo from "../../../assets/Group 1@3x.png";
import { useNavigate } from "react-router";
import Button from "../../UI/Button";

function SignUpTopBar() {
  const navigate = useNavigate();
  const topbarClassName =
    "bg-white dark:bg-black fixed top-0 py-4 xl:px-36 lg:px-20 xs:px-5 flex shadow-md justify-between w-screen items-center lg:h-[9.651474530831099vh] xl:h-[8.651474530831099vh] xs:h-[9.051474530831099vh] z-[100]";
  return (
    <div className={topbarClassName}>
      <div className=" my-1 xs:w-3/6 lg:w-max">
        <button onClick={() => navigate("/home")}>
          <img
            src={ErranddoLogo}
            className="lg:w-80 xs:w-full object-contain"
          />
        </button>
      </div>
      <div className="flex items-center md:gap-5 gap-1">
        <div className="">
          <ul className="flex gap-3 flex-col xs:text-xs xl:text-lg md:text-sm border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-black dark:text-semibold">
            <li>
              <Button
                variant="outlined"
                buttonClassName="text-[#707070]  dark:text-white border-none py-2 xs:px-1 md:px-3 xs:text-xs  md:text-lg"
                onClick={() => navigate("/sign-in")}
              >
                <p className="font-normal font-poppins">Sign In</p>
              </Button>
            </li>
          </ul>
        </div>
        <div className="">
          <Button
            variant="filled"
            color="primary"
            type="button"
            buttonClassName=" xs:text-xs  lg:text-lg rounded-lg py-2 text-center  md:mr-0 xs:px-1 md:px-3 "
            onClick={() => navigate("/signup-pro")}
          >
            Register as a Pro
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignUpTopBar;
