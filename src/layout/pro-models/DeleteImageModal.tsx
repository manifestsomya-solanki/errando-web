import Modal from "../../layout/home/Modal";
import Close from "../../assets/close.tsx";
import Heading from "../../components/UI/Heading";
import { useAuthPro } from "../../store/pro/auth-pro-context";

import { useTheme } from "../../store/theme-context";
import useSWR from "swr";
import { fetcher } from "../../store/customer/home-context.tsx";
import Button from "../../components/UI/Button.tsx";

function DeleteImageModal(props: { onCancel: () => void }) {
  const { deleteImageHandler, isLoading } = useAuthPro();
  const token = localStorage.getItem("data");
  let userData: any;
  if (token) {
    userData = JSON.parse(token);
  }
  const url = `https://erranddo.com/admin/api/v1/user/detail?user_id=${userData?.id}`;
  const { mutate } = useSWR(url, fetcher);
  const deleteUserHandler = async (event: React.MouseEvent) => {
    await deleteImageHandler();
    await mutate();
    props.onCancel();
  };
  const { theme } = useTheme();
  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg xl:w-[460px] md:w-[470px] dark:bg-modalDarkColor">
      <button
        className="absolute top-5 right-5 w-full flex justify-end"
        onClick={() => {
          props.onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>
      <div className="flex flex-col items-center xl:w-[420px] md:w-[450px] xl:mt-1 md:mt-2 p-3 gap-2">
        <div className="py-7 xs:w-full xl:pl-0 md:pl-3">
          <Heading
            variant="subTitle"
            headingclassname="text-center"
            text="Are you sure you want to delete picture?"
          />
        </div>
        <div className="flex gap-5 xl:w-[350px] md:w-[220px] justify-center pl-2">
          <Button
            type="button"
            variant="outlined"
            color="primary"
            children="Cancel"
            onClick={() => props.onCancel()}
            centerClassName="flex justify-center items-center"
            buttonClassName="!px-3 font-poppins py-3 w-full"
          />
          <Button
            loading={isLoading}
            type="submit"
            variant="filled"
            color="primary"
            children="Continue"
            centerClassName="flex justify-center items-center"
            buttonClassName="!px-3 font-poppins py-3 w-full"
            onClick={deleteUserHandler}
          />
        </div>
      </div>
    </Modal>
  );
}

export default DeleteImageModal;
