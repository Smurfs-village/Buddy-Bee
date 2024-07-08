import "./DetailUserInfo.css";

const DetailUserInfo = () => {
  return (
    <div className="ProjectDetailPage-user-wrap">
      <div className="ProjectDetailPage-user">
        <div className="ProjectDetailPage-user-title">
          신청자 정보 <span>*</span>
        </div>
        <div className="ProjectDetailPage-user-info">
          <div className="ProjectDetailPage-user-name">
            <input type="text" placeholder="신청자명"></input>
          </div>
          <div className="ProjectDetailPage-user-email">
            <input type="text" placeholder="이메일 주소"></input>
          </div>
          <div className="ProjectDetailPage-user-tel">
            <input type="text" placeholder="전화번호"></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUserInfo;
