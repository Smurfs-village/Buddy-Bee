import "./MyPosts.css";
import myPageflowerImg from "../../img/myPage_flower.svg";
import rightArrow from "../../img/right_arrow.svg";

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
    <div className="MyPosts_main_rightContainer_wrapper">
      <MainRightContainer />
    </div>
  );
};

export default MyPosts;
