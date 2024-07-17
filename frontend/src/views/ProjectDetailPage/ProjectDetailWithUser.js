import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
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
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "./ProjectDetailWithUser.css";

const ProjectDetailPageWithUser = ({ hashtags }) => {
  const [filterItem, setFilterItem] = useState(false);
  const [project, setProject] = useState(null);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [withState, setWithState] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const buttonRef = useRef();
  const withComplete = "ProjectDetailPage-with-complete";
  const defaultButton = "ProjectDetailPage-click-btn";
  const { user } = useAuth();
  const { id: projectId } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${projectId}/with-author`
        );
        setProject(response.data);
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

  useEffect(() => {
    const checkParticipationStatus = async () => {
      if (user && project) {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/projects/${project.id}/participation/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Participation check response:", response);
          if (response.data.isParticipating) {
            setWithState(true);
            if (buttonRef.current) {
              buttonRef.current.innerText = "동행 참여완료";
            }
          }
        } catch (error) {
          console.error("Error checking participation status:", error);
        }
      }
    };

    checkParticipationStatus();
  }, [project, user]);

  const handleOptionChange = optionName => {
    setSelectedOptions(prevOptions => {
      if (prevOptions.includes(optionName)) {
        return prevOptions.filter(option => option !== optionName);
      } else {
        return [...prevOptions, optionName];
      }
    });
  };

  const withStateHandler = useCallback(async () => {
    if (!user || !project) {
      console.error("User is not authenticated or project is not defined");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5001/api/projects/${project.id}/participate`,
        { userId: user.id, selectedOptions },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setWithState(true);
        if (buttonRef.current) {
          buttonRef.current.innerText = "동행 참여완료";
          buttonRef.current.disabled = true; // 버튼 비활성화
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("Already participating in this project");
      } else {
        console.error("Error participating in project:", error);
      }
    }
  }, [user, project, selectedOptions]);

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
            </div>
            <DetailTitle title={project.title} />
            <DetailContent content={project.description} />
            <DetailButton projectId={project.id} />
            <DetailProfile
              username={project.username || "Unknown"}
              profileImage={
                project.profile_image || "/path/to/default/profile/image.png"
              }
              intro={project.intro || "안녕하세요! 기본 소개입니다."}
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
                            <input
                              type="checkbox"
                              name="optionCount"
                              checked={selectedOptions.includes(option.name)}
                              onChange={() => handleOptionChange(option.name)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ProjectDetailPage-click">
              <div className="ProjectDetailPage-click-btn_wrapper">
                <button
                  className={withState ? withComplete : defaultButton}
                  onClick={withStateHandler}
                  ref={buttonRef}
                  disabled={withState}
                >
                  동행 참여하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
      <Footer />
    </BackGroundGrid>
  );
};

export default ProjectDetailPageWithUser;
