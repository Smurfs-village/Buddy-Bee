import "./Common.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FlowerImg } from "./Common";
import Pagination from "./Common";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import mockImage from "../../img/mock.svg";
import CardSorting from "./CardSorting"; // CardSorting 컴포넌트를 import

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
    className={`${
      status === "종료"
        ? "MyPosts_ParticipatedProjects_main_right_finishedProject_box"
        : "MyPosts_ParticipatedProjects_main_right_container_box"
    }`}
    onClick={() => onCardClick(id)} // 추가
  >
    <div
      className={`MyPosts_ParticipatedProjects_main_right_container_box_img_wrapper ${
        status === "종료"
          ? "MyPosts_ParticipatedProjects_finishedProjectImg"
          : "MyPosts_ParticipatedProjects_activePendingProjectImg"
      }`}
      style={{
        backgroundImage: `url(${imgSrc || mockImage})`,
        opacity: status === "대기중" || status === "진행중" ? 0.8 : 1,
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
      <button className={`status-btn ${status}`}>{status}</button>
      <button
        className="MyPosts_ParticipatedProjects_main_right_container_box_deleteBtn"
        onClick={e => {
          e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록
          Swal.fire({
            title: "프로젝트 참여를 취소하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff8473",
            cancelButtonColor: "#aeaeae",
            confirmButtonText: "확인",
            cancelButtonText: "취소",
          }).then(result => {
            if (result.isConfirmed) {
              onCancelParticipation(id);
            }
          });
        }}
      >
        취소
      </button>
    </div>
  </div>
);

const MainRightContainer = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [noResultsMessage, setNoResultsMessage] = useState(""); // 상태 추가
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const onCancelParticipation = async targetId => {
    try {
      // 서버로 참여 취소 요청
      await axios.post(
        `${API_BASE_URL}/projects/${targetId}/cancel-participation`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 취소 성공 시 프론트엔드에서도 해당 프로젝트 제거
      setProjects(projects.filter(project => project.id !== targetId));
      setFilteredProjects(
        filteredProjects.filter(project => project.id !== targetId)
      );
    } catch (error) {
      console.error("Error cancelling participation:", error);
    }
  };

  const onCardClick = id => {
    navigate(`/projects/${id}`);
  };

  const onChangeOptionHandler = event => {
    const filterType = event.target.value;
    let filtered = [];
    let message = "검색 결과가 없습니다.";

    if (filterType === "defaultOption") {
      filtered = projects;
      message = "프로젝트가 없습니다.";
    } else if (filterType === "동행") {
      filtered = projects.filter(project => project.type === "with");
      message = "동행 프로젝트가 없습니다.";
    } else if (filterType === "펀딩") {
      filtered = projects.filter(project => project.type === "funding");
      message = "펀딩 프로젝트가 없습니다.";
    } else if (filterType === "대기중") {
      filtered = projects.filter(project => project.status === "대기중");
      message = "대기중인 프로젝트가 없습니다.";
    } else if (filterType === "진행중") {
      filtered = projects.filter(project => project.status === "진행중");
      message = "진행중인 프로젝트가 없습니다.";
    } else if (filterType === "종료") {
      filtered = projects.filter(project => project.status === "종료");
      message = "완료된 프로젝트가 없습니다.";
    }

    setFilteredProjects(filtered);
    setNoResultsMessage(message);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/projects/participated`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { activeProjects, finishedProjects, pendingProjects } =
          response.data;
        const allProjects = [
          ...pendingProjects.map(project => ({
            ...project,
            status: "대기중",
          })),
          ...activeProjects.map(project => ({
            ...project,
            status: "진행중",
          })),
          ...finishedProjects.map(project => ({
            ...project,
            status: "종료",
          })),
        ];
        setProjects(allProjects);
        setFilteredProjects(allProjects); // 초기에는 모든 프로젝트 표시
        setNoResultsMessage("프로젝트가 없습니다."); // 초기 메시지 설정
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user, API_BASE_URL]);

  const pageChangeHandler = pageNumber => setActivePage(pageNumber);

  const itemsCountPerPage = 4;
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentItems = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="Main_right_container">
      <div className="Main_right_container_title_selectBox_wrapper">
        <p className="Main_right_container_writtenPosts">참여중인 프로젝트</p>
        <CardSorting onChangeOptionHandler={onChangeOptionHandler} />
      </div>
      <div className="MyPosts_ParticipatedProjects_main_right_container_cards_wrapper">
        {currentItems.length > 0 ? (
          currentItems.map(project => (
            <Card
              key={project.id}
              imgSrc={project.main_image}
              projectName={project.title}
              participants={`${project.current_participants}/${project.max_participants}명`}
              status={project.status}
              onCancelParticipation={onCancelParticipation}
              id={project.id}
              onCardClick={onCardClick} // 추가
            />
          ))
        ) : (
          <p className="no-projects">{noResultsMessage}</p>
        )}
        <FlowerImg />
      </div>
      {filteredProjects.length > 0 && (
        <Pagination
          activePage={activePage}
          totalItemsCount={filteredProjects.length}
          itemsCountPerPage={itemsCountPerPage}
          pageRangeDisplayed={5}
          handlePageChange={pageChangeHandler}
        />
      )}
    </div>
  );
};

const ParticipatedProjects = () => <MainRightContainer />;

export default ParticipatedProjects;
