import Layout from "../../components/Layout/Layout";
import "./ProjectListPage.css";
import ProjectListPageLayout from "../../components/Layout/ProjectListPageLayout";

const ProjectPageList = () => {
  return (
    <Layout>
      <div className="project-page-list-layout">
        <ProjectListPageLayout />
      </div>
    </Layout>
  );
};

export default ProjectPageList;
