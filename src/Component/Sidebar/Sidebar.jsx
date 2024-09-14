import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import UGTLogo from "../assets/UGT-Logo.png";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchMenuList,
  FetchSubMenuList,
  setOpenMenu,
  setSelectedMonth,
  setSelectedSubMenu,
  setSelectedYear,
} from "../../Redux/Menu/Action";

import { getCookie, removeCookie, setCookie } from "../../Utils/FuncUtils";
import { MENU_ID, SUB_MENU_ID, USER_GROUP_ID } from "../../Constants/Constants";

import submenuDeviceLogo from "../assets/submenu-device-logo.svg";
import submenuDeviceLogoSelected from "../assets/submenu-device-logo-selected.svg";

import addLogo from "../assets/add.svg";
import addLogoSelected from "../assets/add_selected.svg";

import deviceLogo from "../assets/device.svg";
import deviceLogoSelected from "../assets/device_selected.svg";

import subscriberLogo from "../assets/3-user.svg";
import subscriberLogoSelected from "../assets/3-user_selected.svg";

import portfolioLogo from "../assets/graph.svg";
import portfolioLogoSelected from "../assets/graph_selected.svg";

import dashboardLogo from "../assets/activity.svg";
import dashboardLogoSelected from "../assets/activity_selected.svg";

import eacTrackingLogo from "../assets/shield-done.svg";
import eacTrackingLogoSelected from "../assets/shield_done_selected.svg";
import issuanceLogo from "../assets/shield-done.svg";
import issuanceLogoSelected from "../assets/shield_done_selected.svg";
import * as WEB_URL from "../../Constants/WebURL";

import SubscriberLOGO01 from "../assets/3-User-submenu.svg";
import SubscriberLOGO01Selected from "../assets/3-User-submenu_selected.svg";

import SubscriberLOGO02 from "../assets/Add-User-submenu.svg";
import SubscriberLOGO02Selected from "../assets/Add-User-submenu_selected.svg";

import EacTrackingLOGO01 from "../assets/chart-submenu.svg";
import EacTrackingLOGO01Selected from "../assets/chart-submenu-selected.svg";

import EacTrackingLOGO02 from "../assets/send-submenu.svg";
import EacTrackingLOGO02Selected from "../assets/send-submenu-selected.svg";

import EacTrackingLOGO03 from "../assets/upload-submenu.svg";
import EacTrackingLOGO03Selected from "../assets/upload-submenu-selected.svg";

import EacTrackingLOGO04 from "../assets/ticket-submenu.svg";
import EacTrackingLOGO04Selected from "../assets/ticket-submenu-selected.svg";

import EacTrackingLOGO05 from "../assets/file-submenu.svg";
import EacTrackingLOGO05Selected from "../assets/file-submenu-selected.svg";
import submenuPortfolioLogoAdd from "../assets/pieplus.svg";
import submenuPortfolioLogoAddSelected from "../assets/pieplus_selected.svg";

import submenuPortfolioLogoInfo from "../assets/graphInfo.svg";
import submenuPortfolioLogoInfoSelected from "../assets/graphInfo_selected.svg";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";
import { set } from "lodash";
// const initMainMenu = 5;
// const initSubMenu = 1; // Info

