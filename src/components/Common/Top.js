import profileImg from "../../img/profile_img.svg";
import cloudImg from "../../img/cloud2.svg";
import "./Top.css";

const Top = () => {
  return (
    <div className="MyProfile_main_top_container">
      <img
        src={profileImg}
        alt=""
        className="Myprofile_main_top_container_img"
      />
      <div className="MyProfile_main_top_container_title_desc_wrapper">
        <p className="MyProfile_main_top_container_title">용감한 버디비</p>
        <p className="MyProfile_main_top_container_desc">
          안녕하세요! 용감한 버디비입니다. 저는 긍정적이고 활기찬 태도로 새로운
          도전을 즐깁니다.
        </p>
      </div>
      <img src={cloudImg} alt="" className="MyProfile_cloud_img" />
    </div>
  );
};

export default Top;
