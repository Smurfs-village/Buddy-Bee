import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const KakaoRedirectHandler = ({ onKakaoAuth }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

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

          const { token, userId, nickname, isNewUser } = response.data;

          if (isNewUser) {
            onKakaoAuth(response.data.email, response.data.nickname);
          } else {
            setUser({ id: userId, nickname }); // AuthContext를 통해 사용자 정보 설정
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("nickname", nickname);
            navigate("/");
          }
        } catch (error) {
          console.error("Kakao login failed", error);
          alert("Kakao login failed");
        }
      }
    };

    handleKakaoLogin();
  }, [onKakaoAuth, navigate, setUser]);

  return null;
};

export default KakaoRedirectHandler;
