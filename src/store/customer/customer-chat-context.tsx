import React, { useContext } from "react";
import { createContext } from "react";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

type ChatResposneType = {
  addChat: (user_id: number, message: string, business_id: number) => void;
};

export const ChatCustomerContext = createContext<ChatResposneType>({
  addChat: () => undefined,
});

const ChatCustomerContextProvider = (props: { children: React.ReactNode }) => {
  const AddChat = async (
    user_id: number,
    message: string,
    business_id: number
  ) => {
    const token = localStorage.getItem("token");
    if (!user_id || !business_id || !message?.trim()) return;

    await fetch(buildApiUrl(API_ENDPOINTS.CHAT_SEND_NOTIFICATION), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id,
        message,
        business_id,
      }),
    });
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
