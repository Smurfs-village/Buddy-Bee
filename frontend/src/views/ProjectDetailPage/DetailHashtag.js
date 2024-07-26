import "./DetailHashtag.css";
import { Link } from "react-router-dom";

const DetailHashtag = ({ hashtags }) => {
  return (
    <div className="ProjectDetailPage-hash-wrap">
      <div className="ProjectDetailPage-hash">
        <div className="ProjectDetailPage-hash-list">
          {hashtags.map((tag, index) => (
            <Link
              key={index}
              to={`/projects?query=${tag}`}
              className={`ProjectDetailPage-hash-tag ${
                index % 2 === 0 ? "yellow" : "purple"
              }`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailHashtag;
