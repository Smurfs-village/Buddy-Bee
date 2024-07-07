import "./MyProfile.css";
import "./ProfilePage.css";
import { useState, useCallback, useEffect, useRef } from "react";
import editProfileImg from "../../img/edit_profile_img.svg";
import { FlowerImg } from "./Common";

const USER_INFO_KEY = "userInfo";

const MainRightContainer = () => {
    useEffect(() => {
        const userInfoString = localStorage.getItem(USER_INFO_KEY);
        if (userInfoString) {
            const userInfoObject = JSON.parse(userInfoString);
            setUserInfo(userInfoObject);
        }
    }, []);

    const [userInfo, setUserInfo] = useState({
        nickname: "",
        password: 0,
        contactInfo: "",
        accountInfo: "",
        intro: "",
    });

    const { nickname, password, contactInfo, accountInfo, intro } = userInfo;

    const onSaveUserProfile = useCallback(() => {
        // api 찔러서 백엔드에 저장
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    }, [userInfo]);

    const onChangeNicknameValue = event => {
        setUserInfo(prev => ({ ...prev, nickname: event.target.value }));
    };
    const onChangePasswordValue = event => {
        setUserInfo(prev => ({ ...prev, password: event.target.value }));
    };
    const onChangeContactInfoValue = event => {
        setUserInfo(prev => ({ ...prev, contactInfo: event.target.value }));
    };
    const onChangeAccountValue = event => {
        setUserInfo(prev => ({ ...prev, accountInfo: event.target.value }));
    };
    const onChangeIntroValue = event => {
        setUserInfo(prev => ({ ...prev, intro: event.target.value }));
    };

    const inputFileRef = useRef(null);

    return (
        <div className="MyProfile_main_right_container">
            <div className="MyProfile_main_right_container_userInfo_wrapper">
                <label>
                    닉네임
                    <input
                        type="text"
                        value={nickname}
                        className="MyProfile_main_right_container_userInfo_input"
                        onChange={onChangeNicknameValue}
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
                <label>
                    연락처
                    <input
                        type="text"
                        value={contactInfo}
                        className="MyProfile_main_right_container_userInfo_input"
                        onChange={onChangeContactInfoValue}
                    />
                </label>
                <label>
                    계좌정보
                    <input
                        type="text"
                        value={accountInfo}
                        className="MyProfile_main_right_container_userInfo_input"
                        onChange={onChangeAccountValue}
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
    return (
        <div className="MyProfile_main_rightContainer_wrapper">
            <MainRightContainer />
        </div>
    );
};

export default MyProfile;
