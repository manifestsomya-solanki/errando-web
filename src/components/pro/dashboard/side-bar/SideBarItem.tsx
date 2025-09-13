import { NavLink } from "react-router-dom";
import styles from "../../../../styles/SideNavLinks.module.css";
import Heading from "../../../UI/Heading";

function SideNavBarItem(props: {
  text: string;
  link: string;
  isNumber?: boolean;
  number?: number;
  img: any;
}) {
  return (
    <NavLink
      style={({ isActive }) =>
        isActive ? { backgroundColor: "#0003FF", color: "white" } : {}
      }
      className={`${styles.sidenavlinks}  flex flex-row items-center gap-3 font-bold rounded-3xl my-2 `}
      to={props.link}
    >
      <div className="w-6">{props.img}</div>
      <Heading
        text={props.text}
        variant="subHeader"
        headingclassname="text-sm hover:font-bold tracking-wide  dark:text-white"
      ></Heading>
    </NavLink>
  );
}

export default SideNavBarItem;
