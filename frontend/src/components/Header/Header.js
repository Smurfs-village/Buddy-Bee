import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link 컴포넌트 추가, useNavigate 훅 추가
import icon from "../../img/nav_icon.svg";
import logo from "../../img/nav_logo.svg";
import myprofile from "../../img/bee.svg";
import searchIcon from "../../img/search_icon.svg"; // 검색 아이콘 업데이트
import createIcon from "../../img/create_icon.svg"; // 모바일뷰 전용 만들기 아이콘 추가
import "./Header.css";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSearchIconOpen, setIsSearchIconOpen] = useState(false); //햄버거 버튼 검색창 추가
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const hamburgerRef = useRef(null);
  const searchInputRef = useRef(null); //햄버거 버튼 검색창 전용
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/projects?query=${searchQuery.trim()}`);
    }
  };

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsProfileDropdownOpen(false); // 다른 드롭다운 닫기
    setIsSearchIconOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsDropdownOpen(false); // 다른 드롭다운 닫기
    setIsSearchIconOpen(false);
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
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setIsSearchIconOpen(false);
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

  //만들기 버튼
  const handleCreateWithClick = () => {
    navigate("/create-with-project");
  };

  const handleCreateFundingClick = () => {
    navigate("/create-funding-project");
  };

  const clickHamburger = () => {
    //하단 표현 방식 리액트에 맞게 수정 예정입니다!
    let icon1 = document.getElementById("a");
    let icon2 = document.getElementById("b");
    let icon3 = document.getElementById("c");
    if (isHamburgerOpen === false) {
      icon1.classList.toggle("a");
      icon2.classList.toggle("c");
      icon3.classList.toggle("b");
      setIsHamburgerOpen(true);
    }
    if (isHamburgerOpen === true) {
      setIsHamburgerOpen(false);
    }
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
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress} // 엔터 키 이벤트 핸들러 추가
            />
            <img
              src={searchIcon}
              alt="Search"
              className="headerpage-search-icon"
              onClick={handleSearch}
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
              <li>
                <button
                  className="headerpage-dropdown-withbtn"
                  onClick={handleCreateWithClick}
                >
                  동행 만들기
                </button>
              </li>
              <li>
                <button
                  className="headerpage-dropdown-withbtn"
                  onClick={handleCreateFundingClick}
                >
                  펀딩 만들기
                </button>
              </li>
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
        {/* 미디어쿼리 ~479px 햄버거버튼_ hamburger btn */}
        <div
          className="headerpage-hamburger-icon"
          id="icon"
          onClick={clickHamburger}
        >
          <div className="icon-1" id="a" />
          <div className="icon-2" id="b" />
          <div className="icon-3" id="c" />
          <div className="clear" />
        </div>
        {isHamburgerOpen && (
          <div className="headerpage-overlay" onClick={clickHamburger}></div>
        )}
        {/* 햄버거버튼 드롭다운_hamburger drop down */}
        <div
          className={`headerpage-hamburger-dropdown ${
            isHamburgerOpen ? "hamburger-open" : ""
          }`}
          ref={hamburgerRef}
        >
          <ul>
            <li>
              <div className="hamburger-search-container">
                <div
                  className={`hamburger-dropdown-search-container ${
                    isSearchIconOpen ? "search-open" : ""
                  }`}
                  ref={searchInputRef}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    ref={searchInputRef}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress} // 엔터 키 이벤트 핸들러 추가
                  />
                  <img
                    src={searchIcon}
                    alt="Search"
                    className="hamburger-dropdown-search-icon"
                    onClick={handleSearch}
                  />
                </div>
                <img
                  src={searchIcon}
                  alt="Search"
                  className="hamburger-search-icon"
                  onClick={() => {
                    setIsSearchIconOpen(!isSearchIconOpen);
                  }}
                />
              </div>
            </li>
            <li>
              <button
                type="button"
                className="hamburger-create-icon"
                onClick={handleButtonClick}
              >
                <img src={createIcon} alt="Create" />
              </button>

              <div
                className={`hamburger-dropdown-menu ${
                  isDropdownOpen ? "headerpage-open" : ""
                }`}
                ref={dropdownRef}
              >
                <ul>
                  <li>
                    <button
                      className="headerpage-create-withbtn"
                      onClick={handleCreateWithClick}
                    >
                      동행 만들기
                    </button>
                  </li>
                  <li>
                    <button
                      className="headerpage-create-withbtn"
                      onClick={handleCreateFundingClick}
                    >
                      펀딩 만들기
                    </button>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              {isLoggedIn ? (
                <>
                  <div
                    className="hamburger-profile-container"
                    onClick={handleProfileClick}
                  >
                    <img
                      src={myprofile}
                      alt="My Profile"
                      className="hamburger-profile-image"
                    />
                  </div>
                  <div
                    className={`hamburger-profile-dropdown-menu ${
                      isProfileDropdownOpen ? "headerpage-open" : ""
                    }`}
                    ref={profileDropdownRef}
                  >
                    <ul>
                      <li>Profile</li>
                      <li onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                </>
              ) : (
                <button
                  className="hamburger-login-button"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
