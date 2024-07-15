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
import DetailFundingStatus from "./DetailFundingStatus";
import DetailUserInfo from "./DetailUserInfo";
import DetailAgree from "./DetailAgree";

// CSS
import "./ProjectDetailFundingUser.css";

const ProjectDetailPageFundingUser = ({ project, hashtags }) => {
  const [filterItem, setFilterItem] = useState(false);
  const [fundingState, setJoinState] = useState(false);

  const buttonRef = useRef();
  const item = [buttonRef];
  const fundingComplete = "ProjectDetailPage-funding-complete";
  const defaultButton = "ProjectDetailPage-click-btn";

  const fundingStateHandler = useCallback(() => {
    // 유저 정보 등록(백엔드)
    setJoinState(true);
    buttonRef.current.innerText = "펀딩 참여완료";
  }, [item]);
  // 리렌더링 문제 해결 요망(백엔드)

  return (
    <BackGroundGrid>
      <Header />
      <SubNav filterItem={filterItem} setFilterItem={setFilterItem} />
      <PageLayout>
        <div className="ProjectDetailPage-all">
          <div className="ProjectDetailPage-container">
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
                            <span>({option.price}원/1개)</span>
                          </div>
                          <div className="ProjectDetailPage-input">
                            <input type="number" name="optionCount" />
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
                    0 <span>원</span>
                  </div>
                </div>
              </div>
            </div>
            <DetailUserInfo />
            <DetailAgree />
            <DetailFundingStatus />
            <div className="ProjectDetailPage-click">
              <div className="ProjectDetailPage-click-btn_wrapper">
                <button
                  className={fundingState ? fundingComplete : defaultButton}
                  onClick={fundingStateHandler}
                  ref={buttonRef}
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
