import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link 컴포넌트 추가, useNavigate 훅 추가
import icon from "../../img/nav_icon.svg";
import logo from "../../img/nav_logo.svg";
import myprofile from "../../img/bee.svg";
import searchIcon from "../../img/jam_search.png"; // 검색 아이콘 추가
import "./Header.css";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleSearch = event => {
    if (event.key === "Enter") {
      console.log("Search triggered: ", event.target.value);
      // 검색 동작을 추가할 수 있습니다.
    }
  };

  const handleButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsProfileDropdownOpen(false); // 다른 드롭다운 닫기
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsDropdownOpen(false); // 다른 드롭다운 닫기
  };

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    setIsLoggedIn(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const clickHamburger = () => {
    var icon1 = document.getElementById("a");
    var icon2 = document.getElementById("b");
    var icon3 = document.getElementById("c");
    icon1.classList.toggle("a");
    icon2.classList.toggle("c");
    icon3.classList.toggle("b");
  };
  return (
    <header className="headerpage-header">
      <div className="headerpage-header-container">
        <div className="headerpage-header-left">
          <Link to="/">
            <img src={icon} alt="Icon" />
          </Link>
          <Link to="/">
            <img className="headerpage-header-logo" src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="headerpage-header-right">
          <div className="headerpage-search-container">
            <input
              type="text"
              placeholder="Search..."
              onKeyDown={handleSearch}
            />
            <img
              src={searchIcon}
              alt="Search"
              className="headerpage-search-icon"
            />
          </div>
          <button type="button" onClick={handleButtonClick}>
            만들기
          </button>
          <div
            className={`headerpage-dropdown-menu ${
              isDropdownOpen ? "headerpage-open" : ""
            }`}
            ref={dropdownRef}
          >
            <ul>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>
          </div>

          {isLoggedIn ? (
            <>
              <div
                className="headerpage-profile-container"
                onClick={handleProfileClick}
              >
                <img
                  src={myprofile}
                  alt="My Profile"
                  className="headerpage-profile-image"
                />
              </div>
              <div
                className={`headerpage-profile-dropdown-menu ${
                  isProfileDropdownOpen ? "headerpage-open" : ""
                }`}
                ref={profileDropdownRef}
              >
                <ul>
                  <li>Profile</li>
                  <li>Settings</li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            </>
          ) : (
            <button
              className="headerpage-login-button"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </div>
        {/* 미디어쿼리 ~479px 햄버거버튼 */}
        <div
          class="headerpage-hamburger-icon"
          id="icon"
          onClick={clickHamburger}
        >
          <div class="icon-1" id="a" />
          <div class="icon-2" id="b" />
          <div class="icon-3" id="c" />
          <div class="clear" />
        </div>
      </div>
    </header>
  );
};

export default Header;
