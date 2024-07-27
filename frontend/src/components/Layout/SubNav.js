import "./SubNav.css";
import { Link, useNavigate } from "react-router-dom";

const SubNav = () => {
  const navigate = useNavigate();

  const handleFilterClick = filter => {
    navigate(`/projects?type=${filter}`);
  };

  return (
    <>
      <div className="sub-nav-wrapper">
        <button
          className="sub-nav-all-btn"
          onClick={() => handleFilterClick("all")}
        >
          <Link to="/projects?type=all">#전체</Link>
        </button>
        <button
          className="sub-nav-with-btn"
          onClick={() => handleFilterClick("with")}
        >
          <Link to="/projects?type=with">#버디비_동행</Link>
        </button>
        <button
          className="sub-nav-funding-btn"
          onClick={() => handleFilterClick("funding")}
        >
          <Link to="/projects?type=funding">#버디비_펀딩</Link>
        </button>
      </div>
    </>
  );
};

export default SubNav;
