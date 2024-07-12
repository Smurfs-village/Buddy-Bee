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
  onDeleteActiveProject,
  id,
}) => (
  <div className="MyPosts_ParticipatedProjects_main_right_container_box">
    <div
      className={`MyPosts_ParticipatedProjects_main_right_container_box_img_wrapper ${
        status === "종료"
          ? "MyPosts_ParticipatedProjects_finishedProjectImg"
          : "MyPosts_ParticipatedProjects_activePendingProjectImg"
      }`}
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
      <button className={`status-btn ${status}`}>{status}</button>
      <button
        className="MyPosts_ParticipatedProjects_main_right_container_box_deleteBtn"
        onClick={() => onDeleteActiveProject(id)}
      >
        삭제
      </button>
    </div>
  </div>
);

const MainRightContainer = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activePage, setActivePage] = useState(1);

  const onDeleteActiveProject = targetId => {
    setProjects(() => projects.filter(project => project.id !== targetId));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/projects/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched projects:", response.data);
        const { activeProjects, finishedProjects, pendingProjects } =
          response.data;
        const allProjects = [
          ...pendingProjects.map(project => ({ ...project, status: "대기중" })),
          ...activeProjects.map(project => ({ ...project, status: "진행중" })),
          ...finishedProjects.map(project => ({ ...project, status: "종료" })),
        ];
        setProjects(allProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  const pageChangeHandler = pageNumber => setActivePage(pageNumber);

  const totalItemsCount = projects.length;
  const itemsCountPerPage = 4;
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;

  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="Main_right_container">
      <p className="Main_right_container_writtenPosts">작성한 글</p>
      <div className="MyPosts_ParticipatedProjects_main_right_container_cards_wrapper">
        {currentProjects.map(project => (
          <Card
            key={project.id}
            imgSrc={project.main_image} // 서버에서 가져온 이미지 URL 사용
            projectName={project.title}
            participants={`${project.current_participants}/${project.max_participants}명`}
            status={project.status}
            onDeleteActiveProject={onDeleteActiveProject}
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

const MyPosts = () => <MainRightContainer />;

export default MyPosts;
