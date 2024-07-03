import Layout from "../../components/Layout/Layout";
import "./ProjectListPage.css";
import ProjectListPageLayout from "../../components/Layout/ProjectListPageLayout";

const ProjectPageList = () => {
  return (
    <Layout>
      <div className="project-page-list-layout">
        <div className="project-page-list-sub-nav">
          <button>#버디비_동행</button>
          <button>#버디비_펀딩</button>
          <ProjectListPageLayout />
        </div>
      </div>
    </Layout>
  );
};

export default ProjectPageList;
