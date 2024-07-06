import backgroundImg from "../../img/login_illust.svg";
import frontCloudImg from "../../img/login_cloud.svg";
import "./LoginPageLayout.css";

const LoginPageLayout = ({ children }) => {
  const handleSubmit = async e => {
    e.preventDefault();
    // await onLogin(email, password);
  };

  return (
    <div className="login-page-layout">
      <div className="login-page-layout-back-img">
        <img src={backgroundImg} alt="backImg" />
      </div>
      <form className="login-page-layout-form" onSubmit={handleSubmit}>
        <div className="login-page-layout-wrapper">
          <div className="login-page-layout-action-bar">
            <div className="login-page-layout-three-color">
              <div className="login-page-layout-color-circle color-green"></div>
              <div className="login-page-layout-color-circle color-yellow"></div>
              <div className="login-page-layout-color-circle color-red"></div>
            </div>
          </div>
          <></>
          {children}
          <></>
        </div>
      </form>
      <div className="login-page-layout-cloud-img">
        <img src={frontCloudImg} alt="cloudImg" />
      </div>
    </div>
  );
};

export default LoginPageLayout;
