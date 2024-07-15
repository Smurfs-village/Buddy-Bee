import { useState, useRef, useCallback } from "react";
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

// CSS
import "./ProjectDetailWithUser.css";

const ProjectDetailPageWithUser = ({ project, hashtags }) => {
  const [filterItem, setFilterItem] = useState(false);
  const [withState, setFundingState] = useState(false);

  const buttonRef = useRef();
  const withComplete = "ProjectDetailPage-with-complete";
  const defaultButton = "ProjectDetailPage-click-btn";
  const item = [buttonRef];

  const withStateHandler = useCallback(() => {
    // 유저 정보 등록(백엔드)
    setFundingState(true);
    buttonRef.current.innerText = "동행 참여완료";
  }, [item]);
  // 리렌더링 문제 해결 요망(백엔드)

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
