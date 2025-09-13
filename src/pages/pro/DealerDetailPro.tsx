import DealerDetailMainPage from "../../components/pro/dashboard/services/dealer-detail/DealerDetailMainPage";
import ReviewContextProProvider from "../../store/pro/review-context";

function DealerDetailPro() {
  return (
    <ReviewContextProProvider>
      <DealerDetailMainPage />
    </ReviewContextProProvider>
  );
}

export default DealerDetailPro;
