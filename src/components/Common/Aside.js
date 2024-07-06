import { Link, useLocation } from "react-router-dom";
import "./Aside.css";

const Aside = () => {
  const { pathname } = useLocation();

  const isProfile = pathname === "/profile";
  const isPost = pathname === "/profile/posts";
  const isParticipatedProject = pathname === "/profile/participated-projects";
  const isBookmarks = pathname === "/profile/bookmarks";

  const activateColor = "MyProfile_main_aside_category_active";
  const defaultColor = "MyProfile_main_aside_category";

  const onDeleteId = () => {
    const result = window.confirm("정말로 탈퇴하시겠습니까?");
    result ? console.log("bye") : console.log("stay");
    // true => 메인페이지로 보내고(라우팅) 아이디 삭제
    // false => 그대로 두기
  };

  return (
    <div className="MyProfile_main_aside">
      <Link to="/profile" style={{ textDecoration: "none" }}>
        <p className={isProfile ? activateColor : defaultColor}>프로필 설정</p>
      </Link>
      <Link to="/profile/posts" style={{ textDecoration: "none" }}>
        <p className={isPost ? activateColor : defaultColor} id="posts">
          작성한 글
        </p>
      </Link>
      <Link
        to="/profile/participated-projects"
        style={{ textDecoration: "none" }}
      >
        <p className={isParticipatedProject ? activateColor : defaultColor}>
          참여중인 프로젝트
        </p>
      </Link>
      <Link to="/profile/bookmarks" style={{ textDecoration: "none" }}>
        <p className={isBookmarks ? activateColor : defaultColor}>
          나의 꿀단지
        </p>
      </Link>
      <div className="MyProfile_main_aside_deleteId_wrapper">
        <p className="MyProfile_main_aside_deleteId" onClick={onDeleteId}>
          회원탈퇴
        </p>
      </div>
    </div>
  );
};

export default Aside;
