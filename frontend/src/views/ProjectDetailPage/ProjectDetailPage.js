import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import ProjectDetailPageFunding from "./ProjectDetailPageFunding";
import ProjectDetailPageWith from "./ProjectDetailPageWith";
import ProjectDetailFundingUser from "./ProjectDetailFundingUser";
import ProjectDetailWithUser from "./ProjectDetailWithUser";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${id}`
        );
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading project details</div>;
  if (!project) return null;

  const isOwner = user && user.id === project.created_by;
  const isFunding = project.type === "funding";
  const isWith = project.type === "with";

  if (isFunding) {
    return isOwner ? (
      <ProjectDetailPageFunding project={project} />
    ) : (
      <ProjectDetailFundingUser project={project} />
    );
  } else if (isWith) {
    return isOwner ? (
      <ProjectDetailPageWith project={project} />
    ) : (
      <ProjectDetailWithUser project={project} />
    );
  }

  return null;
};

export default ProjectDetailPage;
