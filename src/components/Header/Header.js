import icon from "../../img/nav_icon.svg";
import logo from "../../img/nav_logo.svg";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src={icon} alt="Icon" />
          <img src={logo} alt="Logo" />
        </div>
      </div>
    </header>
  );
};

export default Header;
