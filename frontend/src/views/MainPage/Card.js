import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import axios from "axios";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";

const Card = ({ data, index, type, toggleScrap }) => {
  const hashtagsRef = useRef(null);
  const [hashtags, setHashtags] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const containerWidth = hashtagsRef.current.offsetWidth;
    let totalWidth = 0;
    const hashtagsElements = Array.from(hashtagsRef.current.children);

    hashtagsElements.forEach(tag => {
      totalWidth += tag.offsetWidth + 5; // 5는 gap 크기
      if (totalWidth > containerWidth) {
        tag.style.display = "none";
      }
    });
  }, [hashtags]);

  useEffect(() => {
    let isMounted = true;

    // Fetch hashtags from the server
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

    // Fetch current participants from the server
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

    fetchHashtags();
    fetchParticipants();

    return () => {
      isMounted = false; // Cleanup function to prevent setting state on unmounted component
    };
  }, [data.id]);

  // HTML 태그를 제거하는 함수
  const stripHtmlTags = html => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleCardClick = () => {
    navigate(`/projects/${data.id}`); // 프로젝트 디테일 페이지로 이동
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
          src={data.scrap ? scrap_yes : scrap_none}
          alt="Scrap"
          className="mainpage-scrap-icon"
          onClick={e => {
            e.stopPropagation();
            toggleScrap(index, type);
          }}
        />
      </div>
      <div className="mainpage-card-content">
        <div className="mainpage-card-line-1">
          <h3>{data.title}</h3>
          <span>작성자: {data.author}</span>
        </div>
        <p>조회수: {data.views || 0}</p>
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
