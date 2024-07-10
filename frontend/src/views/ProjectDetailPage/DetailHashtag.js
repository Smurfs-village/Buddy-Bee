import "./DetailHashtag.css";

const DetailHashtag = ({ hashtags }) => {
  return (
    <div className="ProjectDetailPage-hash-wrap">
      <div className="ProjectDetailPage-hash">
        <div className="ProjectDetailPage-hash-list">
          {hashtags.map((tag, index) => (
            <div
              key={index}
              className={`ProjectDetailPage-hash-tag ${
                index % 2 === 0 ? "yellow" : "purple"
              }`}
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailHashtag;
