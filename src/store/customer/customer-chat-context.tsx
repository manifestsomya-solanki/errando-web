import { createContext, useContext } from "react";

type ChatResposneType = {
  addChat: (user_id: number, message: string) => void;
};

export const ChatCustomerContext = createContext<ChatResposneType>({
  addChat: (user_id: number, message: string) => console.log(user_id, message),
});
// addChat: (user_id: number, message: string) => console.log(user_id, message),

const ChatCustomerContextProvider = (props: { children: React.ReactNode }) => {
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
  return (
    <ChatCustomerContext.Provider
      value={{
        addChat: AddChat,
      }}
    >
      {props.children}
    </ChatCustomerContext.Provider>
  );
};

export function useChatCustomer() {
  const chatCtx = useContext(ChatCustomerContext);
  return chatCtx;
}

export default ChatCustomerContextProvider;
