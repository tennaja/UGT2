import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Input from "../Control/Input";
import Textarea from "../Control/Textarea";
import MySelect from "../Control/Select";
import { Tooltip } from "react-tooltip";
import { Card } from "@mantine/core";

import {
  FetchDeviceDropdrowList,
  FetchCountryList,
  FetchProvinceList,
  FetchDistrictList,
  FetchSubDistrictList,
  FetchPostcodeList,
} from "../../Redux/Dropdrow/Action";

import {
  FunctionAddDevice,
  FetchDownloadFile,
  clearModal,
} from "../../Redux/Device/Action";
import { useFieldArray } from "react-hook-form";
import bin from "../assets/bin-3.svg";
import plus from "../assets/plus.svg";
import egat from "../assets/default_device.png";
import UploadFile from "../Control/UploadFile";
import Map from "../Map/Map";
import { BiErrorCircle } from "react-icons/bi";
import DatePicker from "../Control/DayPicker";
import UploadImg from "../Control/UploadImg";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModelFail from "../Control/Modal/ModalFail";
import ModalDone from "../Control/Modal/ModalDone";
import * as _ from "lodash";
import { USER_GROUP_ID, UTILITY_GROUP_ID } from "../../Constants/Constants";
import * as WEB_URL from "../../Constants/WebURL";
import ModelLoadPage from "../Control/LoadPage";
import { FaChevronCircleLeft } from "react-icons/fa";
import numeral from "numeral";
import { hideLoading, padNumber, showLoading } from "../../Utils/Utils";
import Radiobtn from "../Control/RadioBtn";
//default location on map @EGAT
const defaultLocation = { lat: 13.8118140871364, lng: 100.50564502457443 };

