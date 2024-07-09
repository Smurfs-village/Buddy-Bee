import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

export const register = async (email, password, nickname) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    email,
    password,
    nickname,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const checkNicknameAvailability = async nickname => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check-nickname`, {
      params: { nickname },
    });
    return response.data.isAvailable;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      return false; // 닉네임이 중복된 경우
    }
    throw new Error("Error checking nickname availability");
  }
};