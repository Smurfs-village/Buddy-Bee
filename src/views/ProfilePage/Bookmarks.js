import "./Bookmarks.css";
import { useState, useEffect } from "react";
import shineeConcertImg from "../../img/shinee_concert.jpg";
import kissOfLifeConcertImg from "../../img/kissOfLife_concert.jpg";
import myPageflowerImg from "../../img/myPage_flower.svg";
import rightArrow from "../../img/right_arrow.svg";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";

const Card = ({ imgSrc, projectName, status, scrapState, onClickBookmark }) => (
    <div className="Bookmarks_main_right_container_box">
        <div
            className="Bookmarks_main_right_container_box_img_wrapper"
            style={{ backgroundImage: `url(${imgSrc})` }}
        ></div>
        <div className="Bookmarks_main_right_container_box_text_wrapper">
            <div className="Bookmarks_main_right_container_box_status_wrapper">
                {status}
            </div>
            <div className="Bookmarks_main_right_container_projectName_wrapper">
                {projectName}
            </div>
        </div>
    </div>
);

const FinishedProject = ({ imgSrc, projectName, status }) => (
    <div className="Bookmarks_main_right_container_box Bookmarks_finishedProject_container">
        <div
            className="Bookmarks_main_right_container_box_img_wrapper Bookmarks_finishedProjectImg"
            style={{ backgroundImage: `url(${imgSrc})` }}
        ></div>
        <div className="Bookmarks_main_right_container_box_text_wrapper Bookmarks_finishedProject_text_wrapper">
            <div className="Bookmarks_main_right_container_box_status_wrapper">
                {status}
            </div>
            <div className="Bookmarks_main_right_container_box_projectName_wrapper">
                {projectName}
            </div>
        </div>
    </div>
);

const MainRightContainer = () => {
    const [projects, setProjects] = useState([]);
    const [finishedProjects, setFinishedProjects] = useState([]);
    const [scrapState, setScrapState] = useState(false);

    const onClickBookmark = () => {
        setScrapState(!scrapState);
    };

    useEffect(() => {
        // 여기에 백엔드에서 데이터를 가져오는 로직 추가
        //
        // fetch('/api/projects')
        //   .then(response => response.json())
        //   .then(data => {
        //     setProjects(data.activeProjects);
        //     setFinishedProjects(data.finishedProjects);
        //   });
        const activeProjects = [
            {
                imgSrc: shineeConcertImg,
                projectName: "프로젝트 이름",
                participants: "15/30명",
                status: "진행중",
            },
            {
                imgSrc: shineeConcertImg,
                projectName: "프로젝트 이름",
                participants: "15/30명",
                status: "진행중",
            },
            {
                imgSrc: shineeConcertImg,
                projectName: "프로젝트 이름",
                participants: "15/30명",
                status: "진행중",
            },
            {
                imgSrc: shineeConcertImg,
                projectName: "프로젝트 이름",
                participants: "15/30명",
                status: "진행중",
            },
            {
                imgSrc: shineeConcertImg,
                projectName: "프로젝트 이름",
                participants: "15/30명",
                status: "진행중",
            },
        ];
        const finishedProjects = [
            {
                imgSrc: kissOfLifeConcertImg,
                projectName: "프로젝트 이름",
                status: "종료됨",
            },
            {
                imgSrc: kissOfLifeConcertImg,
                projectName: "프로젝트 이름",
                status: "종료됨",
            },
            {
                imgSrc: kissOfLifeConcertImg,
                projectName: "프로젝트 이름",
                status: "종료됨",
            },
            {
                imgSrc: kissOfLifeConcertImg,
                projectName: "프로젝트 이름",
                status: "종료됨",
            },
            {
                imgSrc: kissOfLifeConcertImg,
                projectName: "프로젝트 이름",
                status: "종료됨",
            },
        ];
        setProjects(activeProjects);
        setFinishedProjects(finishedProjects);
    }, []);

    return (
        <>
            <div className="Bookmarks_main_right_container_writtenPosts">
                나의 꿀단지
            </div>
            <div className="Bookmarks_main_right_container_cards_wrapper">
                {projects.map((project, index) => (
                    <Card
                        key={index}
                        imgSrc={project.imgSrc}
                        projectName={project.projectName}
                        participants={project.participants}
                        status={project.status}
                    />
                ))}
                {finishedProjects.map((project, index) => (
                    <FinishedProject
                        key={index}
                        imgSrc={project.imgSrc}
                        projectName={project.projectName}
                        participants={project.participants}
                        status={project.status}
                    />
                ))}
            </div>
            <img
                src={myPageflowerImg}
                alt=""
                className="Bookmarks_main_right_container_flowerImg"
            />
            <form className="Bookmarks_main_right_container_btn_arrow_wrapper">
                <button className="Bookmarks_main_right_container_btn Bookmarks_main_right_container_pageOneBtn">
                    1
                </button>
                <button className="Bookmarks_main_right_container_btn Bookmarks_main_right_container_pageTwoBtn">
                    2
                </button>
                <img src={rightArrow} alt="" className="Bookmarks_rightArrow" />
            </form>
        </>
    );
};

const Bookmarks = () => {
    return (
        <div className="Bookmarks_main_rightContainer_wrapper">
            <div className="Bookmarks_main_right_container">
                <MainRightContainer />
            </div>
        </div>
    );
};

export default Bookmarks;
