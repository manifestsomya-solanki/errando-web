import ChatItems from "../../components/pro/responses/ChatSection/ChatItems";
import ChatContextProvider from "../../store/pro/chat-context";

function Chat() {
  return (
    <ChatContextProvider>
      <div className="w-full lg:overflow-y-scroll lg:h-[85vh]">
        <ChatItems />
      </div>
    </ChatContextProvider>
  );
}

export default Chat;
