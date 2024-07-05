import { useState } from "react";
// import { Link } from "react-router-dom";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import Layout from "../../components/Layout/Layout";
import backgroundImg from "../../img/login_illust.svg";
import loginIcon from "../../img/login_bee.svg";
import frontCloudImg from "../../img/login_cloud.svg";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    //
  };

  return (
    <Layout>
      <BackGroundGrid>
        <div className="login-page">
          <div className="login-page-back-img">
            <img src={backgroundImg} alt="backImg" />
          </div>
          <form className="login-page-form" onSubmit={handleSubmit}>
            <div className="login-page-wrapper">
              <div className="login-page-action-bar">
                <div className="login-page-three-color">
                  <div className="login-page-color-circle color-green"></div>
                  <div className="login-page-color-circle color-yellow"></div>
                  <div className="login-page-color-circle color-red"></div>
                </div>
              </div>

              <div className="login-page-content-wrapper">
                <div className="login-page-icon-wrapper">
                  <img src={loginIcon} alt="loginIcon" />
                  <h2>SIGN UP</h2>
                </div>

                <div className="login-page-input-wrapper">
                  <div className="register-page-nickname-wrapper">
                    <input
                      type="text"
                      id="nickname"
                      placeholder="닉네임"
                      value={nickname}
                      required
                      onChange={e => {
                        setNickname(e.target.value);
                      }}
                    />
                    <button className="check-nickname-btn">확인하기</button>
                  </div>
                  <input
                    type="email"
                    id="id"
                    placeholder="이메일 주소"
                    value={email}
                    required
                    onChange={e => {
                      setEmail(e.target.value);
                    }}
                  />
                  <input
                    type="password"
                    id="password"
                    placeholder="비밀번호"
                    value={password}
                    required
                    onChange={e => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="login-page-btn-wrapper">
                <button className="login-page-sign-up-btn">Sign up</button>
              </div>
            </div>
          </form>
          <div className="login-page-cloud-img">
            <img src={frontCloudImg} alt="cloudImg" />
          </div>
        </div>
      </BackGroundGrid>
    </Layout>
  );
};

export default RegisterPage;
