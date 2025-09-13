import { NavLink, useNavigate } from "react-router-dom";
import Button from "../../../UI/Button";
import { useState } from "react";
import LogoutModal from "../../../../layout/home/LogoutModal";
import styles from "../../../../styles/TopBarMenu.module.css";

function TopBarMenu(props: { onClose: () => void }) {
  const navigate = useNavigate();
  const [openLogout, setopenLogout] = useState(false);
  const role = localStorage.getItem("role");
  const buttonClassName =
    "bg-white dark:bg-slate-700 dark:hover:bg-slate-700 w-full  border-none border-b-[0.5px] border-b-slate-500 rounded-lg text-left hover:bg-slate-100";
  const menuClassName = `fixed  bg-white dark:bg-slate-700  text-textColor drop-shadow-lg  shadow-black lg:top-[10.134316353887399vh] md:top-[10.134316353887399vh] xs:top-[9.634316353887399vh] delay-100 origin-top ease-in xl:right-[6vw] lg:right-[8vw] md:right-[3vw] xs:right-[5vw] xl:w-[15.346354166666666vw] lg:w-[18.346354166666666vw] md:w-[25.346354166666666vw] xs:z-50 xs:w-[50vw]  rounded-xl ${styles.menu}`;
  return (
    <div className={menuClassName}>
      {openLogout && (
        <LogoutModal
          onCancel={() => {
            setopenLogout(false);
          }}
        />
      )}
      {/* <Button
        onClick={() => {
          navigate(role === "pro" ? "/home" : "/pro/dashboard");
          localStorage.setItem("role", role === "pro" ? "customer" : "pro");
        }}
        variant="outlined"
        size="big"
        buttonClassName={buttonClassName + " lg:hidden "}
        centerClassName=" items-start lg:hidden"
        children={role === "pro" ? "Switch to Customer" : "Switch to Pro"}
      />
      <NavLink to="/pro/settings/reset-password">
        <Button
          variant="outlined"
          size="big"
          buttonClassName={buttonClassName}
          centerClassName=" items-start"
          children="Reset Password"
          onClick={() => props.onClose()}
        />
      </NavLink> */}
      <Button
        onClick={() => {
          navigate(role === "pro" ? "/home" : "/pro/dashboard");
          localStorage.setItem("role", role === "pro" ? "customer" : "pro");
        }}
        variant="outlined"
        size="big"
        buttonClassName={buttonClassName + " lg:hidden "}
        centerClassName="items-start lg:hidden"
      >
        {role === "pro" ? "Switch to Customer" : "Switch to Pro"}
      </Button>

      <NavLink
        to={
          role === "pro"
            ? "/pro/settings/reset-password"
            : "/settings/reset-password"
        }
      >
        <Button
          variant="outlined"
          size="big"
          buttonClassName={buttonClassName}
          centerClassName="items-start"
          onClick={() => props.onClose()}
        >
          Reset Password
        </Button>
      </NavLink>

      <Button
        onClick={() => {
          setopenLogout(true);
        }}
        variant="outlined"
        size="big"
        buttonClassName={buttonClassName}
        centerClassName=" items-start"
        children="Logout"
      />
    </div>
  );
}

export default TopBarMenu;
