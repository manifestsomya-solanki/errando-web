import React, { useContext } from "react";
import { createContext } from "react";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";

type ChatResposneType = {
  addChat: (user_id: number, message: string, business_id: number) => void;
  deleteChat: (user_id: number) => Promise<void>;
};

export const ChatContext = createContext<ChatResposneType>({
  addChat: () => undefined,
  deleteChat: async () => undefined,
});

const ChatContextProvider = (props: { children: React.ReactNode }) => {
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

  const DeleteChat = async (user_id: number) => {
    const token = localStorage.getItem("token") ?? "{}";
    await fetch(
      buildApiUrl(`${API_ENDPOINTS.CHAT_DELETE}/${user_id}/delete`),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
