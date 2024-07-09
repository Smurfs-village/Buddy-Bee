import { useRef, useEffect } from "react";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import "./ListCard.css";

const ListCard = ({ data, index, type, toggleScrap }) => {
  const hashtagsRef = useRef(null);

  useEffect(() => {
    const containerWidth = hashtagsRef.current.offsetWidth;
    let totalWidth = 0;
    const hashtags = Array.from(hashtagsRef.current.children);

    hashtags.forEach(tag => {
      totalWidth += tag.offsetWidth + 10; // 5는 gap 크기
      if (totalWidth + 2 > containerWidth) {
        tag.style.display = "none";
      }
    });
  }, [data.hashtags]);

  return (
    <div className="common-card" key={index}>
      <div
        className="common-card-image-wrapper"
        style={{ backgroundImage: `url(${data.image})` }}
      >
        <div className="common-participants-info">
          {data.currentParticipants}/{data.maxParticipants}명
        </div>
        <img
          src={data.scrap ? scrap_yes : scrap_none}
          alt="Scrap"
          className="common-scrap-icon"
          onClick={() => toggleScrap(index, type)}
        />
      </div>
      <div className="common-card-content">
        <div className="common-card-line-1">
          <h3>{data.title}</h3>
          <span>{data.author}</span>
        </div>
        <p>조회수 {data.views}</p>
        <p className="common-card_desc">{data.description}</p>
        <div className="common-hashtags" ref={hashtagsRef}>
          {data.hashtags.map((tag, idx) => (
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
