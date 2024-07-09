import { useEffect, useState } from "react";
import BackGroundGrid from "./BackGroundGrid";
import PageLayout from "./PageLayout";
import "./ProjectListPageLayout.css";
import ListCard from "../Common/ListCard";
import birthdayImage from "../../img/birthday1.jpg";
// import rightArrow from "../../img/right_arrow.svg";
// import { type } from "@testing-library/user-event/dist/type";
import Pagination from "../Common/Pagination";
import SubNav from "./SubNav";

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
      hashtags: ["동행", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      hashtags: ["동행", "슈머", "멈머", "현머", "서머", "안녕", "넘친다"],
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
      title: `제발제발제발`,
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
      title: `페이지네이션 테스트`,
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
  ];

  const [cards, setCards] = useState(initialCards);
  const [sortBtn, setSortBtn] = useState("latest"); //초깃값 최신순으로 정렬
  const [sortedCardList, setSortedCardList] = useState([]); //정렬한 값 담는 배열
  const [activePage, setActivePage] = useState(1); //초기 페이지 값 세팅
  const [filterItem, setFilterItem] = useState(false); //초깃값 동행

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
  }, [sortBtn, cards, filterItem]);

  const toggleScrap = (index, type) => {
    if (type === "recruitment") {
      const updatedCards = [...sortedCardList];
      updatedCards[index].scrap = !updatedCards[index].scrap;
      setCards(updatedCards);
    } else if (type === "funding") {
      const updatedCards = [...sortedCardList];
      updatedCards[index].scrap = !updatedCards[index].scrap;
      setCards(updatedCards);
    }
  };

  //한 페이지당 보여줄 아이템 수
  const itemsCountPerPage = 25;

  // 현재 페이지에 보여줄 아이템들을 계산
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentItems = sortedCardList.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = pageNumber => {
    setActivePage(pageNumber);
  };

  return (
    <div className="project-list-page-layout">
      <BackGroundGrid>
        <SubNav setFilterItem={setFilterItem} filterItem={filterItem} />
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
            {/* 목록 페이지 그리드/카드 나열 부분, 삼항 연산자로 제어 */}
            {/* 기본값(동행, 펀딩 둘 다) */}
            <div className="project-list-page-layout-grid">
              {!filterItem
                ? currentItems.map((data, index) => (
                    <ListCard
                      key={index}
                      data={data}
                      index={index}
                      type={data.type}
                      toggleScrap={toggleScrap}
                    />
                  ))
                : // 동행만
                filterItem === "with"
                ? currentItems
                    .filter(item => item.type === "recruitment")
                    .map((data, index) => (
                      <ListCard
                        key={index}
                        data={data}
                        index={index}
                        type={data.type}
                        toggleScrap={toggleScrap}
                      />
                    ))
                : // 펀딩만
                filterItem === "funding"
                ? currentItems
                    .filter(item => item.type === "funding")
                    .map((data, index) => (
                      <ListCard
                        key={index}
                        data={data}
                        index={index}
                        type={data.type}
                        toggleScrap={toggleScrap}
                      />
                    ))
                : alert("error")}
            </div>
            {/* 페이지네이션 부분 */}
            <Pagination
              totalItemsCount={sortedCardList.length}
              activePage={activePage}
              itemsCountPerPage={itemsCountPerPage}
              pageRangeDisplayed={5}
              handlePageChange={handlePageChange}
            />
          </div>
        </PageLayout>
      </BackGroundGrid>
    </div>
  );
};

export default ProjectListPageLayout;
