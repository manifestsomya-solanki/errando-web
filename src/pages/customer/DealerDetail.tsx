import DealerDetailMainPage from "../../components/customer/services/dealer-detail/DealerDetailMainPage";
import ReviewContextProvider from "../../store/customer/review-context";

function DealerDetail() {
  return (
    <ReviewContextProvider>
      <div>
        <DealerDetailMainPage />
      </div>
    </ReviewContextProvider>
  );
}

export default DealerDetail;
