import MessagesDetailMainPage from "../../components/customer/services/messages/MessagesDetailMainPage";
import TopBar from "../../components/customer/services/top-bar/TopBar";
import ChatCustomerContextProvider from "../../store/customer/customer-chat-context";

function Messages() {
  return (
    <ChatCustomerContextProvider>
      <div className="overflow-x-hidden !overflow-y-hidden max-h-[100vh] h-[100vh]  dark:bg-dimGray">
        <TopBar />
        <div className="xl:mt-[8.651474530831099vh] lg:mt-[9.651474530831099vh] xs:mt-[9.051474530831099vh] xl:px-36 lg:px-20  mb-10  ">
          <MessagesDetailMainPage />
        </div>
      </div>
    </ChatCustomerContextProvider>
  );
}

export default Messages;
