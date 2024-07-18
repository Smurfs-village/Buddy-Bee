import axios from "axios";
import { logout } from "../api/api";

const API_BASE_URL = "http://localhost:5001/api";

axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      logout();
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
