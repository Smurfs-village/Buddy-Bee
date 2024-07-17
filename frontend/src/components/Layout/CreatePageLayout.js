import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./CreatePageLayout.css";
import PageLayout from "./PageLayout";
import BackGroundGrid from "./BackGroundGrid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Editor from "../Common/Editor";
import moment from "moment";
import { useAuth } from "../../contexts/AuthContext"; // useAuth import
import addIcon from "../../img/create_icon.svg";

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
  const [targetAmount, setTargetAmount] = useState("");
  const [options, setOptions] = useState([]);
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [accountInfo, setAccountInfo] = useState("고준기 국민KB 1234123456");
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth(); // 현재 사용자 정보 가져오기

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
      type,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      maxParticipants,
      targetAmount: targetAmount === "" ? null : targetAmount,
      options,
      mainImage,
      createdBy: user ? user.id : null, // 현재 사용자의 ID 사용
      hashtags,
      accountInfo,
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/api/projects",
        projectData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 인증 토큰 추가
          },
        }
      );
      console.log("Project created:", response.data);
      const projectId = response.data.projectId;
      navigate(`/projects/${projectId}`);
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
              #동행 만들기
            </button>
            <button onClick={() => navigate("/create-funding-project")}>
              #펀딩 만들기
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
                  <span className="createpage-hashtag-limit">
                    (최대 10개, 중복 제한)
                  </span>
                </label>
                <div className="createpage-hashtag-input-wrapper">
                  <input
                    type="text"
                    value={hashtag}
                    onChange={e => setHashtag(e.target.value)}
                    maxLength="15"
                  />
                  <div className="createpage-char-wrapper">
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
                    {/* 모바일뷰 용 버튼 */}
                    <button
                      type="button"
                      onClick={addHashtag}
                      className="mobile-createpage-add-button"
                    >
                      <img src={addIcon} alt="addIcon" />
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
                      <>
                        <button
                          type="button"
                          onClick={handleAccountSave}
                          className="createpage-edit-button"
                        >
                          저장하기
                        </button>
                        {/* 모바일 전용 버튼 분리 */}
                        <button
                          type="button"
                          onClick={handleAccountSave}
                          className="mobile-createpage-edit-button"
                        >
                          저장
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleAccountEdit}
                          className="createpage-edit-button"
                        >
                          수정하기
                        </button>
                        <button
                          type="button"
                          onClick={handleAccountEdit}
                          className="mobile-createpage-edit-button"
                        >
                          수정
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="createpage-form-group">
                <label>{type === "funding" ? "펀딩" : "동행"} 옵션 추가 </label>

                <div className="createpage-form-group createpage-option-form-group">
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
                    {/* 모바일뷰 용 버튼 */}
                    <button
                      type="button"
                      onClick={addOption}
                      className="mobile-createpage-add-button"
                      id="option-add"
                    >
                      <img src={addIcon} alt="addIcon" />
                    </button>
                  </div>
                  <div className="createpage-options-display">
                    {options.map((option, index) => (
                      <div key={index} className="createpage-option">
                        <div className="button-span-group">
                          <button
                            className="create-delete-btn"
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

              <div className="createpage-form-group createpage-recruitment-group-wrap">
                <label>
                  프로젝트 설정
                  <span className="createpage-form-required-check"> *</span>
                </label>
                <div className="createpage-form-group createpage-recruitment-group">
                  <div className="createpage-recruitment-input-wrapper">
                    <div className="createpage-recruitment-people-input">
                      <span>모집 인원</span>
                      <div className="createpage-project-setting-group">
                        <div className="createpage-number-input">
                          <input
                            type="number"
                            min={1}
                            value={maxParticipants}
                            onChange={e => setMaxParticipants(e.target.value)}
                            placeholder="모집 인원"
                          />
                        </div>
                        <span>명</span>
                      </div>
                    </div>

                    {type === "funding" && (
                      <div className="createpage-recruitment-amount-input">
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
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="createpage-form-group">
                <label>
                  기간 설정
                  <span className="createpage-form-required-check"> *</span>
                </label>
                <div className="createpage-form-group createpage-period-group">
                  <div className="createpage-period-input-wrapper">
                    <div className="createpage-flex-row">
                      <span>시작 날짜 </span>
                      <div className="createpage-date-input">
                        <DatePicker
                          selected={startDate}
                          onChange={date => setStartDate(date)}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="달력에서 선택"
                        />
                      </div>
                    </div>
                    <div className="createpage-flex-row">
                      <span>종료 날짜 </span>
                      <div className="createpage-date-input">
                        <DatePicker
                          selected={endDate}
                          onChange={date => setEndDate(date)}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="달력에서 선택"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="createpage-submit-button">
                <span>프로젝트 등록하기</span>
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
