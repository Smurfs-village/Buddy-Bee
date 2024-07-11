import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import MatterComponent from "../../components/MatterComponent/MatterComponent";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MainPage.css";
import header_icon from "../../img/header_icon.svg";
import section1_bee from "../../img/section1_bee.svg";
import section1_cloud from "../../img/section1_cloud.svg";
import section1_flower from "../../img/section1_flower.svg";
import Card from "./Card";
import axios from "axios";
import { Link } from "react-router-dom";

const MainPage = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    arrows: true,
    draggable: true,
    pauseOnHover: true,
    variableWidth: true,
  };

  const [recruitmentCards, setRecruitmentCards] = useState([]);
  const [fundingCards, setFundingCards] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/projects");
        const projects = response.data;

        const recruitment = projects.filter(
          (project) => project.type === "with"
        );
        const funding = projects.filter(
          (project) => project.type === "funding"
        );

        setRecruitmentCards(recruitment);
        setFundingCards(funding);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const toggleScrap = (index, type) => {
    const updateCards = (cards) => {
      const updatedCards = [...cards];
      updatedCards[index].scrap = !updatedCards[index].scrap;
      return updatedCards;
    };

    if (type === "recruitment") {
      setRecruitmentCards(updateCards(recruitmentCards));
    } else if (type === "funding") {
      setFundingCards(updateCards(fundingCards));
    }
  };

  return (
    <Layout>
      <div className="mainpage-main-page">
        <div className="mainpage-main-section">
          <div className="mainpage-left-section">
            <div>
              <div className="mainpage-left_bee_icon">
                <div>
                  <h1 className="mainpage-h1_buddy">BUDDY </h1>
                  <h1 className="mainpage-h1_bee">BEE</h1>
                </div>
                <img
                  src={header_icon}
                  alt="Header Icon"
                  className="mainpage-header-icon"
                />
              </div>

              <h2>Be My Buddy! </h2>
              <p className="mainpage-left_p">
                버디비(BuddyBee)는 같은 관심사를 가진 친구들과 함께 꿀벌처럼
                협력하며 꿈을 이루어 나가는 곳이에요! 서로의 프로젝트를
                소개하고, 든든한 버디비를 만나 특별한 경험을 만들어보세요.
              </p>
            </div>
            <div className="mainpage-button-container">
              {/* Link to 추가 07.11 */}
              <Link to="/projects?sort=popularity">
                <button className="mainpage-main-button">
                  Find Buddy <p>동행구하기</p>
                </button>
              </Link>
              <Link to="/projects?sort=popularity">
                <button className="mainpage-main-button">
                  Find Funding <p>펀딩구하기</p>
                </button>
              </Link>
            </div>
          </div>
          <div className="mainpage-right-section">
            <MatterComponent />
          </div>
        </div>
        <div className="mainpage-text-container">
          <div className="mainpage-text-up-section">
            <div className="mainpage-text-section">
              <h2>Be My Buddy!</h2>
              <h1>BUDDY BEE</h1>
              <p>우리...진실게임 하자. 친해지고 싶은 버디비 있어?</p>
              <img
                src={section1_flower}
                alt="Flower"
                className="mainpage-flower-icon"
              />
              <img
                src={section1_cloud}
                alt="Cloud"
                className="mainpage-cloud-icon"
              />
              <img src={section1_bee} alt="Bee" className="mainpage-bee-icon" />
            </div>
          </div>
        </div>
        <div className="mainpage-recruitment-section">
          <h2>#동행 모집</h2>
          <Slider {...settings}>
            {recruitmentCards.map((data, index) => (
              <Card
                key={index}
                data={data}
                index={index}
                type="recruitment"
                toggleScrap={toggleScrap}
              />
            ))}
          </Slider>
        </div>
        <div className="mainpage-funding-section">
          <h2>#펀딩 모집</h2>
          <Slider {...settings}>
            {fundingCards.map((data, index) => (
              <Card
                key={index}
                data={data}
                index={index}
                type="funding"
                toggleScrap={toggleScrap}
              />
            ))}
          </Slider>
        </div>
        <div className="mainpage-ranking-section">
          <h2>현재 많은 버디비들이 보고 있어요!</h2>
          <div className="mainpage-ranking-keywords">
            {["버디", "버디버디", "멈머", "슈머", "현머", "서머"].map(
              (keyword, index) => (
                <div key={index} className="mainpage-keyword">
                  {keyword}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MainPage;
