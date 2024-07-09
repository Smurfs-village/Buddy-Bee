import "./PageLayout.css";

const PageLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <div className="three-color">
        <div className="three-color-circle three-green"></div>
        <div className="three-color-circle three-yellow"></div>
        <div className="three-color-circle three-red"></div>
      </div>
      {children}
    </div>
  );
};

export default PageLayout;
