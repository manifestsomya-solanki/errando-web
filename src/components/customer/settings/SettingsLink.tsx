import { NavLink } from "react-router-dom";
import Heading from "../../UI/Heading";

function SettingsLink() {
  return (
    <div className="w-full items-center flex justify-center">
      <div className="flex justify-between md:py-10 xs:py-5 xs:w-max xl:w-3/5  xs:gap-5 lg:gap-0 overflow-x-scroll soft-searchbar">
        <div className="w-max  ">
          <NavLink
            className="hover:text-primaryBlue  flex  w-max "
            style={({ isActive }) =>
              isActive
                ? {
                    color: "#0003FF",
                    borderBottom: "3px #0003FF  solid",
                  }
                : {}
            }
            to="/settings/personal-info"
          >
            <Heading
              text={"Personal Info"}
              variant="subHeader"
              headingclassname=" !font-semibold tracking-wide md:text-xl  xs:text-xs sm:text-sm dark:text-white"
            />
          </NavLink>
        </div>
        <div className="w-max">
          <NavLink
            className="hover:text-primaryBlue  flex  w-max mx-auto"
            style={({ isActive }) =>
              isActive
                ? {
                    color: "#0003FF",
                    borderBottom: "3px #0003FF  solid",
                  }
                : {}
            }
            to="/settings/contact-details"
          >
            <Heading
              text={"Contact Details"}
              variant="subHeader"
              headingclassname="dark:hover:text-primaryBlue !font-semibold tracking-wide md:text-xl  xs:text-xs sm:text-sm dark:text-white"
            />
          </NavLink>
        </div>
        <div className="w-max  ">
          <NavLink
            className="hover:text-primaryBlue  flex  w-max  ml-auto"
            style={({ isActive }) =>
              isActive
                ? {
                    color: "#0003FF",
                    borderBottom: "3px #0003FF  solid",
                  }
                : {}
            }
            to="/settings/reset-password"
          >
            <Heading
              text={"Reset Password"}
              variant="subHeader"
              headingclassname="dark:hover:text-primaryBlue !font-semibold tracking-wide md:text-xl  xs:text-xs sm:text-sm dark:text-white"
            />
          </NavLink>
        </div>
        <div className="w-max  ">
          <NavLink
            className="hover:text-primaryBlue  flex  w-max  ml-auto"
            style={({ isActive }) =>
              isActive
                ? {
                    color: "#0003FF",
                    borderBottom: "3px #0003FF  solid",
                  }
                : {}
            }
            to="/settings/my-reviews"
          >
            <Heading
              text={"My Reviews"}
              variant="subHeader"
              headingclassname="dark:hover:text-primaryBlue !font-semibold tracking-wide md:text-xl  xs:text-xs sm:text-sm dark:text-white"
            />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default SettingsLink;
