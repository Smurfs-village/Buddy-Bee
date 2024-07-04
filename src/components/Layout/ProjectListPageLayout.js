import { useState } from "react";
import BackGroundGrid from "./BackGroundGrid";
import PageLayout from "./PageLayout";
import "./ProjectListPageLayout.css";
import ListCard from "../Common/Card";
import birthdayImage from "../../img/birthday1.jpg";

const ProjectListPageLayout = () => {
  const initialRecruitmentCards = [
    {
      title: "거기 당신",
      author: "위팬덕",
      views: 1373,
      description: "끝내주는 파티를 즐길 최고의 버디비만 모십니다",
      hashtags: ["동행", "뒷풀이", "NCT", "20살이상", "안녕ㄴㅇㅇㄴㄹㄴㅇㄹ"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 2,
      maxParticipants: 4,
      date: new Date(),
    },
    {
      title: "동행 구합니다!",
      author: "비비디바비디",
      views: 1373,
      description:
        "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
      hashtags: ["슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 2,
      maxParticipants: 4,
      date: new Date() + 3,
    },
    {
      title: "동행 구합니다!",
      author: "나비123",
      views: 1373,
      description:
        "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
      hashtags: ["슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 2,
      maxParticipants: 4,
    },
    {
      title: "동행 구합니다!",
      author: "나비123",
      views: 1373,
      description:
        "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
      hashtags: ["슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 2,
      maxParticipants: 4,
      date: new Date() - 5,
    },
    // 추가적인 목업 데이터...
  ];

  const initialFundingCards = [
    {
      title: "펀딩 구합니다!",
      author: "나비456",
      views: 2567,
      description: "안녕하세요. 이번에 OO와서 함께할 펀딩을 찾습니다.",
      hashtags: ["펀딩", "지원", "버디비", "지원", "버디비", "지원", "버디비"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 3,
      maxParticipants: 5,
      date: new Date() + 10,
    },
    {
      title: "펀딩 구합니다!",
      author: "나비456",
      views: 2567,
      description: "안녕하세요. 이번에 OO와서 함께할 펀딩을 찾습니다.",
      hashtags: ["펀딩", "지원", "버디비"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 3,
      maxParticipants: 5,
      date: new Date() - 4,
    },
    {
      title: "오늘은 7월 4일",
      author: "서머",
      views: 12567,
      description: "안녕하세요 날짜 테스트용입니다~",
      hashtags: ["펀딩", "지원", "버디비"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 3,
      maxParticipants: 5,
      date: new Date(),
    },
    {
      title: "날짜 테스트용",
      author: "나비",
      views: 8567,
      description: "날짜 테스트용2.",
      hashtags: ["펀딩", "버디비"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 3,
      maxParticipants: 5,
      date: new Date() + 3,
    },
    // 추가적인 목업 데이터...
  ];

  const [recruitmentCards, setRecruitmentCards] = useState(
    initialRecruitmentCards
  );
  const [fundingCards, setFundingCards] = useState(initialFundingCards);
  const [sortBtn, setSortBtn] = useState(false);

  const toggleScrap = (index, type) => {
    if (type === "recruitment") {
      const updatedCards = [...recruitmentCards];
      updatedCards[index].scrap = !updatedCards[index].scrap;
      setRecruitmentCards(updatedCards);
    } else if (type === "funding") {
      const updatedCards = [...fundingCards];
      updatedCards[index].scrap = !updatedCards[index].scrap;
      setFundingCards(updatedCards);
    }
  };

  const sortCards = e => {
    if (e.target.className === "sort-latest") {
    } else if (e.target.className === "sort-popularity") {
    }
  };
  return (
    <div className="project-list-page-layout">
      <BackGroundGrid>
        <div className="project-page-list-sub-nav">
          <button>#버디비_동행</button>
          <button>#버디비_펀딩</button>
        </div>
        <PageLayout>
          <div className="project-list-page-layout-wrapper">
            <div className="project-list-page-layout-line1">
              <h1>#동행 모집</h1>
              <div className="project-list-btn-wrapper">
                <button
                  className={`sort-latest ${!sortBtn ? "btn-sort-true" : ""}`}
                  onClick={e => {
                    sortCards(e);
                    setSortBtn(false);
                  }}
                >
                  최신순
                </button>
                <button
                  className={`sort-popurality ${
                    sortBtn ? "btn-sort-true" : ""
                  }`}
                  onClick={e => {
                    sortCards(e);
                    setSortBtn(true);
                  }}
                >
                  인기순
                </button>
              </div>
            </div>
            <div className="project-list-page-layout-grid">
              {recruitmentCards.map((data, index) => (
                <ListCard
                  key={index}
                  data={data}
                  index={index}
                  type="recruitment"
                  toggleScrap={toggleScrap}
                />
              ))}
              {fundingCards.map((data, index) => (
                <ListCard
                  key={index}
                  data={data}
                  index={index}
                  type="funding"
                  toggleScrap={toggleScrap}
                />
              ))}
            </div>
          </div>
        </PageLayout>
      </BackGroundGrid>
    </div>
  );
};

export default ProjectListPageLayout;
