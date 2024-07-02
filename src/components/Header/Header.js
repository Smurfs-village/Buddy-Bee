import { useState, useEffect, useRef } from "react";
import icon from "../../img/nav_icon.svg";
import logo from "../../img/nav_logo.svg";
import searchIcon from "../../img/jam_search.png"; // 검색 아이콘 추가
import myprofile from "../../img/bee.svg";
import "./Header.css";

const Header = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const handleSearch = event => {
    if (event.key === "Enter") {
      console.log("Search triggered: ", event.target.value);
      // 검색 동작을 추가할 수 있습니다.
    }
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleClickOutside = event => {
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
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src={icon} alt="Icon" />
          <img src={logo} alt="Logo" />
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              onKeyDown={handleSearch}
            />
            <img src={searchIcon} alt="Search" className="search-icon" />
          </div>
          <div className="profile-container" onClick={handleProfileClick}>
            <img src={myprofile} alt="My Profile" className="profile-image" />
          </div>
          <div
            className={`profile-dropdown-menu ${
              isProfileDropdownOpen ? "open" : ""
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
    </header>
  );
};

export default Header;
