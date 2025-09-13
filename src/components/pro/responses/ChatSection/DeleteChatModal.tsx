import Close from "../../../../assets/close";
import Modal from "../../../../layout/home/Modal";
import { useAuth } from "../../../../store/customer/auth-context";
import { useChat } from "../../../../store/pro/chat-context";
import { useTheme } from "../../../../store/theme-context";
import Button from "../../../UI/Button";

function DeleteChatModal(props: { onCancel: () => void; user_id: number }) {
  const { logout, isLoading } = useAuth();
  const { deleteChat } = useChat();

  const { theme } = useTheme();
  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg  dark:bg-modalDarkColor">
      <button
        className=" absolute top-5 right-5"
        onClick={() => {
          props.onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}

        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>
      <div className="flex flex-col w-full gap-5 ">
        <h1 className="text-black dark:text-white xl:text-lg md:text-md font-medium text-center mt-7 mb-3 ">
          Are you sure you want to Delete Chat ?
        </h1>

        <div className="flex gap-2 items-center justify-center px-5 ">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              props.onCancel();
            }}
            type="button"
            centerClassName="flex justify-center dark:text-white"
            buttonClassName=" !px-10 "
          >
            Cancel
          </Button>
          <Button
            loading={isLoading}
            variant="filled"
            color="primary"
            onClick={() => {
              deleteChat(props.user_id);
            }}
            type="button"
            centerClassName="flex justify-center dark:text-white"
            buttonClassName=" !px-10   "
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteChatModal;
