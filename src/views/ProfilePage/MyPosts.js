import "./MyPosts.css";
import myPageflowerImg from "../../img/myPage_flower.svg";
import rightArrow from "../../img/right_arrow.svg";
import shineeConcertImg from "../../img/shinee_concert.jpg";
import kissOfLifeConcertImg from "../../img/kissOfLife_concert.jpg";

const Card = ({ imgSrc, projectName, participants, status }) => {
  return (
    <div className="MyPosts_main_right_container_box">
      <div
        className="MyPosts_main_right_container_box_img_wrapper"
        style={{ backgroundImage: `url(${imgSrc})` }}
      ></div>
      <div className="MyPosts_main_right_container_box_text_wrapper">
        <div className="MyPosts_main_right_container_box_projectName">
          {projectName}
        </div>
        <div className="MyPosts_main_right_container_box_numbersOfParticipants">
          {participants}
        </div>
      </div>
      <div className="MyPosts_main_right_container_box_btn_wrapper">
        <button className="MyPosts_main_right_container_box_progressingBtn">
          {status}
        </button>
        <button className="MyPosts_main_right_container_box_deleteBtn">
          삭제
        </button>
      </div>
    </div>
  );
};

const FinishedProject = ({ imgSrc, projectName, participants }) => {
  return (
    <div className="MyPosts_main_right_container_box Myposts_finishedProject_container">
      <div
        className="MyPosts_main_right_container_box_img_wrapper Myposts_finishedProjectImg"
        style={{ backgroundImage: `url(${imgSrc})` }}
      ></div>
      <div className="MyPosts_main_right_container_box_text_wrapper MyPosts_finishedProject_text_wrapper">
        <div className="MyPosts_main_right_container_box_projectName">
          {projectName}
        </div>
        <div className="MyPosts_main_right_container_box_numbersOfParticipants">
          {participants}
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
        <Card
          imgSrc={shineeConcertImg}
          projectName="프로젝트 이름"
          participants="12/30명"
          status="진행중"
        />
        <Card
          imgSrc={shineeConcertImg}
          projectName="프로젝트 이름"
          participants="12/30명"
          status="진행중"
        />
        <Card
          imgSrc={shineeConcertImg}
          projectName="프로젝트 이름"
          participants="12/30명"
          status="진행중"
        />
        <FinishedProject
          imgSrc={kissOfLifeConcertImg}
          projectName="프로젝트 이름"
          participants="30/30명"
        />
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
      <MainRightContainer />
    </div>
  );
};

export default MyPosts;
