import React, { useState, useEffect } from "react";
import axios from "axios";
import cloudImg from "../../img/cloud2.svg";
import mockImg from "../../img/mock.svg"; // 기본 이미지 경로 추가
import "./Top.css";

const Top = () => {
  const [profileImg, setProfileImg] = useState("");
  const [username, setUsername] = useState("");
  const [intro, setIntro] = useState();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get("${API_BASE_URL}/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfileImg(response.data.profile_image);
        setUsername(response.data.username);
        setIntro(response.data.intro);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <div className="MyProfile_main_top_container">
      <div className="MyProfile_main_top_container_img_wrapper">
        <img
          src={profileImg || mockImg} // 프로필 이미지가 없으면 기본 이미지 사용
          alt="Profile"
          className="MyProfile_main_top_container_img"
        />
      </div>
      <div className="MyProfile_main_top_container_title_desc_wrapper">
        <p className="MyProfile_main_top_container_title">{username}</p>
        <p className="MyProfile_main_top_container_desc">{intro}</p>
      </div>
      <img src={cloudImg} alt="Cloud" className="MyProfile_cloud_img" />
    </div>
  );
};

export default Top;
