import React, { useEffect, useState } from "react";
import { removeCookie } from "../../Utils/FuncUtils";
import { useLocation } from 'react-router-dom';
import { ImLeaf } from "react-icons/im";
import messageIcon from "../assets/message.svg";
import notificationIcon from "../assets/notification.svg";
import { useForm, Controller } from "react-hook-form";
import MySelect from "../Control/Select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import {
  //   FetchDeviceManagement,
  FetchDeviceManagementDashboard,
  FetchDeviceManagementAssigned,
  FetchDeviceManagementUnAssigned,
} from "../../Redux/Device/Action";
import { setCurrentUgtGroup, setOpenMenu } from "../../Redux/Menu/Action";
import { Group, Avatar, Text, Menu, UnstyledButton } from "@mantine/core";
import { FaCaretDown, FaBars } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import NavBarIcon from "../assets/UGTNavBarIcon.png"
import NavIcon from "../assets/NavIcon.png"
const imageProfile =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const Navbar = () => {
  const [ugtGroupList, setUgtGroupList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userObj = useSelector((state) => state?.login?.userobj);
  const ugtGroups = useSelector((state) => state?.login?.userobj?.ugtGroups);
  const currentPage = WEB_URL.DEVICE_LIST; // Example current page
  const openMenu = useSelector((state) => state?.menu.openMenu);
  const currentAssignedFilter = useSelector(
    (state) => state?.device.currentAssignedFilterObj
  );
  const currentUnAssignedFilter = useSelector(
    (state) => state?.device.currentUnAssignedFilterObj
  );
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const location = useLocation(); // Get current location
  const isDeviceListPage = location.pathname === WEB_URL.DEVICE_LIST; // Check if current page is DEVICE_LIST

  useEffect(() => {
    // const ugtGroup = [{
    //     "ugtGroupId": 1,
    //     "ugtGroupName": "UGT-1",
    //     "startDate": "2024-01-01",
    //     "stopDate": "9999-99-99"
    //   },{
    //     "ugtGroupId": 2,
    //     "ugtGroupName": "UGT-2",
    //     "startDate": "2024-01-01",
    //     "stopDate": "9999-99-99"
    //   },{
    //     "ugtGroupId": 3,
    //     "ugtGroupName": "UGT-3",
    //     "startDate": "2024-01-01",
    //     "stopDate": "9999-99-99"
    //   }]
    const ugtGroup = ugtGroups;
    setUgtGroupList(ugtGroup);
    const defaultUgtGroup = ugtGroup?.length > 0 ? ugtGroup[0] : [];
    console.log(defaultUgtGroup)
    dispatch(setCurrentUgtGroup(defaultUgtGroup)); //setDefaultValue ugtgroup
    setValue("ugtGroup", defaultUgtGroup); //setDefaultValue ugtgroup
  }, [ugtGroups]);
  
  const modifiedUgtGroupList = isDeviceListPage 
  ? ugtGroupList.filter(option => option.name !== 'UGT-2') // Omit UGT-2 if on DEVICE_LIST
  : ugtGroupList; // Keep all options if not on DEVICE_LIST


  const handleChangeUGTGroup = (val) => {
    console.log(val)
    const itemsPerPage = 5;
    const ugtGroupId = val ? val.id : "";
    // const defaultFetchParameter = {
    //     rowOFFSetAssign: 0,
    //     rowFetchAssign: 5,
    //     rowOFFSetUnassign: 0,
    //     rowFetchUnassign: 5,
    //     // orderbyCapacity: 0,
    //     ugtGroup:`${val?.ugtGroupId}`
    //   };
    const selectedUgtGroup = val;

    const fetchParameterForDashboard = {
      findUgtGroupId: ugtGroupId,
      findUtilityId: currentAssignedFilter?.utility
        ? currentAssignedFilter?.utility
        : "",
    };
    
    const fetchParameterForAssignedList = {
      findTypeId: currentAssignedFilter?.type
        ? currentAssignedFilter?.type
        : "",
      findUtilityId: currentAssignedFilter?.utility
        ? currentAssignedFilter?.utility
        : "",
      findStatusId: currentAssignedFilter?.status
        ? currentAssignedFilter?.status
        : "",
      pageNumber: 1,
      pageSize: itemsPerPage,
      findUgtGroupId: ugtGroupId,
    };

    const fetchParameterForUnAssignedList = {
      findTypeId: currentUnAssignedFilter?.type
        ? currentUnAssignedFilter?.type
        : "",
      findUtilityId: currentUnAssignedFilter?.utility
        ? currentUnAssignedFilter?.utility
        : "",
      findStatusId: currentUnAssignedFilter?.status
        ? currentUnAssignedFilter?.status
        : "",
      pageNumber: 1,
      pageSize: itemsPerPage,
      findUgtGroupId: ugtGroupId,
    };

    dispatch(setCurrentUgtGroup(selectedUgtGroup));
    dispatch(FetchDeviceManagementDashboard(fetchParameterForDashboard));
    dispatch(FetchDeviceManagementAssigned(fetchParameterForAssignedList));
    dispatch(FetchDeviceManagementUnAssigned(fetchParameterForUnAssignedList));
    
    console.log(fetchParameterForDashboard)
    console.log(fetchParameterForAssignedList)
    console.log(fetchParameterForUnAssignedList)
    console.log(selectedUgtGroup)
  };
  return (
    <>
      <nav className="bg-[#87be33]">
        <div className="px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between md:justify-evenly gap-2">
            {/* Mobile toggle*/}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => dispatch(setOpenMenu(!openMenu))}
              >
                <FaBars className="h-5 w-5" aria-hidden="true" color="white" />
              </button>
            </div>

            {/* ## LOGO ## */}
            <div className="flex flex-1 items-center justify-start lg:block">
              <div className="flex flex-shrink-0 items-center ">
                <span className="text-white font-medium text-lg lg:text-lg">
                <img src={NavIcon} alt="NavBarIcon" width={110} height={50}/>
                </span>
                {/*<ImLeaf className="ml-2 text-white"></ImLeaf>*/}
              </div>
            </div>

            {/* ## SELECT ## */}
            <div className="flex justify-end  rounded max-sm:w-1/2 lg:w-60">
              <form className="w-40 lg:w-3/4">
                <Controller
                  name="ugtGroup"
                  control={control}
                  render={({ field }) => (
                    <MySelect
                      {...field}
                      options={modifiedUgtGroupList}
                      displayProp={"name"}
                      valueProp={"id"}
                      fontSize={"16px"}
                      onChangeInput={handleChangeUGTGroup}
                      bgColor={"#bcdb8d"}
                      searchable={false}
                      currentPage={currentPage}
                    />
                  )}
                />
              </form>
            </div>

            <div className="sm:hidden lg:flex absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="flex">
                {/* <img
                  style={{ borderRadius: "50%" }}
                  className="h-7 w-7 flex self-center"
                  src={notificationIcon}
                  alt=""
                />

                <div className="border-r-2 border-solid border-white mx-3"></div>

                <img
                  style={{ borderRadius: "50%" }}
                  className="h-7 w-7 fifty-percent flex self-center"
                  src={messageIcon}
                  alt=""
                />
                <div className="border-r-2 border-solid border-white mx-3"></div> */}

                {/* <!-- Profile dropdown --> */}
                <Menu withArrow shadow="md">
                  <Menu.Target>
                    <UnstyledButton
                      style={{
                        padding: "var(--mantine-spacing-md)",
                        color: "var(--mantine-color-text)",
                        borderRadius: "var(--mantine-radius-sm)",
                      }}
                    >
                      <Group>
                        <Avatar src={imageProfile} radius="xl" />

                        <div style={{ flex: 1 }}>
                          <Text size="sm" fw={500} className="text-white">
                            {userObj?.firstName} {userObj?.lastName}
                          </Text>

                          <Text size="xs" className="text-[#338343]">
                            {userObj?.userGroup?.name}
                          </Text>
                        </div>
                        <FaCaretDown size="1rem" color="#F4F4E9" />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item>
                      <div className="flex flex-col items-center justify-center px-4 py-2">
                        <Avatar size={60} src={imageProfile} radius="xl" />
                        <div className="mt-3">
                          {userObj?.firstName} {userObj?.lastName}
                        </div>
                        <small className="mt-1 text-secondary">
                          {userObj?.userGroup?.name}
                        </small>
                        <small className="text-secondary">
                          {userObj?.email}
                        </small>
                      </div>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item>
                      <div
                        className="flex items-center justify-center gap-2"
                        onClick={() => {
                          removeCookie([
                            "token",
                            "currentSubmenu",
                            "currentMainmenu",
                          ]);
                          navigate(WEB_URL.LOGIN);
                        }}
                      >
                        <MdLogout size={18} />
                        <span>Logout</span>
                      </div>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
