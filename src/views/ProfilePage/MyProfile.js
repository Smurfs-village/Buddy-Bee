import "./MyProfile.css";
import { useState, useRef } from "react";
import editProfileImg from "../../img/edit_profile_img.svg";
import myPageflowerImg from "../../img/myPage_flower.svg";

const MainRightContainer = () => {
  const [nickname, setNickname] = useState("용감한 버디비");
  const [password, setPassword] = useState(12345678);
  const [contactInfo, setContactInfo] = useState("01012345678");
  const [accountInfo, setAccountInfo] = useState("홍*동 KB국민은행 123456-7");
  const [intro, setIntro] = useState("");
  const userInfo = [
    { nickname: { nickname } },
    { password: { password } },
    { contactInfo: { contactInfo } },
    { accountInfo: { accountInfo } },
    { intro: { intro } },
  ];
  console.log(userInfo.nickname);
  let nicknameRef = useRef();
  let passwordRef = useRef();
  let contactInfoRef = useRef();
  let accountInfoRef = useRef();
  let introRef = useRef();

  const onChangeNicknameValue = event => {
    setNickname(event.target.value);
  };
  const onChangePasswordValue = event => {
    setPassword(event.target.value);
  };
  const onChangeContactInfoValue = event => {
    setContactInfo(event.target.value);
  };
  const onChangeAccountValue = event => {
    setAccountInfo(event.target.value);
  };
  const onChangeIntroValue = event => {
    setIntro(event.target.value);
  };

  return (
    <div className="MyProfile_main_right_container">
      <div className="MyProfile_main_right_container_userInfo_wrapper">
        <label>
          닉네임
          <input
            type="text"
            value={nickname}
            className="MyProfile_main_right_container_userInfo_input"
            ref={nicknameRef}
            onChange={onChangeNicknameValue}
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            className="MyProfile_main_right_container_userInfo_input"
            ref={passwordRef}
            onChange={onChangePasswordValue}
          />
        </label>
        <label>
          연락처
          <input
            type="text"
            value={contactInfo}
            className="MyProfile_main_right_container_userInfo_input"
            ref={contactInfoRef}
            onChange={onChangeContactInfoValue}
          />
        </label>
        <label>
          계좌정보
          <input
            type="text"
            value={accountInfo}
            className="MyProfile_main_right_container_userInfo_input"
            ref={accountInfoRef}
            onChange={onChangeAccountValue}
          />
        </label>
      </div>
      <div className="MyProfile_main_right_container_profile_edit_img_wrapper">
        <img
          src={editProfileImg}
          className="MyProfile_main_right_container_profile_edit_img"
        />
      </div>
      <input
        className="MyProfile_main_right_container_introductionLetterBox"
        placeholder="최대 50자"
        value={intro}
        ref={introRef}
        onChange={onChangeIntroValue}
      />
      <img
        src={myPageflowerImg}
        className="MyProfile_main_right_container_flowerImg"
      />
      <form className="MyProfile_main_right_container_btn_wrapper">
        <button className="MyProfile_main_right_container_btn MyProfile_main_right_container_cancelBtn">
          취소
        </button>
        <button className="MyProfile_main_right_container_btn MyProfile_main_right_container_saveBtn">
          저장
        </button>
      </form>
    </div>
  );
};

const MyProfile = () => {
  return (
    <div className="MyProfile_main_rightContainer_wrapper">
      <MainRightContainer />
    </div>
  );
};

export default MyProfile;
