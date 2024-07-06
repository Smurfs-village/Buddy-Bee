import "./DetailUserInfo.css";

const DetailUserInfo = () => {
  return (
    <div className="ProjectDetailPage_user_wrap">
      <div className="ProjectDetailPage_user">
        <div className="ProjectDetailPage_user_title">
          신청자 정보 <span>*</span>
        </div>
        <div className="ProjectDetailPage_user_info">
          <div className="ProjectDetailPage_user_name">
            <input type="text" placeholder="신청자명"></input>
          </div>
          <div className="ProjectDetailPage_user_email">
            <input type="text" placeholder="이메일 주소"></input>
          </div>
          <div className="ProjectDetailPage_user_tel">
            <input type="text" placeholder="전화번호"></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUserInfo;
