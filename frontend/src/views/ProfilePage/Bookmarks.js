import "./Bookmarks.css";
import { useState, useEffect } from "react";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import Pagination from "../../components/Common/Pagination";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import mockImage from "../../img/mock.svg";

const Card = ({
  imgSrc,
  projectName,
  status,
  scrapState,
  onClickScrapButton,
  onCardClick,
  isFinished,
}) => (
  <div
    className={`Bookmarks_main_right_container_box ${
      isFinished ? "Bookmarks_finishedProject_container" : ""
    }`}
    onClick={onCardClick}
  >
    <div
      className={`Bookmarks_main_right_container_box_img_wrapper ${
        isFinished ? "Bookmarks_finishedProjectImg" : ""
      }`}
      style={{ backgroundImage: `url(${imgSrc || mockImage})` }}
      onClick={onCardClick}
    >
      {isFinished && <div className="Bookmarks_overlay" />}
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

const MainRightContainer = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchBookmarkedProjects = async () => {
      try {
        const response = await axios.get(
          "${API_BASE_URL}/projects/bookmarked",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { activeProjects, finishedProjects, pendingProjects } =
          response.data;
        setBookmarks([
          ...activeProjects,
          ...pendingProjects,
          ...finishedProjects,
        ]);
      } catch (error) {
        console.error("Error fetching bookmarked projects:", error);
      }
    };

    if (user) {
      fetchBookmarkedProjects();
    }
  }, [user]);

  const toggleBookmark = async (projectId, index) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/projects/${projectId}/toggle-honey`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const updatedBookmarks = [...bookmarks];
        updatedBookmarks[index].scrapState =
          !updatedBookmarks[index].scrapState;
        setBookmarks(updatedBookmarks);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const scrapStateHandler = (index, projectId) => {
    toggleBookmark(projectId, index);
  };

  const pageChangeHandler = pageNumber => setActivePage(pageNumber);

  const totalItemsCount = bookmarks.length;
  const itemsCountPerPage = 10;

  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentItems = bookmarks.slice(indexOfFirstItem, indexOfLastItem);

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

  const onCardClick = id => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="Main_right_container">
      <div className="Main_right_container_writtenPosts">나의 꿀단지</div>
      <div className="Bookmarks_main_right_container_cards_wrapper">
        {currentItems.map((project, index) => {
          const globalIndex = indexOfFirstItem + index;
          const isFinished = project.status === "completed";
          return (
            <Card
              key={project.id}
              imgSrc={project.main_image}
              projectName={project.title}
              status={getStatusText(project.status)}
              scrapState={project.scrapState}
              onClickScrapButton={e => {
                e.stopPropagation();
                scrapStateHandler(globalIndex, project.id);
              }}
              onCardClick={() => onCardClick(project.id)}
              isFinished={isFinished}
            />
          );
        })}
      </div>
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
