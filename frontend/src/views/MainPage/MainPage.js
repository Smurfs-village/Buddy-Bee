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
import arrow_right from "../../img/arrow_right.svg";
import Card from "./Card";
import axios from "axios";
import { Link } from "react-router-dom";

const MainPage = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplaySpeed: 3000,
    arrows: true,
    draggable: true,
    pauseOnHover: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [recruitmentCards, setRecruitmentCards] = useState([]);
  const [fundingCards, setFundingCards] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/projects");
        const projects = response.data;

        const activeProjects = projects.filter(
          project => project.status === "active"
        );

        const recruitment = activeProjects.filter(
          project => project.type === "with"
        );
        const funding = activeProjects.filter(
          project => project.type === "funding"
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
    const updateCards = cards => {
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

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          if (
            entry.target.classList.contains("fade-in-left") ||
            entry.target.classList.contains("fade-in-right")
          ) {
            setTimeout(() => {
              entry.target.classList.add("delay-animate");
            }, 1000); // 딜레이 시간을 1초로 설정
          }
        } else {
          entry.target.classList.remove("animate");
          entry.target.classList.remove("delay-animate");
        }
      });
    });

    const elements = document.querySelectorAll(
      ".fade-in-up, .fade-in-left, .fade-in-right"
    );
    elements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      elements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <Layout>
      <div className="mainpage-main-page">
        <div className="mainpage-main-section">
          <div className="mainpage-left-section">
            <div>
              <div className="mainpage-left_bee_icon">
                <div>
                  <h1 className="mainpage-h1_buddy fade-in-up">BUDDY </h1>
                  <h1 className="mainpage-h1_bee fade-in-up">BEE</h1>
                </div>
                <img
                  src={header_icon}
                  alt="Header Icon"
                  className="mainpage-header-icon fade-in-right icon"
                />
              </div>

              <h2 className="fade-in-up">Be My Buddy! </h2>
              <p className="mainpage-left_p fade-in-up">
                버디비(BuddyBee)는 같은 관심사를 가진 친구들과 함께 꿀벌처럼
                협력하며 꿈을 이루어 나가는 곳이에요! 서로의 프로젝트를
                소개하고, 든든한 버디비를 만나 특별한 경험을 만들어보세요.
              </p>
            </div>
            <div className="mainpage-button-container">
              <Link to="/projects?sort=popularity">
                <button className="mainpage-main-button fade-in-up">
                  Find Buddy <p>동행구하기</p>
                  <div className="mainpage-btn-arrow">
                    <img
                      src={arrow_right}
                      alt="arrow_right"
                      className="mainpage-arrow-icon fade-in-up"
                    />
                  </div>
                </button>
              </Link>
              <Link to="/projects?sort=popularity">
                <button className="mainpage-main-button fade-in-up">
                  Find Funding <p>펀딩구하기</p>
                  <div className="mainpage-btn-arrow">
                    <img
                      src={arrow_right}
                      alt="arrow_right"
                      className="mainpage-arrow-icon fade-in-up"
                    />
                  </div>
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
              <h2 className="fade-in-up">Be My Buddy!</h2>
              <h2 className="fade-in-up">
                우리...진실게임 하자. 친해지고 싶은 버디비 있어?
              </h2>
              <h1 className="fade-in-up">BUDDY BEE</h1>
              <p className="fade-in-up">
                Buddy Bee에 오신 걸 환영해요! 여기서는 좋아하는 콘서트나 행사에
                함께 갈 동행자를 쉽게 찾을 수 있고, 필요한 펀딩도 모을 수
                있어요. Buddy Bee와 함께 멋진 추억을 만들어 보세요. Buddy Bee와
                함께라면 모든 순간이 더 특별해질 거예요!
              </p>
              <img
                src={section1_flower}
                alt="Flower"
                className="mainpage-flower-icon fade-in-left icon"
              />
              <img
                src={section1_cloud}
                alt="Cloud"
                className="mainpage-cloud-icon fade-in-left icon"
              />
              <img
                src={section1_bee}
                alt="Bee"
                className="mainpage-bee-icon fade-in-right icon"
              />
            </div>
          </div>
        </div>
        <div className="mainpage-recruitment-section">
          <h2 className="fade-in-up">#동행 모집</h2>
          <Slider {...settings} className="fade-in-up">
            {recruitmentCards.map((data, index) => (
              <Card
                key={index}
                data={data}
                index={index}
                type="recruitment"
                toggleScrap={toggleScrap}
                className="fade-in-up"
              />
            ))}
          </Slider>
        </div>
        <div className="mainpage-funding-section">
          <h2 className="fade-in-up">#펀딩 모집</h2>
          <Slider {...settings} className="fade-in-up">
            {fundingCards.map((data, index) => (
              <Card
                key={index}
                data={data}
                index={index}
                type="funding"
                toggleScrap={toggleScrap}
                className="fade-in-up"
              />
            ))}
          </Slider>
        </div>
        <div className="mainpage-ranking-section fade-in-up">
          <h2 className="fade-in-up">현재 많은 버디비들이 보고 있어요!</h2>
          <div className="mainpage-ranking-keywords fade-in-up">
            {["버디", "버디버디", "멈머", "슈머", "현머", "서머"].map(
              (keyword, index) => (
                <div key={index} className="mainpage-keyword fade-in-up">
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
