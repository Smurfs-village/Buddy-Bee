import "./SubNav.css";
import { Link, useNavigate } from "react-router-dom";

const SubNav = () => {
  const navigate = useNavigate();

  const handleFilterClick = filter => {
    navigate(`/projects?query=${filter}`);
  };

  return (
    <>
      <div className="sub-nav-wrapper">
        <button
          className="sub-nav-all-btn"
          onClick={() => handleFilterClick("전체")}
        >
          <Link to="/projects?query=전체">#전체</Link>
        </button>
        <button
          className="sub-nav-with-btn"
          onClick={() => handleFilterClick("동행")}
        >
          <Link to="/projects?query=동행">#버디비_동행</Link>
        </button>
        <button
          className="sub-nav-funding-btn"
          onClick={() => handleFilterClick("펀딩")}
        >
          <Link to="/projects?query=펀딩">#버디비_펀딩</Link>
        </button>
      </div>
    </>
  );
};

export default SubNav;
