import SeviceDetailMainPage from "../../components/customer/services/service-detail/SeviceDetailMainPage";
import CloseRequestProvider from "../../store/customer/close-request-context";
import ReviewContextProvider from "../../store/customer/review-context";

function ServiceDetail() {
  return (
    <CloseRequestProvider>
      <ReviewContextProvider>
        <div className="w-screen">
          <SeviceDetailMainPage />
        </div>
      </ReviewContextProvider>
    </CloseRequestProvider>
  );
}

export default ServiceDetail;
