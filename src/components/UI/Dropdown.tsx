import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "../../styles/Dropdown.css";
import { useTheme } from "../../store/theme-context";
import Sort from "../../assets/Sort";

function DropdownCompoenet(props: {
  initialId?: number;
  options: any;
  className?: string;
  placeholder: string;
  placeholderClassName?: string;
  isImage?: boolean;
  menuClassName?: string;
  value?: { label: any; value: any };
  onChange: (newValue: any) => void;
}) {
  const { theme } = useTheme();
  return (
    <div className={` ${props.className}`}>
      {props.isImage ? (
        ""
      ) : (
        <div className="w-5 h-5 absolute z-[10] mt-2.5 mx-2">
          {theme === "light" && <div children={<Sort color="black" />} />}

          {theme === "dark" && <div children={<Sort color="white" />} />}
          {/* <img src={Sort} className="w-5 h-5 absolute z-[10] mt-2.5 mx-2" /> */}
        </div>
      )}
      <Dropdown
        className="border-[0.7px] border-black  rounded-lg dark:bg-black text-sm w-full py-0.5 font-poppins  dark:border-white"
        arrowClassName="mt-1"
        placeholder={props.placeholder}
        placeholderClassName={`text-base placeholder:text-slate-400 !font-normal font-poppins dark:text-slate-400 ${
          props.placeholderClassName
        } ${props.isImage ? "ml-0" : "ml-7"}`}
        menuClassName={props.menuClassName}
        value={props?.value?.label}
        options={props.options}
        onChange={(newValue) => {
          props.onChange(newValue);
        }}
      />
    </div>
  );
}

export default DropdownCompoenet;
