import ErranddoLogo from "../../../assets/Group 1@3x.png";
import { useNavigate } from "react-router";
import Button from "../../UI/Button";
import { useTheme } from "../../../store/theme-context";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Warning from "../../../assets/Warning";
import Theme from "../../../assets/Theme";
import Settings from "../../../assets/Settings";
import Heading from "../../UI/Heading";
import LogoutModal from "../../../layout/home/LogoutModal";
import TopBarMenu from "../../pro/dashboard/top-bar/TopBarMenu";
import DownArrow from "../../../assets/DownArrow.svg";
import { UserData } from "../../../models/user";
import useSWR from "swr";
import { fetcher } from "../../../store/customer/home-context";
import profileAvatar from "../../../assets/avatar.svg";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../../config/api";

function HomeTopBar(props: { isSettingDisabled?: boolean }) {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const { theme, changeTheme } = useTheme();
  const [openMenu, setOpenMenu] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const token = localStorage.getItem("data");
  let userData: any;
  if (token) {
    userData = JSON.parse(token);
  }
  const url = buildApiUrl(`${API_ENDPOINTS.USER_DETAIL}?user_id=${userData?.id}`);
  const { data } = useSWR(url, fetcher);
  const profileData: UserData = data?.data ?? "";
  const profilePhoto = `https://erranddo.s3.eu-west-2.amazonaws.com/${profileData?.img_avatar}`;
  const switchToPro = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("role", "pro");
      navigate("/pro/dashboard");
      return;
    }

    const formData = new FormData();
    formData.set("role", "pro");

    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.USER_EDIT), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }
    } catch {
      // Keep UX consistent even if request fails, as role switch is a navigation action too.
    } finally {
      localStorage.setItem("role", "pro");
      navigate("/pro/dashboard");
    }
  };
  const topbarClassName =
    "bg-white dark:bg-black fixed top-0 py-4 xl:px-36 lg:px-12 md:px-12 xs:px-3 flex shadow-md justify-between w-screen items-center lg:h-[9.651474530831099vh] xl:h-[8.651474530831099vh] xs:h-[9.051474530831099vh] z-[100]";
  return (
    <div className={topbarClassName}>
      {isLoggedIn !== "true" ? (
        <>
          <div className="my-1 xs:w-3/6 lg:w-max">
            <button onClick={() => navigate("/home")}>
              <img
                src={ErranddoLogo}
                className="lg:w-80 xs:w-full object-contain"
              />
            </button>
          </div>
          <div className="md:flex items-center md:gap-5 xs:flex xs:gap-2">
            <div className="md:pr-5">
              <ul className="flex lg:gap-3 xs:gap-2  xs:ml-2 xs:flex-row items-center  xl:text-lg md:text-sm  rounded-lg  md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-black dark:text-semibold">
                <li>
                  <button
                    className="text-[#707070] dark:text-white xs:text-xs lg:text-lg w-max xs:py-2 lg:py-0 xs:text-center"
                    onClick={() => navigate("/signup-customer")}
                  >
                    Sign Up
                  </button>
                </li>
                <div className="xl:h-6 md:h-5 min-h-[1em] w-0.5 bg-[#707070] opacity-40"></div>
                <li>
                  <button
                    className="text-[#707070] dark:text-white xs:text-xs lg:text-lg w-max xs:py-2 lg:py-0"
                    onClick={() => navigate("/sign-in")}
                  >
                    Sign In
                  </button>
                </li>
              </ul>
            </div>
            <div className="hidden xs:block md:block">
              <Button
                variant="filled"
                color="primary"
                type="button"
                buttonClassName="xs:text-xs lg:text-base rounded-lg py-2 text-center md:mr-0"
                onClick={() => navigate("/signup-pro")}
              >
                Register as a Pro
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          {openMenu && <TopBarMenu onClose={() => setOpenMenu(false)} />}

          {showLogoutModal && (
            <LogoutModal
              onCancel={() => {
                setShowLogoutModal(false);
              }}
            />
          )}
          <div className=" my-1 xs:w-3/6 lg:w-max">
            <button onClick={() => navigate("/home")}>
              <img
                src={ErranddoLogo}
                className="lg:w-80 xs:w-full object-contain"
              />
            </button>
          </div>
          <div className=" md:gap-3  xs:gap-3 flex  ml-auto items-center">
            <Button
              variant="outlined"
              color="primary"
              size="normal"
              children="Your Projects"
              buttonClassName="!px-7 text-sm xs:hidden lg:flex !text-whie !dark:text-slate-900"
              onClick={() => {
                navigate("/projects");
              }}
            />

            {(!profileData?.address || !profileData?.city || !profileData?.postcode) ?
              (<Button
                variant="filled"
                color="primary"
                size="normal"
                children="Register as a Pro"
                buttonClassName="!px-7 text-sm xs:hidden lg:flex"
                onClick={switchToPro}
              />) : (<Button
                variant="filled"
                color="primary"
                size="normal"
                children="Switch to Pro"
                buttonClassName="!px-7 text-sm xs:hidden lg:flex"
                onClick={switchToPro}
              />)}

            <div className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full h-7 w-7 flex items-center justify-center">
              {theme === "light" && (
                <button
                  onClick={() => {
                    changeTheme("light");
                  }}
                >
                  <div children={<Theme color="black" />} />
                </button>
              )}

              {theme === "dark" && (
                <button
                  onClick={() => {
                    changeTheme("dark");
                  }}
                >
                  <div children={<Theme color="white" />} />
                </button>
              )}
            </div>
            <NavLink to="/notifications">
              <div className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full h-7 w-7 flex items-center justify-center cursor-pointer">
                {theme === "light" && (
                  <div children={<Warning color="black" />} />
                )}
                {theme === "dark" && (
                  <div children={<Warning color="white" />} />
                )}
              </div>
            </NavLink>
            <NavLink to="/settings">
              <div
                className={`  rounded-full h-7 w-7 flex items-center justify-center ${props.isSettingDisabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
              >
                {theme === "light" && (
                  <div
                    children={
                      <Settings
                        color={`${props.isSettingDisabled
                          ? " rgb(156 163 175)"
                          : " black"
                          } `}
                      />
                    }
                  />
                )}

                {theme === "dark" && (
                  <div
                    children={
                      <Settings
                        color={`${props.isSettingDisabled
                          ? " rgb(156 163 175)"
                          : " white"
                          } `}
                      />
                    }
                  />
                )}
              </div>
            </NavLink>
            <div
              className="flex items-center ml-auto gap-2  cursor-pointer"
              onClick={() => {
                setOpenMenu(!openMenu);
              }}
            >
              <div className="flex items-center gap-2">
                <button>
                  <img
                    src={profileData?.img_avatar ? profilePhoto : profileAvatar}
                    className="object-cover h-10 bg-blue-100 dark:bg-slate-700 w-10  rounded-full"
                  />
                </button>
                <div className="flex flex-col xs:hidden lg:inline gap-2  ">
                  {profileData && profileData.full_name && (
                    <Heading
                      variant="subHeader"
                      text={profileData.full_name}
                      headingclassname="text-textColor w-max dark:text-darktextColor capitalize"
                    />
                  )}
                </div>
              </div>
              <Button
                variant="outlined"
                buttonClassName="border-none  !py-2 !px-2 !text-textColor xs:hidden lg:inline  font-semibold rounded-full text-md font-poppins"
              >
                <img src={DownArrow} className="w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HomeTopBar;
