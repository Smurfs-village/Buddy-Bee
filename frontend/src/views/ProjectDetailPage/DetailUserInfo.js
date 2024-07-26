import React, { useState } from "react";
import Swal from "sweetalert2";
import "./DetailUserInfo.css";

const DetailUserInfo = ({ setApplicantName, setEmail, setPhone }) => {
  const [localEmail, setLocalEmail] = useState("");
  const [localPhone, setLocalPhone] = useState("");

  const handleEmailChange = e => {
    const value = e.target.value;
    setLocalEmail(value);
    setEmail(value);
  };

  const handlePhoneChange = e => {
    const value = e.target.value;
    setLocalPhone(value);
    setPhone(value);
  };

  return (
    <div className="ProjectDetailPage-user-wrap">
      <div className="ProjectDetailPage-user">
        <div className="ProjectDetailPage-user-title">
          신청자 정보 <span>*</span>
        </div>
        <div className="ProjectDetailPage-user-info">
          <div className="ProjectDetailPage-user-name">
            <input
              type="text"
              placeholder="신청자명"
              onChange={e => setApplicantName(e.target.value)}
              required
            />
          </div>
          <div className="ProjectDetailPage-user-email">
            <input
              type="email"
              placeholder="이메일 주소"
              value={localEmail}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="ProjectDetailPage-user-tel">
            <input
              type="tel"
              placeholder="전화번호"
              value={localPhone}
              onChange={handlePhoneChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUserInfo;
