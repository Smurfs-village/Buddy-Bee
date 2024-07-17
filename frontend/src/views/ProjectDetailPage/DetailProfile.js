import "./DetailProfile.css";
import mockImage from "../../img/mock.svg";

const DetailProfile = ({ username, profileImage, intro }) => {
  // 기본 프로필 이미지와 설명
  const defaultProfileImage = mockImage;
  const defaultIntro = "안녕하세요!";

  return (
    <div className="ProjectDetailPage-profile-wrap">
      <div className="ProjectDetailPage-profile">
        <div className="ProjectDetailPage-profile-img">
          <img src={profileImage || defaultProfileImage} alt="Profile" />
        </div>
        <div className="ProjectDetailPage-profile-detail">
          <div className="ProjectDetailPage-profile-name">
            <span>{username}</span>
          </div>
          <div className="ProjectDetailPage-profile-txt">
            <span>{intro || defaultIntro}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProfile;
