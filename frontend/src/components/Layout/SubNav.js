import "./SubNav.css";
import { Link, useNavigate } from "react-router-dom";

const SubNav = () => {
  const navigate = useNavigate();

  const handleFilterClick = (filter, type) => {
    navigate(`/projects?query=${filter}&type=${type}`);
  };

  return (
    <div className="sub-nav-wrapper">
      <button
        className="sub-nav-all-btn"
        onClick={() => handleFilterClick("전체", "all")}
      >
        <Link to="/projects?query=전체&type=all">#전체</Link>
      </button>
      <button
        className="sub-nav-with-btn"
        onClick={() => handleFilterClick("동행", "with")}
      >
        <Link to="/projects?query=동행&type=with">#버디비_동행</Link>
      </button>
      <button
        className="sub-nav-funding-btn"
        onClick={() => handleFilterClick("펀딩", "funding")}
      >
        <Link to="/projects?query=펀딩&type=funding">#버디비_펀딩</Link>
      </button>
    </div>
  );
};

export default SubNav;
