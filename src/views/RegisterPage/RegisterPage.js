import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackGroundGrid from "../../components/Layout/BackGroundGrid";
import Layout from "../../components/Layout/Layout";
import loginIcon from "../../img/login_bee.svg";
import LoginPageLayout from "../../components/Layout/LoginPageLayout";
import "./RegisterPage.css";
import { register, checkNicknameAvailability } from "../../api/api"; // checkNicknameAvailability 함수 추가

const RegisterPage = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null); // 닉네임 중복 확인 상태
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0 || !isNicknameAvailable) {
      setErrors(validationErrors);
      if (!isNicknameAvailable) {
        validationErrors.nickname = "닉네임 중복 확인이 필요합니다.";
      }
      return;
    }

    try {
      await register(email, password, nickname);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (nickname.length > 8) {
      errors.nickname = "닉네임은 8글자 이하로 입력해주세요.";
    }
    if (!email.includes("@")) {
      errors.email = "유효한 이메일 주소를 입력해주세요.";
    }
    if (password.length < 8) {
      errors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
    }
    return errors;
  };

  const handleCheckNickname = async () => {
    try {
      const isAvailable = await checkNicknameAvailability(nickname);
      setIsNicknameAvailable(isAvailable);
      if (isAvailable) {
        alert("사용 가능한 닉네임입니다.");
      } else {
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error("Error checking nickname availability:", error);
      alert("닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };

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
                    setIsNicknameAvailable(null); // 닉네임이 변경되면 중복 확인 상태 초기화
                  }}
                />
                <button
                  type="button"
                  className="check-nickname-btn"
                  onClick={handleCheckNickname}
                >
                  중복확인
                </button>
              </div>
              {errors.nickname && (
                <p className="error-message">{errors.nickname}</p>
              )}
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
              {errors.email && <p className="error-message">{errors.email}</p>}
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
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="register-page-btn-wrapper">
            <button
              className="register-page-sign-up-btn"
              onClick={handleRegister}
            >
              Sign up
            </button>
          </div>
        </LoginPageLayout>
      </BackGroundGrid>
    </Layout>
  );
};

export default RegisterPage;
