import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link 컴포넌트 추가, useNavigate 훅 추가
import axios from "axios";
import icon from "../../img/nav_icon.svg";
import myprofile from "../../img/bee.svg";
import searchIcon from "../../img/search_icon.svg"; // 검색 아이콘 업데이트
import createIcon from "../../img/create_icon.svg"; // 모바일뷰 전용 만들기 아이콘 추가
import "./Header.css";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2"; // SweetAlert2 import 추가

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const [profileImg, setProfileImg] = useState("");
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSearchIconOpen, setIsSearchIconOpen] = useState(false); //햄버거 버튼 검색창 추가
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const hamburgerRef = useRef(null);
  const searchInputRef = useRef(null); //햄버거 버튼 검색창 전용
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { logout } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/user`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setProfileImg(response.data.profile_image);
        } catch (error) {
          console.error("Failed to fetch user data", error);
          Swal.fire({
            title: "Error",
            text: "프로필 사진을 불러오는데 실패했습니다",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      };
      fetchUserData();
    } else {
      setIsLoggedIn(false);
    }
  }, [API_BASE_URL]);

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

  const clearScrollPosition = () => {
    localStorage.removeItem("ASIDE_scrollPosition");
  };

  const handleToProfile = () => {
    clearScrollPosition();
    navigate("/profile");
  };

  const handleToMyPosts = () => {
    clearScrollPosition();
    navigate("/profile/posts");
  };

  const handleToParticipatedProjects = () => {
    clearScrollPosition();
    navigate("/profile/participated-projects");
  };

  const handleLogout = () => {
    logout(); // AuthContext의 logout 함수 호출
    setIsProfileDropdownOpen(false); // 프로필 드롭다운 닫기
    clearScrollPosition();
    navigate("/");
    window.location.reload(); // 페이지 새로고침하여 상태 반영
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  //만들기 버튼
  const handleCreateWithClick = e => {
    e.stopPropagation();
    navigate("/create-with-project");
  };

  const handleCreateFundingClick = e => {
    e.stopPropagation();
    navigate("/create-funding-project");
  };

  const clickHamburger = e => {
    //하단 표현 방식 리액트에 맞게 수정 예정입니다!
    e.preventDefault();
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
      icon1.classList.remove("a");
      icon2.classList.remove("c");
      icon3.classList.remove("b");
      setIsHamburgerOpen(false);
    }
  };

  return (
    <header
      className={`headerpage-header ${
        isDropdownOpen || isProfileDropdownOpen ? "headerpage-open" : ""
      }`}
    >
      <div className="headerpage-header-container">
        <div className="headerpage-header-left">
          <Link to="/">
            <img src={icon} className="headerpage-header-icon" alt="Icon" />
          </Link>
          <Link to="/">
            <h1 className="headerpage-header-logo">BUDDY BEE</h1>
          </Link>
        </div>
        <div className="headerpage-header-right">
          <div className="headerpage-search-container">
            <input
              type="text"
              placeholder="해시태그로 키워드 검색"
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
          <button
            type="button"
            className="headerpage-create-btn"
            onClick={handleButtonClick}
          >
            + 작성하기
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
                  동행 작성하기
                </button>
              </li>
              <li>
                <button
                  className="headerpage-dropdown-withbtn"
                  onClick={handleCreateFundingClick}
                >
                  펀딩 작성하기
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
                  src={profileImg || myprofile}
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
                  <li onClick={handleToProfile}>마이페이지</li>
                  <li onClick={handleToMyPosts}>작성한 글</li>
                  <li onClick={handleToParticipatedProjects}>참여 프로젝트</li>
                  <li onClick={handleLogout}>로그아웃</li>
                </ul>
              </div>
            </>
          ) : (
            <button
              className="headerpage-login-button"
              onClick={handleLoginClick}
            >
              로그인
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
                    placeholder="해시태그로 키워드 검색"
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
                      동행 작성하기
                    </button>
                  </li>
                  <li>
                    <button
                      className="headerpage-create-withbtn"
                      onClick={handleCreateFundingClick}
                    >
                      펀딩 작성하기
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
                      src={profileImg || myprofile}
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
                      <li onClick={handleToProfile}>마이 페이지</li>
                      <li onClick={handleToMyPosts}>작성한 글</li>
                      <li onClick={handleToParticipatedProjects}>
                        참여 프로젝트
                      </li>
                      <li onClick={handleLogout}>로그아웃</li>
                    </ul>
                  </div>
                </>
              ) : (
                <button
                  className="hamburger-login-button"
                  onClick={handleLoginClick}
                >
                  로그인
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
