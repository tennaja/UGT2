import { useState, useEffect } from "react";
import AlmostDone from "../assets/done.png";
import { Link, useNavigate } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import { getCookie, removeCookie, setCookie } from "../../Utils/FuncUtils";
import { setSelectedSubMenu } from "../../Redux/Menu/Action";
import { useDispatch, useSelector } from "react-redux";
import { clearModal } from "../../Redux/Subscriber/Action";
import ImgDone from "../assets/Imgdone.png"

const ModalCompleteSubscriber = (props) => {
  const dispatch = useDispatch();

  const { title = "Almost Done!", context = "Complete", link } = props;
  const navigate = useNavigate();
  const onClickOk = () => {
    dispatch(setSelectedSubMenu(1));
    setCookie("currentSubmenu", 1);
    dispatch(clearModal());
    navigate(`${link}`);
    //window.location.reload()
  };
  return (
    <>
      <>
        <div className="fixed z-10 inset-0 overflow-y-auto sm:mt-[25%] md:mt-[13%]">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-10">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>

            <div
              className="inline-block rounded align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div>
                <div className="md:col-span-6 rounded-full rounded mx-auto flex items-center justify-center h-20 w-20  bg-[#ffffff]">
                  <img
                    type="file"
                    id="preview_img"
                    className="h-16 w-56 object-cover rounded-full flex items-center justify-center"
                    src={ImgDone}
                    alt="done photo"
                  />
                </div>

                <div className="md:col-span-6 mt-4 text-center sm:mt-4">
                  {/*<h6
                    className="text-2xl leading-6 font-bold text-[#071437] "
                    id="modal-headline"
                  >
                    {context}
                  </h6>*/}
                 <div className="mt-4">
                    <p className="text-2xl leading-6 font-bold text-[#071437] ">{context}</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid gap-1 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                  <div className="md:col-span-6 mt-1 sm:mt-6">
                    <button
                      onClick={() => {
                        onClickOk();
                      }}
                      className="inline-flex justify-center w-full rounded  border border-transparent shadow-sm px-4 py-2 bg-[#87BE33] text-base font-medium text-[#fafbf9] hover:bg-[#c3c5cb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                      // onClick={handleSubmit(() => onSubmitDavice({}))}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default ModalCompleteSubscriber;
