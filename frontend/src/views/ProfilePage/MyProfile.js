import "./MyProfile.css";
import "./Common";
import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import editProfileImg from "../../img/edit_profile_img.svg";
import pen from "../../img/mingcute_quill-pen-line.png"; // pen 이미지 경로 수정
import { FlowerImg } from "./Common";
import { useAuth } from "../../contexts/AuthContext";

const MainRightContainer = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    username: "",
    phone_number: "",
    account_number: "",
    intro: "",
  });

  const [editableFields, setEditableFields] = useState({
    username: false,
    phone_number: false,
    account_number: false,
  });

  const { username, phone_number, account_number, intro } = userInfo || {};

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
    const { password, ...updatedUserInfo } = userInfo; // 비밀번호 필드를 제거
    try {
      await axios.put("http://localhost:5001/api/user", updatedUserInfo, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("Failed to update user profile");
    }
  }, [userInfo]);

  const onChangeUsernameValue = event => {
    setUserInfo(prev => ({ ...prev, username: event.target.value || "" }));
  };
  const onChangePhoneNumberValue = event => {
    setUserInfo(prev => ({ ...prev, phone_number: event.target.value || "" }));
  };
  const onChangeAccountNumberValue = event => {
    setUserInfo(prev => ({
      ...prev,
      account_number: event.target.value || "",
    }));
  };
  const onChangeIntroValue = event => {
    setUserInfo(prev => ({ ...prev, intro: event.target.value || "" }));
  };

  const toggleEditField = field => {
    setEditableFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const inputFileRef = useRef(null);

  return (
    <div className="Main_right_container">
      <div className="MyProfile_main_right_container_userInfo_wrapper">
        <label className="MyProfile_label_with_pen">
          닉네임
          <input
            type="text"
            value={username || ""}
            className="MyProfile_main_right_container_userInfo_input MyProfile_nickname_input"
            onChange={onChangeUsernameValue}
            readOnly={!editableFields.username}
          />
          <img
            src={pen}
            alt="Edit"
            className="pen-icon"
            onClick={() => toggleEditField("username")}
          />
        </label>
        <label className="MyProfile_label_with_pen">
          비밀번호
          <input
            type="password"
            value="********"
            className="MyProfile_main_right_container_userInfo_input"
            readOnly
          />
          <img
            src={pen}
            alt="Edit"
            className="pen-icon"
            onClick={() =>
              alert("비밀번호 변경 기능은 추후에 추가될 예정입니다.")
            }
          />
        </label>
        <label className="MyProfile_contactInfo_label">
          연락처
          <input
            type="text"
            value={phone_number || ""}
            className="MyProfile_main_right_container_userInfo_input MyProfile_nickname_input"
            onChange={onChangePhoneNumberValue}
            readOnly={!editableFields.phone_number}
          />
          <button className="MyProfile_certification_Btn">인증하기</button>
        </label>
        <label className="MyProfile_label_with_pen">
          계좌정보
          <input
            type="text"
            value={account_number || ""}
            className="MyProfile_main_right_container_userInfo_input"
            onChange={onChangeAccountNumberValue}
            readOnly={!editableFields.account_number}
          />
          <img
            src={pen}
            alt="Edit"
            className="pen-icon"
            onClick={() => toggleEditField("account_number")}
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
        value={intro || ""}
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
