import { useState } from "react";

import "../../styles/ToggleBar.css";
import { useAuth } from "../../store/customer/auth-context";

const TogglerBar = (props: {
  status: boolean;
  key: string;
  onChange: (status: boolean) => void;
}) => {
  const [status, setStatus] = useState<boolean>(props.status);

  const onStatusChange = (status: boolean) => {
    if (status) {
      setStatus((prevStatus) => !prevStatus);
    } else {
      setStatus((prevStatus) => !prevStatus);
    }
    props.onChange(status);
  };

  const statusHandler = () => {
    onStatusChange(!status);
  };

  // console.log(status, props.key);
  return (
    <div>
      <label className="switch" htmlFor={props.key}>
        <input
          type="checkbox"
          checked={status}
          onClick={statusHandler}
          key={props.key}
        />

        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default TogglerBar;
