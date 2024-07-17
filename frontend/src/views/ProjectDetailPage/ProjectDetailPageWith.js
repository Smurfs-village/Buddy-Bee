import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import axios from "axios";
import Header from "../../components/Header/Header";
import SubNav from "../../components/Layout/SubNav";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import PageLayout from "../../components/Layout/PageLayout";
import Footer from "../../components/Footer/Footer";
import DetailTitle from "./DetailTitle";
import DetailContent from "./DetailContent";
import DetailButton from "./DetailButton";
import DetailProfile from "./DetailProfile";
import DetailHashtag from "./DetailHashtag";
import "./ProjectDetailPageWith.css";

const ProjectDetailPageWith = () => {
  const [filterItem, setFilterItem] = useState(false);
  const [project, setProject] = useState(null);
  const [hashtags, setHashtags] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState(0); // 참여자 수 상태 추가
  const { id: projectId } = useParams();
  const navigate = useNavigate(); // navigate 추가

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${projectId}/with-author`
        );
        setProject(response.data);
        setHashtags(response.data.hashtags || []);
        console.log("Project data:", response.data); // 디버깅 로그 추가
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
          `http://localhost:5001/api/projects/${projectId}/participants`
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
      await axios.delete(`http://localhost:5001/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(-1); // 이전 페이지로 리다이렉트
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const formatDate = date => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

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
            <div className="ProjectDetailPage-participate">
              <div className="ProjectDetailPage-participate-txt">
                참여자 수: {currentParticipants}
              </div>
              <div className="ProjectDetailPage-participate-btn">
                <button className="ProjectDetailPage-modify">수정</button>
                <button
                  className="ProjectDetailPage-delete"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            </div>
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
                    옵션 선택 <span>*</span>
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
                            <span>({option.price}원/1개)</span>
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
