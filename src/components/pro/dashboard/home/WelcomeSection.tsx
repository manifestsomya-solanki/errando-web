import React from "react";
import HomeCard from "./HomeCard";
import DashboaedImage from "../../../../assets/dashboard-image.png";
import Target from "../../../../assets/target.svg";
import Heading from "../../../UI/Heading";
import WelcomeSkeleton from "../../skeleton/WelcomeSkeleton";
function WelcomeSection() {
  const isLoading = false;

  return (
    <div>
      {isLoading ? (
        <WelcomeSkeleton />
      ) : (
        <div className="grid lg:grid-cols-2 xs:grid-cols-1 lg:gap-10 xs:gap-3 ">
          <HomeCard
            children={
              <div className="flex justify-between items-center h-full gap-2">
                <div className="flex flex-col gap-3">
                  <Heading
                    text={"Welcome to your Dashboard"}
                    variant="headingTitle"
                    headingclassname="text-primaryYellow !font-bold tracking-wide  dark:text-primaryYellow"
                  />
                  <Heading
                    text={
                      "Here you have all the tools you need to make sure the leads you receive are tailored to you."
                    }
                    variant="smallTitle"
                    headingclassname="text-textColor tracking-wide dark:text-slate-400 lg:w-9/12 leading-tighter"
                  />
                </div>
                <div>
                  <img src={Target} className="xs:w-32 md:w-auto" />
                </div>
              </div>
            }
            className="py-3 px-5 h-36"
          />
          <HomeCard
            children={
              <div>
                <img
                  src={DashboaedImage}
                  className="w-full  rounded-md object-cover object-center h-36"
                />
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}

export default WelcomeSection;
