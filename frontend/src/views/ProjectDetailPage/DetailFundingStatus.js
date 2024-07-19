import "./DetailFundingStatus.css";
import bee_yellow from "../../img/bee_yellow.svg";

const DetailFundingStatus = () => {
  return (
    <div className="ProjectDetailPage-funding-wrap">
      <div className="ProjectDetailPage-funding">
        <div className="ProjectDetailPage-funding-title">현재 달성 금액</div>
        <div className="ProjectDetailPage-money">
          9,999,999 <span>원</span>
        </div>
        <div className="ProjectDetailPage-status">
          <div className="ProjectDetailPage-status-bar">
            <div className="ProjectDetailPage-status-bar-bg">
              <div className="ProjectDetailPage-status-bar-bee">
                <img
                  src={bee_yellow}
                  alt="bee_yellow"
                  className="ProjectDetailPage-status-icon"
                />
              </div>
            </div>
          </div>
          <div className="ProjectDetailPage-status-rate">
            70 <span>% 달성중</span>
          </div>
          <div className="ProjectDetailPage-status-money">
            목표 금액 9,999,999 <span>원</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFundingStatus;
