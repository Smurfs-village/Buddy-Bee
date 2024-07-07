import myPageflowerImg from "../../img/myPage_flower.svg";
import rightArrow from "../../img/right_arrow.svg";

export const FlowerImg = () => {
  return (
    <img
      src={myPageflowerImg}
      alt=""
      className="ProfilePage_main_right_container_flowerImg"
    />
  );
};

export const SelectPageItems = () => {
  return (
    <form className="MyPosts_ParticipatedProjects_main_right_container_btn_arrow_wrapper">
      <button className="MyPosts_ParticipatedProjects_main_right_container_btn MyPosts_ParticipatedProjects_main_right_container_pageOneBtn">
        1
      </button>
      <button className="MyPosts_ParticipatedProjects_main_right_container_btn MyPosts_ParticipatedProjects_main_right_container_pageTwoBtn">
        2
      </button>
      <img
        src={rightArrow}
        alt=""
        className="MyPosts_ParticipatedProjects_rightArrow"
      />
    </form>
  );
};
