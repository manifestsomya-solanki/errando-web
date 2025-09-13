import { NavLink } from "react-router-dom";
import Heading from "../../UI/Heading";

function SettingsNavLinkPro() {
  return (
    <div className="w-full flex justify-between">
      <div className="md:py-3 xs:py-2 xs:w-full px-5">
        <div className="navbar w-full overflow-x-auto">
          <ul className="flex lg:justify-between xs:gap-6 list-none p-0 m-0">
            <li>
              <div className="xs:w-28 md:w-full">
                <NavLink
                  className="hover:text-primaryBlue  flex w-fit "
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: "#0003FF",
                          borderBottom: "3px #0003FF  solid",
                        }
                      : {}
                  }
                  to="/pro/settings/personal-info"
                >
                  <Heading
                    text={"Personal Info"}
                    variant="subHeader"
                    headingclassname=" !font-semibold tracking-wide md:text-base  xs:text-base sm:text-base dark:text-white"
                  />
                </NavLink>
              </div>
            </li>
            <li className="">
              <div className="xs:w-36 md:w-full">
                <NavLink
                  className="hover:text-primaryBlue  flex  w-fit mx-auto"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: "#0003FF",
                          borderBottom: "3px #0003FF  solid",
                        }
                      : {}
                  }
                  to="/pro/settings/contact-details"
                >
                  <Heading
                    text={"Contact Details"}
                    variant="subHeader"
                    headingclassname="dark:hover:text-primaryBlue !font-semibold tracking-wide md:text-base  xs:text-base sm:text-base dark:text-white"
                  />
                </NavLink>
              </div>
            </li>
            <li className="">
              <div className="xs:w-36 md:w-full">
                <NavLink
                  className="hover:text-primaryBlue  flex  w-fit ml-auto"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: "#0003FF",
                          borderBottom: "3px #0003FF  solid",
                        }
                      : {}
                  }
                  to="/pro/settings/payment-details"
                >
                  <Heading
                    text={"Payment Details"}
                    variant="subHeader"
                    headingclassname="dark:hover:text-primaryBlue !font-semibold tracking-wide md:text-base  xs:text-base  dark:text-white"
                  />
                </NavLink>
              </div>
            </li>
            <li className="">
              <div className="xs:w-24 md:w-full">
                <NavLink
                  className="hover:text-primaryBlue  flex  w-fit mx-auto"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: "#0003FF",
                          borderBottom: "3px #0003FF  solid",
                        }
                      : {}
                  }
                  to="/pro/settings/reset-password"
                >
                  <Heading
                    text={"Reset Password"}
                    variant="subHeader"
                    headingclassname="dark:hover:text-primaryBlue !font-semibold tracking-wide md:text-base  xs:text-base sm:text-base dark:text-white"
                  />
                </NavLink>
              </div>
            </li>
            <li className="">
              <div className="w-full">
                <NavLink
                  className="hover:text-primaryBlue  flex  w-fit ml-auto"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: "#0003FF",
                          borderBottom: "3px #0003FF  solid",
                        }
                      : {}
                  }
                  to="/pro/settings/credits"
                >
                  <Heading
                    text={"Credits"}
                    variant="subHeader"
                    headingclassname="dark:hover:text-primaryBlue !font-semibold tracking-wide md:text-base  xs:text-base sm:text-base dark:text-white"
                  />
                </NavLink>
              </div>
            </li>
            <li className="">
              <div className="w-full">
                <NavLink
                  className="hover:text-primaryBlue flex w-fit ml-auto"
                  style={({ isActive }) =>
                    isActive
                      ? {
                          color: "#0003FF",
                          borderBottom: "3px #0003FF  solid",
                        }
                      : {}
                  }
                  to="/pro/settings/invoices"
                >
                  <Heading
                    text={"Invoices"}
                    variant="subHeader"
                    headingclassname="dark:hover:text-primaryBlue !font-semibold tracking-wide md:text-base  xs:text-base sm:text-base dark:text-white"
                  />
                </NavLink>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SettingsNavLinkPro;
