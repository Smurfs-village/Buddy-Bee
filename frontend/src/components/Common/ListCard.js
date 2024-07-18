import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth
import "./ListCard.css";
import mockImage from "../../img/mock.svg";

const ListCard = ({ data, index, type, toggleScrap }) => {
  const hashtagsRef = useRef(null);
  const [hashtags, setHashtags] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [isHoney, setIsHoney] = useState(false);
  const { user } = useAuth(); // Get current user from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    if (hashtagsRef.current) {
      const containerWidth = hashtagsRef.current.offsetWidth;
      let totalWidth = 0;
      const hashtagsElements = Array.from(hashtagsRef.current.children);

      hashtagsElements.forEach(tag => {
        totalWidth += tag.offsetWidth + 10;
        if (totalWidth > containerWidth) {
          tag.style.display = "none";
        }
      });
    }
  }, [hashtags]);

  useEffect(() => {
    let isMounted = true;

    const fetchHashtags = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${data.id}/hashtags`
        );
        if (isMounted) setHashtags(response.data);
      } catch (error) {
        console.error("Error fetching hashtags:", error);
      }
    };

    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${data.id}/participants`
        );
        if (isMounted)
          setCurrentParticipants(response.data.currentParticipants);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    const checkHoneyStatus = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${data.id}/honey/${user.id}`
        );
        if (isMounted) setIsHoney(response.data.isHoney);
      } catch (error) {
        console.error("Error checking honey status:", error);
      }
    };

    fetchHashtags();
    fetchParticipants();
    checkHoneyStatus();

    return () => {
      isMounted = false;
    };
  }, [data.id, user]);

  const stripHtmlTags = html => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleCardClick = () => {
    navigate(`/projects/${data.id}`);
  };

  const handleHoneyClick = async e => {
    e.stopPropagation();
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    try {
      if (isHoney) {
        await axios.delete(
          `http://localhost:5001/api/projects/${data.id}/honey`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: { userId: user.id },
          }
        );
      } else {
        await axios.post(
          `http://localhost:5001/api/projects/${data.id}/honey`,
          { userId: user.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      setIsHoney(!isHoney);
      toggleScrap(index, type); // 스크랩 상태 업데이트
    } catch (error) {
      console.error("Error toggling honey status:", error);
    }
  };

  return (
    <div className="common-card" key={index} onClick={handleCardClick}>
      <div
        className="common-card-image-wrapper"
        style={{ backgroundImage: `url(${data.main_image || mockImage})` }}
      >
        <div className="common-participants-info">
          {currentParticipants} / {data.max_participants}명
        </div>
        <img
          src={isHoney ? scrap_yes : scrap_none}
          alt="Scrap"
          className="common-scrap-icon"
          onClick={handleHoneyClick}
        />
      </div>
      <div className="common-card-content">
        <div className="common-card-line-1">
          <h3>{data.title}</h3>
          <span>{data.author}</span>
        </div>
        <p>조회수 {data.view_count || 0}</p>
        <p className="common-card_desc">{stripHtmlTags(data.description)}</p>
        <div className="common-hashtags" ref={hashtagsRef}>
          {hashtags.map((tag, idx) => (
            <span
              key={idx}
              className={`common-hashtag ${
                idx % 2 === 0 ? "common-alternate-color" : ""
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListCard;
