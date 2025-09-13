import { Outlet } from "react-router";
// import HomeMainPage from "../../components/pro/dashboard/home/HomeMainPage";

function Home() {
  return (
    <div className="xl:mt-[8.651474530831099vh]  lg:mt-[9.651474530831099vh] xs:mt-[9.051474530831099vh] lg:pl-60 xs:px-5 lg:px-0 bg-gray-100  dark:bg-black  w-screen h-max pb-20">
      <div className="my-5 lg:mx-5">
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
