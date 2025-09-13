import MyReviewContextProvider from "../../../../store/customer/my-review-context";

import SettingsCard from "../SettingsCard";
import MyReviewsList from "./MyReviewsList";

function MyReviews() {
  return (
    <MyReviewContextProvider>
      <SettingsCard>
        <MyReviewsList />
      </SettingsCard>
    </MyReviewContextProvider>
  );
}

export default MyReviews;
