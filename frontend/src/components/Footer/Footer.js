import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footerpage-footer">
      <div className="footerpage-footer-links"></div>
      <div className="footerpage-footer-info">
        <p>
          서울특별시 수원 팔달구 행복동 달표상가 | 대표 : 스머프빌리지
          <br></br>
          <br></br>
          개인정보보호책임 : 버디비는 플랫폼 제공자로서 프로젝트의 당사자가
          아니며, 직접적인 통신판매를 진행하지 않습니다. 프로젝트의 완수 및
          선물제공의 책임은 해당 프로젝트의 창작자에게 있으며, 프로젝트와
          관련하여 후원자와 발생하는 법적 분쟁에 대한 책임은 해당 창작자가
          부담합니다. <br></br>
        </p>
      </div>
      <div className="footerpage-footer-copy">
        <p>&copy; 2024 Buddy Bee. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
