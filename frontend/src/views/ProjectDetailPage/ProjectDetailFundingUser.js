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
import DetailFundingStatus from "./DetailFundingStatus";
import DetailUserInfo from "./DetailUserInfo";
import DetailAgree from "./DetailAgree";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2"; // SweetAlert2 import 추가
import "./ProjectDetailFundingUser.css";
import "./ProjectDetailPage.css"; //공통 css 요소는 전부 이 파일에서

const ProjectDetailPageFundingUser = ({ hashtags }) => {
  const [project, setProject] = useState(null);
  const [filterItem, setFilterItem] = useState(false);
  const [fundingState, setFundingState] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const buttonRef = useRef();
  const fundingComplete = "ProjectDetailPage-funding-complete";
  const defaultButton = "ProjectDetailPage-click-btn";
  const { user } = useAuth();
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
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
        setCurrentAmount(response.data.current_amount);
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
            setFundingState(true);
            if (buttonRef.current) {
              buttonRef.current.innerText = "펀딩 참여완료";
            }
          }
        } catch (error) {
          console.error("Error checking participation status:", error);
        }
      }
    };

    checkParticipationStatus();
  }, [project, user, API_BASE_URL]);

  const fundingStateHandler = useCallback(async () => {
    if (!user) {
      console.error("User is not authenticated");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }
    if (!project) {
      console.error("Project is not defined");
      return;
    }
    if (!agreement) {
      Swal.fire({
        title: "Error",
        text: "개인정보 제 3자 제공 동의를 해주세요",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
    if (!applicantName || !email || !phone) {
      Swal.fire({
        title: "Error",
        text: "신청자 정보를 모두 입력해야 합니다",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/projects/${project.id}/participate`,
        {
          userId: user.id,
          options,
          applicantName,
          email,
          phone,
          agreement,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Participation response:", response);
      if (response.status === 200) {
        setFundingState(true);
        if (buttonRef.current) {
          buttonRef.current.innerText = "펀딩 참여완료";
          buttonRef.current.disabled = true; // 버튼 비활성화
        }
        // 최신 데이터 다시 가져오기
        const updatedProject = await axios.get(
          `${API_BASE_URL}/projects/${projectId}/with-author`
        );
        setProject(updatedProject.data);
        setCurrentParticipants(updatedProject.data.currentParticipants);
        setCurrentAmount(updatedProject.data.current_amount);

        Swal.fire({
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: "success",
          title: "펀딩 참여에 성공했습니다!",
          didOpen: toast => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("Already participating in this project");
        Swal.fire({
          title: "Error",
          text: "이미 이 프로젝트에 참여하고 있습니다",
          icon: "error",
          confirmButtonText: "확인",
        });
      } else {
        console.error("Error participating in project:", error);
        Swal.fire({
          title: "Error",
          text: "프로젝트 참여 중 오류가 발생했습니다",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    }
  }, [
    user,
    project,
    options,
    applicantName,
    email,
    phone,
    agreement,
    totalPrice,
    navigate,
    API_BASE_URL,
    projectId,
  ]);

  const handleOptionChange = (index, newQuantity) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], quantity: newQuantity };
    setOptions(newOptions);
    calculateTotalPrice(newOptions); // 옵션이 변경될 때마다 총합 가격을 계산
  };

  const calculateTotalPrice = options => {
    const total = options.reduce(
      (total, option) => total + option.price * option.quantity,
      0
    );
    setTotalPrice(total);
  };

  const initializeOptions = useCallback(() => {
    const initialOptions = project.options.map(option => ({
      name: option.name,
      price: option.price,
      quantity: 0,
    }));
    setOptions(initialOptions);
  }, [project]);

  useEffect(() => {
    if (project) {
      initializeOptions();
    }
  }, [project, initializeOptions]);

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
                            <span>({formatPrice(option.price)}원/1개)</span>
                          </div>
                          <div className="ProjectDetailPage-input">
                            <input
                              type="number"
                              name="optionCount"
                              min="0"
                              value={options[index]?.quantity || 0}
                              onChange={e =>
                                handleOptionChange(
                                  index,
                                  parseInt(e.target.value, 10)
                                )
                              }
                            />
                            <span>개</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ProjectDetailPage-total">
                  <div className="ProjectDetailPage-detail-title">
                    총 결제금액
                  </div>
                  <div className="ProjectDetailPage-total-cash">
                    {formatPrice(totalPrice)} <span>원</span>
                  </div>
                </div>
              </div>
            </div>
            <DetailUserInfo
              setApplicantName={setApplicantName}
              setEmail={setEmail}
              setPhone={setPhone}
            />
            <DetailAgree setAgreement={setAgreement} />
            <DetailFundingStatus
              projectId={project.id}
              currentAmount={currentAmount}
            />
            <div className="ProjectDetailPage-click">
              <div className="ProjectDetailPage-click-btn_wrapper">
                <button
                  className={fundingState ? fundingComplete : defaultButton}
                  onClick={fundingStateHandler}
                  ref={buttonRef}
                  disabled={fundingState}
                >
                  펀딩 참여하기
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

export default ProjectDetailPageFundingUser;
