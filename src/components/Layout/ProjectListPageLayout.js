// import { useState } from "react";
import "./ProjectListPageLayout.css";
// import Card from "./Card";
// import birthdayImage from "../../img/birthday1.jpg";

const ProjectListPageLayout = () => {
  // const initialRecruitmentCards = [
  //   {
  //     title: "동행 구합니다!",
  //     author: "나비123",
  //     views: 1373,
  //     description:
  //       "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
  //     hashtags: ["슈머", "멈머", "현머", "서머", "안녕ㄴㅇㅇㄴㄹㄴㅇㄹ"],
  //     image: birthdayImage,
  //     scrap: false,
  //     currentParticipants: 2,
  //     maxParticipants: 4,
  //   },
  //   {
  //     title: "동행 구합니다!",
  //     author: "나비123",
  //     views: 1373,
  //     description:
  //       "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
  //     hashtags: ["슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
  //     image: birthdayImage,
  //     scrap: false,
  //     currentParticipants: 2,
  //     maxParticipants: 4,
  //   },
  //   {
  //     title: "동행 구합니다!",
  //     author: "나비123",
  //     views: 1373,
  //     description:
  //       "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
  //     hashtags: ["슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
  //     image: birthdayImage,
  //     scrap: false,
  //     currentParticipants: 2,
  //     maxParticipants: 4,
  //   },
  //   {
  //     title: "동행 구합니다!",
  //     author: "나비123",
  //     views: 1373,
  //     description:
  //       "안녕하세요. 이번에 OO와서 함께할 동행을 찾습니다.ㄴㅇㄴㅇㄹㄹㄴㅇ",
  //     hashtags: ["슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
  //     image: birthdayImage,
  //     scrap: false,
  //     currentParticipants: 2,
  //     maxParticipants: 4,
  //   },
  //   // 추가적인 목업 데이터...
  // ];

  // const initialFundingCards = [
  //   {
  //     title: "펀딩 구합니다!",
  //     author: "나비456",
  //     views: 2567,
  //     description: "안녕하세요. 이번에 OO와서 함께할 펀딩을 찾습니다.",
  //     hashtags: ["펀딩", "지원", "버디비", "지원", "버디비", "지원", "버디비"],
  //     image: birthdayImage,
  //     scrap: false,
  //     currentParticipants: 3,
  //     maxParticipants: 5,
  //   },
  //   {
  //     title: "펀딩 구합니다!",
  //     author: "나비456",
  //     views: 2567,
  //     description: "안녕하세요. 이번에 OO와서 함께할 펀딩을 찾습니다.",
  //     hashtags: ["펀딩", "지원", "버디비"],
  //     image: birthdayImage,
  //     scrap: false,
  //     currentParticipants: 3,
  //     maxParticipants: 5,
  //   },
  //   {
  //     title: "펀딩 구합니다!",
  //     author: "나비456",
  //     views: 2567,
  //     description: "안녕하세요. 이번에 OO와서 함께할 펀딩을 찾습니다.",
  //     hashtags: ["펀딩", "지원", "버디비"],
  //     image: birthdayImage,
  //     scrap: false,
  //     currentParticipants: 3,
  //     maxParticipants: 5,
  //   },
  //   {
  //     title: "펀딩 구합니다!",
  //     author: "나비456",
  //     views: 2567,
  //     description: "안녕하세요. 이번에 OO와서 함께할 펀딩을 찾습니다.",
  //     hashtags: ["펀딩", "지원", "버디비"],
  //     image: birthdayImage,
  //     scrap: false,
  //     currentParticipants: 3,
  //     maxParticipants: 5,
  //   },
  //   // 추가적인 목업 데이터...
  // ];

  // const [recruitmentCards, setRecruitmentCards] = useState(
  //   initialRecruitmentCards
  // );
  // const [fundingCards, setFundingCards] = useState(initialFundingCards);

  // const toggleScrap = (index, type) => {
  //   if (type === "recruitment") {
  //     const updatedCards = [...recruitmentCards];
  //     updatedCards[index].scrap = !updatedCards[index].scrap;
  //     setRecruitmentCards(updatedCards);
  //   } else if (type === "funding") {
  //     const updatedCards = [...fundingCards];
  //     updatedCards[index].scrap = !updatedCards[index].scrap;
  //     setFundingCards(updatedCards);
  //   }
  // };

  return (
    <div className="project-list-page-layout">
      <div className="project-list-page-layout-grid">
        <h1>hi</h1>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
      </div>
      {/* {recruitmentCards.map((data, index) => (
    <Card
    key={index}
    data={data}
     index={index}
     type="recruitment"
     toggleScrap={toggleScrap}
   />
))} */}
    </div>
  );
};

export default ProjectListPageLayout;
