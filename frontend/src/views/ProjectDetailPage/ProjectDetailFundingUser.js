import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

// CSS
import "./ProjectDetailFundingUser.css";

const ProjectDetailPageFundingUser = ({ project, hashtags }) => {
  const [filterItem, setFilterItem] = useState(false);
  const [fundingState, setFundingState] = useState(false);
  const buttonRef = useRef();
  const fundingComplete = "ProjectDetailPage-funding-complete";
  const defaultButton = "ProjectDetailPage-click-btn";
  const { user } = useAuth();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreement, setAgreement] = useState(false);

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
  }, [project, user]);

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
      alert("개인정보 제 3자 제공 동의를 해야합니다.");
      return;
    }
    if (!applicantName || !email || !phone) {
      alert("신청자 정보를 모두 입력해야 합니다.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5001/api/projects/${project.id}/participate`,
        {
          userId: user.id,
          options,
          applicantName,
          email,
          phone,
          agreement,
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
    options,
    applicantName,
    email,
    phone,
    agreement,
    navigate,
  ]);

  const handleOptionChange = (index, newQuantity) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], quantity: newQuantity };
    setOptions(newOptions);
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

  return (
    <BackGroundGrid>
      <Header />
      <SubNav filterItem={filterItem} setFilterItem={setFilterItem} />
      <PageLayout>
        <div className="ProjectDetailPage-all">
          <div className="ProjectDetailPage-container">
            <DetailTitle title={project.title} />
            <DetailContent content={project.description} />
            <DetailButton projectId={project.id} />
            <DetailProfile profile={project.profile} />
            <DetailHashtag hashtags={hashtags} />
            <div className="ProjectDetailPage-detail-wrap">
              <div className="ProjectDetailPage-detail">
                <div className="ProjectDetailPage-day">
                  <div className="ProjectDetailPage-detail-title">
                    수요조사 기간
                  </div>
                  <div className="ProjectDetailPage-detail-day">
                    {project.startDate} ~ {project.endDate}
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
                    {options.reduce(
                      (total, option) => total + option.price * option.quantity,
                      0
                    )}{" "}
                    <span>원</span>
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
            <DetailFundingStatus />
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
