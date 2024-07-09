import "./Common.css";
import { useState, useEffect } from "react";
import shineeConcertImg from "../../img/shinee_concert.jpg";
import kissOfLifeConcertImg from "../../img/kissOfLife_concert.jpg";
import markLee from "../../img/marklee.jpg";
import taemin from "../../img/taemin.jpg";
import { FlowerImg } from "./Common";
import { SelectPageItems } from "./Common";

const Card = ({
    imgSrc,
    projectName,
    participants,
    status,
    onDeleteActiveProject,
    id,
}) => (
    <div className="Main_right_container_box">
        <div
            className="MyPosts_ParticipatedProjects_main_right_container_box_img_wrapper"
            style={{ backgroundImage: `url(${imgSrc})` }}
        ></div>
        <div className="MyPosts_ParticipatedProjects_main_right_container_box_text_wrapper">
            <div className="MyPosts_ParticipatedProjects_main_right_container_box_projectName">
                {projectName}
            </div>
            <div className="MyPosts_ParticipatedProjects_main_right_container_box_numbersOfParticipants">
                {participants}
            </div>
        </div>
        <div className="MyPosts_ParticipatedProjects_main_right_container_box_btn_wrapper">
            <button className="MyPosts_ParticipatedProjects_main_right_container_box_progressingBtn">
                {status}
            </button>
            <button
                className="MyPosts_ParticipatedProjects_main_right_container_box_deleteBtn"
                onClick={() => onDeleteActiveProject(id)}
            >
                삭제
            </button>
        </div>
    </div>
);

const FinishedProject = ({
    imgSrc,
    projectName,
    participants,
    status,
    onDeleteFinishedProject,
    id,
}) => (
    <div className="Main_right_container_box">
        <div
            className="MyPosts_ParticipatedProjects_main_right_container_box_img_wrapper MyPosts_ParticipatedProjects_finishedProjectImg"
            style={{ backgroundImage: `url(${imgSrc})` }}
        ></div>
        <div className="MyPosts_ParticipatedProjects_main_right_container_box_text_wrapper MyPosts_ParticipatedProjects_finishedProject_text_wrapper">
            <div className="MyPosts_ParticipatedProjects_main_right_container_box_projectName">
                {projectName}
            </div>
            <div className="MyPosts_ParticipatedProjects_main_right_container_box_numbersOfParticipants">
                {participants}
            </div>
        </div>
        <div className="MyPosts_ParticipatedProjects_main_right_container_box_btn_wrapper">
            <button className="MyPosts_ParticipatedProjects_main_right_container_box_endBtn">
                {status}
            </button>
            <button
                className="MyPosts_ParticipatedProjects_main_right_container_box_deleteBtn MyPosts_ParticipatedProjects_finishedProject_container_deleteBtn"
                onClick={() => onDeleteFinishedProject(id)}
            >
                삭제
            </button>
        </div>
    </div>
);

const MainRightContainer = () => {
    const [myProjects, setMyProjects] = useState([]);
    const [finishedProjects, setFinishedProjects] = useState([]);

    const onDeleteActiveProject = targetId => {
        setMyProjects(myProjects =>
            myProjects.filter(project => project.id !== targetId)
        );
    };

    const onDeleteFinishedProject = targetId => {
        setFinishedProjects(finishedProjects =>
            finishedProjects.filter(project => project.id !== targetId)
        );
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
                id: 0,
                imgSrc: shineeConcertImg,
                projectName: "프로젝트 이름",
                participants: "12/30명",
                status: "진행중",
            },
            {
                id: 1,
                imgSrc: taemin,
                projectName: "프로젝트 이름",
                participants: "15/30명",
                status: "진행중",
            },
            {
                id: 2,
                imgSrc: markLee,
                projectName: "프로젝트 이름",
                participants: "29/30명",
                status: "진행중",
            },
        ];
        const finishedProjects = [
            {
                id: 0,
                imgSrc: kissOfLifeConcertImg,
                projectName: "프로젝트 이름",
                participants: "30/30명",
                status: "종료",
            },
        ];
        setMyProjects(activeProjects);
        setFinishedProjects(finishedProjects);
    }, []);

    return (
        <div className="Main_right_container">
            <p className="Main_right_container_writtenPosts">작성한 글</p>
            <div className="MyPosts_ParticipatedProjects_main_right_container_cards_wrapper">
                {myProjects.map(project => (
                    <Card
                        key={project.id}
                        imgSrc={project.imgSrc}
                        projectName={project.projectName}
                        participants={project.participants}
                        status={project.status}
                        onDeleteActiveProject={onDeleteActiveProject}
                        id={project.id}
                    />
                ))}
                {finishedProjects.map(project => (
                    <FinishedProject
                        key={project.id}
                        imgSrc={project.imgSrc}
                        projectName={project.projectName}
                        participants={project.participants}
                        status={project.status}
                        onDeleteFinishedProject={onDeleteFinishedProject}
                        id={project.id}
                    />
                ))}
            </div>
            <FlowerImg />
            <SelectPageItems />
        </div>
    );
};

const MyPosts = () => <MainRightContainer />;

export default MyPosts;
