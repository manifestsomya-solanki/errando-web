import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export interface ButtonProps
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "className"
  > {
  fullWidth?: boolean;
  variant?: "filled" | "outlined" | "ghost";
  color?: "primary" | "secondary" | "success" | "ghost" | "error" | "gray";
  loading?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  buttonClassName?: string;
  centerClassName?: string;
  size?: "normal" | "small" | "big";

  // type?: "submit" | "reset" | "button" | undefined;
}
const Button: FC<ButtonProps> = ({
  children,
  variant = "filled",
  color = "primary",
  size = "normal",
  // type,
  fullWidth = false,
  loading = false,
  rounded = false,
  buttonClassName: buttonClassName,
  disabled = false,
  centerClassName,
  ...props
}) => {
  let className =
    "relative block outline-none transition-all border  duration-75  ring-offset-2 whitespace-nowrap rounded-[8px] focus-visible:ring-2 focus-visible:ring-black disabled:text-transparent  disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:border-gray-300 dark:disabled:border-dimGray font-poppins ";
  if (size === "big") className += "px-5 p-2 lg:px-6 lg:p-3 ";
  if (size === "normal") className += "px-3  p-1 md:p-[0.6rem] ";
  if (size === "small") className += "px-3 p-1.5 text-sm ";
  if (variant === "filled")
    className +=
      "  disabled:bg-gray-300 disabled:text-slate-500 active:shadow-inner text-white ";
  if (variant === "filled" && color === "primary")
    className +=
      "bg-primaryBlue text-white hover:bg-primaryBlue/80 hover:text-white dark:border-primaryBlue";
  if (variant === "filled" && color === "secondary")
    className +=
      "bg-primaryYellow hover:bg-primaryYellow/90 active:bg-primaryYellow/90 !text-white dark:border-primaryYellow ";

  if (variant === "outlined")
    className +=
      "border-primaryBlue  text-textColor   dark:text-white  disabled:bg-gray-300 disabled:text-slate-500";

  if (variant === "ghost" && color === "primary")
    className +=
      "bg-transparent text-textColor border-textColor hover:bg-gray-100/70 active:bg-gray-100/70 ";
  if (variant === "ghost" && color === "error")
    className +=
      "bg-transparent text-red-500  hover:bg-slate-200/60  active:bg-slate-200/60  dark:hover:bg-slate-700/60 dark:active:bg-slate-700/60";

  if (variant === "ghost" && color === "gray")
    className +=
      "bg-transparent text-textColor hover:bg-slate-100/90 dark:text-white  active:bg-slate-100/90 dark:hover:bg-slate-700/90 dark:active:bg-slate-700/90";

  if (variant === "ghost" && color === "secondary")
    className +=
      "bg-transparent text-primaryYellow border-none hover:bg-gray-100/70 active:bg-gray-100/70";

  if (fullWidth) className += "w-full ";
  if (loading) className += "!text-transparent";
  if (rounded) className += "!rounded-full ";

  const loaderClassName =
    "w-full h-full flex justify-center items-center text-lg absolute top-0 left-0 z-[100] text-slate-500";

  return (
    <button
      className={className + " " + buttonClassName}
      {...props}
      disabled={disabled || loading}
    >
      {loading && (
        <div className={loaderClassName}>
          <svg
            className="w-5 h-5 animate-spin text-slate-700 dark:text-white"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          {/* <svg  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> */}
        </div>
      )}
      <div className={`flex ${centerClassName || ''}`}>{children}</div>
    </button>
  );
};

export default Button;
