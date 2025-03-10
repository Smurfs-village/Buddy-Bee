import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import Swal from "sweetalert2"; // SweetAlert2 import 추가
import "./ProjectDetailWithUser.css";
import "./ProjectDetailPage.css"; //공통 css 요소는 전부 이 파일에서

const ProjectDetailPageWithUser = ({ hashtags }) => {
  const [filterItem, setFilterItem] = useState(false);
  const [project, setProject] = useState(null);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [withState, setWithState] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const buttonRef = useRef();
  const withComplete = "ProjectDetailPage-with-complete";
  const defaultButton = "ProjectDetailPage-click-btn";
  const { user } = useAuth();
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${projectId}/with-author`
        );
        setProject(response.data);
        setMaxParticipants(response.data.max_participants);
        console.log("Project data:", response.data); // 디버깅 로그 추가
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId, API_BASE_URL]);

  const fetchParticipants = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects/${projectId}/participants`
      );
      setCurrentParticipants(response.data.currentParticipants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  }, [projectId, API_BASE_URL]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  useEffect(() => {
    const checkParticipationStatus = async () => {
      if (user && project) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/projects/${project.id}/participation/${user.id}`,
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
  }, [project, user, API_BASE_URL]);

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
    if (!user) {
      Swal.fire({
        title: "Error",
        text: "로그인 후 이용 가능합니다!",
        icon: "error",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/login");
      });
      return;
    }
    if (!project) {
      console.error("User is not authenticated or project is not defined");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/projects/${project.id}/participate`,
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
        Swal.fire({
          toast: true,
          position: "bottom", // 하단 오른쪽에 표시
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: "success",
          title: "동행 참여에 성공했습니다!",
          didOpen: toast => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        // 최신 데이터 다시 가져오기
        const updatedProject = await axios.get(
          `${API_BASE_URL}/projects/${projectId}/with-author`
        );
        setProject(updatedProject.data);
        fetchParticipants(); // 참가자 수 다시 가져오기
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("Already participating in this project");
      } else {
        console.error("Error participating in project:", error);
      }
    }
  }, [
    user,
    project,
    selectedOptions,
    fetchParticipants,
    navigate,
    API_BASE_URL,
    projectId,
  ]);

  const formatDate = date => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 가격에 쉼표를 추가하는 함수
  const formatPrice = price => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                참여자: {currentParticipants} / {maxParticipants}
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
                    옵션 선택
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
                            <span>({formatPrice(option.price)}원/1개)</span>
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
