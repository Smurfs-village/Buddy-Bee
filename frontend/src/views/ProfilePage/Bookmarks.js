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
import { FlowerImg } from "./Common";
import Pagination from "../../components/Common/Pagination";

const Card = ({
    imgSrc,
    projectName,
    status,
    scrapState,
    onClickScrapButton,
}) => (
    <div className="Bookmarks_main_right_container_box">
        <div
            className="Bookmarks_main_right_container_box_img_wrapper"
            style={{
                backgroundImage: `url(${imgSrc})`,
            }}
        >
            <div className="Bookmarks_honeyPot_img_wrapper">
                <img
                    alt="scrap"
                    src={scrapState ? scrap_yes : scrap_none}
                    onClick={onClickScrapButton}
                    className="Bookmarks_honeyPot_img"
                />
            </div>
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

const FinishedProject = ({
    imgSrc,
    projectName,
    status,
    scrapState,
    onClickScrapButton,
}) => (
    <div className="Bookmarks_main_right_container_box Bookmarks_finishedProject_container">
        <div
            className="Bookmarks_main_right_container_box_img_wrapper Bookmarks_finishedProjectImg"
            style={{ backgroundImage: `url(${imgSrc})` }}
        >
            <div className="Bookmarks_honeyPot_img_wrapper">
                <img
                    alt="scrap"
                    src={scrapState ? scrap_yes : scrap_none}
                    onClick={onClickScrapButton}
                    className="Bookmarks_honeyPot_img"
                />
            </div>
        </div>
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
    const [finishedBookmarks, setFinishedBookmarks] = useState([]);
    const [activePage, setActivePage] = useState(1);

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
                id: 0,
                imgSrc: riize,
                projectName: "라이즈 콘서트",
                status: "진행중",
                scrapState: true,
            },
            {
                id: 1,
                imgSrc: oohImg,
                projectName: "BTS 지민 옥외광고",
                status: "진행중",
                scrapState: true,
            },
            {
                id: 2,
                imgSrc: demandSurveyImg1,
                projectName: "인형덕후 모여",
                status: "진행중",
                scrapState: true,
            },
            {
                id: 3,
                imgSrc: accompanyImg2,
                projectName: "같이 가실분",
                status: "진행중",
                scrapState: true,
            },
            {
                id: 4,
                imgSrc: Sheonoo,
                projectName: "셔누 생파",
                status: "진행중",
                scrapState: true,
            },
        ];
        const finishedProjects = [
            {
                id: 0,
                imgSrc: nctDreamConcertImg,
                projectName: "nctDream 콘",
                status: "종료",
                scrapState: true,
            },
            {
                id: 1,
                imgSrc: blackPinkConcertImg,
                projectName: "블랙핑크 콘서트",
                status: "종료",
                scrapState: true,
            },
            {
                id: 2,
                imgSrc: seventeenConcertImg,
                projectName: "비더선 월드투어",
                status: "종료",
                scrapState: true,
            },
            {
                id: 3,
                imgSrc: heroConcertImg,
                projectName: "임영웅 콘서트",
                status: "종료",
                scrapState: true,
            },
            {
                id: 4,
                imgSrc: FinishedProjectImg2,
                projectName: "전소미 콘서트",
                status: "종료",
                scrapState: true,
            },
        ];
        setBookmarks(activeProjects);
        setFinishedBookmarks(finishedProjects);
    }, []);

    const scrapStateHandler = (index, status) => {
        if (status === "진행중") {
            const updatedBookmarks = [...bookmarks];
            updatedBookmarks[index].scrapState =
                !updatedBookmarks[index].scrapState;
            setBookmarks(updatedBookmarks);
        } else if (status === "종료") {
            const updatedFinishedBookmarks = [...finishedBookmarks];
            updatedFinishedBookmarks[index].scrapState =
                !updatedFinishedBookmarks[index].scrapState;
            setFinishedBookmarks(updatedFinishedBookmarks);
        }
    };

    const pageChangeHandler = pageNumber => setActivePage(pageNumber);

    const totalItemsCount = bookmarks.length + finishedBookmarks.length;

    const itemsCountPerPage = 10;

    const indexOfLastItem = activePage * bookmarks.length;
    const indexOfFirstItem = indexOfLastItem - bookmarks.length;
    const currentItems = bookmarks.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="Main_right_container">
            <div className="Main_right_container_writtenPosts">나의 꿀단지</div>
            <div className="Bookmarks_main_right_container_cards_wrapper">
                {currentItems.map((project, index) => (
                    <Card
                        key={project.id}
                        imgSrc={project.imgSrc}
                        projectName={project.projectName}
                        status={project.status}
                        scrapState={project.scrapState}
                        onClickScrapButton={() =>
                            scrapStateHandler(index, project.status)
                        }
                    />
                ))}
                {finishedBookmarks.map((project, index) => (
                    <FinishedProject
                        key={project.id}
                        imgSrc={project.imgSrc}
                        projectName={project.projectName}
                        status={project.status}
                        scrapState={project.scrapState}
                        onClickScrapButton={() =>
                            scrapStateHandler(index, project.status)
                        }
                    />
                ))}
            </div>
            <FlowerImg />
            <Pagination
                totalItemsCount={totalItemsCount}
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                pageRangeDisplayed={5}
                handlePageChange={pageChangeHandler}
            />
        </div>
    );
};

const Bookmarks = () => {
    return <MainRightContainer />;
};

export default Bookmarks;
