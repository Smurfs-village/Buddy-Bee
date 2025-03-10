import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import SubNav from "../../components/Layout/SubNav";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import PageLayout from "../../components/Layout/PageLayout";
import Footer from "../../components/Footer/Footer";
import DetailParticipate from "./DetailParticipate";
import DetailTitle from "./DetailTitle";
import DetailContent from "./DetailContent";
import DetailButton from "./DetailButton";
import DetailProfile from "./DetailProfile";
import DetailHashtag from "./DetailHashtag";
import "./ProjectDetailPageWith.css";
import "./ProjectDetailPage.css"; //공통 css 요소는 전부 이 파일에서
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ProjectDetailPageWith = ({ hashtags }) => {
  const [filterItem, setFilterItem] = useState(false);
  const [project, setProject] = useState(null);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(0);
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${projectId}/with-author`
        );
        setProject(response.data);
        setMaxParticipants(response.data.max_participants);
        console.log("Fetched project data in Author Page:", response.data); // 디버깅 로그 추가
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!projectId) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${projectId}/participants`
        );
        setCurrentParticipants(response.data.currentParticipants);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, [projectId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(-1);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleModify = () => {
    navigate(`/projects/${projectId}/edit`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 가격에 쉼표를 추가하는 함수
  // const formatPrice = (price) => {
  //   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <BackGroundGrid>
      <Header />
      <SubNav filterItem={filterItem} setFilterItem={setFilterItem} />
      <PageLayout>
        <div className="ProjectDetailPage-all">
          <div className="ProjectDetailPage-container">
            <DetailParticipate
              currentParticipants={currentParticipants}
              handleModify={handleModify}
              handleDelete={handleDelete}
              maxParticipants={maxParticipants}
            />
            <DetailTitle title={project.title} />
            <DetailContent content={project.description} />
            <DetailButton projectId={project.id} />
            <DetailProfile
              username={project.username}
              profileImage={project.profile_image}
              intro={project.intro}
            />
            <DetailHashtag hashtags={hashtags} />
            <div className="ProjectDetailPage-detail-wrap">
              <div className="ProjectDetailPage-detail">
                <div className="ProjectDetailPage-day">
                  <div className="ProjectDetailPage-detail-title">
                    수요조사 기간
                  </div>
                  <div className="ProjectDetailPage-detail-day">
                    {formatDate(project.start_date)} ~{" "}
                    {formatDate(project.end_date)}
                  </div>
                </div>
                <div className="ProjectDetailPage-option">
                  <div className="ProjectDetailPage-detail-title">
                    옵션 선택 <span></span>
                  </div>
                  <div className="ProjectDetailPage-option-goods">
                    <div className="ProjectDetailPage-goods-list">
                      {project.options.map((option, index) => (
                        <div
                          key={index}
                          className="ProjectDetailPage-goods-wrap"
                        >
                          <div className="ProjectDetailPage-goods">
                            {index + 1}. {option.name}{" "}
                            {/* <span>({formatPrice(option.price)}원/1개)</span> */}
                          </div>
                          <div className="ProjectDetailPage-input">
                            <input type="checkbox" name="optionCount" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
      <Footer />
    </BackGroundGrid>
  );
};

export default ProjectDetailPageWith;
