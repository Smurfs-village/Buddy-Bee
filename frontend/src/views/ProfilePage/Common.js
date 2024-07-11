import "./Common.css";
import myPageflowerImg from "../../img/myPage_flower.svg";
import Paging from "react-js-pagination";
import rightArrow from "../../img/right_arrow.svg";

export const FlowerImg = () => {
    return (
        <img
            src={myPageflowerImg}
            alt=""
            className="ProfilePage_main_right_container_flowerImg"
        />
    );
};

const Pagination = ({
    totalItemsCount,
    handlePageChange,
    activePage,
    itemsCountPerPage,
    pageRangeDisplayed,
}) => {
    return (
        <Paging
            activePage={activePage}
            itemsCountPerPage={itemsCountPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={pageRangeDisplayed}
            prevPageText={null}
            nextPageText={
                <img
                    className="pagination-right-arrow"
                    src={rightArrow}
                    alt="next"
                />
            }
            onChange={handlePageChange}
            firstPageText={null}
            lastPageText={null}
        />
    );
};

export default Pagination;
