import { NavLink } from "react-router-dom";

function MobileSideBarItem(props: { link: string; img: any }) {
  return (
    <NavLink className={` mx-auto h-full `} to={props.link}>
      <div className="mx-auto ">{props.img}</div>
    </NavLink>
  );
}

export default MobileSideBarItem;
