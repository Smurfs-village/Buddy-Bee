import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import Layout from "../../components/Layout/Layout";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import LoginPageLayout from "../../components/Layout/LoginPageLayout";
import loginIcon from "../../img/login_bee.svg";
import { useRef, useState, useEffect } from "react";
import { login } from "../../api/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterDropDownOpen, setIsProfileDropDownOpen] = useState(false);
  const registerRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const { token, userId, nickname } = await login(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("nickname", nickname);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password");
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  const registerButton = e => {
    setIsProfileDropDownOpen(!isRegisterDropDownOpen);
    e.preventDefault();
  };

  const handleClickOutside = event => {
    if (registerRef.current && !registerRef.current.contains(event.target)) {
      setIsProfileDropDownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Layout>
      <BackGroundGrid>
        <LoginPageLayout>
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
                onKeyDown={handleKeyPress} // 엔터 키 이벤트 추가
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
                onKeyDown={handleKeyPress} // 엔터 키 이벤트 추가
              />
            </div>
          </div>

          <div className="login-page-btn-wrapper">
            <button className="login-page-sign-up-btn" onClick={registerButton}>
              Sign up
            </button>

            <button className="login-page-login-btn" onClick={handleLogin}>
              Login
            </button>
          </div>
          {isRegisterDropDownOpen && (
            <div className="login-page-register-dropdown" ref={registerRef}>
              <ul className="login-page-dropdown-list">
                <li>
                  <Link
                    to="/register"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    이메일로 가입하기
                  </Link>
                </li>
                <li>SNS로 가입하기</li>
              </ul>
            </div>
          )}
        </LoginPageLayout>
      </BackGroundGrid>
    </Layout>
  );
};

export default LoginPage;
