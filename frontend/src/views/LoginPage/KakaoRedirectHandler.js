import { useEffect } from "react";
import axios from "axios";

const KakaoRedirectHandler = ({ onKakaoAuth }) => {
  useEffect(() => {
    const handleKakaoLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        try {
          const response = await axios.post(
            "http://localhost:5001/api/auth/kakao",
            { code }
          );

          if (response.data.isNewUser) {
            onKakaoAuth(response.data.email, response.data.nickname);
          } else {
            const { token, userId, nickname } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("nickname", nickname);
            window.location.href = "/"; // 새로고침 방식으로 홈으로 이동
          }
        } catch (error) {
          console.error("Kakao login failed", error);
          alert("Kakao login failed");
        }
      }
    };

    handleKakaoLogin();
  }, [onKakaoAuth]);

  return null;
};

export default KakaoRedirectHandler;
