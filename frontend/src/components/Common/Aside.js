import { useEffect } from "react";
import {
  Link,
  useLinkClickHandler,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./Aside.css";
import Swal from "sweetalert2";

const Aside = () => {
  const { pathname } = useLocation();
  // const navigate = useNavigate();

  const setScrollHandler = () => {
    const setScrollPosition = window.pageYOffset;
    localStorage.setItem("scrollPosition", setScrollPosition);
  };

  useEffect(() => {
    const getScrollPosition = localStorage.getItem("scrollPosition");
    if (getScrollPosition) {
      window.scrollTo(0, parseInt(getScrollPosition, 10));
    }
  });

  const isProfile = pathname === "/profile";
  const isPost = pathname === "/profile/posts";
  const isParticipatedProject = pathname === "/profile/participated-projects";
  const isBookmarks = pathname === "/profile/bookmarks";

  const activateColor = "MyProfile_main_aside_category_active";
  const defaultColor = "MyProfile_main_aside_category";

  const onDeleteId = e => {
    e.preventDefault();
    Swal.fire({
      title: "Info",
      text: "회원탈퇴 기능은 추후 추가될 예정입니다!",
      icon: "info",
      // showCancelButton: true,
      // confirmButtonColor: "#ff8473",
      // cancelButtonColor: "#aeaeae",
      confirmButtonText: "확인",
      // cancelButtonText: "취소",
    });
    // .then(result => {
    //   if (result.isConfirmed) {
    //     console.log("bye");
    //     // 추가 로직: 메인 페이지로 보내고 아이디 삭제 처리
    //     navigate("/"); // 메인 페이지로 라우팅
    //   }
    // });
  };

  return (
    <div className="MyProfile_main_aside">
      <Link to="/profile">
        <p
          className={isProfile ? activateColor : defaultColor}
          onClick={setScrollHandler}
        >
          프로필 설정
        </p>
      </Link>
      <Link to="/profile/posts">
        <p
          className={isPost ? activateColor : defaultColor}
          onClick={setScrollHandler}
        >
          작성한 글
        </p>
      </Link>
      <Link to="/profile/participated-projects">
        <p
          className={isParticipatedProject ? activateColor : defaultColor}
          onClick={setScrollHandler}
        >
          참여중인 프로젝트
        </p>
      </Link>
      <Link to="/profile/bookmarks">
        <p
          className={isBookmarks ? activateColor : defaultColor}
          onClick={setScrollHandler}
        >
          나의 꿀단지
        </p>
      </Link>
      <form className="MyProfile_main_aside_deleteId_wrapper">
        <p className="MyProfile_main_aside_deleteId" onClick={onDeleteId}>
          회원탈퇴
        </p>
      </form>
    </div>
  );
};

export default Aside;
