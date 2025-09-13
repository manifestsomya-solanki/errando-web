import { useState } from "react";
import CloseRequestModal from "../../../../layout/close-request-modals/CloseRequestModal";
import Button from "../../../UI/Button";
import Heading from "../../../UI/Heading";
import { Request } from "../../../../models/customer/requestlist";

function ServiceTitle(props: { data: Request }) {
  const createdAt = new Date(props?.data?.created_at);
  const formattedDate = createdAt.toISOString().split("T")[0];
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {
        <CloseRequestModal
          serviceId={props?.data?.service_id}
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
          }}
          onCancelAll={() => {
            setOpenModal(false);
          }}
        />
      }
      <div className="flex justify-between lg:py-5 xs:py-4 items-center">
        <div>
          <Heading
            variant="headingTitle"
            text={props?.data?.service?.name + " : " + formattedDate}
            headingclassname="text-primaryBlue !font-extrabold !font-poppins-bold tracking-wide dark:text-darktextColor "
          />
        </div>
        <div>
          <Button
            variant="filled"
            color="secondary"
            size="normal"
            children="Close Request"
            buttonClassName="!px-4 py-2 text-sm tracking-wide md:flex xs:hidden"
            onClick={() => setOpenModal(true)}
          />
        </div>
      </div>
    </>
  );
}

export default ServiceTitle;
