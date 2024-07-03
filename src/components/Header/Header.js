import { useState, useEffect, useRef } from "react";
import icon from "../../img/nav_icon.svg";
import logo from "../../img/nav_logo.svg";
import myprofile from "../../img/bee.svg";
import searchIcon from "../../img/jam_search.png"; // 검색 아이콘 추가
import "./Header.css";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

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

  return (
    <header className="headerpage-header">
      <div className="headerpage-header-container">
        <div className="headerpage-header-left">
          <img src={icon} alt="Icon" />
          <img src={logo} alt="Logo" />
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
              <li>Logout</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 네비게이션 바 추가 */}
    </header>
  );
};

export default Header;
