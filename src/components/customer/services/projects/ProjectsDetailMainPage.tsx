import DetailHero from "../../../../assets/detail-hero.png";

import Navigation from "../../../UI/Navigation";
import ProjectListSection from "./ProjectListSection";

function ProjectsDetailMainPage() {
  return (
    <div className="dark:bg-black ">
      <img
        src={DetailHero}
        className="w-full h-[24.80965147453083vh] object-cover xs:object-center "
      />
      <div className="lg:mx-20 xl:mx-36 xs:mx-5 ">
        <Navigation isButton={true} />
        <ProjectListSection />
      </div>
    </div>
  );
}

export default ProjectsDetailMainPage;
