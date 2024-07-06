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
import DetailUserInfo from "./DetailUserInfo";
import DetailAgree from "./DetailAgree";

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
        {/* 추가적인 내용이 필요하면 여기에 작성 */}
        <div className="ProjectDetailPage_all">
          <div className="ProjectDetailPage_container">
            <div className="ProjectDetailPage-participate">
              <div className="ProjectDetailPage-participate-txt">
                참여자 수:{id}
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
            <div className="ProjectDetailPage_detail_wrap">
              <div className="ProjectDetailPage_detail">
                <div className="ProjectDetailPage_day">
                  <div className="ProjectDetailPage_detail_title">
                    수요조사 기간
                  </div>
                  <div className="ProjectDetailPage_detail_day">
                    2024-07-01~2024-07-07
                  </div>
                </div>
                <div className="ProjectDetailPage_option">
                  <div className="ProjectDetailPage_detail_title">
                    옵션 선택 <span>*</span>
                  </div>
                  <div className="ProjectDetailPage_option_goods">
                    <div className="ProjectDetailPage_goods_list">
                      <div className="ProjectDetailPage_goods_wrap">
                        <div className="ProjectDetailPage_goods">
                          1. GGYUCHIWA <span>(18,000원/1개)</span>
                        </div>
                        <div className="ProjectDetailPage_input">
                          <input type="number" name="optionCount"></input>
                          <span>개</span>
                        </div>
                      </div>

                      <div className="ProjectDetailPage_goods_wrap">
                        <div className="ProjectDetailPage_goods">
                          2. PUPPY VER <span>(17,000원/1개)</span>
                        </div>
                        <div className="ProjectDetailPage_input">
                          <input type="number" name="optionCount"></input>
                          <span>개</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ProjectDetailPage_total">
                  <div className="ProjectDetailPage_detail_title">
                    총 결제금액
                  </div>
                  <div className="ProjectDetailPage_total_cash">
                    0 <span>원</span>
                  </div>
                </div>
              </div>
            </div>
            <DetailUserInfo />
            <DetailAgree />
            <div className="ProjectDetailPage_click">
              <div className="ProjectDetailPage_click_btn">
                <button>펀딩 참여하기</button>
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
