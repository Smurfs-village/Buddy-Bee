import "./Common.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FlowerImg } from "./Common";
import Pagination from "./Common";
import { useAuth } from "../../contexts/AuthContext";

const Card = ({
  imgSrc,
  projectName,
  participants,
  status,
  id,
  onDeleteProject,
}) => (
  <div className="MyPosts_ParticipatedProjects_main_right_container_box">
    <div
      className={`MyPosts_ParticipatedProjects_main_right_container_box_img_wrapper ${
        status === "종료" ? "overlay" : ""
      }`}
      style={{
        backgroundImage: `url(${imgSrc})`,
        opacity: status === "대기중" || status === "진행중" ? 0.5 : 1,
      }}
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
      <button
        className={`MyPosts_ParticipatedProjects_main_right_container_box_${
          status === "대기중"
            ? "pendingBtn"
            : status === "진행중"
            ? "activeBtn"
            : "completedBtn"
        }`}
      >
        {status}
      </button>
      <button
        className="MyPosts_ParticipatedProjects_main_right_container_box_deleteBtn"
        onClick={() => {
          onDeleteProject(id);
        }}
      >
        삭제
      </button>
    </div>
  </div>
);

const MainRightContainer = () => {
  const { user } = useAuth();
  const [activeProjects, setActiveProjects] = useState([]);
  const [finishedProjects, setFinishedProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [activePage, setActivePage] = useState(1);

  const onDeleteProject = targetId => {
    setActiveProjects(
      activeProjects.filter(project => project.id !== targetId)
    );
    setFinishedProjects(
      finishedProjects.filter(project => project.id !== targetId)
    );
    setPendingProjects(
      pendingProjects.filter(project => project.id !== targetId)
    );
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/projects/participated",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { activeProjects, finishedProjects, pendingProjects } =
          response.data;
        setActiveProjects(activeProjects || []);
        setFinishedProjects(finishedProjects || []);
        setPendingProjects(pendingProjects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  const pageChangeHandler = pageNumber => setActivePage(pageNumber);

  const totalItemsCount =
    activeProjects.length + finishedProjects.length + pendingProjects.length;
  const itemsCountPerPage = 4;
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;

  const currentPendingPosts = pendingProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentActivePosts = activeProjects.slice(
    indexOfFirstItem - pendingProjects.length,
    indexOfLastItem - pendingProjects.length
  );
  const currentFinishedPosts = finishedProjects.slice(
    indexOfFirstItem - pendingProjects.length - activeProjects.length,
    indexOfLastItem - pendingProjects.length - activeProjects.length
  );

  const getStatusText = status => {
    switch (status) {
      case "pending":
        return "대기중";
      case "active":
        return "진행중";
      case "completed":
        return "종료";
      default:
        return status;
    }
  };

  return (
    <div className="Main_right_container">
      <p className="Main_right_container_writtenPosts">참여중인 프로젝트</p>
      <div className="MyPosts_ParticipatedProjects_main_right_container_cards_wrapper">
        {currentPendingPosts.map(project => (
          <Card
            key={project.id}
            imgSrc={project.main_image}
            projectName={project.title}
            participants={`${project.current_participants}/${project.max_participants}명`}
            status={getStatusText(project.status)}
            onDeleteProject={onDeleteProject}
            id={project.id}
          />
        ))}
        {currentActivePosts.map(project => (
          <Card
            key={project.id}
            imgSrc={project.main_image}
            projectName={project.title}
            participants={`${project.current_participants}/${project.max_participants}명`}
            status={getStatusText(project.status)}
            onDeleteProject={onDeleteProject}
            id={project.id}
          />
        ))}
        {currentFinishedPosts.map(project => (
          <Card
            key={project.id}
            imgSrc={project.main_image}
            projectName={project.title}
            participants={`${project.current_participants}/${project.max_participants}명`}
            status={getStatusText(project.status)}
            onDeleteProject={onDeleteProject}
            id={project.id}
          />
        ))}
      </div>
      <FlowerImg />
      <Pagination
        activePage={activePage}
        totalItemsCount={totalItemsCount}
        itemsCountPerPage={itemsCountPerPage}
        pageRangeDisplayed={5}
        handlePageChange={pageChangeHandler}
      />
    </div>
  );
};

const ParticipatedProjects = () => <MainRightContainer />;

export default ParticipatedProjects;
