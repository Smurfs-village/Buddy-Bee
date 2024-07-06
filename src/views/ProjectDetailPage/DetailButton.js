import scrap_yes from "../../img/scrap_yes.svg";
import "./DetailButton.css";

const DetailButton = () => {
  return (
    <div className="ProjectDetailPage_btn">
      <button className="ProjectDetailPage_like">
        <img
          src={scrap_yes}
          alt="scrap_yes"
          className="ProjectDetailPage-icon"
        />
        <span>개</span>
      </button>
      <button className="ProjectDetailPage_share">
        <span>공유하기</span>
      </button>
    </div>
  );
};

export default DetailButton;
