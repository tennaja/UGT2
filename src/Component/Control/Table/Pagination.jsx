import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSelector} from "react-redux";

import './Pagination.css'
// Example items, to simulate fetching from another resources.

const PaginatedItems = (props) => {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const { itemsPerPage,handlePageClick,totalData=0 ,changepage} = props
  // const [itemOffset, setItemOffset] = useState(0);
  const [pageSelected,setPageSelected] = useState(0)
  const currentUGTGroup = useSelector((state) => state.menu.currentUGTGroup);


  useEffect(()=>{
    setPageSelected(0) //set page selected to 1 when user change ugt group
  },[currentUGTGroup])

  useEffect(()=>{
    setPageSelected(0) //set page selected to 1 when total data in change
  },[changepage])
  

  const numberPage = Math.ceil(totalData/itemsPerPage)>0 ? Math.ceil(totalData/itemsPerPage) : 1
  return (
    <>
         {/* <button onClick={()=>    setPageSelected(0)
}>Reset to Page 0</button> */}

      {/* <Items currentItems={currentItems} /> */}
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        pageClassName="page-item "
        pageLinkClassName="page-link "
        previousClassName="page-item "
        previousLinkClassName="page-link "
        nextClassName="page-item "
        nextLinkClassName="page-link "
        activeLinkClassName=""
        breakLabel="..."
        breakClassName="page-item "
        breakLinkClassName="page-link "
        pageCount={numberPage}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(event)=>{
          setPageSelected(event.selected)
          handlePageClick&&handlePageClick(event)
        }}
        containerClassName="pagination"
        activeClassName="active "
        // initialPage={0} // Set the initial page
        // onPageChange={()=>{cons}}
        forcePage={pageSelected}
      />
    </>
  );
}

export default PaginatedItems

// Add a <div id="container"> to your HTML to see the component rendered.
