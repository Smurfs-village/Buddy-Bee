import axios from "axios";
import { logout } from "../api/api";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // 로그인 시도 중의 401 에러는 무시
      if (originalRequest.url.includes("/login")) {
        return Promise.reject(error);
      }

      Swal.fire({
        title: "Session Expired",
        text: "세션이 만료되었습니다. 다시 로그인해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      }).then(() => {
        logout(false); // 페이지 새로고침을 제외한 로그아웃 호출
      });
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const refreshToken = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await axios.post("/refresh-token", { token });
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      setAuthToken(newToken);
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  }
};
