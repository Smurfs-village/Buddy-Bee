import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import PageLayout from "../../components/Layout/PageLayout";
import Footer from "../../components/Footer/Footer";

import DetailTitle from "./DetailTitle";
import DetailContent from "./DetailContent";
import DetailButton from "./DetailButton";
import DetailProfile from "./DetailProfile";
import DetailHashtag from "./DetailHashtag";

// CSS
import "./ProjectDetailPage.css";

const ProjectDetailPage = ({ projectType }) => {
  const { id } = useParams();
  return (
    <BackGroundGrid>
      <Header></Header>
      <div className="project-list-page-sub-nav">
        <button>#버디비_동행</button>
        <button>#버디비_펀딩</button>
      </div>
      <PageLayout>
        <div className="ProjectDetailPage-all">
          <div className="ProjectDetailPage-container">
            <div className="ProjectDetailPage-participate">
              <div className="ProjectDetailPage-participate-txt">
                참여자 수: {id}
              </div>
              <div className="ProjectDetailPage-participate-btn">
                <button className="ProjectDetailPage-modify">수정</button>
                <button className="ProjectDetailPage-delete">삭제</button>
              </div>
            </div>
            <DetailTitle />
            <DetailContent />
            <DetailButton />
            <DetailProfile />
            <DetailHashtag />
            <div className="ProjectDetailPage-detail-wrap">
              <div className="ProjectDetailPage-detail">
                <div className="ProjectDetailPage-day">
                  <div className="ProjectDetailPage-detail-title">
                    수요조사 기간
                  </div>
                  <div className="ProjectDetailPage-detail-day">
                    2024-07-01~2024-07-07
                  </div>
                </div>
                <div className="ProjectDetailPage-option">
                  <div className="ProjectDetailPage-detail-title">
                    옵션 선택 <span>*</span>
                  </div>
                  <div className="ProjectDetailPage-option-goods">
                    <div className="ProjectDetailPage-goods-list">
                      <div className="ProjectDetailPage-goods-wrap">
                        <div className="ProjectDetailPage-goods">
                          1. GGYUCHIWA <span>(18,000원/1개)</span>
                        </div>
                        <div className="ProjectDetailPage-input">
                          <input type="radio" name="optionCount"></input>
                        </div>
                      </div>

                      <div className="ProjectDetailPage-goods-wrap">
                        <div className="ProjectDetailPage-goods">
                          2. PUPPY VER <span>(17,000원/1개)</span>
                        </div>
                        <div className="ProjectDetailPage-input">
                          <input type="radio" name="optionCount"></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
      <Footer></Footer>
    </BackGroundGrid>
  );
};

export default ProjectDetailPage;
