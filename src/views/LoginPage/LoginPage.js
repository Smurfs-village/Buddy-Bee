import "./LoginPage.css";
import Layout from "../../components/Layout/Layout";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import backgroundImg from "../../img/login_illust.svg";
import frontCloudImg from "../../img/login_cloud.svg";

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
              <div className="three-color">
                <div className="three-color-circle three-green"></div>
                <div className="three-color-circle three-yellow"></div>
                <div className="three-color-circle three-red"></div>
              </div>
            </div>
            <div className="login-icon"></div>
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
