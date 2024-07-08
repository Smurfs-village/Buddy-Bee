import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import Layout from "../../components/Layout/Layout";
import "./CreatePageLayout.css"; // CSS 파일 import
import PageLayout from "./PageLayout";
import BackGroundGrid from "./BackGroundGrid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Editor from "../Common/Editor"; // Editor 컴포넌트 import
import moment from "moment"; // moment import

// 전역 에러 핸들러를 설정하여 ResizeObserver 오류 무시
const handleGlobalError = event => {
  if (
    event.message === "ResizeObserver loop limit exceeded" ||
    event.message ===
      "ResizeObserver loop completed with undelivered notifications."
  ) {
    event.preventDefault();
    return true;
  }
  return false;
};

window.addEventListener("error", handleGlobalError);

const CreatePageLayout = ({ children, type }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [maxParticipants, setMaxParticipants] = useState("");
  const [targetAmount, setTargetAmount] = useState(""); // 목표 금액 상태 추가
  const [options, setOptions] = useState([]);
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [mainImage, setMainImage] = useState(""); // 메인 이미지 상태 추가
  const [accountInfo, setAccountInfo] = useState("고준기 국민KB 1234123456"); // 초기 계좌 정보
  const [isEditingAccount, setIsEditingAccount] = useState(false); // 수정 모드 상태

  const createdBy = 1; // 목업 유저 ID (테스트용)
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleSubmit = async event => {
    event.preventDefault();

    const formattedStartDate = startDate
      ? moment(startDate).format("YYYY-MM-DD")
      : null;
    const formattedEndDate = endDate
      ? moment(endDate).format("YYYY-MM-DD")
      : null;

    const projectData = {
      title,
      content,
      type, // type 추가
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      maxParticipants,
      targetAmount, // 목표 금액 추가
      options,
      mainImage, // 메인 이미지 추가
      createdBy, // 목업 유저 추가
      hashtags, // 해시태그 추가
      accountInfo, // 계좌 정보 추가
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/projects",
        projectData
      );
      console.log("Project created:", response.data);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const addHashtag = () => {
    if (
      hashtag.trim() &&
      !hashtags.includes(hashtag) &&
      hashtag.length <= 15 &&
      hashtags.length < 10
    ) {
      setHashtags([...hashtags, hashtag.trim()]);
      setHashtag("");
    }
  };

  const removeHashtag = tag => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const addOption = () => {
    if (optionName.trim() && optionPrice.trim()) {
      setOptions([...options, { name: optionName, price: optionPrice }]);
      setOptionName("");
      setOptionPrice("");
    }
  };

  const removeOption = index => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleAccountEdit = () => {
    setIsEditingAccount(true);
  };

  const handleAccountSave = () => {
    setIsEditingAccount(false);
  };

  return (
    <Layout>
      <BackGroundGrid>
        <div className="createpage-sub-nav">
          <div className="createpage-button-group">
            <button onClick={() => navigate("/create-with-project")}>
              #버디비_동행
            </button>
            <button onClick={() => navigate("/create-funding-project")}>
              #버디비_펀딩
            </button>
          </div>
        </div>
        <PageLayout>
          <div className="createpage-create-main-section">
            <form
              className="createpage-create-project-form"
              onSubmit={handleSubmit}
            >
              <div className="createpage-form-group">
                <input
                  className="createpage-title-input"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="제목을 작성해주세요"
                />
              </div>
              <div className="createpage-form-group">
                <Editor
                  setDesc={setContent}
                  desc={content}
                  setImage={setMainImage}
                />
              </div>
              <div className="createpage-form-group">
                <label className="createpage-hashtag-label">
                  해시태그 입력{" "}
                  <span className="createpage-hashtag-limit">(최대 10개)</span>
                </label>
                <div className="createpage-hashtag-input-wrapper">
                  <input
                    type="text"
                    value={hashtag}
                    onChange={e => setHashtag(e.target.value)}
                    maxLength="15"
                  />
                  <div>
                    <span className="createpage-char-count">
                      {hashtag.length}/15
                    </span>
                    <button
                      type="button"
                      onClick={addHashtag}
                      className="createpage-add-button"
                    >
                      추가하기
                    </button>
                  </div>
                </div>
                <div className="createpage-hashtags-display">
                  {hashtags.map((tag, index) => (
                    <div
                      key={index}
                      className="createpage-hashtag"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#FADF0B" : "#C4A1FF",
                      }}
                    >
                      <button type="button" onClick={() => removeHashtag(tag)}>
                        ✕
                      </button>
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {type === "funding" && (
                <div className="createpage-form-group">
                  <label>입금 계좌 설정</label>
                  <div className="createpage-account-input-wrapper">
                    <input
                      type="text"
                      value={accountInfo}
                      onChange={e => setAccountInfo(e.target.value)}
                      readOnly={!isEditingAccount}
                      className={isEditingAccount ? "editable" : ""}
                    />
                    {isEditingAccount ? (
                      <button
                        type="button"
                        onClick={handleAccountSave}
                        className="createpage-edit-button"
                      >
                        저장하기
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAccountEdit}
                        className="createpage-edit-button"
                      >
                        수정하기
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label>{type === "funding" ? "펀딩" : "동행"} 옵션 추가</label>

                <div className="createpage-form-group createpate-option-form-group">
                  <div className="createpage-option-input-wrapper">
                    <div className="input-wrapper">
                      <span>옵션명</span>
                      <input
                        type="text"
                        value={optionName}
                        onChange={e => setOptionName(e.target.value)}
                      />
                    </div>
                    <div className="input-wrapper">
                      <span>가격</span>
                      <input
                        type="text"
                        value={optionPrice}
                        onChange={e => setOptionPrice(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addOption}
                      className="createpage-add-button"
                      id="option-add"
                    >
                      추가하기
                    </button>
                  </div>
                  <div className="createpage-options-display">
                    {options.map((option, index) => (
                      <div key={index} className="createpage-option">
                        <div className="button-span-group">
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                          >
                            ✕
                          </button>
                          <span>{option.name}</span>
                        </div>

                        <span>{option.price}원</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label>프로젝트 설정</label>
                <div className="createpage-form-group createpage-recruitment-group">
                  <div className="createpage-recruitment-input-wrapper">
                    <span>모집 인원</span>
                    <div className="createpage-project-setting-group">
                      <div className="createpage-number-input">
                        <input
                          type="number"
                          value={maxParticipants}
                          onChange={e => setMaxParticipants(e.target.value)}
                          placeholder="모집 인원"
                        />
                      </div>
                      <span>명</span>
                    </div>

                    {type === "funding" && (
                      <>
                        <span className="whitespace-nowrap">목표 금액</span>
                        <div className="createpage-project-setting-group">
                          <div className="createpage-number-input">
                            <input
                              type="number"
                              value={targetAmount}
                              onChange={e => setTargetAmount(e.target.value)}
                              placeholder="목표 금액"
                            />
                          </div>
                          <span>원</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label>기간 설정</label>
                <div className="createpage-form-group createpage-period-group">
                  <div className="createpage-period-input-wrapper">
                    <div className="createpage-flex-row">
                      <span>시작 날짜:</span>
                      <div className="createpage-date-input">
                        <DatePicker
                          selected={startDate}
                          onChange={date => setStartDate(date)}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="달력에서 선택 ㄱ"
                        />
                      </div>
                    </div>
                    <div className="createpage-flex-row">
                      <span>종료 날짜:</span>
                      <div className="createpage-date-input">
                        <DatePicker
                          selected={endDate}
                          onChange={date => setEndDate(date)}
                          dateFormat="yyyy-MM-dd"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="createpage-submit-button">
                프로젝트 등록하기
              </button>
            </form>
            {children}
          </div>
        </PageLayout>
      </BackGroundGrid>
    </Layout>
  );
};

export default CreatePageLayout;
