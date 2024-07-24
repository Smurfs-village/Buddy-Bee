import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import shareIcon from "../../img/share-icon.svg";
import Swal from "sweetalert2"; // SweetAlert2 import 추가
import "./DetailButton.css";

const DetailButton = ({ projectId }) => {
  const { user } = useAuth();
  const [isHoney, setIsHoney] = useState(false);
  const [honeyCount, setHoneyCount] = useState(0);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const PageURL = `http://13.125.119.35:5001/projects/${projectId}`; /*복사용 사이트 */

  useEffect(() => {
    const checkHoneyStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${projectId}/honey/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsHoney(response.data.isHoney);
      } catch (error) {
        console.error("Error checking honey status:", error);
      }
    };

    const fetchHoneyCount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${projectId}/honey`
        );
        setHoneyCount(response.data.honeyCount);
      } catch (error) {
        console.error("Error fetching honey count:", error);
      }
    };

    if (user) {
      checkHoneyStatus();
      fetchHoneyCount();
    }
  }, [projectId, user, API_BASE_URL]);

  const handleHoneyClick = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      if (isHoney) {
        await axios.delete(`${API_BASE_URL}/projects/${projectId}/honey`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: { userId: user.id },
        });
        setHoneyCount(honeyCount - 1); // Decrement honey count
      } else {
        await axios.post(
          `${API_BASE_URL}/projects/${projectId}/honey`,
          {
            userId: user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setHoneyCount(honeyCount + 1); // Increment honey count
      }
      setIsHoney(!isHoney);
    } catch (error) {
      console.error("Error toggling honey status:", error);
    }
  };

  const copyURL = async url => {
    /*복사하기 버튼*/
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      await document.execCommand("copy");
      document.body.removeChild(textArea);
      Swal.fire({
        toast: true,
        position: "bottom", // 하단 오른쪽에 표시
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: "success",
        title: "링크 복사 완료!",
        didOpen: toast => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    } catch (error) {
      console.log("error while copying URL", error);
      Swal.fire({
        title: "Error",
        text: "복사 중 문제가 생겼습니다",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className="ProjectDetailPage-btn">
      <button className="ProjectDetailPage-like" onClick={handleHoneyClick}>
        <img
          src={isHoney ? scrap_yes : scrap_none}
          alt={isHoney ? "scrap_yes" : "scrap_none"}
          className="ProjectDetailPage-icon"
        />
        <span>{honeyCount}개</span> {/* Display honey count */}
      </button>
      <button
        className="ProjectDetailPage-share"
        onClick={() => copyURL(PageURL)}
      >
        <img
          src={shareIcon}
          alt="shareIcon"
          className="ProjectDetailPage-share-icon"
          onClick={() => copyURL(PageURL)}
        />
        <span>공유하기</span>
      </button>
    </div>
  );
};

export default DetailButton;
