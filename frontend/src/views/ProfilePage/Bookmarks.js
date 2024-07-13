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

  const scrapStateHandler = (index, status) => {
    if (status === "진행중" || status === "대기중") {
      const updatedBookmarks = [...bookmarks];
      updatedBookmarks[index].scrapState = !updatedBookmarks[index].scrapState;
      setBookmarks(updatedBookmarks);
    } else if (status === "종료") {
      const updatedFinishedBookmarks = [...finishedBookmarks];
      updatedFinishedBookmarks[index].scrapState =
        !updatedFinishedBookmarks[index].scrapState;
      setFinishedBookmarks(updatedFinishedBookmarks);
    }
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
            onClickScrapButton={() => scrapStateHandler(index, project.status)}
          />
        ))}
        {currentFinishedItems.map((project, index) => (
          <FinishedProject
            key={project.id}
            imgSrc={project.main_image}
            projectName={project.title}
            status={getStatusText(project.status)}
            scrapState={project.scrapState}
            onClickScrapButton={() => scrapStateHandler(index, project.status)}
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
