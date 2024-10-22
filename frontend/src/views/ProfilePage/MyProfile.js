import "./MyProfile.css";
import "./Common";
import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import pen from "../../img/mingcute_quill-pen-line.png";
import mockImg from "../../img/mock.svg"; // 기본 이미지 경로 추가
import { useAuth } from "../../contexts/AuthContext";
import myProfileFlower from "../../img/myPage_flower.svg";
import Swal from "sweetalert2"; // SweetAlert2 import

const FlowerImg = () => {
  return <img src={myProfileFlower} alt="" className="MyProfile_flowerImg" />;
};

const MainRightContainer = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    username: "",
    phone_number: "",
    account_number: "",
    intro: "",
    profile_image: "", // 초기값 빈 문자열
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [editableFields, setEditableFields] = useState({
    username: false,
    phone_number: false,
    account_number: false,
  });

  const { username, phone_number, account_number, intro, profile_image } =
    userInfo || {};

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (user) {
      fetchUserInfo();
    }
  }, [user, API_BASE_URL]);

  const onSaveUserProfile = useCallback(async () => {
    const { password, ...updatedUserInfo } = userInfo; // 비밀번호 필드를 제거
    try {
      await axios.put(`${API_BASE_URL}/user`, updatedUserInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      Swal.fire({
        title: "Success",
        text: "변경 완료 되었습니다!",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      Swal.fire({
        title: "Error",
        text: "변경 중 오류가 발생했습니다",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  }, [userInfo, API_BASE_URL]);

  const onChangeUsernameValue = event => {
    setUserInfo(prev => ({ ...prev, username: event.target.value || "" }));
  };
  const onChangePhoneNumberValue = event => {
    setUserInfo(prev => ({
      ...prev,
      phone_number: event.target.value || "",
    }));
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

  const handleProfileImageUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserInfo(prev => ({
        ...prev,
        profile_image: response.data.url,
      }));
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleOverlayClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <div className="Main_right_container">
      <div className="MyProfile_main_right_container_userInfo_wrapper">
        <div className="MyProfile_input_box">
          <label className="MyProfile_label_with_pen">
            <span>닉네임</span>
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
            <span>비밀번호</span>

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
                Swal.fire({
                  title: "Info",
                  text: "비밀번호 변경 기능은 추후 추가될 예정입니다!",
                  icon: "info",
                  confirmButtonText: "확인",
                })
              }
            />
          </label>
          <label className="MyProfile_contactInfo_label">
            <span>연락처</span>

            <input
              type="text"
              value={phone_number || ""}
              className="MyProfile_main_right_container_userInfo_input MyProfile_nickname_input"
              onChange={onChangePhoneNumberValue}
              readOnly={!editableFields.phone_number}
            />
            <button
              className="MyProfile_certification_Btn"
              onClick={() =>
                Swal.fire({
                  title: "Info",
                  text: "휴대폰 번호 인증은 추후 추가될 예정입니다!",
                  icon: "info",
                  confirmButtonText: "확인",
                })
              }
            >
              인증하기
            </button>
          </label>
          <label className="MyProfile_label_with_pen">
            <span>계좌정보</span>

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
        </div>
        <div className="MyProfile_main_right_container_profile_edit_img_wrapper">
          <div className="MyProfile_main_right_container_profile_edit_img_wrapper_inner">
            <img
              src={profile_image || mockImg} // 프로필 이미지가 없으면 기본 이미지 사용
              alt="Profile"
              className="MyProfile_main_right_container_profile_edit_img"
              onClick={handleOverlayClick}
            />
            <div className="MyProfile_overlay" onClick={handleOverlayClick}>
              <span className="overlay-text">프로필 이미지 변경</span>
            </div>
            <input
              ref={inputFileRef}
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleProfileImageUpload}
            />
          </div>
        </div>
      </div>
      <div className="MyProfile_main_right_container_introductionLetterBox_flowerImg_wrapper">
        <textarea
          className="MyProfile_main_right_container_introductionLetterBox"
          placeholder="최대 50자"
          value={intro || ""}
          onChange={onChangeIntroValue}
          maxLength={50}
        />
        <FlowerImg />
      </div>
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
