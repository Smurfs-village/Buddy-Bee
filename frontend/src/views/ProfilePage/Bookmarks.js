import "./Bookmarks.css";
import "./Common";
import { useState, useEffect } from "react";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import FinishedProjectImg2 from "../../img/finished_project1.jpg";
import demandSurveyImg1 from "../../img/demand_survey1.png";
import oohImg from "../../img/OOH1.jpg";
import accompanyImg2 from "../../img/accompany2.jpeg";
import riize from "../../img/riize1.jpg";
import nctDreamConcertImg from "../../img/nctDream_concert.jpg";
import seventeenConcertImg from "../../img/seventeen_concert.jpg";
import blackPinkConcertImg from "../../img/blackpink_concert.jpg";
import heroConcertImg from "../../img/hero_concert.jpg";
import Sheonoo from "../../img/sheonoo.jpg";

import { SelectPageItems } from "./Common";
import { FlowerImg } from "./Common";

const Card = ({ imgSrc, projectName, status, scrapState, onClickBookmark }) => (
    <div className="Bookmarks_main_right_container_box">
        <div
            className="Bookmarks_main_right_container_box_img_wrapper"
            style={{ backgroundImage: `url(${imgSrc})` }}
        >
            <div className={scrapState ? "scrap_yes" : "scrap_none"}></div>
        </div>
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
    const [bookmarks, setBookmarks] = useState([]);
    const [finishedProjectsInBookmarks, setFinishedProjectsInBookmarks] =
        useState([]);
    const [scrapState, setScrapState] = useState(false);

    const onClickBookmark = () => {
        setScrapState(true);
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
                imgSrc: riize,
                projectName: "프로젝트 이름",
                status: "진행중",
            },
            {
                imgSrc: oohImg,
                projectName: "프로젝트 이름",
                status: "진행중",
            },
            {
                imgSrc: demandSurveyImg1,
                projectName: "프로젝트 이름",
                status: "진행중",
            },
            {
                imgSrc: accompanyImg2,
                projectName: "프로젝트 이름",
                status: "진행중",
            },
            {
                imgSrc: Sheonoo,
                projectName: "프로젝트 이름",
                status: "진행중",
            },
        ];
        const finishedProjects = [
            {
                imgSrc: nctDreamConcertImg,
                projectName: "프로젝트 이름",
                status: "종료",
            },
            {
                imgSrc: blackPinkConcertImg,
                projectName: "프로젝트 이름",
                status: "종료",
            },
            {
                imgSrc: seventeenConcertImg,
                projectName: "프로젝트 이름",
                status: "종료",
            },
            {
                imgSrc: heroConcertImg,
                projectName: "프로젝트 이름",
                status: "종료",
            },
            {
                imgSrc: FinishedProjectImg2,
                projectName: "프로젝트 이름",
                status: "종료",
            },
        ];
        setBookmarks(activeProjects);
        setFinishedProjectsInBookmarks(finishedProjects);
    }, []);

    return (
        <div className="Main_right_container">
            <div className="Main_right_container_writtenPosts">나의 꿀단지</div>
            <div className="Bookmarks_main_right_container_cards_wrapper">
                {bookmarks.map((project, index) => (
                    <Card
                        key={index}
                        imgSrc={project.imgSrc}
                        projectName={project.projectName}
                        status={project.status}
                    />
                ))}
                {finishedProjectsInBookmarks.map((project, index) => (
                    <FinishedProject
                        key={index}
                        imgSrc={project.imgSrc}
                        projectName={project.projectName}
                        status={project.status}
                    />
                ))}
            </div>
            <FlowerImg />
            <SelectPageItems />
        </div>
    );
};

const Bookmarks = () => {
    return <MainRightContainer />;
};

export default Bookmarks;
