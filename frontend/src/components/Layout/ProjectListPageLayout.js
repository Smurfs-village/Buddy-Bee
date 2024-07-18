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
  const [sortBtn, setSortBtn] = useState("latest");
  const [sortedCardList, setSortedCardList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [filterItem, setFilterItem] = useState(false);
  const location = useLocation();
  const [title, setTitle] = useState("전체");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = new URLSearchParams(location.search).get("query");
        // 검색어 입력했을 때 결과를 보여줍니다.
        setTitle(`${query} 검색결과`);
        const response = query
          ? await axios.get(
              `http://localhost:5001/api/projects/search?query=${query}`
            )
          : await axios.get("http://localhost:5001/api/projects");

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
  }, [sortBtn, cards, filterItem]);

  useEffect(() => {
    switch (filterItem) {
      case "with": {
        setTitle("버디비_동행");
        break;
      }
      case "funding": {
        setTitle("버디비_펀딩");
        break;
      }
      default: {
        setTitle("전체");
        break;
      }
    }
  }, [filterItem]);

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

  return (
    <div className="project-list-page-layout">
      <BackGroundGrid>
        <SubNav setFilterItem={setFilterItem} filterItem={filterItem} />
        <PageLayout>
          <div className="project-list-page-layout-wrapper">
            <div className="project-list-page-layout-line1">
              <h1>#{title}</h1>
              <div className="project-list-btn-wrapper">
                <button
                  className={`sort-latest ${
                    sortBtn === "latest" ? "btn-sort-true" : ""
                  }`}
                  onClick={() => setSortBtn("latest")}
                >
                  최신순
                </button>
                <button
                  className={`sort-popularity ${
                    sortBtn === "popularity" ? "btn-sort-true" : ""
                  }`}
                  onClick={() => setSortBtn("popularity")}
                >
                  인기순
                </button>
              </div>
            </div>
            <div className="project-list-page-layout-grid">
              {!filterItem
                ? currentItems.map((data, index) => (
                    <ListCard
                      key={index}
                      data={data}
                      index={index}
                      type={data.type}
                      toggleScrap={toggleScrap}
                    />
                  ))
                : filterItem === "with"
                ? currentItems
                    .filter(item => item.type === "with")
                    .map((data, index) => (
                      <ListCard
                        key={index}
                        data={data}
                        index={index}
                        type={data.type}
                        toggleScrap={toggleScrap}
                      />
                    ))
                : filterItem === "funding"
                ? currentItems
                    .filter(item => item.type === "funding")
                    .map((data, index) => (
                      <ListCard
                        key={index}
                        data={data}
                        index={index}
                        type={data.type}
                        toggleScrap={toggleScrap}
                      />
                    ))
                : alert("error")}
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
