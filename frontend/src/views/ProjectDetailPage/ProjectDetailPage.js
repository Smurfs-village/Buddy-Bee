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
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    const incrementViewCount = async () => {
      try {
        await axios.patch(`${API_BASE_URL}/projects/${id}/increment-view`);
      } catch (err) {
        console.error("Failed to increment view count", err);
      }
    };

    const fetchHashtags = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${id}/hashtags`
        );
        setHashtags(response.data);
      } catch (err) {
        console.error("Failed to fetch hashtags", err);
      }
    };

    fetchProject();
    incrementViewCount();
    fetchHashtags();
  }, [id, API_BASE_URL]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading project details</div>;
  if (!project) return null;

  const isOwner = user && user.id === project.created_by;
  const isFunding = project.type === "funding";
  const isWith = project.type === "with";

  return (
    <div>
      {isFunding ? (
        isOwner ? (
          <ProjectDetailPageFunding project={project} hashtags={hashtags} />
        ) : (
          <ProjectDetailFundingUser project={project} hashtags={hashtags} />
        )
      ) : isWith ? (
        isOwner ? (
          <ProjectDetailPageWith project={project} hashtags={hashtags} />
        ) : (
          <ProjectDetailWithUser project={project} hashtags={hashtags} />
        )
      ) : null}
    </div>
  );
};

export default ProjectDetailPage;
