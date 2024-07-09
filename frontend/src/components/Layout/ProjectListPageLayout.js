import { useEffect, useState } from "react";
import BackGroundGrid from "./BackGroundGrid";
import PageLayout from "./PageLayout";
import "./ProjectListPageLayout.css";
import ListCard from "../Common/ListCard";
import birthdayImage from "../../img/birthday1.jpg";
import rightArrow from "../../img/right_arrow.svg";
// import { type } from "@testing-library/user-event/dist/type";

const ProjectListPageLayout = () => {
  const initialCards = [
    {
      title: `날짜 테스트: ${new Date().getDate()}`,
      author: "위팬덕",
      type: "recruitment",
      views: 1373,
      description: "끝내주는 파티를 즐길 최고의 버디비만 모십니다",
      hashtags: ["동행", "뒷풀이", "NCT", "20살이상", "안녕ㄴㅇㅇㄴㄹㄴㅇㄹ"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 2,
      maxParticipants: 4,
      date: new Date().getDate(),
    },
    {
      title: `날짜 테스트: ${new Date().getDate() + 3}`,
      author: "비비디바비디부부",
      type: "recruitment",
      views: 1373,
      description:
        "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
      hashtags: ["슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 2,
      maxParticipants: 4,
      date: new Date().getDate() + 3,
    },
    {
      title: `날짜 테스트: ${new Date().getDate() + 2}`,
      author: "나비123",
      type: "recruitment",
      views: 1373,
      description:
        "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
      hashtags: ["슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 2,
      maxParticipants: 4,
      date: new Date().getDate() + 2,
    },
    {
      title: `날짜 테스트: ${new Date().getDate() + 12}`,
      author: "나비123",
      type: "recruitment",
      views: 1373,
      description:
        "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
      hashtags: ["슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 2,
      maxParticipants: 4,
      date: new Date().getDate() + 12,
    },
    // 추가적인 목업 데이터...
    {
      title: `날짜 테스트: ${new Date().getDate() + 10}일`,
      author: "나비456",
      type: "funding",
      views: 2567,
      description: "안녕하세요. 이번에 OO와서 함께할 펀딩을 찾습니다.",
      hashtags: ["펀딩", "지원", "버디비", "지원", "버디비", "지원", "버디비"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 3,
      maxParticipants: 5,
      date: new Date().getDate() + 10,
    },
    {
      title: `날짜 테스트:${new Date().getDate() - 4}일ㅁㄴㅇㅁㄴㅇ`,
      author: "나비456",
      type: "funding",
      views: 2567,
      description: "안녕하세요. 이번에 OO와서 함께할 펀딩을 찾습니다.",
      hashtags: ["펀딩", "지원", "버디비"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 3,
      maxParticipants: 5,
      date: new Date().getDate() - 4,
    },
    {
      title: `날짜 테스트: ${new Date().getDate() - 2}`,
      author: "서머",
      type: "funding",
      views: 12567,
      description: "안녕하세요 날짜 테스트용입니다~",
      hashtags: ["펀딩", "지원", "버디비"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 3,
      maxParticipants: 5,
      date: new Date().getDate() - 2,
    },
    {
      title: `날짜 테스트: ${new Date().getDate() + 3}`,
      author: "나비",
      type: "funding",
      views: 8567,
      description: "날짜 테스트용2.",
      hashtags: ["펀딩", "버디비"],
      image: birthdayImage,
      scrap: false,
      currentParticipants: 3,
      maxParticipants: 5,
      date: new Date().getDate() + 3,
    },
    // 추가적인 목업 데이터...
  ];

  // const [recruitmentCards, setRecruitmentCards] = useState(
  //   initialRecruitmentCards
  // );
  // const [fundingCards, setFundingCards] = useState(initialFundingCards);
  const [cards, setCards] = useState(initialCards);
  const [sortBtn, setSortBtn] = useState("latest"); //초깃값 최신순으로 정렬
  const [sortedCardList, setSortedCardList] = useState([]); //정렬한 값 담는 배열

  useEffect(() => {
    const sortCompare = (a, b) => {
      if (sortBtn === "latest") {
        return Number(a.date) - Number(b.date);
      } else if (sortBtn === "popularity") {
        return Number(b.views) - Number(a.views);
      }
    };

    const copyCardList = [...cards];
    copyCardList.sort(sortCompare);
    setSortedCardList(copyCardList);
  }, [sortBtn, cards]);

  const toggleScrap = (index, type) => {
    if (type === "recruitment") {
      console.log("test");
      const updatedCards = [...sortedCardList];
      updatedCards[index].scrap = !updatedCards[index].scrap;
      setCards(updatedCards);
    } else if (type === "funding") {
      const updatedCards = [...sortedCardList];
      updatedCards[index].scrap = !updatedCards[index].scrap;
      setCards(updatedCards);
    }
  };

  return (
    <div className="project-list-page-layout">
      <BackGroundGrid>
        <div className="project-list-page-sub-nav">
          <button>#버디비_동행</button>
          <button>#버디비_펀딩</button>
        </div>
        <PageLayout>
          <div className="project-list-page-layout-wrapper">
            <div className="project-list-page-layout-line1">
              <h1>#동행 모집</h1>
              <div className="project-list-btn-wrapper">
                <button
                  className={`sort-latest ${
                    sortBtn === "latest" ? "btn-sort-true" : ""
                  }`}
                  onClick={e => {
                    setSortBtn("latest");
                  }}
                >
                  최신순
                </button>
                <button
                  className={`sort-popularity ${
                    sortBtn === "popularity" ? "btn-sort-true" : ""
                  }`}
                  onClick={e => {
                    setSortBtn("popularity");
                  }}
                >
                  인기순
                </button>
              </div>
            </div>
            {/* 목록 페이지 그리드/카드 나열 부분 */}
            <div className="project-list-page-layout-grid">
              {sortedCardList.map((data, index) => (
                <ListCard
                  key={index}
                  data={data}
                  index={index}
                  type={data.type}
                  toggleScrap={toggleScrap}
                />
              ))}
            </div>
            {/* 페이지 버튼 컴포넌트화 할 예정입니다 */}
            <div className="project-list-pagenation-btn-wrapper">
              <button className="project-list-pagenation-btn">1</button>
              <img
                src={rightArrow}
                alt=""
                className="project-list-pagenation-arrow"
              />
            </div>
          </div>
        </PageLayout>
      </BackGroundGrid>
    </div>
  );
};

export default ProjectListPageLayout;
