import { useEffect, useState } from "react";
import axios from "axios";
import BackGroundGrid from "./BackGroundGrid";
import PageLayout from "./PageLayout";
import "./ProjectListPageLayout.css";
import ListCard from "../Common/ListCard";
import Pagination from "../Common/Pagination";
import SubNav from "./SubNav";
import { useLocation } from "react-router-dom";

const ProjectListPageLayout = () => {
  const [cards, setCards] = useState([]);
  const [sortBtn, setSortBtn] = useState(
    localStorage.getItem("sortBtn") || "latest"
  );
  const [sortedCardList, setSortedCardList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const location = useLocation();
  const [title, setTitle] = useState("전체");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query =
          new URLSearchParams(location.search).get("query") || "전체";
        setTitle(`${query} 검색결과`);
        const response = await axios.get(
          `${API_BASE_URL}/projects/search?query=${query}`
        );

        const activeProjects = response.data.filter(
          project => project.status === "active"
        );

        setCards(activeProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [location.search]);

  useEffect(() => {
    const sortCompare = (a, b) => {
      if (sortBtn === "latest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBtn === "popularity") {
        return b.view_count - a.view_count;
      }
    };

    const copyCardList = [...cards];
    copyCardList.sort(sortCompare);
    setSortedCardList(copyCardList);
  }, [sortBtn, cards]);

  const toggleScrap = (index, type) => {
    const updatedCards = [...sortedCardList];
    updatedCards[index].scrap = !updatedCards[index].scrap;
    setCards(updatedCards);
  };

  const itemsCountPerPage = 25;
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentItems = sortedCardList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = pageNumber => {
    setActivePage(pageNumber);
  };

  const containerClassName = () => {
    if (currentItems.length === 1)
      return "project-list-page-layout single-item";
    if (currentItems.length === 2) return "project-list-page-layout few-items";
    if (currentItems.length === 3)
      return "project-list-page-layout three-items";
    if (currentItems.length === 4) return "project-list-page-layout four-items";
    return "project-list-page-layout";
  };

  const handleSortChange = sortType => {
    setSortBtn(sortType);
    localStorage.setItem("sortBtn", sortType);
  };

  return (
    <div className={containerClassName()}>
      <BackGroundGrid>
        <SubNav />
        <PageLayout>
          <div className="project-list-page-layout-wrapper">
            <div className="project-list-page-layout-line1">
              <h1>#{title}</h1>
              <div className="project-list-btn-wrapper">
                <button
                  className={`sort-latest ${
                    sortBtn === "latest" ? "btn-sort-true" : ""
                  }`}
                  onClick={() => handleSortChange("latest")}
                >
                  최신순
                </button>
                <button
                  className={`sort-popularity ${
                    sortBtn === "popularity" ? "btn-sort-true" : ""
                  }`}
                  onClick={() => handleSortChange("popularity")}
                >
                  인기순
                </button>
              </div>
            </div>
            <div className="project-list-page-layout-grid">
              {currentItems.map((data, index) => (
                <ListCard
                  key={index}
                  data={data}
                  index={index}
                  type={data.type}
                  toggleScrap={toggleScrap}
                />
              ))}
            </div>
            <Pagination
              totalItemsCount={sortedCardList.length}
              activePage={activePage}
              itemsCountPerPage={itemsCountPerPage}
              pageRangeDisplayed={5}
              handlePageChange={handlePageChange}
            />
          </div>
        </PageLayout>
      </BackGroundGrid>
    </div>
  );
};

export default ProjectListPageLayout;
