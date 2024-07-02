import Layout from "../../components/Layout/Layout";
import MatterComponent from "../../components/MatterComponent/MatterComponent";
import header_icon from "../../img/header_icon.svg";
import "./MainPage.css";

const MainPage = () => {
  return (
    <Layout>
      <div className="main-page">
        <div className="main-section">
          <div className="left-section">
            <div>
              <div className="left_bee_icon">
                <div>
                  <h1 className="h1_buddy">BUDDY </h1>
                  <h1 className="h1_bee">BEE</h1>
                </div>
                <img
                  src={header_icon}
                  alt="Header Icon"
                  className="header-icon"
                />
              </div>
              <h2>Be My Buddy! </h2>
              <p className="left_p">
                욕망은 욕심보다 모호한 단어다. 마음 심을 쓰는 욕심과 달리 욕망의
                '망'은 바랄 망을 쓴다. 희망의 '망'과도 같은 한자다. 그래서
                욕망은 내가 무엇을 바라는지 알지 못하면 잘 모를 수밖에 없는
                영역이다.
              </p>
            </div>
            <div className="button-container">
              <button className="main-button">
                Find Buddy <p>동행구하기</p>
              </button>
              <button className="main-button">
                Find Funding <p>펀딩구하기</p>
              </button>
            </div>
          </div>
          <div className="right-section">
            <MatterComponent />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MainPage;
