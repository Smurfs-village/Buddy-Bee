import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./CreatePageLayout.css";
import PageLayout from "./PageLayout";
import BackGroundGrid from "./BackGroundGrid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Editor from "../Common/Editor";
import moment from "moment";
import { useAuth } from "../../contexts/AuthContext";
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

const CreatePageLayout = ({ children, type: initialType }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // 빈 문자열로 초기화
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
  const [type, setType] = useState(initialType || "defaultType"); // 수정된 부분

  const navigate = useNavigate();
  const { user } = useAuth();
  const { id: projectId } = useParams();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/${projectId}/with-author`
        );
        const projectData = response.data;
        setTitle(projectData.title);
        setContent(projectData.description || ""); // null일 경우 빈 문자열로 설정
        setStartDate(moment(projectData.start_date).toDate());
        setEndDate(moment(projectData.end_date).toDate());
        setMaxParticipants(projectData.max_participants);
        setTargetAmount(projectData.target_amount);
        setOptions(projectData.options ? projectData.options : []);
        setMainImage(projectData.main_image);
        setHashtags(projectData.hashtags ? projectData.hashtags : []);
        setAccountInfo(projectData.account_info);
        setType(projectData.type || "defaultType"); // type 필드 설정
        console.log("Fetched project data:", projectData); // 디버깅용 로그
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async event => {
    event.preventDefault();

    const formattedStartDate = startDate
      ? moment(startDate).format("YYYY-MM-DD")
      : null;
    const formattedEndDate = endDate
      ? moment(endDate).format("YYYY-MM-DD")
      : null;

    console.log("Submitting project data with type:", type); // 디버깅용 로그

    const projectData = {
      title,
      content,
      type, // Ensure type is included
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      maxParticipants,
      targetAmount: targetAmount === "" ? null : targetAmount,
      options: options.map(option => ({
        ...option,
        price: option.price.replace(/,/g, ""), // 숫자 자릿수(콤마)
      })),
      mainImage,
      createdBy: user ? user.id : null,
      hashtags,
      accountInfo,
    };

    try {
      if (projectId) {
        // Update existing project
        await axios.put(`${API_BASE_URL}/projects/${projectId}`, projectData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        navigate(`/projects/${projectId}`);
      } else {
        // Create new project
        const response = await axios.post(
          "${API_BASE_URL}/projects",
          projectData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Project created:", response.data);
        const newProjectId = response.data.projectId;
        navigate(`/projects/${newProjectId}`);
      }
    } catch (error) {
      console.error("Error saving project:", error);
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
      setOptions([
        ...options,
        { name: optionName, price: formatPrice(optionPrice) },
      ]);
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

  //엔터 키를 눌렀을 때 해시태그 추가
  const handleHashtagKeyPress = event => {
    if (event.key === "Enter") {
      event.preventDefault(); //폼 제출 방지
      addHashtag();
    }
  };

  //엔터 키를 눌렀을 때 옵션 추가
  const handleOptionKeyPress = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      addOption();
    }
  };

  //숫자 자릿수(콤마)
  const formatPrice = value => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleOptionPriceChange = e => {
    const unformattedValue = e.target.value.replace(/,/g, "");
    setOptionPrice(unformattedValue);
  };

  // 제목 입력 제한
  const handleTitleChange = e => {
    const newTitle = e.target.value;

    // 제목이 30자를 넘지 않도록 제한
    if (newTitle.length <= 30) {
      setTitle(newTitle);
    }
  };

  // 본문 길이 제한
  const handleContentChange = desc => {
    if (desc.length <= 3000) {
      setContent(desc);
    } else {
      alert("3000자 이상은 작성할 수 없습니다.");
      setContent(desc.slice(0, 3000));
    }
  };

  // 종료 날짜가 시작 날짜보다 빠르지 않도록 설정
  const handleStartDateChange = date => {
    if (endDate && date > endDate) {
      alert("시작 날짜는 종료 날짜보다 빠를 수 없습니다.");
    } else {
      setStartDate(date);
    }
  };

  const handleEndDateChange = date => {
    if (startDate && date < startDate) {
      alert("종료 날짜는 시작 날짜보다 빠를 수 없습니다.");
    } else {
      setEndDate(date);
    }
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
                  onChange={handleTitleChange}
                  placeholder="제목을 작성해주세요 (30자 이하)"
                  required
                />
              </div>
              <div className="createpage-form-group">
                <Editor
                  setDesc={handleContentChange}
                  desc={content}
                  setImage={setMainImage}
                  required
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
                    onKeyPress={handleHashtagKeyPress} //해시태그 추가 핸들러
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
                        onChange={e => setOptionName(e.target.value)}
                        onKeyDown={handleOptionKeyPress} //옵션 추가 핸들러
                        required
                      />
                    </div>
                    <div className="input-wrapper">
                      <span>가격</span>
                      <input
                        type="text"
                        value={formatPrice(optionPrice)}
                        onChange={handleOptionPriceChange}
                        onKeyDown={handleOptionKeyPress} //옵션 추가 핸들러
                        required
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
                            required
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
                              required
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
                          onChange={handleStartDateChange}
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
                          onChange={handleEndDateChange}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="달력에서 선택"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="createpage-submit-button">
                <span>
                  {projectId ? "프로젝트 수정하기" : "프로젝트 등록하기"}
                </span>
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
