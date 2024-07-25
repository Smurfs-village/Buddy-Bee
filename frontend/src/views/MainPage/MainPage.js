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
    slidesToShow: 2,
    slidesToScroll: 2,
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
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects`);
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
    const elements = document.querySelectorAll(
      ".from-right, .from-left, .from-down, .from-bounce"
    );

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("from-right")) {
            entry.target.classList.add("fade-in-right");
          } else if (entry.target.classList.contains("from-left")) {
            entry.target.classList.add("fade-in-left");
          } else if (entry.target.classList.contains("from-down")) {
            entry.target.classList.add("fade-in-up");
          } else if (entry.target.classList.contains("from-bounce")) {
            entry.target.classList.add("fade-in-bounce");
          }
        } else {
          entry.target.classList.remove(
            "fade-in-right",
            "fade-in-up",
            "fade-in-left",
            "fade-in-bounce"
          );
        }
      });
    });

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
            <div className="main-page-left_in">
              <div className="mainpage-left_bee_icon">
                <div>
                  <h1 className="mainpage-h1_buddy">BUDDY </h1>
                  <h1 className="mainpage-h1_bee">BEE</h1>
                </div>
                <img
                  src={header_icon}
                  alt="Header Icon"
                  className="mainpage-header-icon from-right"
                />
              </div>

              <h2 className="from-down">Be My Buddy! </h2>
              <p className="mainpage-left_p from-down">
                버디비(BuddyBee)는 같은 관심사를 가진 친구들과 함께 꿀벌처럼
                협력하며 꿈을 이루어 나가는 곳이에요! 서로의 프로젝트를
                소개하고, 든든한 버디비를 만나 특별한 경험을 만들어보세요.
              </p>
            </div>
            <div className="mainpage-button-container">
              <Link to="/projects?query=동행">
                <button className="mainpage-main-button from-down">
                  Find Buddy <p>동행구하기</p>
                  <div className="mainpage-btn-arrow">
                    <img
                      src={arrow_right}
                      alt="arrow_right"
                      className="mainpage-arrow-icon from-down"
                    />
                  </div>
                </button>
              </Link>
              <Link to="/projects?query=펀딩">
                <button className="mainpage-main-button from-down">
                  Find Funding <p>펀딩구하기</p>
                  <div className="mainpage-btn-arrow">
                    <img
                      src={arrow_right}
                      alt="arrow_right"
                      className="mainpage-arrow-icon from-down"
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
              <h2 className="from-down">Be My Buddy!</h2>
              <h2 className="from-down">
                우리...진실게임 하자. 친해지고 싶은 버디비 있어?
              </h2>
              <h1 className="from-down">BUDDY BEE</h1>
              <p className="from-down">
                Buddy Bee에 오신 걸 환영해요! 여기서는 좋아하는 콘서트나 행사에
                함께 갈 동행자를 쉽게 찾을 수 있고, 필요한 펀딩도 모을 수
                있어요. Buddy Bee와 함께 멋진 추억을 만들어 보세요. Buddy Bee와
                함께라면 모든 순간이 더 특별해질 거예요!
              </p>
              <img
                src={section1_flower}
                alt="Flower"
                className="mainpage-flower-icon from-bounce "
              />
              <img
                src={section1_cloud}
                alt="Cloud"
                className="mainpage-cloud-icon from-left"
              />
              <img
                src={section1_bee}
                alt="Bee"
                className="mainpage-bee-icon from-right"
              />
            </div>
          </div>
        </div>
        <div className="mainpage-recruitment-section">
          <h2 className="from-down">#동행 모집</h2>
          <Slider {...settings} className="from-down">
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
          <h2 className="from-down">#펀딩 모집</h2>
          <Slider {...settings} className="from-down">
            {fundingCards.map((data, index) => (
              <Card
                key={index}
                data={data}
                index={index}
                type="funding"
                toggleScrap={toggleScrap}
                className="from-down"
              />
            ))}
          </Slider>
        </div>
        <div className="mainpage-ranking-section from-down">
          <h2 className="from-down">현재 많은 버디비들이 보고 있어요!</h2>
          <div className="mainpage-ranking-keywords from-down">
            {["버디", "버디버디", "멈머", "슈머", "현머", "서머"].map(
              (keyword, index) => (
                <div key={index} className="mainpage-keyword from-down">
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
