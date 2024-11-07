import React, { useState } from "react";
import right from "../assets/right.svg";
import down from "../assets/down.svg";
import { FaTrashAlt } from "react-icons/fa";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const CollapsInfoSubscriberEdit = ({
  title,
  total,
  children,
  onClickEditBtn,
  onClickDeleteBtn,
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
        className="grid grid-cols-[400px_260px_200px] bg-MAIN_SCREEN_BG items-center  px-4 py-2 cursor-pointer"
        onClick={toggleCollapse}
      >
        
        <div className="grid grid-cols-[60px_300px] px-4 ">
        <div className="mb-0 col-start-1">
            {isCollapsed ? <IoChevronDown /> : <IoChevronUp />}
          </div>
          <div className=" col-start-2">
            <h2 className="text-sm mb-0 pl-4 font-semibold break-all">{title}</h2>
          </div>
          {/*<div className="flex items-center">
            <h2 className="text-lg mb-0 mr-5">
              <img
                src={istoggleIcon}
                alt="React Logo"
                width={20}
                height={20}
                className={"text-white mr-2"}
              />
            </h2>
          </div>*/}
        </div>
        <div>
          <h2 className="text-sm mb-0 pl-4 text-center font-semibold ">
            {total}
          </h2>
        </div>
        <div className="flex justify-end items-center gap-3">
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
          
        </div>
        {/* <span className="text-sm">{isCollapsed ? "Expand" : "Collapse"}</span> */}
      </div>
      {!isCollapsed && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};

export default CollapsInfoSubscriberEdit;
