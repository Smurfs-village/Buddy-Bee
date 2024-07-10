import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import axios from "axios";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import "./ListCard.css";

const ListCard = ({ data, index, type, toggleScrap }) => {
  const hashtagsRef = useRef(null);
  const [hashtags, setHashtags] = useState([]);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    if (hashtagsRef.current) {
      const containerWidth = hashtagsRef.current.offsetWidth;
      let totalWidth = 0;
      const hashtagsElements = Array.from(hashtagsRef.current.children);

      hashtagsElements.forEach(tag => {
        totalWidth += tag.offsetWidth + 10; // 10은 gap 크기
        if (totalWidth > containerWidth) {
          tag.style.display = "none";
        }
      });
    }
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
    <div className="common-card" key={index} onClick={handleCardClick}>
      <div
        className="common-card-image-wrapper"
        style={{ backgroundImage: `url(${data.main_image})` }}
      >
        <div className="common-participants-info">
          {currentParticipants} / {data.max_participants}명
        </div>
        <img
          src={data.scrap ? scrap_yes : scrap_none}
          alt="Scrap"
          className="common-scrap-icon"
          onClick={e => {
            e.stopPropagation();
            toggleScrap(index, type);
          }}
        />
      </div>
      <div className="common-card-content">
        <div className="common-card-line-1">
          <h3>{data.title}</h3>
          <span>작성자: {data.author}</span>
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
