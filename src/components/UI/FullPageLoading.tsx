import * as React from "react";

export interface FullPageLoadingProps {
  show?: boolean;
  className?: string;
  fill?: string;
}

const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  show = true,
  className = "",
  fill = "",
}) => {
  if (!show) return <></>;

  return (
    <div
      className={`h-[80vh] flex justify-center items-center rounded-md bg-white dark:bg-dimGray text-primary dark:text-primaryLight my-5 ${className}`}
      style={{ zIndex: 999 }}
    >
      <svg
        className="animate-spin"
        viewBox="0 0 24 24"
        width="27"
        height="27"
        stroke={fill ? fill : "#007aff"}
        strokeWidth="2"
        fill={fill ? fill : "#007aff"}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      </svg>
    </div>
  );
};

export default FullPageLoading;
