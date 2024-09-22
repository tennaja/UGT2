import React, { useState,useEffect } from "react";
import right from "../assets/right.svg";
import down from "../assets/down.svg";
import { FaTrashAlt } from "react-icons/fa";

const CollapsSubscriberEdit = ({
  title,
  total,
  children,
  onClickEditBtn,
  onClickDeleteBtn,
  isShowDelete = true,
  isDefaultShow
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [istoggleIcon, setIstoggleIcon] = useState(right);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    istoggleIcon == down ? setIstoggleIcon(right) : setIstoggleIcon(down);
  };

  useEffect(()=>{
    console.log("Show",isCollapsed)
    if(isDefaultShow === true){
       toggleCollapse()
    }

  },[isDefaultShow])
  return (
    <div className="">
      <div
        className="grid grid-cols-3 bg-MAIN_SCREEN_BG flex items-center  px-5 py-2 cursor-pointer"
        onClick={toggleCollapse}
      >
        <div className="flex justify-between px-4">
          <div>
            <h2 className="text-sm mb-0 pl-4 font-semibold">{title}</h2>
          </div>
          <div className="flex items-center">
            <h2 className="text-lg mb-0 mr-5">
              <img
                src={istoggleIcon}
                alt="React Logo"
                width={20}
                height={20}
                className={"text-white mr-2"}
              />
            </h2>
          </div>
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
          {isShowDelete === true?<FaTrashAlt
            className="hover:text-red-500
            text-BREAD_CRUMB"
            size={20}
            onClick={onClickDeleteBtn}
          />:undefined}
        </div>
        {/* <span className="text-sm">{isCollapsed ? "Expand" : "Collapse"}</span> */}
      </div>
      {!isCollapsed && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};

export default CollapsSubscriberEdit;
