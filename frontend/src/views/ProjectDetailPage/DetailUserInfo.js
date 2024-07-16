import "./DetailUserInfo.css";

const DetailUserInfo = ({ setApplicantName, setEmail, setPhone }) => {
  return (
    <div className="ProjectDetailPage-user-wrap">
      <div className="ProjectDetailPage-user">
        <div className="ProjectDetailPage-user-title">
          신청자 정보 <span>*</span>
        </div>
        <div className="ProjectDetailPage-user-info">
          <div className="ProjectDetailPage-user-name">
            <input
              type="text"
              placeholder="신청자명"
              onChange={e => setApplicantName(e.target.value)}
              required
            />
          </div>
          <div className="ProjectDetailPage-user-email">
            <input
              type="email"
              placeholder="이메일 주소"
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="ProjectDetailPage-user-tel">
            <input
              type="tel"
              placeholder="전화번호"
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUserInfo;
