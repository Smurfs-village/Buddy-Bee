import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; // useAuth import
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import mockImage from "../../img/mock.svg"; // 기본 이미지 import

const Card = ({ data, index, type, toggleScrap }) => {
  const { user } = useAuth(); // useAuth 훅 사용
  const hashtagsRef = useRef(null);
  const [hashtags, setHashtags] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [isHoney, setIsHoney] = useState(false);
  const [honeyCount, setHoneyCount] = useState(0);
  const navigate = useNavigate();

  const startPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
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
          `${API_BASE_URL}/projects/${data.id}/hashtags`
        );
        if (isMounted) setHashtags(response.data);
      } catch (error) {
        console.error("Error fetching hashtags:", error);
      }
    };

    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${data.id}/participants`
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
          `${API_BASE_URL}/projects/${data.id}/honey/${user.id}`
        );
        if (isMounted) setIsHoney(response.data.isHoney);
      } catch (error) {
        console.error("Error fetching honey status:", error);
      }
    };

    const fetchHoneyCount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${data.id}/honey`
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
  }, [data.id, user, API_BASE_URL]);

  const stripHtmlTags = html => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleCardClick = () => {
    if (!isDragging.current) {
      navigate(`/projects/${data.id}`);
    }
  };

  const handleMouseDown = e => {
    startPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
  };

  const handleMouseUp = e => {
    const endPos = { x: e.clientX, y: e.clientY };
    const distance = Math.sqrt(
      Math.pow(endPos.x - startPos.current.x, 2) +
        Math.pow(endPos.y - startPos.current.y, 2)
    );

    if (distance > 5) {
      // 드래그로 간주하는 최소 거리
      isDragging.current = true;
    } else {
      handleCardClick();
    }
  };

  const handleHoneyClick = async e => {
    e.stopPropagation();
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      if (isHoney) {
        await axios.delete(`${API_BASE_URL}/projects/${data.id}/honey`, {
          data: { userId: user.id },
          headers: config.headers, // 인증 헤더 추가
        });
        setHoneyCount(honeyCount - 1);
      } else {
        await axios.post(
          `${API_BASE_URL}/projects/${data.id}/honey`,
          {
            userId: user.id,
          },
          config // 인증 헤더 추가
        );
        setHoneyCount(honeyCount + 1);
      }
      setIsHoney(!isHoney);
    } catch (error) {
      console.error("Error toggling honey status:", error);
    }
  };

  return (
    <div
      className="mainpage-card"
      key={index}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="mainpage-card-image-wrapper">
        <img
          src={data.main_image || mockImage}
          alt="Sample"
          className="mainpage-card-image"
        />
        <div className="mainpage-participants-info">
          {currentParticipants} / {data.max_participants}명
        </div>
        <div className="mainpage-scrap-icon-wrapper">
          <img
            src={isHoney ? scrap_yes : scrap_none}
            alt={isHoney ? "scrap_yes" : "scrap_none"}
            className="mainpage-scrap-icon"
            onClick={handleHoneyClick}
            onMouseDown={e => e.stopPropagation()} // 스크랩 클릭 시 드래그 방지
            onMouseUp={e => e.stopPropagation()} // 스크랩 클릭 시 드래그 방지
          />
          <span className="mainpage-scarp-icon-info">나의 꿀단지</span>
        </div>
      </div>
      <div className="mainpage-card-content">
        <div className="mainpage-card-line-1">
          <h3 className="mainpage-card-title">{data.title}</h3>
          <span>{data.author}</span>
        </div>
        <p>조회수 {data.view_count || 0}</p>
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
