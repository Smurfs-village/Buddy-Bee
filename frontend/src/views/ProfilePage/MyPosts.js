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
  <div className="MyPosts_ParticipatedProjects_main_right_container_box">
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
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [finishedMyProjects, setFinishedMyProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [activePage, setActivePage] = useState(1);

  const onDeleteActiveProject = targetId => {
    setMyProjects(() => myProjects.filter(project => project.id !== targetId));
  };

  const onDeleteFinishedProject = targetId => {
    setFinishedMyProjects(() =>
      finishedMyProjects.filter(project => project.id !== targetId)
    );
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
        setMyProjects(activeProjects || []);
        setFinishedMyProjects(finishedProjects || []);
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
    myProjects.length + finishedMyProjects.length + pendingProjects.length;
  const itemsCountPerPage = 4;
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;

  const currentMyPosts = myProjects.slice(indexOfFirstItem, indexOfLastItem);
  const currentFinishedPosts = finishedMyProjects.slice(
    indexOfFirstItem - myProjects.length,
    indexOfLastItem - myProjects.length
  );
  const currentPendingPosts = pendingProjects.slice(
    indexOfFirstItem - myProjects.length - finishedMyProjects.length,
    indexOfLastItem - myProjects.length - finishedMyProjects.length
  );

  const getStatusText = status => {
    switch (status) {
      case "pending":
        return "대기중";
      case "active":
        return "진행중";
      case "completed":
        return "완료";
      default:
        return status;
    }
  };

  return (
    <div className="Main_right_container">
      <p className="Main_right_container_writtenPosts">작성한 글</p>
      <div className="MyPosts_ParticipatedProjects_main_right_container_cards_wrapper">
        {currentMyPosts.map(project => (
          <Card
            key={project.id}
            imgSrc={project.main_image} // 서버에서 가져온 이미지 URL 사용
            projectName={project.title}
            participants={`${project.current_participants}/${project.max_participants}명`}
            status={getStatusText(project.status)}
            onDeleteActiveProject={onDeleteActiveProject}
            id={project.id}
          />
        ))}
        {currentFinishedPosts.map(project => (
          <FinishedProject
            key={project.id}
            imgSrc={project.main_image} // 서버에서 가져온 이미지 URL 사용
            projectName={project.title}
            participants={`${project.current_participants}/${project.max_participants}명`}
            status={getStatusText(project.status)}
            onDeleteFinishedProject={onDeleteFinishedProject}
            id={project.id}
          />
        ))}
        {currentPendingPosts.map(project => (
          <FinishedProject
            key={project.id}
            imgSrc={project.main_image} // 서버에서 가져온 이미지 URL 사용
            projectName={project.title}
            participants={`${project.current_participants}/${project.max_participants}명`}
            status={getStatusText(project.status)}
            onDeleteFinishedProject={onDeleteFinishedProject}
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
