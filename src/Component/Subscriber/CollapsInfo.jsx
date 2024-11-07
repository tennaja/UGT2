import React, { useState } from "react";
import right from "../assets/right.svg";
import down from "../assets/down.svg";
import { FaTrashAlt } from "react-icons/fa";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const CollapsInfo = ({
  title,
  total,
  children,
  onClickEditBtn,
  onClickDeleteBtn,
  isShowEdit
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [istoggleIcon, setIstoggleIcon] = useState(right);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    istoggleIcon == down ? setIstoggleIcon(right) : setIstoggleIcon(down);
  };
  return (
    <div className="">
      <div
        className="grid grid-cols-[150px_minmax(200px,_1fr)_50px] bg-MAIN_SCREEN_BG items-center  cursor-pointer"
        onClick={toggleCollapse}
      >
        <div className="flex p-3">
          <div>
            <h2 className="text-sm mb-0 font-semibold text-left">{title}</h2>
          </div>
          
        </div>
        <div className="col-start-2">
            <div className="ml-24 items-center">
            <h2 className="ml-20 text-sm mb-0 text-center font-semibold ">
            {total}
          </h2>
            </div>
        </div>
        <div className="grid grid-cols-3">
          
          <div className="col-start-1 mb-0 mr-5">
          {isCollapsed ? <IoChevronDown /> : <IoChevronUp />}
                </div>
        </div>
        
        {isShowEdit&&<div className="flex justify-end items-center gap-3">
          <button
            onClick={onClickEditBtn}
            type="button"
            className="h-10 px-4 mr-4 rounded duration-150 border-2 text-BREAD_CRUMB border-BREAD_CRUMB bg-LIGHT_BUTTON hover:bg-BREAD_CRUMB hover:text-MAIN_SCREEN_BG"
          >
            Edit
          </button>
          <FaTrashAlt
            className="hover:text-red-500
            text-BREAD_CRUMB"
            size={20}
            onClick={onClickDeleteBtn}
          />
        </div>}
        {/* <span className="text-sm">{isCollapsed ? "Expand" : "Collapse"}</span> */}
      </div>
      {!isCollapsed && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};

export default CollapsInfo;
