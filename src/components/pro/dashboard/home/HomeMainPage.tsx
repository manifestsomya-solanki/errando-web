import { useEffect } from "react";
import NavigateSettingsModal from "../../../../layout/pro-models/NavigateSettingsModal";
import { useAuth } from "../../../../store/customer/auth-context";
import BusinessSection from "./BusinessSection";
import ServiceSection from "./ServicesSection";
import WelcomeSection from "./WelcomeSection";

function HomeMainPage() {
  const { userData, isDetailLoading, mutate } = useAuth();
  useEffect(() => {
    mutate();
  }, []);
  return (
    <div>
      {(!userData?.address || !userData?.city || !userData?.postcode) &&
        !isDetailLoading && <>{<NavigateSettingsModal />}</>}

      <WelcomeSection />
      <BusinessSection />
      <ServiceSection />
    </div>
  );
}

export default HomeMainPage;