const AddDevice = () => {
  //default location on map Thailand

  const {
    watch,
    reset,
    handleSubmit,
    resetField,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "devicemeasure",
    }
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timeoutId = useRef(null);
  const [showModal, setShowModalConfirm] = React.useState(false);
  const [currentProvince, setCurrentProvicne] = useState(null);
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [currentSubDistrict, setCurrentSubDistrict] = useState(null);
  const [currentOnsite, setCurrentOnsite] = useState(null);
  const [currentPublicfunding, setPublicfunding] = useState(null);
  const [currentEnergySourch, setEnergySourch] = useState(null);
  const [currentPostCode, setCurrentPostCode] = useState(null);
  const [postCodeListForDisplay, setPostCodeListForDisplay] = useState([]);
  const [disableUtility, setDisableUtility] = useState(false);
  const [selectedCommisionDate, setSelectedCommisionDate] = useState(null);
  const [disableRequestedEffectiveDate, setDisableRequestedEffectiveDate] =
    useState(true);
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [fileList, setFileList] = React.useState([]);
  const [deviceTechnoList, setDeviceTechnoList] = React.useState([]);

  const countryList = useSelector((state) => state.dropdrow.countryList);
  const provinceList = useSelector((state) => state.dropdrow.provinceList);
  const districtList = useSelector((state) => state.dropdrow.districtList);
  const subDistrictList = useSelector(
    (state) => state.dropdrow.subDistrictList
  );
  const addInput = () => {
    append({
      description : "",
    });
  };
 
  
  const PublicFundingList = [
    {id :1 , Name:'No'},
    {id :2 , Name:'Feed in Tariff'}
  ]
  const OnsiteList = [
    {id :1 , Name:'Yes'},
    {id :2 , Name:'No'}
  ]
  const EnergySourchList = [
    {id :1 , Name:'Yes'},
    {id :2 , Name:'No'}
  ]
  console.log(OnsiteList)
  const dropDrowList = useSelector((state) => state.dropdrow.dropDrowList);
  const postcodeList = useSelector((state) => state.dropdrow.postcodeList);
  const isOpenDoneModal = useSelector((state) => state.device.isOpenDoneModal);
  const isOpenFailModal = useSelector((state) => state.device.isOpenFailModal);
  const modalFailMessage = useSelector(
    (state) => state.device.modalFailMessage
  );
  const responseDataAdd = useSelector(
    (state) => state.device.responseDataAddDevice
  );

  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);
  const [locationDataList, setLocationDataList] = useState([]);
  const [mapZoomLevel, setMapZoomLevel] = useState(15); //default zoom level
  const [vFormData, setFormData] = useState("");
  const onlyNumRegex = /^-?[0-9]+([.,][0-9]+)?$/;
  const onlyPositiveNum = /^[+]?\d+([.]\d+)?$/;

  useEffect(() => {
    dispatch(FetchCountryList());
    dispatch(FetchDeviceDropdrowList());
    dispatch(FetchProvinceList(764));
    dispatch(FetchPostcodeList());
    addInput();
  }, []);
  useEffect(() => {
    const initContry = initialvalueForSelectField(countryList, "alpha2", "th"); ////hardcode for thailand
    setValue("countryCode", initContry);
  }, [countryList]);

  useEffect(() => {
    checkPermission();

    const fixSelected = initialvalueForSelectField(
      dropDrowList?.issuerOrganization,
      "id",
      1
    );
    setValue("issuerCode", fixSelected); //hardcode Fix Selected EGAT ONLY
  }, [dropDrowList?.assignedUtility, userData]);

  const initialvalueForSelectField = (listItems = [], key, itemID) => {
    const initialValue = listItems?.filter((item) => item[key] == itemID);
    if (initialValue.length > 0) {
      return initialValue[0];
    } else {
      return null;
    }
  };

  const validateInput = (value) => {
    const isError = !value.match(onlyNumRegex);
    // Validate the input and set an error if needed
    if (isError) {
      setError("longitude", {
        type: "manual",
        message: "Please enter only numeric characters.",
      });
    } else {
      // Clear the error if the input is valid
      setError("longitude", null);
    }
  };

  const onHandleSubmitForm = (formData) => {
    const ugtGroupId = currentUGTGroup?.id ? currentUGTGroup?.id : 1;
    const data = { ...formData, ugtGroup: ugtGroupId };
    console.log(data)
    setFormData(data);
    setShowModalConfirm(true);
  };

  const onChangeLatLon = (type, val = null) => {
    let newLat = null;
    let newLon = null;
    if (type === "lat") {
      const currentLon = watch("longitude");
      if (val) {
        newLat = parseFloat(val);
        newLon = parseFloat(currentLon);
      }
    } else if (type == "lon") {
      const currentLat = watch("latitude");
      if (val) {
        newLon = parseFloat(val);
        newLat = parseFloat(currentLat);
      }
    }

    const isCanSetLatLon =
      /*    typeof newLat == "number" &&
      typeof newLon == "number" && */
      !isNaN(newLat) && !isNaN(newLon);

    // const isCanSetLatLon = true;

    if (isCanSetLatLon) {
      let latValue = newLat ? parseFloat(newLat) : 0;
      let lonValue = newLon ? parseFloat(newLon) : 0;
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        setLocationDataList([
          {
            lat: latValue,
            lng: lonValue,
          },
        ]);
        if (latValue && lonValue) {
          setMapZoomLevel(15);
        } else {
          setMapZoomLevel(2);
        }
        // setLat(newLat);
        // setLon(newLon);
      }, 1000);
    }
  };

  // --------- Country, Province,District,Subdistrict,Postcode Process ---------- //
  const onChangeCountry = (value) => {};
  const onChangeProvince = (value) => {
    console.log(value)
    if (currentDistrict?.id) {
      setValue("districtCode", null); //set value to null
      setCurrentDistrict(null);

      setValue("subdistrictCode", null); //set value to null
      setCurrentSubDistrict(null);

      setValue("postCode", null); //set value to null
      setCurrentPostCode(null);
      setPostCodeListForDisplay([]); // clear post code list option

      dispatch(FetchSubDistrictList());
    }
    setCurrentProvicne(value);
    dispatch(FetchDistrictList(value?.provinceCode));
  };

  const onChangeDistrict = (value) => {
    if (currentSubDistrict?.id) {
      setValue("subdistrictCode", null); //set value to null
      setCurrentSubDistrict(null);

      setValue("postCode", null); //set value to null
      setCurrentPostCode(null);
      setPostCodeListForDisplay([]); // clear post code list option
    }

    setCurrentDistrict(value);
    dispatch(
      FetchSubDistrictList(value?.districtCode, currentProvince?.provinceCode)
    );
  };

  const onChangeOnsite = (value) => {
    console.log(value)
     setCurrentOnsite(value);
  };
  const onChangePublicFund = (value) => {
    console.log(value)
     setPublicfunding(value);
  };
  const onChangeEnergySourch = (value) => {
    console.log(value)
    setEnergySourch(value);
  };

  const onChangeSubDistrict = (value) => {
    const postCodeFilter = postcodeList.filter(
      (item) =>
        item.provinceCode == currentProvince?.provinceCode &&
        item.districtCode == currentDistrict?.districtCode &&
        item.postalCode == value?.postalCode
    );
    if (postCodeFilter.length > 0) {
      const newPostCodeListForDisplay = _.uniqBy(postCodeFilter, "postalCode");
      setPostCodeListForDisplay(newPostCodeListForDisplay);
    } else {
      setPostCodeListForDisplay([]);
    }

    setCurrentSubDistrict(value);
  };

  const onChangePostCode = (value) => {
    setCurrentPostCode(value);
  };

  const handleCloseModalConfirm = (val) => {
    setShowModalConfirm(false);
  };

  const handleClickConfirm = () => {
    setShowModalConfirm(false);
    // setIsOpenLoading(true);
    showLoading();
    console.log("vFormData", vFormData);
    console.log("fileList", fileList);
    const fileListEvident = fileList?.map((item) => {
      return item?.evidentFileID;
    });

    console.log("fileListEvident=>>>", fileListEvident);
    const deviceData = { ...vFormData, uploadFile: fileListEvident };
    console.log("deviceData=>>>", deviceData);
    dispatch(
      FunctionAddDevice(deviceData, () => {
        hideLoading();
        // setIsOpenLoading(false);
      })
    );
  };

  const handleClickBackToEdit = () => {
    const deviceID = responseDataAdd?.id;
    dispatch(clearModal());
    navigate(`${WEB_URL.DEVICE_EDIT}`, { state: { code: deviceID } });
  };

  const commissioningDateDisableDateCal = (day) => {
    let dateValue = new Date();
    const previousDate = new Date(dateValue);
    previousDate.setDate(dateValue.getDate());

    return day > previousDate;
  };
  const handleChangeCommissioningDate = (date) => {
    setSelectedCommisionDate(date);
    resetField("registrationDate");
    if (date) {
      setDisableRequestedEffectiveDate(false);
    } else {
      setDisableRequestedEffectiveDate(true);
    }
  };

  const requestedEffectiveDateDisableDateCal = (day) => {
    let dateValue = new Date(selectedCommisionDate);
    const previousDate = new Date(dateValue);
    previousDate.setHours(0, 0, 0, 0);
    previousDate.setDate(dateValue.getDate());

    let currentDate = new Date();
    const previousCurrentDate = new Date(currentDate);
    previousCurrentDate.setDate(currentDate.getDate());

    const condition1 = day < previousDate; // not less than CommisionDate
    const condition2 = day > previousCurrentDate; // past of current date
    const disable = condition1 || condition2;

    return disable;
  };

  const checkPermission = () => {
    const userGroupID = userData?.userGroup?.id;
    if (userGroupID == USER_GROUP_ID.MEA_DEVICE_MNG) {
      const utilityID = UTILITY_GROUP_ID.MEA; //MEA
      const initValue = initialvalueForSelectField(
        dropDrowList?.assignedUtility,
        "id",
        utilityID
      );
      setValue("assignedUtilityCode", initValue);
      setDisableUtility(true);
    } else if (userGroupID == USER_GROUP_ID.PEA_DEVICE_MNG) {
      const utilityID = UTILITY_GROUP_ID.PEA; //PEA
      const initValue = initialvalueForSelectField(
        dropDrowList?.assignedUtility,
        "id",
        utilityID
      );
      setValue("assignedUtilityCode", initValue);
      setDisableUtility(true);
    } else if (userGroupID == USER_GROUP_ID.EGAT_DEVICE_MNG) {
      const utilityID = UTILITY_GROUP_ID.EGAT; //EGAT
      const initValue = initialvalueForSelectField(
        dropDrowList?.assignedUtility,
        "id",
        utilityID
      );
      setValue("assignedUtilityCode", initValue);
      setDisableUtility(true);
    } else if (userGroupID == USER_GROUP_ID.MEA_SUBSCRIBER_MNG) {
      //Code here...
    } else if (userGroupID == USER_GROUP_ID.PEA_SUBSCRIBER_MNG) {
      //Code here...
    } else if (userGroupID == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG) {
      //Code here...
    } else if (userGroupID == USER_GROUP_ID.PORTFOLIO_MNG) {
      //Code here...
    } else if (userGroupID == USER_GROUP_ID.ALL_MODULE_VIEWER) {
      //Code here...
    }
  };

  const handleUploadfile = async (id, result) => {
    // console.log("fileJaa>>>",file)

    console.log("id", id);
    console.log("res", result);
    console.log("file=>>", result?.res["@id"]);

    setFileList((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = [
        ...prevFileList,
        { fileID: result?.res?.uid, evidentFileID: result?.res["@id"] },
        
      ];
      return newFileList;
      
    });
  };

  // useEffect(()=>{
  //   console.log("fileList>>>>",fileList)
  // },[fileList])

  const handleDeleteFile = (id, evidentFileID, fileName) => {
    // console.log('id>>',id)
    console.log("evidentFileID>>", evidentFileID);
    setFileList((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = prevFileList.filter(
        (item) => item.fileID !== evidentFileID
      );

      return newFileList;
    });
  };

  const handleClickDownloadFile = async (item) => {
    // console.log('item',item)
    // console.log('item evidentFileID',item?.evidentFileID)
    // console.log('item name',item?.name)
    try {
      // setIsOpenLoading(true);
      showLoading();
      const fileID = item?.evidentFileID;
      const fileName = item?.name;
      const requestParameter = {
        fileID: fileID,
        fileName: fileName,
      };
      const response = await FetchDownloadFile(requestParameter);

      const blob = new Blob([response.res.data], {
        type: response.res.headers["content-type"],
      });
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
    hideLoading();
    // setIsOpenLoading(false);
  };
  const handleChangeFuelCode = (value) => {
    const deviceTechnologyList = dropDrowList?.deviceTechnology;
    const newDeviceTechnologyList = deviceTechnologyList?.filter(
      (item) => item?.fuelCode == value?.code
    );
    setDeviceTechnoList(newDeviceTechnologyList);
    setValue("technologyCode", null);
  };

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center w-12/12">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                Device Registration
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Device Management / Device
                Registration
              </p>
            </div>

            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="0"
            >
              <div className="p-4">
                <div className=" lg:col-span-2 ">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    <div className="md:col-span-3  lg:col-span-4 flex  m-0 items-center gap-3">
                      <FaChevronCircleLeft
                        className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                        size="30"
                        onClick={() => navigate(WEB_URL.DEVICE_LIST)}
                      />
                      <span className="text-xl	mr-14 	leading-tight">
                        <b> Device Info</b>
                      </span>
                    </div>

                    <div className="md:col-span-3 md:text-left lg:col-span-2 lg:text-right  py-2 flex  m-0 items-center justify-self-end">
                      <span className="text-PRIMARY_TEXT flex  m-0 items-center">
                        <b> English Only** </b>
                      </span>
                      <span className="text-[#f94a4a] flex  m-0 items-center pl-4">
                        <b> * Required Field </b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(onHandleSubmitForm)}>
                <div className="  p-0 px-0 md:p-0 mb-0 border-1 align-top"></div>
                {/*  */}
                <div className="  p-6 px-8 md:p-8 mb-6 ">
                  <div className=" lg:col-span-2 ">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                      {/* <div className="md:col-span-3">
                        <Controller
                          name="assignedUtilityCode"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"assignedUtilityCode"}
                              options={dropDrowList?.assignedUtility}
                              displayProp={"abbr"}
                              valueProp={"id"}
                              label={"Assigned Utility"}
                              validate={" *"}
                              disable={disableUtility}
                              error={errors.assignedUtilityCode}
                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-3"></div> */}

                      <div className="md:col-span-6 mt-2">
                      <div className="grid grid-cols-6 gap-4">
                      <div className="md:col-span-3">
                            <Controller
                              name="assignedUtilityCode"
                              control={control}
                              defaultValue={null}
                              rules={{
                                required: "This field is required",
                              }}
                              render={({ field }) => (
                                <MySelect
                                  {...field}
                                  id={"assignedUtilityCode"}
                                  options={dropDrowList?.assignedUtility}
                                  displayProp={"abbr"}
                                  valueProp={"id"}
                                  label={"Assigned Utility"}
                                  validate={" *"}
                                  disable={disableUtility}
                                  error={errors.assignedUtilityCode}
                                  // ... other props
                                />
                              )}
                            />
                          </div>
                          <div className="md:col-span-3 flex justify-end">
                            <Controller
                              name="deviceImg"
                              control={control}
                              defaultValue={null}
                              rules={{}}
                              render={({ field }) => (
                                <UploadImg
                                  {...field}
                                  id={"deviceImg"}
                                  defaultImg={egat}
                                  error={errors.deviceImg}
                                />
                              )}
                            />
                          </div>
                      </div>
                      </div>
                      {/* Device Detail */}
                      <div className="md:col-span-6 mt-4">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Production Device Details</b>
                        </h6>
                      </div>

                      <div className="md:col-span-6">
                        <div className="grid grid-cols-6 gap-4">
                         

                          <div className="md:col-span-6">
                            <Controller
                              name="name"
                              control={control}
                              rules={{
                                required: "This field is required",

                                maxLength: {
                                  value: 500,
                                  message:
                                    "Device Name must be at max 500 characters",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={"name"}
                                  type={"text"}
                                  placeholder={"Please fill the form in English"}
                                  label={"Device Name"}
                                  error={errors.name}
                                  validate={" *"}
                                  // ... other props
                                />
                              )}
                            />
                          </div>

                          

                          <div className="md:col-span-3">
                            <Controller
                              name="issuerCode"
                              control={control}
                              defaultValue={null}
                              rules={{
                                required: "This field is required",
                              }}
                              render={({ field }) => (
                                <MySelect
                                  {...field}
                                  id={"issuerCode"}
                                  options={dropDrowList?.issuerOrganization}
                                  displayProp={"issuerName"}
                                  valueProp={"id"}
                                  label={"Issuer Organization"}
                                  error={errors.issuerCode}
                                  validate={" *"}
                                  disable={true}
                                  // ... other props
                                />
                              )}
                            />
                          </div>

                          <div className="md:col-span-3">
                            <Controller
                              name="defaultAccountCode"
                              control={control}
                              rules={{
                                maxLength: {
                                  value: 8,
                                  message: "must be at max 8 characters",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={"defaultAccountCode"}
                                  placeholder={"Please fill the form in Number"}
                                  type={"text"}
                                  label={"Default account code"}
                                  error={errors.defaultAccountCode}
                                  // ... other props
                                />
                              )}
                            />
                          </div>

                          <div className="md:col-span-3">
                            <Controller
                              name="ppaNo"
                              control={control}
                              rules={{
                                required: "This field is required",
                                maxLength: {
                                  value: 500,
                                  message: "must be at max 500 characters",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={"ppaNo"}
                                  type={"text"}
                                  placeholder={"Please fill the form in English"}
                                  label={"PPA No."}
                                  error={errors.ppaNo}
                                  validate={" *"}
                                  // ... other props
                                />
                              )}
                            />
                          </div>

                          <div className="md:col-span-3">
                            <Controller
                              name="owner"
                              control={control}
                              rules={{
                                required: "This field is required",
                                maxLength: {
                                  value: 500,
                                  message: "must be at max 500 characters",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={"owner"}
                                  placeholder={"Please fill the form in English"}
                                  type={"text"}
                                  label={
                                    "Device" + "'" + "s owner / shareholder"
                                  }
                                  validate={" *"}
                                  error={errors.owner}
                                  // ... other props
                                />
                              )}
                            />
                          </div>

                          <div className="md:col-span-3">
                            <Controller
                              name="code"
                              control={control}
                              rules={{
                                maxLength: {
                                  value: 500,
                                  message: "must be at max 500 characters",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={"code"}
                                  type={"text"}
                                  placeholder={"Please fill the form in English"}
                                  label={"Device Code"}
                                  error={errors.code}
                                  disabled
                                  // ... other props
                                />
                              )}
                            />
                          </div>

                          <div className="md:col-span-3">
                            <Controller
                              name="deviceNameBySO"
                              control={control}
                              rules={{
                                maxLength: {
                                  value: 100,
                                  message: "must be at max 100 characters",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={"deviceNameBySO"}
                                  placeholder={"Please fill the form in English"}
                                  type={"text"}
                                  label={"Device name by SO"}
                                  error={errors.deviceNameBySO}
                                  // ... other props
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      {/* end Device Detail */}

                      {/* Technical Information */}
                      <div className="md:col-span-6 mt-4">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Technical Information</b>
                        </h6>
                      </div>

                      <div className="md:col-span-3">
                        <Controller
                          name="fuelCode"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"fuelCode"}
                              options={dropDrowList?.fuelCode}
                              displayProp={"name"}
                              valueProp={"code"}
                              label={"Device Fuel"}
                              error={errors.fuelCode}
                              onChangeInput={(value) => {
                                handleChangeFuelCode(value);
                              }}
                              validate={" *"}
                              // ... other props
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <Controller
                          name="technologyCode"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"technologyCode"}
                              options={deviceTechnoList}
                              displayProp={"name"}
                              valueProp={"id"}
                              label={"Device Technology"}
                              error={errors.technologyCode}
                              validate={" *"}
                              // ... other props
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <Controller
                          name="capacity"
                          control={control}
                          rules={{
                            required: "This field is required",
                            max: {
                              value: 99999.999999,
                              message:
                                "This value must be between 0 and 99999.999999",
                            },
                            min: {
                              value: 0,
                              message:
                                "This value must be between 0 and 99999.999999",
                            },
                            // pattern: {
                            //   value: onlyPositiveNum,
                            //   message: "Please enter only numeric characters.",
                            // },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={"capacity"}
                              type={"number"}
                              step="0.0000001"
                              placeholder={"Please fill the form in Number"}
                              label={"Installed Capacity (MW)"}
                              error={errors.capacity}
                              validate={" *"}
                              onBlur={(e) => {
                                let value = e?.target?.value;
                                // เรียก fucntion Pad ตัวเลขให้เป็นแค่ 6 หลัก
                                let val = padNumber(value, 6);
                                setValue("capacity", val);
                              }}
                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Controller
                          name="commissioningDate"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              id={"commissioningDate"}
                              label={"Commissioning Date"}
                              error={errors.commissioningDate}
                              onCalDisableDate={commissioningDateDisableDateCal}
                              onChangeInput={handleChangeCommissioningDate}
                              validate={" *"}
                              // ... other props
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-3"></div>

                      <div className="md:col-span-6">
                            <div className="flex justify-between mt-2 ml-2 md:col-span-6">
                              <div>
                                <strong>
                                Meter or Measurement ID (s){" "}
                                  <span className="text-red-500">*</span>
                                </strong>
                              </div>
                              <button
                                onClick={addInput}
                                type="button"
                                className="flex items-center w-30 rounded h-10 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                              >
                                <img
                                  src={plus}
                                  alt="React Logo"
                                  width={20}
                                  height={20}
                                  className={"text-white mr-2"}
                                />
                                <p className="m-0">Add</p>
                              </button>
                            </div>
                          <div className="mt-3 mb-4 md:col-span-6">
                              {fields.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="flex items-center mb-1"
                                >
                                  <div className="flex-grow">
                                    <Controller
                                      name={`devicemeasure[${index}].description`}
                                      control={control}
                                      rules={{
                                        required: "This field is required",
                                      }}
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          id={index}
                                          validate={" *"}
                                          placeholder={`Please fill the form in English#${
                                            index + 1
                                          }`}
                                          error={
                                            errors.devicemeasure?.[index]?.description
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                  <img
                                    src={bin}
                                    alt="React Logo"
                                    width={20}
                                    height={20}
                                    className={
                                      "text-white m-2 mb-3 mt-3 hover:cursor-pointer"
                                    }
                                    onClick={() =>
                                      fields.length > 1 ? remove(index) : null
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="md:col-span-3">
                            <Controller
                              name="NumberofGeneratingUnits"
                              control={control}
                              rules={{
                                required: "This field is required",
                                maxLength: {
                                  value: 500,
                                  message: "must be at max 500 characters",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={"NumberofGeneratingUnits"}
                                  placeholder={"Please fill the form in Number"}
                                  type={"text"}
                                  label={"Number of Generating Units"}
                                  error={errors.NumberofGeneratingUnits}
                                  validate={" *"}
                                  // ... other props
                                />
                              )}
                            />
                            <div
                        className="md:col-span-3 mt-4"
                        id="registration-date-tooltip"
                      >
                        <Controller
                          name="registrationDate"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              id={"registrationDate"}
                              label={"Requested Effective Registration Date"}
                              error={errors.registrationDate}
                              onCalDisableDate={
                                requestedEffectiveDateDisableDateCal
                              }
                              isDisable={disableRequestedEffectiveDate}
                              validate={" *"}
                              // ... other props
                            />
                          )}
                        />  

                        {disableRequestedEffectiveDate && (
                          <Tooltip
                            anchorSelect="#registration-date-tooltip"
                            content="Please select the commissioning date first."
                          />
                        )}
                      </div>
                      
                      <div className="md:col-span-3 mt-4">
                      <Controller
                          name="ExpectedFormofVolumeEvidence"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <div>
                              <Radiobtn
                              {...field}
                              id={"ExpectedFormofVolumeEvidence"}
                              label={"ExpectedForm of Volume Evidence"}
                              error={errors.ExpectedFormofVolumeEvidence}
                              validate={" *"}

                              // ... other props
                            />
                            </div>
                            
                            
                          )}
                        />
                      </div>
                          </div>
                          {/* <div className="md:col-span-3">
                            <Controller
                              name="ppaNo"
                              control={control}
                              rules={{
                                required: "This field is required",
                                maxLength: {
                                  value: 500,
                                  message: "must be at max 500 characters",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={"ppaNo"}
                                  type={"text"}
                                  label={"PPA No."}
                                  error={errors.ppaNo}
                                  validate={" *"}
                                  // ... other props
                                />
                              )}
                            />
                          </div> */}
                          
                          <div className="md:col-span-3">
                        <Controller
                          name="OwnerofNetwork"
                          control={control}
                          rules={{required: "This field is required",}}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              id={"OwnerofNetwork"}
                              placeholder={"Please fill the form in English"}
                              type={"text"}
                              label={"Owner of Network and Connection Voltage"}
                              error={errors.OwnerofNetwork}
                              // ... other props
                            />
                          )}
                        />
                        
                      </div>
                      
                      {/* <div className="md:col-span-3">
                        <Controller
                          name="otherLabellingCode"
                          control={control}
                          defaultValue={null}
                          rules={{}}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"otherLabellingCode"}
                              disable // disable labellingScheme
                              options={dropDrowList?.labellingScheme}
                              displayProp={"labelDesc"}
                              valueProp={"id"}
                              label={"Other Labelling Scheme"}
                              error={errors.otherLabellingCode}
                              // ... other props
                            />
                          )}
                        />
                      </div> */}
                      
                      {/*End  Technical Information  */}

                      {/* Location Information */}
                      <div className="md:col-span-6 mt-4">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Location Information</b>
                        </h6>
                      </div>

                      <div className="md:col-span-6">
                        <Controller
                          name="address"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={"address"}
                              type={"text"}
                              placeholder={"Please fill the form in English"}
                              label={"Address"}
                              error={errors.address}
                              validate={" *"}

                              // ... other props
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Controller
                          name="stateCode"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"stateCode"}
                              options={provinceList}
                              displayProp={"provinceNameEn"}
                              valueProp={"provinceCode"}
                              label={"State / Province"}
                              validate={" *"}
                              onChangeInput={onChangeProvince}
                              error={errors.stateCode}

                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Controller
                          name="districtCode"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"districtCode"}
                              options={districtList}
                              displayProp={"districtNameEn"}
                              valueProp={"districtCode"}
                              label={"District"}
                              error={errors.districtCode}
                              validate={" *"}
                              onChangeInput={onChangeDistrict}

                              // ... other props
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Controller
                          name="subdistrictCode"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"subdistrictCode"}
                              options={subDistrictList}
                              displayProp={"subdistrictNameEn"}
                              valueProp={"subdistrictCode"}
                              label={"Subdistrict"}
                              validate={" *"}
                              error={errors.subdistrictCode}
                              onChangeInput={onChangeSubDistrict}

                              // ... other props
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Controller
                          name="countryCode"
                          control={control}
                          defaultValue={null}
                          rules={
                            {
                              // required: "This field is required",
                            }
                          }
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"countryCode"}
                              options={countryList}
                              displayProp={"name"}
                              valueProp={"alpha2"}
                              label={"Country"}
                              error={errors.countryCode}
                              onChangeInput={onChangeCountry}
                              disable
                              validate={" *"}

                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Controller
                          name="postCode"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"postCode"}
                              // options={dropDrowList?.stateProvince}
                              options={postCodeListForDisplay}
                              displayProp={"postCodeDisplay"}
                              valueProp={"postalCode"}
                              label={"Postcode"}
                              validate={" *"}
                              onChangeInput={onChangePostCode}
                              error={errors.postCode}

                              // ... other props
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-2"></div>
                      <div className="md:col-span-2">
                        <Controller
                          name="latitude"
                          control={control}
                          rules={{
                            required: "This field is required",
                            max: {
                              value: 90,
                              message: "Please enter value between -90 to 90",
                            },
                            min: {
                              value: -90,
                              message: "Please enter value between -90 to 90",
                            },
                            // pattern: {
                            //   value: onlyNumRegex,
                            //   message: "Please enter only numeric characters.",
                            // },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={"latitude"}
                              type={"number"}
                              label={"Latitude"}
                              placeholder={"Please fill the form in Number"}
                              error={errors.latitude}
                              validate={" *"}
                              onChangeInput={(val) => {
                                onChangeLatLon("lat", val);
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Controller
                          name="longitude"
                          control={control}
                          rules={{
                            required: "This field is required",
                            max: {
                              value: 180,
                              message: "Please enter value between -180 to 180",
                            },
                            min: {
                              value: -180,
                              message: "Please enter value between -180 to 180",
                            },
                            // pattern: {
                            //   value: onlyNumRegex,
                            //   message: "Please enter only numeric characters.",
                            // },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={"longitude"}
                              type={"number"}
                              label={"Longitude"}
                              placeholder={"Please fill the form in Number"}
                              error={errors.longitude}
                              validate={" *"}
                              onChangeInput={(val) => {
                                onChangeLatLon("lon", val);
                              }}
                            />
                          )}
                        />
                      </div>

                      {/* Map */}
                      <div className="md:col-span-6">
                        <div className="flex justify-center w-full h-[450px] justify-items-center">
                          <Map
                            zoom={mapZoomLevel}
                            locationList={locationDataList}
                            className={"w-full h-[450px] justify-items-center"}
                            isGotoLatLon
                          ></Map>
                        </div>
                      </div>
                      {/*End  */}

{/*other information*/}
                      <div className="md:col-span-6 mt-4">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Other Information</b>
                        </h6>
                      </div>

                      <div className="md:col-span-3">
                        <Controller
                          name="Onsite"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"Onsite"}
                              options={OnsiteList}
                              displayProp={"Name"}
                              valueProp={"id"}
                              label={"On-site (captive) consumer"}
                              validate={" *"}
                              onChangeInput={onChangeOnsite}
                              error={errors.Onsite}

                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Controller
                          name="Energysources"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"Energysources"}
                              options={EnergySourchList}
                              displayProp={"Name"}
                              valueProp={"id"}
                              label={"Auxiliary/standby energy sources"}
                              error={errors.Energysources}
                              validate={" *"}
                              onChangeInput={onChangeEnergySourch}

                              // ... other props
                            />
                          )}
                        />
                      </div>

                    

                     
                      <div className="md:col-span-3">
                      <Controller
                          name="Otherimport"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={"Otherimport"}
                              placeholder={"Please fill the form in English"}
                              type={"text"}
                              label={"Other import eletricity"}
                              validate={" *"}
                              error={errors.note}
                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-3">
                      <Controller
                          name="Othercarbon"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={"Othercarbon"}
                              placeholder={"Please fill the form in English"}
                              type={"text"}
                              validate={" *"}
                              label={"Other carbon offset or energy tracking scheme"}
                              error={errors.note}
                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Controller
                          name="Publicfunding"
                          control={control}
                          defaultValue={null}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <MySelect
                              {...field}
                              id={"Publicfunding"}
                              options={PublicFundingList}
                              displayProp={"Name"}
                              valueProp={"id"}
                              label={"Public funding"}
                              error={errors.Publicfunding}
                              validate={" *"}
                              onChangeInput={onChangePublicFund}

                              // ... other props
                            />
                          )}
                        />
                      </div>
{/*End other information*/}
              

                      {/*Documents Information Attachments */}
                      <div className="md:col-span-6 mt-4">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Documents Information Attachments</b>
                        </h6>
                      </div>

                      <div className="md:col-span-3">
                        <Controller
                          name="uploadFile"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <UploadFile
                              {...field}
                              id={"uploadFile"}
                              type={"file"}
                              multiple
                              label={"File upload"}
                              onChngeInput={(id, res) => {
                                handleUploadfile(id, res);
                              }}
                              onDeleteFile={(id, evidentFileID, fileName) => {
                                handleDeleteFile(id, evidentFileID, fileName);
                              }}
                              onClickFile={(item) => {
                                handleClickDownloadFile(item);
                              }}
                              error={errors.uploadFile}
                              validate={" *"}
                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Controller
                          name="note"
                          control={control}
                          rules={{}}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              id={"note"}
                              type={"text"}
                              placeholder={"Please fill the form in English"}
                              label={"Note"}
                              error={errors.note}
                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-3"></div>
                      {/*End  Documents Information Attachments */}
                      {/* Save as draft */}
                      <div className="md:col-span-2"></div>
                      <div className="md:col-span-2">
                        <div>
                          {Object.keys(errors).length !== 0 && (
                            <div className="font-medium text-lg flex items-center justify-center border-solid bg-[#fdeeee] border-red-300 border-3   my-2 p-4 text-red-400 ">
                              <div className="mr-2">
                                <BiErrorCircle className="w-[25px] h-[25px] text-red-600" />
                              </div>
                              <div className="">
                                One of fields is incorrect or invalid
                              </div>
                            </div>
                          )}
                          <button className="w-full rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-indigo-[#4ed813d1]">
                            <b>Save Device</b>
                          </button>
                        </div>
                      </div>
                      <div className="md:col-span-2"></div>

                      {/* end Save as draft */}
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
      {showModal && (
        <ModalConfirm
          onClickConfirmBtn={handleClickConfirm}
          onCloseModal={handleCloseModalConfirm}
          title={"Are you sure?"}
          content={"Are you sure you would like to Save this device?"}
        />
      )}

      {isOpenDoneModal && (
        <ModalDone
          data={vFormData}
          deviceID={responseDataAdd?.id}
          onChangeModalDone={handleClickBackToEdit}
        />
      )}
      {isOpenFailModal && (
        <ModelFail
          onClickOk={() => {
            dispatch(clearModal());
          }}
          content={modalFailMessage ? modalFailMessage : undefined}
        />
      )}

      {isOpenLoading && <ModelLoadPage></ModelLoadPage>}
    </div>
  );
};

export default AddDevice;