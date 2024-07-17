import "./DetailProfile.css";

const DetailProfile = ({ username, profileImage, intro }) => {
  return (
    <div className="ProjectDetailPage-profile-wrap">
      <div className="ProjectDetailPage-profile">
        <div className="ProjectDetailPage-profile-img">
          <img src={profileImage} alt="Profile" />
        </div>
        <div className="ProjectDetailPage-profile-detail">
          <div className="ProjectDetailPage-profile-name">
            <span>{username}</span>
          </div>
          <div className="ProjectDetailPage-profile-txt">
            <span>{intro}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProfile;
