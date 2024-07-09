// import React, { useState } from "react";
import "./Pagination.css";
import Paging from "react-js-pagination";
import rightArrow from "../../img/right_arrow.svg";

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
        <img className="pagination-right-arrow" src={rightArrow} alt="next" />
      }
      onChange={handlePageChange}
      firstPageText={null}
      lastPageText={null}
    />
  );
};

export default Pagination;
