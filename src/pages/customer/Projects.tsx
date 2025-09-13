import ProjectsDetailMainPage from "../../components/customer/services/projects/ProjectsDetailMainPage";
import TopBar from "../../components/customer/services/top-bar/TopBar";
import ProjectContextProvider from "../../store/customer/project-context";

function Projects() {
  return (
    <ProjectContextProvider>
      <div className="overflow-x-hidden">
        <TopBar />
        <div className="xl:mt-[8.651474530831099vh] lg:mt-[9.651474530831099vh] xs:mt-[9.051474530831099vh]">
          <ProjectsDetailMainPage />
        </div>
      </div>
    </ProjectContextProvider>
  );
}

export default Projects;
