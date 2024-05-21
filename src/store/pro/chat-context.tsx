import { createContext, useContext } from "react";

type ChatResposneType = {
  addChat: (user_id: number, message: string) => void;
  deleteChat: (user_id: number) => Promise<void>;
};

export const ChatContext = createContext<ChatResposneType>({
  addChat: (user_id: number, message: string) => console.log(user_id, message),
  deleteChat: async (user_id: number) => {
    console.log(user_id);
  },
});
// addChat: (user_id: number, message: string) => console.log(user_id, message),

const ChatContextProvider = (props: { children: React.ReactNode }) => {
  const AddChat = async (user_id: number, message: string) => {
    const token = localStorage.getItem("token");
    // const formData: any = {
    //     user_id: user_id,
    //     message: message,
    // }
    const res = await fetch(
      `https://erranddo.com/admin/api/v1/chat/send-notification?user_id=${user_id}&message=${message}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      const data: any = await res.json();
    } else {
      const data: any = await res.json();
    }
  };
  const DeleteChat = async (user_id: number) => {
    const token = localStorage.getItem("token") ?? "{}";
    const res = await fetch(
      `https://erranddo.com/admin/api/v1/chat/${user_id}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      const data: any = await res.json();
      if (data.status === "1") {
        // toast.success("Email has been successfully sent !");
      } else {
        // toast.error(data.error);
      }
    } else {
      const data: any = await res.json();
    }
  };
  return (
    <ChatContext.Provider
      value={{
        addChat: AddChat,
        deleteChat: DeleteChat,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export function useChat() {
  const chatCtx = useContext(ChatContext);
  return chatCtx;
}

export default ChatContextProvider;
