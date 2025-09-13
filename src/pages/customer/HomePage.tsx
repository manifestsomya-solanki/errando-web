import HomeTopBar from "../../components/customer/home/HomeTopBar";

import "swiper/css";
import HomePageDetails from "../../components/customer/home/HomePageDetails";

function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* {isLoggedIn ? <TopBar /> : <HomeTopBar />} */}
      <HomeTopBar />
      <HomePageDetails />
    </div>
  );
}

export default HomePage;
