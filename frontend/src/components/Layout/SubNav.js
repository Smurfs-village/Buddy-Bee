import "./SubNav.css";
import { Link } from "react-router-dom";

const SubNav = ({ setFilterItem }) => {
  return (
    <>
      <div className="sub-nav-wrapper">
        <button
          className="sub-nav-with-btn"
          onClick={() => {
            setFilterItem("with");
          }}
        >
          <Link to="/projects">#버디비_동행</Link>
        </button>
        <button
          className="sub-nav-funding-btn"
          onClick={() => {
            setFilterItem("funding");
          }}
        >
          <Link to="/projects">#버디비_펀딩</Link>
        </button>
      </div>
    </>
  );
};

export default SubNav;