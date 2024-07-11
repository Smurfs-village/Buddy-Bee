import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; // useAuth import
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";

const Card = ({ data, index, type, toggleScrap }) => {
  const { user } = useAuth(); // useAuth 훅 사용
  const hashtagsRef = useRef(null);
  const [hashtags, setHashtags] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [isHoney, setIsHoney] = useState(false);
  const [honeyCount, setHoneyCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (hashtagsRef.current) {
      const containerWidth = hashtagsRef.current.offsetWidth;
      let totalWidth = 0;
      const hashtagsElements = Array.from(hashtagsRef.current.children);

      hashtagsElements.forEach(tag => {
        totalWidth += tag.offsetWidth + 5;
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

    const fetchHoneyStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${data.id}/honey/${user.id}`
        );
        if (isMounted) setIsHoney(response.data.isHoney);
      } catch (error) {
        console.error("Error fetching honey status:", error);
      }
    };

    const fetchHoneyCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/projects/${data.id}/honey`
        );
        if (isMounted) setHoneyCount(response.data.honeyCount);
      } catch (error) {
        console.error("Error fetching honey count:", error);
      }
    };

    fetchHashtags();
    fetchParticipants();
    if (user) {
      fetchHoneyStatus();
      fetchHoneyCount();
    }

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
            data: { userId: user.id },
          }
        );
        setHoneyCount(honeyCount - 1);
      } else {
        await axios.post(
          `http://localhost:5001/api/projects/${data.id}/honey`,
          {
            userId: user.id,
          }
        );
        setHoneyCount(honeyCount + 1);
      }
      setIsHoney(!isHoney);
    } catch (error) {
      console.error("Error toggling honey status:", error);
    }
  };

  return (
    <div className="mainpage-card" key={index} onClick={handleCardClick}>
      <div className="mainpage-card-image-wrapper">
        <img
          src={data.main_image}
          alt="Sample"
          className="mainpage-card-image"
        />
        <div className="mainpage-participants-info">
          {currentParticipants} / {data.max_participants}명
        </div>
        <img
          src={isHoney ? scrap_yes : scrap_none}
          alt={isHoney ? "scrap_yes" : "scrap_none"}
          className="mainpage-scrap-icon"
          onClick={handleHoneyClick}
        />
      </div>
      <div className="mainpage-card-content">
        <div className="mainpage-card-line-1">
          <h3>{data.title}</h3>
          <span>작성자: {data.author}</span>
        </div>
        <p>조회수: {data.view_count || 0}</p>
        <p className="mainpage-card_desc">{stripHtmlTags(data.description)}</p>
        <div className="mainpage-hashtags" ref={hashtagsRef}>
          {hashtags.map((tag, idx) => (
            <span
              key={idx}
              className={`mainpage-hashtag ${
                idx % 2 === 0 ? "mainpage-alternate-color" : ""
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

export default Card;
