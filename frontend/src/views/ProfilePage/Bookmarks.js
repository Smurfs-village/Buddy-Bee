import "./Bookmarks.css";
import { useState, useEffect } from "react";
import scrap_yes from "../../img/scrap_yes.svg";
import scrap_none from "../../img/scrap_none.svg";
import { FlowerImg } from "./Common";
import Pagination from "../../components/Common/Pagination";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

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
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [finishedBookmarks, setFinishedBookmarks] = useState([]);
  const [activePage, setActivePage] = useState(1);

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
        console.log("Fetched bookmarked projects:", response.data);
        const { activeProjects, finishedProjects, pendingProjects } =
          response.data;
        setBookmarks(activeProjects.concat(pendingProjects) || []);
        setFinishedBookmarks(finishedProjects || []);
      } catch (error) {
        console.error("Error fetching bookmarked projects:", error);
      }
    };

    if (user) {
      fetchBookmarkedProjects();
    }
  }, [user]);

  const toggleBookmark = async (projectId, currentIndex, isFinished) => {
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
          updatedFinishedBookmarks[currentIndex].scrapState =
            !updatedFinishedBookmarks[currentIndex].scrapState;
          setFinishedBookmarks(updatedFinishedBookmarks);
        } else {
          const updatedBookmarks = [...bookmarks];
          updatedBookmarks[currentIndex].scrapState =
            !updatedBookmarks[currentIndex].scrapState;
          setBookmarks(updatedBookmarks);
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const scrapStateHandler = (index, status, projectId, isFinished) => {
    toggleBookmark(projectId, index, isFinished);
  };

  const pageChangeHandler = pageNumber => setActivePage(pageNumber);

  const totalItemsCount = bookmarks.length + finishedBookmarks.length;
  const itemsCountPerPage = 10;

  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentItems = bookmarks.slice(indexOfFirstItem, indexOfLastItem);
  const currentFinishedItems = finishedBookmarks.slice(
    indexOfFirstItem,
    indexOfLastItem
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
      <div className="Main_right_container_writtenPosts">나의 꿀단지</div>
      <div className="Bookmarks_main_right_container_cards_wrapper">
        {currentItems.map((project, index) => (
          <Card
            key={project.id}
            imgSrc={project.main_image}
            projectName={project.title}
            status={getStatusText(project.status)}
            scrapState={project.scrapState}
            onClickScrapButton={() =>
              scrapStateHandler(index, project.status, project.id, false)
            }
          />
        ))}
        {currentFinishedItems.map((project, index) => (
          <FinishedProject
            key={project.id}
            imgSrc={project.main_image}
            projectName={project.title}
            status={getStatusText(project.status)}
            scrapState={project.scrapState}
            onClickScrapButton={() =>
              scrapStateHandler(index, project.status, project.id, true)
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
