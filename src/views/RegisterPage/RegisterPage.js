import { useState } from "react";
// import { Link } from "react-router-dom";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import Layout from "../../components/Layout/Layout";
import loginIcon from "../../img/login_bee.svg";
import LoginPageLayout from "../../components/Layout/LoginPageLayout";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Layout>
      <BackGroundGrid>
        <LoginPageLayout>
          <div className="register-page-content-wrapper">
            <div className="register-page-icon-wrapper">
              <img src={loginIcon} alt="loginIcon" />
              <h2>SIGN UP</h2>
            </div>

            <div className="register-page-input-wrapper">
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
                <button className="check-nickname-btn">중복확인</button>
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

          <div className="register-page-btn-wrapper">
            <button className="register-page-sign-up-btn">Sign up</button>
          </div>
        </LoginPageLayout>
      </BackGroundGrid>
    </Layout>
  );
};

export default RegisterPage;
