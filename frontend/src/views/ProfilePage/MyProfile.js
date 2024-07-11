import "./MyProfile.css";
import "./Common";
import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import editProfileImg from "../../img/edit_profile_img.svg";
import { FlowerImg } from "./Common";
import { useAuth } from "../../contexts/AuthContext";

const MainRightContainer = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    phone_number: "",
    account_number: "",
    intro: "",
  });

  const { username, password, phone_number, account_number, intro } = userInfo;

  useEffect(() => {
    console.log("User from AuthContext:", user);
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Fetched user info:", response.data);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  const onSaveUserProfile = useCallback(async () => {
    try {
      await axios.put("http://localhost:5001/api/user", userInfo, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("Failed to update user profile");
    }
  }, [userInfo]);

  const onChangeUsernameValue = event => {
    setUserInfo(prev => ({ ...prev, username: event.target.value }));
  };
  const onChangePasswordValue = event => {
    setUserInfo(prev => ({ ...prev, password: event.target.value }));
  };
  const onChangePhoneNumberValue = event => {
    setUserInfo(prev => ({ ...prev, phone_number: event.target.value }));
  };
  const onChangeAccountNumberValue = event => {
    setUserInfo(prev => ({ ...prev, account_number: event.target.value }));
  };
  const onChangeIntroValue = event => {
    setUserInfo(prev => ({ ...prev, intro: event.target.value }));
  };

  const inputFileRef = useRef(null);

  return (
    <div className="Main_right_container">
      <div className="MyProfile_main_right_container_userInfo_wrapper">
        <label>
          닉네임
          <input
            type="text"
            value={username}
            className="MyProfile_main_right_container_userInfo_input MyProfile_nickname_input"
            onChange={onChangeUsernameValue}
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            className="MyProfile_main_right_container_userInfo_input"
            onChange={onChangePasswordValue}
          />
        </label>
        <label className="MyProfile_contactInfo_label">
          연락처
          <input
            type="text"
            value={phone_number}
            className="MyProfile_main_right_container_userInfo_input MyProfile_nickname_input"
            onChange={onChangePhoneNumberValue}
          />
          <button className="MyProfile_certification_Btn">인증하기</button>
        </label>
        <label>
          계좌정보
          <input
            type="text"
            value={account_number}
            className="MyProfile_main_right_container_userInfo_input"
            onChange={onChangeAccountNumberValue}
          />
        </label>
        <div className="MyProfile_main_right_container_profile_edit_img_wrapper">
          <img
            src={editProfileImg}
            alt=""
            className="MyProfile_main_right_container_profile_edit_img"
            onClick={() => {
              if (inputFileRef.current) {
                inputFileRef.current.click();
              }
            }}
          />
          <input
            ref={inputFileRef}
            type="file"
            style={{ display: "none" }}
            accept="image/*"
          />
        </div>
      </div>
      <textarea
        className="MyProfile_main_right_container_introductionLetterBox"
        placeholder="최대 50자"
        value={intro}
        onChange={onChangeIntroValue}
      />
      <FlowerImg />
      <form className="MyProfile_main_right_container_btn_wrapper">
        <button className="MyProfile_main_right_container_btn MyProfile_main_right_container_cancelBtn">
          취소
        </button>
        <button
          className="MyProfile_main_right_container_btn MyProfile_main_right_container_saveBtn"
          onClick={e => {
            e.preventDefault();
            onSaveUserProfile();
          }}
        >
          저장
        </button>
      </form>
    </div>
  );
};

const MyProfile = () => {
  return <MainRightContainer />;
};

export default MyProfile;
