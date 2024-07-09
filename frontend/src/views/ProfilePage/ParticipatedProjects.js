import "./Common.css";
import { useState, useEffect } from "react";
import shineeConcertImg from "../../img/shinee_concert.jpg";
import btsConcertImg from "../../img/bts_concert.jpg";
import karinaConcertImg from "../../img/karina_concert.jpg";
import accompanyImg from "../../img/accompany1.jpg";
import { FlowerImg } from "./Common";
import { SelectPageItems } from "./Common";

const Card = ({ imgSrc, projectName, participants, status }) => (
    <div className="MyPosts_ParticipatedProjects_main_right_container_box">
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
            <button className="MyPosts_ParticipatedProjects_main_right_container_box_deleteBtn">
                삭제
            </button>
        </div>
    </div>
);

const FinishedProject = ({ imgSrc, projectName, participants, status }) => (
    <div className="MyPosts_ParticipatedProjects_main_right_container_box MyPosts_ParticipatedProjects_finishedProject_container">
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
            <button className="MyPosts_ParticipatedProjects_main_right_container_box_deleteBtn MyPosts_ParticipatedProjects_finishedProject_container_deleteBtn">
                삭제
            </button>
        </div>
    </div>
);

const MainRightContainer = () => {
    const [participatingProjects, setParticipatingProjects] = useState([]);
    const [finishedProjects, setFinishedProjects] = useState([]);

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
                participants: "4/20명",
                status: "진행중",
            },
            {
                imgSrc: karinaConcertImg,
                projectName: "프로젝트 이름",
                participants: "10/30명",
                status: "진행중",
            },
            {
                imgSrc: btsConcertImg,
                projectName: "프로젝트 이름",
                participants: "15/30명",
                status: "진행중",
            },
        ];
        const finishedProjects = [
            {
                imgSrc: accompanyImg,
                projectName: "프로젝트 이름",
                participants: "30/30명",
                status: "종료",
            },
        ];
        setParticipatingProjects(activeProjects);
        setFinishedProjects(finishedProjects);
    }, []);

    return (
        <div className="MyPosts_ParticipatedProjects_main_right_container">
            <p className="MyPosts_ParticipatedProjects_main_right_container_writtenPosts">
                참여중인 프로젝트
            </p>
            <div className="MyPosts_ParticipatedProjects_main_right_container_cards_wrapper">
                {participatingProjects.map((project, index) => (
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
            <FlowerImg />
            <SelectPageItems />
        </div>
    );
};

const ParticipatedProjects = () => {
    return <MainRightContainer />;
};

export default ParticipatedProjects;
