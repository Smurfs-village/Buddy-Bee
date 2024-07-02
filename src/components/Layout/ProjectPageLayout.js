import { useState, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./ProjectPageLayout.css";

// 이미지 업로드 핸들러
const imageHandler = function () {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const range = this.quill.getSelection();
      this.quill.insertEmbed(range.index, "image", reader.result);
    };
    reader.readAsDataURL(file);
  };
};

const ProjectPageLayout = ({ children }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const quillRef = useRef(null);

  const handleSubmit = event => {
    event.preventDefault();
    // 프로젝트 생성 로직 추가
    console.log("Project created:", {
      title,
      content,
      hashtags,
      startDate,
      endDate,
      maxParticipants,
    });
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

  return (
    <Layout>
      <div className="createpage-project-page-layout">
        <div className="createpage-sub-nav">
          <button>#버디비_동행</button>
        </div>
        <div className="createpage-create-main-section">
          <form
            className="createpage-create-project-form"
            onSubmit={handleSubmit}
          >
            <div className="createpage-three-color">신호등</div>
            <div className="createpage-form-group">
              <label>제목</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목을 작성해주세요"
              />
            </div>
            <div className="createpage-form-group">
              <label>내용</label>
              <ReactQuill
                ref={quillRef}
                value={content}
                onChange={setContent}
                placeholder="텍스트를 입력해주세요"
                modules={{
                  toolbar: {
                    container: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline"],
                      ["image"],
                    ],
                    handlers: {
                      image: imageHandler,
                    },
                  },
                }}
                style={{ minHeight: "300px" }} // 글 내용 부분에 최소 높이 설정
              />
            </div>
            <div className="createpage-form-group">
              <label>
                해시태그 입력{" "}
                <span className="createpage-hashtag-limit">(최대 10개)</span>
              </label>
              <div className="createpage-hashtag-input-wrapper">
                <input
                  type="text"
                  value={hashtag}
                  onChange={e => setHashtag(e.target.value)}
                  placeholder="해시태그를 입력해주세요"
                  maxLength="15"
                />
                <button
                  type="button"
                  onClick={addHashtag}
                  className="createpage-add-button"
                >
                  추가하기
                </button>
                <span className="createpage-char-count">
                  {hashtag.length}/15
                </span>
              </div>
              <div className="createpage-hashtags-display">
                {hashtags.map((tag, index) => (
                  <div
                    key={index}
                    className="createpage-hashtag"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#FADF0B" : "#C4A1FF",
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
            <div>
              <label>기간 설정</label>
              <div className="createpage-form-group createpage-period-group">
                <div className="createpage-period-input-wrapper">
                  <span>시작 날짜:</span>
                  <div className="createpage-date-input">
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      placeholder="시작 날짜"
                    />
                  </div>
                  <span>종료 날짜:</span>
                  <div className="createpage-date-input">
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      placeholder="종료 날짜"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label>프로젝트 설정</label>
              <div className="createpage-form-group createpage-recruitment-group">
                <div className="createpage-recruitment-input-wrapper">
                  <span>모집 인원:</span>
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
              </div>
            </div>
            <button type="submit" className="createpage-submit-button">
              프로젝트 등록하기
            </button>
          </form>
          {children}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectPageLayout;
