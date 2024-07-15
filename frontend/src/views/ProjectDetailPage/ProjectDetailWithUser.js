import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../../components/Header/Header";
import SubNav from "../../components/Layout/SubNav";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import PageLayout from "../../components/Layout/PageLayout";
import Footer from "../../components/Footer/Footer";

import DetailTitle from "./DetailTitle";
import DetailContent from "./DetailContent";
import DetailButton from "./DetailButton"; // Import DetailButton
import DetailProfile from "./DetailProfile";
import DetailHashtag from "./DetailHashtag";
import axios from "axios"; // axios import 추가
import { useAuth } from "../../contexts/AuthContext"; // useAuth import 추가

// CSS
import "./ProjectDetailWithUser.css";

const ProjectDetailPageWithUser = ({ project, hashtags }) => {
  const [filterItem, setFilterItem] = useState(false);
  const [withState, setWithState] = useState(false);
  const buttonRef = useRef();
  const withComplete = "ProjectDetailPage-with-complete";
  const defaultButton = "ProjectDetailPage-click-btn";
  const { user } = useAuth(); // Import useAuth to get user info

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
          console.log("Participation check response:", response); // 응답 상태와 데이터 확인
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

  const withStateHandler = useCallback(async () => {
    if (!user || !project) {
      console.error("User is not authenticated or project is not defined");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5001/api/projects/${project.id}/participate`,
        { userId: user.id },
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
  }, [user, project]);

  return (
    <BackGroundGrid>
      <Header />
      <SubNav filterItem={filterItem} setFilterItem={setFilterItem} />
      <PageLayout>
        <div className="ProjectDetailPage-all">
          <div className="ProjectDetailPage-container">
            <div className="ProjectDetailPage-participate">
              <div className="ProjectDetailPage-participate-txt">
                참여자 수: {project.currentParticipants}
              </div>
            </div>
            <DetailTitle title={project.title} />
            <DetailContent content={project.description} />
            <DetailButton projectId={project.id} /> {/* Pass projectId */}
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
                            <span>
                              ({option.price}
                              원/1개)
                            </span>
                          </div>
                          <div className="ProjectDetailPage-input">
                            <input type="radio" name="optionCount" />
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
                  disabled={withState} // 참여 완료 상태면 버튼 비활성화
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
