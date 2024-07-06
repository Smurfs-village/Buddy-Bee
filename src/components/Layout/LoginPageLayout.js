import backgroundImg from "../../img/login_illust.svg";
import frontCloudImg from "../../img/login_cloud.svg";
import "./LoginPageLayout.css";

const LoginPageLayout = ({ children }) => {
  const handleSubmit = async e => {
    e.preventDefault();
    // await onLogin(email, password);
  };

  return (
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
          <></>
          {children}
          <></>
        </div>
      </form>
      <div className="login-page-cloud-img">
        <img src={frontCloudImg} alt="cloudImg" />
      </div>
    </div>
  );
};

export default LoginPageLayout;
