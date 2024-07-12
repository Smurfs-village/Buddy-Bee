import React, { useState, useEffect } from "react";
import axios from "axios";
import cloudImg from "../../img/cloud2.svg";
import "./Top.css";

const Top = () => {
  const [userInfo, setUserInfo] = useState({
    profile_image: "",
    username: "",
    intro: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="MyProfile_main_top_container">
      <div className="MyProfile_main_top_container_img_wrapper">
        <img
          src={userInfo.profile_image}
          alt="Profile"
          className="MyProfile_main_top_container_img"
        />
      </div>
      <div className="MyProfile_main_top_container_title_desc_wrapper">
        <p className="MyProfile_main_top_container_title">
          {userInfo.username}
        </p>
        <p className="MyProfile_main_top_container_desc">{userInfo.intro}</p>
      </div>
      <img src={cloudImg} alt="Cloud" className="MyProfile_cloud_img" />
    </div>
  );
};

export default Top;
