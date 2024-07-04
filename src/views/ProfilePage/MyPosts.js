import "./MyPosts.css";
import myPageflowerImg from "../../img/myPage_flower.svg";
import cloudImg from "../../img/cloud2.svg";
import profileImg from "../../img/profile_img.svg";
import rightArrow from "../../img/right_arrow.svg";

const MainTop = () => {
  return (
    <div className="MyPosts_main_top_container">
      <img src={profileImg} className="MyPosts_main_top_container_img" />
      <div className="MyPosts_main_top_container_title_desc_wrapper">
        <p className="MyPosts_main_top_container_title">용감한 버디비</p>
        <p className="MyPosts_main_top_container_desc">
          안녕하세요! 용감한 버디비입니다. 저는 긍정적이고 활기찬 태도로 새로운
          도전을 즐깁니다.
        </p>
      </div>
      <img src={cloudImg} className="MyPosts_cloud_img" />
    </div>
  );
};

const MainAside = () => {
  return (
    <div className="MyPosts_main_aside">
      <p className="MyPosts_main_aside_word">프로필 설정</p>
      <p className="MyPosts_main_aside_word MyPosts_main_aside_word_writtenPosts">
        작성한 글
      </p>
      <p className="MyPosts_main_aside_word">진행중인 프로젝트</p>
      <p className="MyPosts_main_aside_word">나의 꿀단지</p>
      <div className="MyPosts_main_aside_deleteId_wrapper">
        <p className="MyPosts_main_aside_deleteId">회원탈퇴</p>
      </div>
    </div>
  );
};

const Card = () => {
  return (
    <div className="MyPosts_main_right_container_box">
      <div className="MyPosts_main_right_container_box_img_wrapper"></div>
      <div className="MyPosts_main_right_container_box_text_wrapper">
        <div className="MyPosts_main_right_container_box_projectName">
          프로젝트 이름
        </div>
        <div className="MyPosts_main_right_container_box_numbersOfParticipants">
          12/30명
        </div>
      </div>

      <div className="MyPosts_main_right_container_box_btn_wrapper">
        <button className="MyPosts_main_right_container_box_progressingBtn">
          진행중
        </button>
        <button className="MyPosts_main_right_container_box_deleteBtn">
          삭제
        </button>
      </div>
    </div>
  );
};

const FinishedProject = () => {
  return (
    <div className="MyPosts_main_right_container_box Myposts_finishedProject_container">
      <div className="MyPosts_main_right_container_box_img_wrapper Myposts_finishedProjectImg"></div>
      <div className="MyPosts_main_right_container_box_text_wrapper MyPosts_finishedProject_text_wrapper">
        <div className="MyPosts_main_right_container_box_projectName">
          프로젝트 이름
        </div>
        <div className="MyPosts_main_right_container_box_numbersOfParticipants">
          30/30명
        </div>
      </div>

      <div className="MyPosts_main_right_container_box_btn_wrapper">
        <button className="MyPosts_main_right_container_box_endBtn">
          종료
        </button>
        <button className="MyPosts_main_right_container_box_deleteBtn MyPosts_finishedProject_container_deleteBtn">
          삭제
        </button>
      </div>
    </div>
  );
};

const MainRightContainer = () => {
  return (
    <div className="MyPosts_main_right_container">
      <div className="MyPosts_main_right_container_writtenPosts">작성한 글</div>
      <div className="MyPosts_main_right_container_cards_wrapper">
        <Card />
        <Card />
        <Card />
        <FinishedProject />
      </div>
      <img
        src={myPageflowerImg}
        alt=""
        className="MyPosts_main_right_container_flowerImg"
      />
      <form className="MyPosts_main_right_container_btn_arrow_wrapper">
        <button className="MyPosts_main_right_container_btn MyPosts_main_right_container_pageOneBtn">
          1
        </button>
        <button className="MyPosts_main_right_container_btn MyPosts_main_right_container_pageTwoBtn">
          2
        </button>
        <img src={rightArrow} alt="" className="MyPosts_rightArrow" />
      </form>
    </div>
  );
};

const MyPosts = () => {
  return (
    <div className="MyPosts_container">
      <div className="MyPosts_main">
        <MainTop />
        <div className="MyPosts_main_aside_rightContainer_wrapper">
          <MainAside />
          <MainRightContainer />
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
