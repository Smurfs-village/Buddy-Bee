import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import "./DetailButton.css";

const DetailButton = ({ projectId }) => {
  const { user } = useAuth();
  const [isHoney, setIsHoney] = useState(false);
  const [honeyCount, setHoneyCount] = useState(0);

  useEffect(() => {
    const checkHoneyStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${projectId}/honey/${user.id}`
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
            data: { userId: user.id },
          }
        );
        setHoneyCount(honeyCount - 1); // Decrement honey count
      } else {
        await axios.post(
          `http://localhost:5001/api/projects/${projectId}/honey`,
          {
            userId: user.id,
          }
        );
        setHoneyCount(honeyCount + 1); // Increment honey count
      }
      setIsHoney(!isHoney);
    } catch (error) {
      console.error("Error toggling honey status:", error);
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
      <button className="ProjectDetailPage-share">
        <span>공유하기</span>
      </button>
    </div>
  );
};

export default DetailButton;
