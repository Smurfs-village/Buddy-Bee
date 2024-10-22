import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import Layout from "../../components/Layout/Layout";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import LoginPageLayout from "../../components/Layout/LoginPageLayout";
import loginIcon from "../../img/login_bee.svg";
import { useRef, useState, useEffect } from "react";
import { login } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext"; // useAuth import 추가
import Swal from "sweetalert2"; // SweetAlert2 import 추가
import "../../components/Common/SweetAlert.css";
import googleLogo from "../../img/google.png";
import kakaoLogo from "../../img/KakaoTalk_logo.png";
import naverLogo from "../../img/naver.png";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterDropDownOpen, setIsProfileDropDownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const registerRef = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // setUser 함수 가져오기

  const handleLogin = async e => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        title: "Error",
        text: "이메일과 비밀번호를 입력해주세요",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#3085d",
      });
      return;
    }
    try {
      const { token, userId, nickname } = await login(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("nickname", nickname);
      setUser({ id: userId, nickname }); // setUser 호출
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: "Error",
          text: "유효하지 않은 아이디 또는 비밀번호입니다",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
    const scrollPosition = window.pageYOffset;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
    document.body.style.position = "";
  };

  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    // window.Kakao 객체가 존재하는지 확인
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(REST_API_KEY);
      }
      window.Kakao.Auth.authorize({
        redirectUri: REDIRECT_URI,
      });
    } else {
      console.error("Kakao SDK not loaded.");
    }
  };

  const handleNaverLogin = () => {
    // Naver 로그인 처리 로직 추가
  };

  const handleGoogleLogin = () => {
    // Google 로그인 처리 로직 추가
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

          <div className="sns-login-wrapper">
            <p>SNS Login</p>
            <div className="sns-login-icons">
              <button onClick={handleNaverLogin}>
                <img src={naverLogo} alt="Naver" />
              </button>
              <button onClick={handleKakaoLogin}>
                <img src={kakaoLogo} alt="Kakao" />
              </button>
              <button onClick={handleGoogleLogin}>
                <img src={googleLogo} alt="Google" />
              </button>
            </div>
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
                <li onClick={handleOpenModal}>SNS로 가입하기</li>
              </ul>
            </div>
          )}
        </LoginPageLayout>
        {isModalOpen && (
          <div className="sns-register-overlay">
            <div className="modal">
              <button className="modal-close-btn" onClick={handleCloseModal}>
                &times;
              </button>
              <h2 className="modal-title">SNS 가입하기</h2>{" "}
              <div className="modal-content">
                <button className="sns-signup-btn naver">
                  <img src={naverLogo} alt="Naver" />
                  <span>네이버 가입하기</span>
                </button>
                <button
                  className="sns-signup-btn kakao"
                  onClick={handleKakaoLogin}
                >
                  <img src={kakaoLogo} alt="Kakao" />
                  <span>카카오 가입하기</span>
                </button>
                <button className="sns-signup-btn google">
                  <img src={googleLogo} alt="Google" />
                  <span>구글 가입하기</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </BackGroundGrid>
    </Layout>
  );
};

export default LoginPage;
