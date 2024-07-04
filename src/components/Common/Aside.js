import { Link } from "react-router-dom";
import "./Aside.css";

const Aside = () => {
  return (
    <div className="MyProfile_main_aside">
      <Link to="/profile">
        <p className="MyProfile_main_aside_word MyProfile_main_aside_word_profileSetting">
          프로필 설정
        </p>
      </Link>
      <Link to="/profile/posts">
        <p className="MyProfile_main_aside_word">작성한 글</p>
      </Link>
      <Link to="/profile/participated-projects">
        <p className="MyProfile_main_aside_word">참여한 프로젝트</p>
      </Link>
      <Link to="/profile/bookmarks">
        <p className="MyProfile_main_aside_word">북마크</p>
      </Link>
      <div className="MyProfile_main_aside_deleteId_wrapper">
        <p className="MyProfile_main_aside_deleteId">회원탈퇴</p>
      </div>
    </div>
  );
};

export default Aside;
