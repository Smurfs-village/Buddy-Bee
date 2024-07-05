import "./LoginPage.css";
import Layout from "../../components/Layout/Layout";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import backgroundImg from "../../img/login_illust.svg";
import frontCloudImg from "../../img/login_cloud.svg";
import loginIcon from "../../img/login_bee.svg";

const LoginPage = () => {
  return (
    <Layout>
      <BackGroundGrid>
        <div className="login-page">
          <div className="login-page-back-img">
            <img src={backgroundImg} alt="backImg" />
          </div>
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
                <input type="email" placeholder="이메일 주소" required />
                <input type="password" placeholder="비밀번호" required />
              </div>
            </div>
            <div className="login-page-btn-wrapper">
              <button className="login-page-sign-up-btn">Sign up</button>
              <button className="login-page-login-btn">Login</button>
            </div>
          </div>
          <div className="login-page-cloud-img">
            <img src={frontCloudImg} alt="cloudImg" />
          </div>
        </div>
      </BackGroundGrid>
    </Layout>
  );
};

export default LoginPage;
