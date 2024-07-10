import { useEffect, useState } from "react";
import axios from "axios";
import BackGroundGrid from "./BackGroundGrid";
import PageLayout from "./PageLayout";
import "./ProjectListPageLayout.css";
import ListCard from "../Common/ListCard";
import Pagination from "../Common/Pagination";
import SubNav from "./SubNav";

const ProjectListPageLayout = () => {
  const [cards, setCards] = useState([]);
  const [sortBtn, setSortBtn] = useState("latest"); //초깃값 최신순으로 정렬
  const [sortedCardList, setSortedCardList] = useState([]); //정렬한 값 담는 배열
  const [activePage, setActivePage] = useState(1); //초기 페이지 값 세팅
  const [filterItem, setFilterItem] = useState(false); //초깃값 동행

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/projects");
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const sortCompare = (a, b) => {
      if (sortBtn === "latest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBtn === "popularity") {
        return b.views - a.views;
      }
    };

    const copyCardList = [...cards];
    copyCardList.sort(sortCompare);
    setSortedCardList(copyCardList);
  }, [sortBtn, cards, filterItem]);

  const toggleScrap = (index, type) => {
    const updatedCards = [...sortedCardList];
    updatedCards[index].scrap = !updatedCards[index].scrap;
    setCards(updatedCards);
  };

  //한 페이지당 보여줄 아이템 수
  const itemsCountPerPage = 25;

  // 현재 페이지에 보여줄 아이템들을 계산
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
              <h1>#동행 모집</h1>
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
            {/* 페이지네이션 부분 */}
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
