import { Link } from "react-router-dom";
import "./LoginPage.css";
import Layout from "../../components/Layout/Layout";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import backgroundImg from "../../img/login_illust.svg";
import frontCloudImg from "../../img/login_cloud.svg";
import loginIcon from "../../img/login_bee.svg";
import { useState } from "react";

const LoginPage = () => {
  //나중에 onLogin 받아 와야할 것 같슴니다
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    // await onLogin(email, password);
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
                  <h2>LOGIN</h2>
                </div>

                <div className="login-page-input-wrapper">
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
                <Link to="/register">
                  <button className="login-page-sign-up-btn">Sign up</button>
                </Link>
                <button className="login-page-login-btn">Login</button>
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

export default LoginPage;
