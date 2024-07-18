import "./Common.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FlowerImg } from "./Common";
import Pagination from "./Common";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import mockImage from "../../img/mock.svg";

const Card = ({
  imgSrc,
  projectName,
  participants,
  status,
  id,
  onCancelParticipation,
  onCardClick, // 추가
}) => (
  <div
    className="MyPosts_ParticipatedProjects_main_right_container_box"
    onClick={() => onCardClick(id)} // 추가
  >
    <div
      className={`MyPosts_ParticipatedProjects_main_right_container_box_img_wrapper ${
        status === "종료" ? "overlay" : ""
      }`}
      style={{
        backgroundImage: `url(${imgSrc || mockImage})`,
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
        onClick={e => {
          e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록
          if (window.confirm("정말로 이 프로젝트 참여를 취소하시겠습니까?")) {
            onCancelParticipation(id);
          }
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
  const navigate = useNavigate(); // 추가

  const onCancelParticipation = async targetId => {
    try {
      // 서버로 참여 취소 요청
      await axios.post(
        `http://localhost:5001/api/projects/${targetId}/cancel-participation`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 취소 성공 시 프론트엔드에서도 해당 프로젝트 제거
      setActiveProjects(
        activeProjects.filter(project => project.id !== targetId)
      );
      setFinishedProjects(
        finishedProjects.filter(project => project.id !== targetId)
      );
      setPendingProjects(
        pendingProjects.filter(project => project.id !== targetId)
      );
    } catch (error) {
      console.error("Error cancelling participation:", error);
    }
  };

  const onCardClick = id => {
    navigate(`/projects/${id}`);
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
            onCancelParticipation={onCancelParticipation}
            id={project.id}
            onCardClick={onCardClick} // 추가
          />
        ))}
        {currentActivePosts.map(project => (
          <Card
            key={project.id}
            imgSrc={project.main_image}
            projectName={project.title}
            participants={`${project.current_participants}/${project.max_participants}명`}
            status={getStatusText(project.status)}
            onCancelParticipation={onCancelParticipation}
            id={project.id}
            onCardClick={onCardClick} // 추가
          />
        ))}
        {currentFinishedPosts.map(project => (
          <Card
            key={project.id}
            imgSrc={project.main_image}
            projectName={project.title}
            participants={`${project.current_participants}/${project.max_participants}명`}
            status={getStatusText(project.status)}
            onCancelParticipation={onCancelParticipation}
            id={project.id}
            onCardClick={onCardClick} // 추가
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
