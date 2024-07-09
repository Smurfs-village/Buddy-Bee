import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footerpage-footer">
      <div className="footerpage-footer-links">
        <p>이용약관 |개인정보처리방침 |운영정책 |공지사항 |도움센터</p>
      </div>
      <div className="footerpage-footer-info">
        <p>
          서울특별시 강남 어딘가 지금시간 22-51 | 대표 : 머가문 |
          개인정보보호책임 : 어쩌고 | 사업자등록번호 : 000-00-00000 | 대표번호:
          010-1234-5678 | merfamily@multi.kr 평일 10:00 ~ 17:00 점심시간 12:00 ~
          13:00 (주말/공휴일 휴무)
        </p>
      </div>
      <div className="footerpage-footer-copy">
        <p>&copy; 2024 Buddy Bee. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
