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
}) => (
  <div className="Bookmarks_main_right_container_box" onClick={onCardClick}>
    <div
      className="Bookmarks_main_right_container_box_img_wrapper"
      style={{ backgroundImage: `url(${imgSrc || mockImage})` }}
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
  onCardClick,
}) => (
  <div
    className="Bookmarks_main_right_container_box Bookmarks_finishedProject_container"
    onClick={onCardClick}
  >
    <div
      className="Bookmarks_main_right_container_box_img_wrapper Bookmarks_finishedProjectImg"
      style={{ backgroundImage: `url(${imgSrc || mockImage})` }}
    >
      <div
        className="Bookmarks_honeyPot_img_wrapper"
        onClick={e => e.stopPropagation()}
      >
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
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [finishedBookmarks, setFinishedBookmarks] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarkedProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/projects/bookmarked",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { activeProjects, finishedProjects, pendingProjects } =
          response.data;
        setBookmarks([...activeProjects, ...pendingProjects]);
        setFinishedBookmarks(finishedProjects);
      } catch (error) {
        console.error("Error fetching bookmarked projects:", error);
      }
    };

    if (user) {
      fetchBookmarkedProjects();
    }
  }, [user]);

  const toggleBookmark = async (projectId, globalIndex, isFinished) => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/projects/${projectId}/toggle-honey`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        if (isFinished) {
          const updatedFinishedBookmarks = [...finishedBookmarks];
          updatedFinishedBookmarks[globalIndex].scrapState =
            !updatedFinishedBookmarks[globalIndex].scrapState;
          setFinishedBookmarks(updatedFinishedBookmarks);
        } else {
          const updatedBookmarks = [...bookmarks];
          updatedBookmarks[globalIndex].scrapState =
            !updatedBookmarks[globalIndex].scrapState;
          setBookmarks(updatedBookmarks);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const scrapStateHandler = (globalIndex, status, projectId, isFinished) => {
    toggleBookmark(projectId, globalIndex, isFinished);
  };

  const pageChangeHandler = pageNumber => setActivePage(pageNumber);

  const allBookmarks = bookmarks.concat(finishedBookmarks);
  const totalItemsCount = allBookmarks.length;
  const itemsCountPerPage = 10;

  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentItems = allBookmarks.slice(indexOfFirstItem, indexOfLastItem);

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
          const globalIndex = indexOfFirstItem + index; // 전체 목록에서의 인덱스 계산
          const isFinished = project.status === "completed";
          return isFinished ? (
            <FinishedProject
              key={project.id}
              imgSrc={project.main_image}
              projectName={project.title}
              status={getStatusText(project.status)}
              scrapState={project.scrapState}
              onClickScrapButton={e => {
                e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록
                scrapStateHandler(
                  globalIndex,
                  project.status,
                  project.id,
                  true
                );
              }}
              onCardClick={() => onCardClick(project.id)}
            />
          ) : (
            <Card
              key={project.id}
              imgSrc={project.main_image}
              projectName={project.title}
              status={getStatusText(project.status)}
              scrapState={project.scrapState}
              onClickScrapButton={e => {
                e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록
                scrapStateHandler(
                  globalIndex,
                  project.status,
                  project.id,
                  false
                );
              }}
              onCardClick={() => onCardClick(project.id)}
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
