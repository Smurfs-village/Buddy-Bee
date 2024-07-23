import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import shareIcon from "../../img/share-icon.svg";
import "./DetailButton.css";

const DetailButton = ({ projectId }) => {
  const { user } = useAuth();
  const [isHoney, setIsHoney] = useState(false);
  const [honeyCount, setHoneyCount] = useState(0);
  const nowLocation = useLocation();
  const [pageURL, setPageURL] = useState("");

  useEffect(() => {
    const checkHoneyStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${projectId}/honey/${user.id}`,
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
          `http://localhost:5001/api/projects/${projectId}/honey`
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
  }, [projectId, user]);

  const handleHoneyClick = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      if (isHoney) {
        await axios.delete(
          `http://localhost:5001/api/projects/${projectId}/honey`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: { userId: user.id },
          }
        );
        setHoneyCount(honeyCount - 1); // Decrement honey count
      } else {
        await axios.post(
          `http://localhost:5001/api/projects/${projectId}/honey`,
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

  const shareURL = () => {
    // setPageURL(window.location.href);
    console.log(nowLocation);
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
      <button className="ProjectDetailPage-share" onClick={shareURL}>
        <img
          src={shareIcon}
          alt="shareIcon"
          className="ProjectDetailPage-share-icon"
        />
        <span>공유하기</span>
      </button>
    </div>
  );
};

export default DetailButton;
