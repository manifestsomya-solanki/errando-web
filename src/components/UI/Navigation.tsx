import { useNavigate } from "react-router";
import BackArrow from "../../assets/BackArrow";
import { useTheme } from "../../store/theme-context";
import Button from "./Button";
import Heading from "./Heading";
import { useState } from "react";
import ServiceRequestModal from "../../layout/customer/ServiceRequestModal";

function Navigation(props: { isButton: boolean }) {
  const { theme } = useTheme();
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      {openServiceModal && (
        <ServiceRequestModal
          open={openServiceModal}
          onCancel={() => {
            setOpenServiceModal(false);
          }}
          onCancelAll={() => {
            setOpenServiceModal(false);
          }}
        />
      )}
      <div className="py-4 border-b-[0.5px] border-b-slate-300 dark:border-b-lineColor flex justify-between ">
        <div className="flex gap-2 items-center" onClick={() => navigate(-1)}>
          {theme === "light" && <div children={<BackArrow color="black" />} />}

          {theme === "dark" && <div children={<BackArrow color="white" />} />}
          <Heading
            text="Back"
            variant="smallTitle"
            headingclassname="text-textColor !font-semibold tracking-wide dark:text-darktextColor"
          />
        </div>
        <div>
          {props.isButton && (
            <Button
              variant="filled"
              color="primary"
              size="normal"
              children="New Request"
              buttonClassName="!px-4 py-2 text-sm lg:hidden "
              onClick={() => setOpenServiceModal(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navigation;
