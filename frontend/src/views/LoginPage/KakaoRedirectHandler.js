import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      axios
        .post("http://localhost:5001/api/auth/kakao", { code })
        .then(response => {
          const { token, userId, nickname } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("nickname", nickname);
          navigate("/");
        })
        .catch(error => {
          console.error("Kakao login failed", error);
          alert("Kakao login failed");
          navigate("/login");
        });
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default KakaoRedirectHandler;
