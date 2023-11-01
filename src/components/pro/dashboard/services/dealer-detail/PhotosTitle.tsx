import { NavLink, useNavigate, useParams } from "react-router-dom";
import Button from "../../../../UI/Button";
import Heading from "../../../../UI/Heading";

function PhotosTitle() {
  const id = useParams().id;
  const navigate = useNavigate();
  return (
    <div className="flex justify-between lg:py-5 xs:py-4 items-center">
      <div>
        <Heading
          variant="headingTitle"
          text="Photos"
          headingclassname="text-textColor !font-extrabold !font-poppins-bold tracking-wide dark:text-darktextColor"
        />
      </div>
      <div className=" gap-2 items-center  flex">
        <Button
          onClick={() =>
            navigate(`/services/dealer-detail/${id}`, {
              state: {
                page_key: "pro",
              },
            })
          }
          variant="ghost"
          color="secondary"
          size="normal"
          children="Preview Profile"
          buttonClassName="!px-4 py-2 text-sm tracking-wide flex  dark:hover:bg-black"
        />
      </div>
    </div>
  );
}

export default PhotosTitle;
