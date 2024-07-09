import "./DetailAgree.css";

const DetailAgree = () => {
  return (
    <div className="ProjectDetailPage-agree-wrap">
      <div className="ProjectDetailPage-agree">
        <div className="ProjectDetailPage-agree-title">
          개인정보 제 3자 제공 동의 <span>*</span>
        </div>
        <div className="ProjectDetailPage-agree-content">
          회원의 개인정보는 당사의 개인정보 취급방침에 따라 안전하게 보호됩니다.
          '회사'는 이용자들의 개인정보를 개인정보 취급방침의 '제 2조 수집하는
          개인정보의 항목, 수집방법 및 이용목적'에서 고지한 범위 내에서
          사용하며, 이용자의 사전 동의 없이는 동 범위를 초과하여 이용하거나
          원칙적으로 이용자의 개인정보를 외부에 공개하지 않습니다.
        </div>
        <div className="ProjectDetailPage-agree-check">
          <div className="ProjectDetailPage-agree-txt">동의합니다</div>
          <input type="checkbox"></input>
        </div>
      </div>
    </div>
  );
};

export default DetailAgree;