const Sidebar2 = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchesLarge = useMediaQuery("(min-width: 1024px)");
  const menuList = useSelector((state) => state.menu.menuList);
  const currentSubMenuList = useSelector((state) => state.menu.subMenuList);
  const selectedSubMenu = useSelector((state) => state.menu.selectedSubMenu);
  const userData = useSelector((state) => state.login.userobj);
  const openMenu = useSelector((state) => state.menu.openMenu);
  const [open, setOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [selectedMenuID, setSelectedMenuID] = useState(1);
  const [defaultSubMenuID, setDefaultSubMenuID] = useState(1);
  const [submenu, setSubmenu] = useState([]);
  const [mainMenu, setMainMenu] = useState([]);

  const setDefaultMenu = (userData) => {
    let userGroupID = userData?.userGroup?.id;
    let defaultMenu = null;
    let defaultSubmenu = null;
    if (
      userGroupID == USER_GROUP_ID.MEA_DEVICE_MNG ||
      userGroupID == USER_GROUP_ID.EGAT_DEVICE_MNG ||
      userGroupID == USER_GROUP_ID.PEA_DEVICE_MNG || 
      userGroupID == USER_GROUP_ID.UGT_REGISTANT_VERIFIER || 
      userGroupID == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY 
    ) {
      defaultMenu = MENU_ID.DEVICE;
      defaultSubmenu = SUB_MENU_ID.DEVICE_LIST_INFO;
    } else if (
      userGroupID == USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
      userGroupID == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
      userGroupID == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
    ) {
      defaultMenu = MENU_ID.SUBSCRIBER;
      defaultSubmenu = SUB_MENU_ID.SUBSCRIBER_LIST_INFO;
    } else if (userGroupID == USER_GROUP_ID.PORTFOLIO_MNG) {
      defaultMenu = MENU_ID.PORTFOLIO;
      defaultSubmenu = SUB_MENU_ID.PORTFOLIO_LIST_INFO;
    } else if (userGroupID == USER_GROUP_ID.ALL_MODULE_VIEWER) {
      defaultMenu = MENU_ID.DEVICE;
      defaultSubmenu = SUB_MENU_ID.DEVICE_LIST_INFO;
    } else {
      defaultMenu = MENU_ID.DEVICE;
      defaultSubmenu = SUB_MENU_ID.DEVICE_LIST_INFO;
    }
    setSelectedMenuID(defaultMenu);
    setDefaultSubMenuID(defaultSubmenu);
  };

  useEffect(() => {
    const currentMainmenu = getCookie("currentMainmenu");

    if (currentMainmenu) {
      setCookie("currentMainmenu", currentMainmenu);
      setSelectedMenuID(currentMainmenu);
    } else {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setDefaultMenu(userData);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(FetchMenuList());
    initAndSetSubMenu();
    const widthScreen = window.innerWidth;
    //1024 is min desktop width
    if (widthScreen < 1024) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (matchesLarge) {
      setOpen(true);
      dispatch(setOpenMenu(true));
    } else {
      // setOpen(false);
      dispatch(setOpenMenu(false));
    }
  }, [matchesLarge]);

  useEffect(() => {
    if (openMenu) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [openMenu]);

  useEffect(() => {
    dispatch(FetchSubMenuList(selectedMenuID));
  }, [selectedMenuID]);

  useEffect(() => {
    if (selectedMenuID) {
      setSelectedMenu(
        // menuList[selectedMenuID - 1]?.name.toUpperCase() + " MANAGEMENT"
        menuList[selectedMenuID - 2]?.name.toUpperCase() + " MANAGEMENT" // ไม่เอา DASHBOARD
      );
    }
  }, [selectedMenuID, menuList]);

  useEffect(() => {
    // device = menuID [2,3]
    // subscriber = menuID [2,3]
    // module viewer = menuID [2,3,4]
    // portfolio = menuID [2,3,4,5]

    if (menuList?.length > 0) {
      let data = menuList;
      if (
        userData?.userGroup?.id !== USER_GROUP_ID?.PORTFOLIO_MNG &&
        userData?.userGroup?.id !== USER_GROUP_ID?.ALL_MODULE_VIEWER
      ) {
        data = data.filter(
          (item) => item.menuId !== "4" && item.menuId !== "5"
        );
        setMainMenu(data);
      } else {
        if (userData?.userGroup?.id == USER_GROUP_ID?.ALL_MODULE_VIEWER) {
          data = data.filter((item) => item.menuId !== "5");
          setMainMenu(data);
        } else {
          setMainMenu(menuList);
        }
      }
    }
  }, [menuList]);

  useEffect(() => {
    if (currentSubMenuList?.length > 0) {
      if (selectedMenuID == 2) {
        if (
          userData?.userGroup?.id !== USER_GROUP_ID?.EGAT_DEVICE_MNG &&
          userData?.userGroup?.id !== USER_GROUP_ID?.MEA_DEVICE_MNG &&
          userData?.userGroup?.id !== USER_GROUP_ID?.PEA_DEVICE_MNG &&
          userData?.userGroup?.id !== USER_GROUP_ID?.UGT_REGISTANT_VERIFIER &&
          userData?.userGroup?.id !== USER_GROUP_ID?.UGT_REGISTANT_SIGNATORY 
        ) {
          let data = currentSubMenuList;
          data = data.filter((item) => item.id !== 2);
          setSubmenu(data);
        } else {
          setSubmenu(currentSubMenuList);
        }
      }
      if (selectedMenuID == 3) {
        if (
          userData?.userGroup?.id !== USER_GROUP_ID.EGAT_SUBSCRIBER_MNG &&
          userData?.userGroup?.id !== USER_GROUP_ID.MEA_SUBSCRIBER_MNG &&
          userData?.userGroup?.id !== USER_GROUP_ID.PEA_SUBSCRIBER_MNG
        ) {
          let data = currentSubMenuList;
          data = data.filter((item) => item.id !== 2);
          setSubmenu(data);
        } else {
          setSubmenu(currentSubMenuList);
        }
      }
      if (selectedMenuID == 4) {
        if (userData?.userGroup?.id == USER_GROUP_ID.ALL_MODULE_VIEWER) {
          let data = currentSubMenuList;
          data = data.filter((item) => item.id !== 2);
          setSubmenu(data);
        } else {
          setSubmenu(currentSubMenuList);
        }
      }
      if (selectedMenuID == 5) {
        setSubmenu(currentSubMenuList);
      }
    }
  }, [currentSubMenuList]);

  const initAndSetSubMenu = () => {
    const currentSubmenu = getCookie("currentSubmenu");
    if (currentSubmenu) {
      setCookie("currentSubmenu", currentSubmenu);
      dispatch(setSelectedSubMenu(currentSubmenu));
    } else {
      dispatch(setSelectedSubMenu(defaultSubMenuID));
      setCookie("currentSubmenu", defaultSubMenuID);
    }
  };

  const getPath = (submenuID) => {
    let path = "#";
    if (selectedMenuID == MENU_ID.DEVICE) {
      switch (submenuID) {
        case 1:
          path = WEB_URL.DEVICE_LIST;
          break;
        case 2:
          path = WEB_URL.DEVICE_ADD;
          break;
      }
    } else if (selectedMenuID == MENU_ID.SUBSCRIBER) {
      switch (submenuID) {
        case 1:
          path = WEB_URL.SUBSCRIBER_LIST;
          break;
        case 2:
          path = WEB_URL.SUBSCRIBER_ADD;
          break;
      }
    } else if (selectedMenuID == MENU_ID.PORTFOLIO) {
      switch (submenuID) {
        case 1:
          path = WEB_URL.PORTFOLIO_LIST;
          break;
        case 2:
          path = WEB_URL.PORTFOLIO_ADD;
          break;
      }
    } else if (selectedMenuID == MENU_ID.EAC_TRACKING) {
      switch (submenuID) {
        case 1:
          path = WEB_URL.EAC_INFO;
          break;
        case 2:
          path = WEB_URL.EAC_ISSUE;
          break;
        case 3:
          path = WEB_URL.EAC_TRANSFER;
          break;
        case 4:
          path = WEB_URL.EAC_REDEMPTION;
          break;
      }
    }
    return path;
  };

  const onCLickMenuList = (id) => {
    console.log("onClickMenuList", id);
    console.log("selectedMenuID", selectedMenuID);
    if (id == selectedMenuID) {
      setOpen(!open);
      // dispatch(setOpenMenu(!open));
    } else {
      setOpen(true);
      dispatch(setOpenMenu(true));

      // ถ้าย้าย mainmenu ให้เซ็ตเป็น default ใหม่
      dispatch(setSelectedYear(dayjs().year()));
      dispatch(setSelectedMonth(dayjs().month() + 1));
    }

    if (id) {
      setSelectedMenuID(id);
      setCookie("currentMainmenu", id);

      const currentSubmenu = getCookie("currentSubmenu");
      if (id != selectedMenuID) {
        onClickSubmenu(1);
        if (id == 2) {
          navigate(WEB_URL.DEVICE_LIST);
        } else if (id == 3) {
          navigate(WEB_URL.SUBSCRIBER_LIST);
        } else if (id == 4) {
          navigate(WEB_URL.PORTFOLIO_LIST);
        } else if (id == 5) {
          navigate(WEB_URL.EAC_INFO);
        }
      } else {
        // onClickSubmenu(currentSubmenu);
        // navigate(getPath(currentSubmenu));
      }
    }
  };

  const onClickSubmenu = (submenuID) => {
    let currentSubmenu = getCookie("currentSubmenu");
    if (currentSubmenu != submenuID) {
      // ถ้าย้าย submenu ให้เซ็ตเป็น default ใหม่
      dispatch(setSelectedYear(dayjs().year()));
      dispatch(setSelectedMonth(dayjs().month() + 1));
      dispatch(setSelectedSubMenu(submenuID));
      setCookie("currentSubmenu", submenuID);
    }
  };

  const getMenuLogoImg = (menuId) => {
    let logo = null;

    if (menuId == MENU_ID.DASH_BOARD) {
      if (selectedMenuID == menuId) {
        logo = dashboardLogoSelected;
      } else {
        logo = dashboardLogo;
      }
    } else if (menuId == MENU_ID.DEVICE) {
      if (selectedMenuID == menuId) {
        logo = deviceLogoSelected;
      } else logo = deviceLogo;
    } else if (menuId == MENU_ID.SUBSCRIBER) {
      if (selectedMenuID == menuId) {
        logo = subscriberLogoSelected;
      } else logo = subscriberLogo;
    } else if (menuId == MENU_ID.PORTFOLIO) {
      if (selectedMenuID == menuId) {
        logo = portfolioLogoSelected;
      } else logo = portfolioLogo;
    } else if (menuId == MENU_ID.ISSUANCE) {
      if (selectedMenuID == menuId) {
        logo = issuanceLogoSelected;
      } else logo = issuanceLogo;
    } else if (menuId == MENU_ID.EAC_TRACKING) {
      if (selectedMenuID == menuId) {
        logo = eacTrackingLogoSelected;
      } else logo = eacTrackingLogo;
    }

    return logo;
  };
  const getSubmenuLogoImg = (submenuId) => {
    let logo = null;
    if (selectedMenuID == MENU_ID.DEVICE) {
      switch (submenuId) {
        case 1:
          if (selectedSubMenu == submenuId) {
            logo = submenuDeviceLogoSelected;
          } else {
            logo = submenuDeviceLogo;
          }
          break;
        case 2:
          if (selectedSubMenu == submenuId) {
            logo = addLogoSelected;
          } else {
            logo = addLogo;
          }
          break;
      }
    } else if (selectedMenuID == MENU_ID.SUBSCRIBER) {
      switch (submenuId) {
        case 1:
          if (selectedSubMenu == submenuId) {
            logo = SubscriberLOGO01Selected;
          } else {
            logo = SubscriberLOGO01;
          }
          break;
        case 2:
          if (selectedSubMenu == submenuId) {
            logo = SubscriberLOGO02Selected;
          } else {
            logo = SubscriberLOGO02;
          }
          break;
      }
    } else if (selectedMenuID == MENU_ID.PORTFOLIO) {
      switch (submenuId) {
        case 1:
          if (selectedSubMenu == submenuId) {
            logo = submenuPortfolioLogoInfoSelected;
          } else {
            logo = submenuPortfolioLogoInfo;
          }
          break;
        case 2:
          if (selectedSubMenu == submenuId) {
            logo = submenuPortfolioLogoAddSelected;
          } else {
            logo = submenuPortfolioLogoAdd;
          }
          break;
      }
    } else if (selectedMenuID == MENU_ID.EAC_TRACKING) {
      switch (submenuId) {
        case 1:
          if (selectedSubMenu == submenuId) {
            logo = EacTrackingLOGO01Selected;
          } else {
            logo = EacTrackingLOGO01;
          }
          break;
        case 2:
          if (selectedSubMenu == submenuId) {
            logo = EacTrackingLOGO02Selected;
          } else {
            logo = EacTrackingLOGO02;
          }
          break;
        case 3:
          if (selectedSubMenu == submenuId) {
            logo = EacTrackingLOGO03Selected;
          } else {
            logo = EacTrackingLOGO03;
          }
          break;
        case 4:
          if (selectedSubMenu == submenuId) {
            logo = EacTrackingLOGO04Selected;
          } else {
            logo = EacTrackingLOGO04;
          }
          break;
        case 5:
          if (selectedSubMenu == submenuId) {
            logo = EacTrackingLOGO05Selected;
          } else {
            logo = EacTrackingLOGO05;
          }
          break;
      }
    }
    return logo;
  };

  return (
    <div className="flex w-full">
      {openMenu && (
        <div className="bg-[#071437] lg:flex lg:flex-col  xs:w-3/12 xs:h-128 w-24">
          <div className="flex justify-center">
            <img
              alt={"ig"}
              src={UGTLogo}
              width={60}
              height={60}
              className="ml-2"
            ></img>
          </div>

          <hr className="border-1 border-solid border-slate-400 mt-0" />

          {mainMenu?.map((menu, index) => {
            return (
              <>
                <div
                  onClick={() => {
                    onCLickMenuList(menu.menuId);
                  }}
                  key={index}
                  className="cursor-pointer flex flex-col justify-center  gap-x-4 items-center p-2"
                >
                  <img
                    alt={"ig"}
                    src={getMenuLogoImg(menu.menuId)}
                    width={45}
                    height={45}
                  ></img>
                  <p
                    className={`text-xs mt-2 ${
                      selectedMenuID == menu.menuId
                        ? "text-[#d6ff98]"
                        : "text-white"
                    }`}
                  >
                    {menu?.name ? menu?.name.toUpperCase() : "-"}
                  </p>
                </div>

                <hr className="border-1 border-solid border-slate-400 my-2" />
              </>
            );
          })}
          <div
            onClick={() => {
              removeCookie(["token", "currentSubmenu", "currentMainmenu"]);
              navigate(WEB_URL.LOGIN);
            }}
            className="cursor-pointer flex flex-col justify-center items-center gap-x-4 p-1"
          >
            <FiLogOut
              className={`text-4xl max-w-screen-sm  cursor-pointer duration-500 text-white`}
            />
            <p className={`text-white text-xs mt-2`}>{"LOG OUT"}</p>
          </div>
        </div>
      )}

      <div className="flex-1">
        {/* //Navbar Desktop View// */}
        <div className="text-2xl 	">
          <Navbar></Navbar>
        </div>

        <div className="flex   bg-[#F3F6F9]">
          {/* //Navbar Mobile View// */}
          {/*    <div className="text-2xl sm:block md:block  lg:hidden">
            <Navbar></Navbar>
          </div> */}

          {/* back drop for mobile view */}
          {/*    {open && (
            <div
              className="w-full h-[2645px] absolute bg-gray-500 opacity-75 z-40 sm:block md:block lg:hidden"
              onClick={() => {
                setOpen(false);
              }}
            >
              {" "}
            </div>
          )} */}

          {/* //Submenu// */}
          <div
            className={`rounded-tr-large static max-sm:z-50  h-auto   lg:z-10 lg:static lg:h-auto ${
              open ? "w-72" : "hidden" //"w-20"
            } bg-white max-h-max  p-2 shadow-sm `}
          >
            <p className="mt-3 text-left pl-2 text-base font-semibold">
              {selectedMenu ? selectedMenu : ""}
            </p>
            <ul className="pl-0">
              {submenu?.map((subMenu, index) => (
                <React.Fragment key={index}>
                  <Link
                    type="button"
                    onClick={() => {
                      onClickSubmenu(subMenu.id);
                    }}
                    to={getPath(subMenu.id)}
                    style={{ borderRadius: "5px" }}
                    className={`flex w-auto no-underline p-2 cursor-pointer text-xs items-center gap-x-4 mb-2 hover:bg-[#e2e2ac]
                        ${
                          selectedSubMenu == subMenu.id
                            ? "text-[#4d6a00]"
                            : "text-[#91918a]"
                        } ${
                      selectedSubMenu == subMenu.id
                        ? "bg-[#f4f4e9]"
                        : "bg-[#ffffff]"
                    }  `}
                  >
                    <li className="w-full">
                      <div className="w-full flex gap-2">
                        <img
                          src={getSubmenuLogoImg(subMenu.id)}
                          alt="React Logo"
                          width={20}
                          height={20}
                        />
                        <label className="ml-2 font-semibold  cursor-pointer leading-[30px]">
                          {subMenu?.name ? subMenu?.name : ""}
                        </label>
                      </div>
                    </li>
                  </Link>
                </React.Fragment>
              ))}
            </ul>
          </div>

          <div className="flex-1   md:z-0 lg:z-auto  lg:static bg-[#F3F6F9] ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar2;
