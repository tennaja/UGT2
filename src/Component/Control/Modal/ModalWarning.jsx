import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import WarningImg from "../../assets/warning.png";

const ModalWarning = (props) => {
  const {
    onClickOk,
    title = "Warning!",
    content = "Your transaction has failed. Please go back and try again",
  } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" id="oop-modal">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div className="md:col-span-6 rounded-full rounded mx-auto flex items-center justify-center h-16 w-20  ">
              <img
                type="file"
                id="preview_img"
                className="h-20 w-20 object-cover rounded-full flex items-center justify-center"
                src={WarningImg}
                alt="Current profile photo"
              />
            </div>

            <div className="mt-3 text-center sm:mt-4">
              <h6
                className="text-2xl leading-6 font-bold text-[#071437] "
                id="modal-headline"
              >
                {title}
              </h6>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {content}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              onClick={onClickOk}
              className="inline-flex justify-center w-full rounded  border border-transparent shadow-sm px-4 py-2 bg-[#EF4835] text-base font-medium text-white hover:bg-[#78829D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWarning;
