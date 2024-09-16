import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Input from "../Control/Input";
import Textarea from "../Control/Textarea";
import MySelect from "../Control/Select";
import { Card } from "@mantine/core";
import { useFieldArray } from "react-hook-form";
import bin from "../assets/bin-3.svg";
import plus from "../assets/plus.svg";
import Radiobtn from "../Control/RadioBtn";
import {
  FetchDeviceDropdrowList,
  FetchCountryList,
  FetchProvinceList,
  FetchDistrictList,
  FetchSubDistrictList,
  FetchPostcodeList,
} from "../../Redux/Dropdrow/Action";
import egat from "../assets/default_device.png";
import UploadFile from "../Control/UploadFile";
import Map from "../Map/Map";
import { BiErrorCircle } from "react-icons/bi";
import DatePicker from "../Control/DayPicker";
import UploadImg from "../Control/UploadImg";

import {
  FunctionEditDevice,
  clearModal,
  FetchGetDeviceByID,
  WithdrawDevice,
  FetchDeleteFile,
  FetchDownloadFile,
  sendEmail
} from "../../Redux/Device/Action";

import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModelFail from "../Control/Modal/ModalFail";
import ModalDone from "../Control/Modal/ModalDone";
import * as _ from "lodash";
import { DEVICE_STATUS, USER_GROUP_ID } from "../../Constants/Constants";
import { format } from "date-fns";
import { Tooltip } from "react-tooltip";
import LoadPage from "../Control/LoadPage";
import { FaChevronCircleLeft } from "react-icons/fa";
import { DEVICE_INFO } from "../../Constants/WebURL";
import StatusLabel from "../Control/StatusLabel";
import { hideLoading, padNumber, showLoading } from "../../Utils/Utils";
import TextareaNote from "../Control/TextareaNote";

const UpdateDevice = () => {
  //default location on map Thailand
  const defaultLocation = [13.736717, 100.523186];
  const [checking, setChecking] = useState([]);
  const initialValues = [
    { name: "Meteringdata", Checked: "True" },
    { name: "Contractsalesinvoice", Checked: "False" },
    { name: "Other", Checked: "True", otherText: "Additional details" },
  ];
  const Datenow = new Date();
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const {
    handleSubmit,
    reset,
    watch,
    control,
    resetField,
    setValue,
    formState: { errors },
  } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "devicemeasure",
    }
  );
  const addInput = (data) => {
    console.log(data)
    if (data?.length > 0) {
      for (let i = 0; i < data?.length; i++) {
        append({
          description: data[i]?.description,
        });
      }
    } else {
      append({
        description: "",
      });
    }
  };
  
  const [vDeviceCode, vDeviceCodechange] = useState("");
  const [vDisabled, vDisabledchange] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timeoutId = useRef(null);
  const { state } = useLocation();
  const code = state?.code;
  const [showModal, setShowModalConfirm] = React.useState(false);
  const [currentProvince, setCurrentProvicne] = useState(null);
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [currentSubDistrict, setCurrentSubDistrict] = useState(null);
  const [currentPostCode, setCurrentPostCode] = useState(null);
  const [currentOnsite, setCurrentOnsite] = useState({ id: null, Name: '' });
  const [currentPublicfunding, setPublicfunding] = useState({ id: null, Name: '' });
  const [currentEnergySourch, setEnergySourch] = useState({ id: null, Name: '' });
  const [postCodeListForDisplay, setPostCodeListForDisplay] = useState([]);
  const [disableUtility, setDisableUtility] = useState(false);
  const [selectedCommisionDate, setSelectedCommisionDate] = useState(null);
  const [disableRequestedEffectiveDate, setDisableRequestedEffectiveDate] =
    useState(true);
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const dropDrowList = useSelector((state) => state.dropdrow.dropDrowList);
  const isOpen = useSelector((state) => state.device.isOpen);
  const [locationDataList, setLocationDataList] = useState([]);
  const [mapZoomLevel, setMapZoomLevel] = useState(15); //default zoom level

  const [status, setStatus] = useState(null);
  const [vFormData, setFormData] = useState("");
  const [fileList, setFileList] = React.useState([]);
  const [deviceTechnoList, setDeviceTechnoList] = React.useState([]);

  const deviceobj = useSelector((state) => state.device.deviceobj);

  const countryList = useSelector((state) => state.dropdrow.countryList);
  const provinceList = useSelector((state) => state.dropdrow.provinceList);
  const districtList = useSelector((state) => state.dropdrow.districtList);
  const subDistrictList = useSelector(
    (state) => state.dropdrow.subDistrictList
  );
  const postcodeList = useSelector((state) => state.dropdrow.postcodeList);

  const isOpenDoneModal = useSelector((state) => state.device.isOpenDoneModal);
  const isOpenFailModal = useSelector((state) => state.device.isOpenFailModal);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);
  const modalFailMessage = useSelector(
    (state) => state.device.modalFailMessage
  );
  console.log(deviceobj)
  console.log(deviceobj?.imagePath?.slice(24))
  useEffect(() => {
    // Check if deviceobj.onSiteConsumer exists
    if (deviceobj?.onSiteConsumer) {
      const matchingOnsite = OnsiteList.find(item => item.Name === deviceobj.onSiteConsumer);
      
      if (matchingOnsite) {
        // Set both Name and Id in the state
        setCurrentOnsite({ id: matchingOnsite.id, Name: matchingOnsite.Name });
        console.log({ id: matchingOnsite.id, Name: matchingOnsite.Name })
      } else {
        setCurrentOnsite({ id: null, Name: '' }); // Reset if no match
      }
    }
  }, [deviceobj]); // Re-run when deviceobj changes
  const deviceName = watch("name");
  const titleemail ="[Device Registration] UGT Device Registration Edited"
  const emailBodytoOwner = `
  <html>
    <body>
      <p>Dear Device Owner,</p>
      
      <p>
      Device registration 
        <b><span style="color: red;"> has been edited.</span></b>
      </p>
      
      <p>Device Details:</p>
       
      <p>
      <b>Name:</b> ${deviceName}
      </p>
      <p>
        <b>Edited Date:</b> ${formatDate(Datenow)} 
      </p>
      <p>
      <b>Edited by:</b> ${userData?.firstName + userData?.lastName}
      </p>
      <p>Please sign via this link: <a href="${`https://ugt-2.vercel.app/`}">Sign Here</a>.</p>
      
      <p>UGT Platform</p>
    </body>
  </html>
`; 

  useEffect(() => {
    if (deviceobj?.energySource) {
      
      const matchingenergySource = EnergySourchList.find(item => item.Name === deviceobj.energySource);
      if (matchingenergySource) {
        setEnergySourch({ id: matchingenergySource.id, Name: matchingenergySource.Name });
        console.log({ id: matchingenergySource.id, Name: matchingenergySource.Name })
         // Set the matching Name in state
      } else {
        setEnergySourch({ id: null, Name: '' }); // If no match found, set to null or handle accordingly
      }
    }
  },[deviceobj])

  useEffect(() => {
    if (deviceobj?.publicFunding) {
      
      const matchingPublicfunding= PublicFundingList.find(item => item.Name === deviceobj.publicFunding);
      if (matchingPublicfunding) {
        setPublicfunding({ id: matchingPublicfunding.id, Name: matchingPublicfunding.Name });
        console.log({ id: matchingPublicfunding.id, Name: matchingPublicfunding.Name })
         // Set the matching Name in state
      } else {
        setPublicfunding({ id: null, Name: '' }); // If no match found, set to null or handle accordingly
      }
    }
  },[deviceobj])

  const base64String = deviceobj?.imagePath;
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
  const onlyNumRegex = /^-?[0-9]+([.,][0-9]+)?$/;
  const onlyPositiveNum = /^[+]?\d+([.]\d+)?$/;

  const initialvalueForSelectField = (listItems = [], key, itemID) => {
    const initialValue = listItems?.filter((item) => item[key] == itemID);
    if (initialValue.length > 0) {
      return initialValue[0];
    } else {
      return null;
    }
  };
  useEffect(() => {
    // setIsOpenLoading(true);
    showLoading();
    dispatch(FetchDeviceDropdrowList());
    dispatch(
      FetchGetDeviceByID(code, (res, err) => {
        // setIsOpenLoading(false);
        hideLoading();
      })
    );
    
    dispatch(FetchCountryList());
  }, []);

  useEffect(() => {
    if (deviceobj && dropDrowList) {
      
      var initValue = {
        id: deviceobj.id,
        assignedUtilityCode: initialvalueForSelectField(
          dropDrowList.assignedUtility,
          "id",
          deviceobj?.assignedUtilityId
        ),
        name: deviceobj.name,
        issuerCode: initialvalueForSelectField(
          dropDrowList.issuerOrganization,
          "issuerCode",
          deviceobj?.issuerCode
        ),
        // code: deviceobj.deviceCode,
        code: deviceobj.deviceEvidentCode,
        owner: deviceobj.deviceOwner,
        defaultAccountCode: deviceobj.defaultAccountCode,
        fuelCode: initialvalueForSelectField(
          dropDrowList.fuelCode,
          "code",
          deviceobj.deviceFuelCode
        ),
        Onsite : initialvalueForSelectField(
          OnsiteList,
          "Name",
          deviceobj?.onSiteConsumer
        ),
        Onsitedetail : deviceobj?.onSiteConsumerDetail,
        Energysourcesdetail : deviceobj?.energySourceDetail,
        Publicfunding : initialvalueForSelectField(
          PublicFundingList,
          "Name",
          deviceobj?.publicFunding
        ),
        Energysources : initialvalueForSelectField(
          EnergySourchList,
          "Name",
          deviceobj?.energySource
        ),
        ppaNo: deviceobj.ppaNo,
        capacity: deviceobj.capacity,
        registrantOrganisationCode: deviceobj.registrantOrganisationCode,
        otherLabellingCode: initialvalueForSelectField(
          dropDrowList.labellingScheme,
          "id",
          deviceobj?.otherLabellingSchemeId
        ),

        technologyCode: initialvalueForSelectField(
          dropDrowList.deviceTechnology,
          "id",
          deviceobj?.deviceTechnologyId
        ),
        latitude: deviceobj?.latitude,
        longitude: deviceobj?.longitude,
        FundingReceivedate : deviceobj?.fundingReceive
        ? format(new Date(deviceobj?.fundingReceive), "yyyy-MM-dd")
        : "",
        commissioningDate: deviceobj?.commissioningDate
          ? format(new Date(deviceobj?.commissioningDate), "yyyy-MM-dd")
          : "", //deviceobj?.commissioningDate,
        registrationDate: deviceobj?.registrationDate
          ? format(new Date(deviceobj?.registrationDate), "yyyy-MM-dd")
          : "", //deviceobj?.registrationDate,
        address: deviceobj?.address,
        note: deviceobj?.notes,
        deviceNameBySO: deviceobj?.deviceNameBySO,
        Otherimport : deviceobj?.otherImportEletricity,
        Othercarbon : deviceobj?.otherCarbonOffset,
        NumberofGeneratingUnits : deviceobj?.generatingUnit, 
        OwnerofNetwork : deviceobj?.ownerNetwork,
        ExpectedFormofVolumeEvidence : 
        [
          { name: "Meteringdata", Checked: deviceobj?.isMeteringData === "True" ? true : false  },
          { name: "Contractsalesinvoice", Checked: deviceobj?.isContractSaleInvoice === "True" ? true : false  },
          { name: "Other", Checked: deviceobj?.isOther === "True" ? true : false , otherText: deviceobj?.otherDescription || "" },
        ]
      
      };
      setChecking(initValue.ExpectedFormofVolumeEvidence);
      console.log(checking)
      reset(initValue);
      setLocationDataList([
        {
          lat: deviceobj?.latitude ? parseFloat(deviceobj?.latitude) : 0,
          lng: deviceobj?.longitude ? parseFloat(deviceobj?.longitude) : 0,
        },
      ]);
      vDeviceCodechange(deviceobj?.code);
      setStatus(deviceobj?.statusName);
      dispatch(FetchProvinceList(764)); //hardcode for thailand
      dispatch(FetchDistrictList(deviceobj?.proviceCode));
      dispatch(
        FetchSubDistrictList(deviceobj.districtCode, deviceobj?.proviceCode)
      );
      checkPermission();
      addInput(deviceobj.deviceMeasurements);
    }

    // ---- Set Init File For Request ----//
    let seletcedFileList = [];
    seletcedFileList = deviceobj?.fileUploads?.map((itm) => {
      return { fileID: itm?.uid, evidentFileID: `/files/${itm?.uid}` };
    });
    // console.log("seletcedFileList",seletcedFileList)
    setFileList(seletcedFileList);
    // --------------------------------- //


  
    //--- Set Init DeviceTechnoList ---//
    const deviceTechnologyList = dropDrowList?.deviceTechnology;
    const newDeviceTechnologyList = deviceTechnologyList?.filter(
      (item) => item?.fuelCode == deviceobj?.deviceFuelCode
    );
    setDeviceTechnoList(newDeviceTechnologyList);
    //---------------------------------//
  }, [deviceobj, dropDrowList]);

  //------------------- USEEFECT FOR SET INITIAL VALUE PROVINCE DISTRICT SUBDISTRICT POSTCODE ----------------//
  useEffect(() => {
    const filteredProvince = provinceList.filter(
      (item) => item.provinceCode == deviceobj?.proviceCode
    );
    if (filteredProvince.length > 0) {
      setCurrentProvicne(filteredProvince[0]);
    }
    setValue(
      "countryCode",
      initialvalueForSelectField(countryList, "alpha2", "th")
    ); //initial value country

    setValue(
      "stateCode",
      initialvalueForSelectField(
        provinceList,
        "provinceCode",
        deviceobj?.proviceCode
      )
    ); //initial value for province
  }, [provinceList]);

  useEffect(() => {
    //set Current DistrictList & initial value
    const filteredDistrict = districtList.filter(
      (item) => item.districtCode == deviceobj?.districtCode
    );
    if (filteredDistrict.length > 0) {
      setCurrentDistrict(filteredDistrict[0]);
    }
    setValue(
      "districtCode",
      initialvalueForSelectField(
        districtList,
        "districtCode",
        deviceobj?.districtCode
      )
    ); //initial value for district
  }, [districtList]);

  useEffect(() => {
    //set Current subdistrictCode
    const filteredSubDistrictList = subDistrictList.filter(
      (item) => item.subdistrictCode == deviceobj?.subdistrictCode
    );
    if (filteredSubDistrictList.length > 0) {
      setCurrentSubDistrict(filteredSubDistrictList[0]);
    }

    setValue(
      "subdistrictCode",
      initialvalueForSelectField(
        subDistrictList,
        "subdistrictCode",
        deviceobj?.subdistrictCode
      )
    ); //initial value for subdistrictCode
  }, [subDistrictList]);

  

  useEffect(() => {
    //set initial postcode list
    const postCodeFilter = postcodeList.filter(
      (item) =>
        item.provinceCode == deviceobj?.proviceCode &&
        item.districtCode == deviceobj?.districtCode &&
        item.postalCode == deviceobj?.postcode
    );
    if (postCodeFilter.length > 0) {
      const newPostCodeListForDisplay = _.uniqBy(postCodeFilter, "postalCode");
      setPostCodeListForDisplay(newPostCodeListForDisplay);
    } else {
      setPostCodeListForDisplay([]);
    }
  }, [postcodeList, deviceobj]);

  useEffect(() => {
    //set initial postcode value
    const postCodeFilter = postcodeList.filter(
      (item) =>
        item.provinceCode == deviceobj?.proviceCode &&
        item.districtCode == deviceobj?.districtCode &&
        item.postalCode == deviceobj?.postcode
    );
    if (postCodeListForDisplay.length > 0) {
      setValue(
        "postCode",
        initialvalueForSelectField(
          postCodeFilter,
          "postalCode",
          deviceobj?.postcode
        )
      );
    }
  }, [postCodeListForDisplay]);

  const onHandleSubmitForm = (formData) => {
    const data = {
      ...formData,
      provinceNameEn: currentProvince?.provinceNameEn,
      districtNameEn: currentDistrict?.districtNameEn,
      subdistrictNameEn: currentSubDistrict?.subdistrictNameEn,
    };
    console.log(data)
    setFormData(data);
    setShowModalConfirm(true);
  };

  const getStatusColor = (statusValue) => {
    let color = "bg-GRAY_BUTTON";
    if (statusValue) {
      const status = statusValue?.toLowerCase();
      if (status === DEVICE_STATUS.DRAFT.toLowerCase()) {
        color = "bg-PRIMARY_BUTTON";
      } else if (status === DEVICE_STATUS.SUBMITTED.toLowerCase()) {
        color = "bg-INFO_BUTTON";
      } else if (status === DEVICE_STATUS.VERIFIED.toLowerCase()) {
        color = "bg-SECONDARY_BUTTON";
      } else if (status === DEVICE_STATUS.APPROVED.toLowerCase()) {
        color = "bg-SUCCESS_BUTTON";
      } else if (status === DEVICE_STATUS.REJECTED.toLowerCase()) {
        color = "bg-DANGER_BUTTON";
      }
    } else {
      color = null;
    }
    return color;
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
      // typeof newLat == "number" &&
      // typeof newLon == "number" &&
      !isNaN(newLat) && !isNaN(newLon);
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
      }, 1000);
    }
  };

  // --------- Country, Province,District,Subdistrict,Postcode Process ---------- //

  const onChangeCountry = (value) => {
    if (currentProvince?.id) {
      setValue("stateCode", null); //set value to null
      setCurrentProvicne(null);

      setValue("districtCode", null); //set value to null
      setCurrentDistrict(null);

      setValue("subdistrictCode", null); //set value to null
      setCurrentSubDistrict(null);

      setValue("postCode", null); //set value to null
      setCurrentPostCode(null);
      setPostCodeListForDisplay([]); // clear post code list option

      dispatch(FetchDistrictList(null));
      dispatch(FetchSubDistrictList(null));
    }
    dispatch(FetchProvinceList(value?.id));
  };

  const onChangeProvince = (value) => {
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

    console.log("vFormData",vFormData)
    console.log("fileList",fileList)
    // const filterFileNoUndefined = fileList.filter(item => item.evidentFileID != undefined )
    const fileListEvident = fileList?.map((item) => {
      return item?.evidentFileID;
    });

    // console.log("fileListEvident=>>>",fileListEvident)
    const deviceData = { ...vFormData, uploadFile: fileListEvident };
    // console.log("deviceData=>>>",deviceData)

    dispatch(
      FunctionEditDevice(deviceData, () => {
        // setIsOpenLoading(false);
        hideLoading();
      })
    );
    dispatch (
      sendEmail(titleemail,emailBodytoOwner,deviceobj?.userEmail
        ,() => {
        hideLoading();
        // dispatch(clearModal());
      })
    )
  };


  
  const handleClickBackToEdit = () => {
    dispatch(clearModal());
  };

  const checkPermission = () => {
    const userGroupID = userData?.userGroup?.id;
    if (userGroupID == USER_GROUP_ID.MEA_DEVICE_MNG) {
      setDisableUtility(true);
    } else if (userGroupID == USER_GROUP_ID.PEA_DEVICE_MNG) {
      setDisableUtility(true);
    } else if (userGroupID == USER_GROUP_ID.EGAT_DEVICE_MNG) {
      setDisableUtility(true);
    }
  };

  //--- ComissioningDate & RegistrationDtae Disable Logic ---//

  const commissioningDateDisableDateCal = (day) => {
    let dateValue = new Date();
    const previousDate = new Date(dateValue);
    previousDate.setDate(dateValue.getDate());

    return day > previousDate;
  };

  const handleChangeCommissioningDate = (date) => {
    setSelectedCommisionDate(date);
    setValue("registrationDate", null);
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

  // -------------------------------------------------------- //

  const handleUploadfile = async (id, result) => {
    //   console.log("handleUploadfile>>>",id)

    // console.log("id",id)
    // console.log("res",result)
    // console.log('file=>>',result?.res["@id"])
    if (result?.res?.uid) {
      setFileList((prevFileList) => {
        console.log("prevFileList", prevFileList);
        let newFileList = [
          ...prevFileList,
          { fileID: result?.res?.uid, evidentFileID: result?.res["@id"] },
        ];
        console.log("newFileList", newFileList);
        return newFileList;
      });
    }
  };

  const handleClickDownloadFile = async (item) => {

    console.log('item',item)
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
      console.log(response.res.data)
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
    // setIsOpenLoading(false);
    hideLoading();
  };

  const handleClickPreviewFile = async (item) => {
    console.log(item)
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
      console.log(response)
      const blob = new Blob([response.res.data], {
        type: response.res.headers["content-type"],
      });
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error Preview file:", error);
    }
    // setIsOpenLoading(false);
    hideLoading();
  };

  const handleClickDeleteFile = async (id, evidentFileID, fileName) => {
    console.log("----DELETE FILE---");

    console.log("test id====>", id);
    console.log("evidentFileID====>", evidentFileID);
    console.log("fileName", fileName);
    const requestParameter = {
      fileId: evidentFileID,
      name: fileName,
    };
    const result = await FetchDeleteFile(requestParameter);
    console.log("result", result);
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
                {deviceobj?.name}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Device Management / Device Info /{" "}
                <span className="truncate">{deviceobj?.name}</span>
              </p>
            </div>

            {/* Device Info */}

            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full overflow-visible"
              padding="0"
            >
              <div className="p-4">
                <div className=" lg:col-span-2 ">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    <div className="md:col-span-6  lg:col-span-4 flex  m-0 items-center gap-3">
                      <FaChevronCircleLeft
                        className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                        size="30"
                        onClick={() => navigate(DEVICE_INFO, { code: code })}
                      />
                      <span className="text-xl	mr-14 	leading-tight">
                        <b> Device Info</b>
                      </span>
                      <span>
                        <StatusLabel status={deviceobj?.statusName}/>
                      </span>
                    </div>

                    <div className="md:col-span-3 md:text-left lg:col-span-2 lg:text-right py-2 flex flex-col m-0 items-center justify-self-end gap-2">
  
                    <span className="text-[#f94a4a] flex m-0 items-center">
                    <b> * Required Field </b>
                    </span>
                    {/* <span className="text-PRIMARY_TEXT flex m-0 items-center pl-3">
                    <b> English Only** </b>
                    </span> */}
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(onHandleSubmitForm)}>
                <div className="  p-0 px-0 md:p-0 mb-0 border-1 align-top"></div>
                <div className="  p-6 px-8 md:p-8 mb-6 ">
                  <div className=" lg:col-span-2 ">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    <div className="md:col-span-3 ">
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
                                  defaultImg={base64String}
                                  error={errors.deviceImg}
                                />
                              )}
                            />
                          </div>
                      {/* <div className="md:col-span-3 ">
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
                      <div className="md:col-span-3" /> */}

                      {/* Device Detail */}
                      <div className="md:col-span-6">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Device Details</b>
                        </h6>
                      </div>

                      <div className="md:col-span-6">
                        <div className="grid grid-cols-6 gap-4">

                          <div className="md:col-span-3">
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
                                  label={"Device Name"}
                                  error={errors.name}
                                  disabled={vDisabled}
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
                                  options={dropDrowList.issuerOrganization}
                                  displayProp={"issuerName"}
                                  valueProp={"issuerCode"}
                                  label={"Issuer Organization"}
                                  error={errors.issuerCode}
                                  validate={" *"}
                                  disable={true}
                                  // disabled={vDisabled}
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
                                // required: "This field is required",
                                maxLength: {
                                  value: 8,
                                  message: "must be at max 8 characters",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={"defaultAccountCode"}
                                  type={"text"}
                                  label={"Default account code"}
                                  
                                  // error={errors.defaultAccountCode}
                                  validate={" *"}
                                  disabled={true}
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
                                  label={"PPA No."}
                                  error={errors.ppaNo}
                                  validate={" *"}
                                  disabled={vDisabled}
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
                                  type={"text"}
                                  label={
                                    "Device" + "'" + "s owner / shareholder"
                                  }
                                  validate={" *"}
                                  disabled={vDisabled}
                                  error={errors.owner}
                                  // ... other props
                                />
                              )}
                            />
                          </div>

                          {/* <div className="md:col-span-3">
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
                                  label={"Device Code"}
                                  disabled
                                  error={errors.code}
                                  // ... other props
                                />
                              )}
                            />
                          </div> */}

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
                                  type={"text"}
                                  label={"Device name by SO"}
                                  disabled={vDisabled}
                                  error={errors.deviceNameBySO}
                                  // ... other props
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Device Detail */}
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
                              options={dropDrowList.fuelCode}
                              displayProp={"name"}
                              valueProp={"code"}
                              label={"Device Fuel"}
                              onChangeInput={(value) => {
                                handleChangeFuelCode(value);
                              }}
                              error={errors.fuelCode}
                              validate={" *"}
                              disabled={vDisabled}
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
                              disabled={vDisabled}
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
                              value: 999999.000000,
                              message:
                                "This value must be between 0 and 99999.999999",
                            },
                            min: {
                              value: 0,
                              message:
                                "This value must be between 0 and 99999.999999",
                            },
                            pattern: {
                              value: onlyPositiveNum,
                              message: "Please enter only numeric characters.",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={"capacity"}
                              type={"number"}
                              step="0.000001"
                              max={999999.000000}
                              min={0}
                              label={"Installed Capacity (MW)"}
                              error={errors.capacity}
                              validate={" *"}
                              disabled={vDisabled}
                              onKeyDown={(e) => {
                                // Prevent invalid characters like 'e', '+', '-'
                                if (['e', 'E', '+'].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              // ... other props
                              onBlur={(e) => {
                                let value = parseFloat(e.target.value);
                                // Cap the value between -90.000000 and 90.000000
                                if (value > 999999.000000) value = 999999.000000;
                                if (value <= 0 ) value = 0;
                                
                                // Optionally pad the number if needed
                                let paddedValue = padNumber(value.toString(), 6);
                                setValue("capacity", paddedValue);
                              }}
                              onChangeInput={(val) => {
                                let numericValue = parseFloat(val);
                                // Enforce the max and min range on change
                                if (numericValue > 99999.000000) numericValue = 99999.000000;
                                if (numericValue <= 0 ) numericValue = 0;
                                let paddedValue = padNumber(numericValue.toString(), 6);
                                setValue("capacity", paddedValue);
                              }}
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
                              onCalDisableDate={commissioningDateDisableDateCal}
                              onChangeInput={handleChangeCommissioningDate}
                              error={errors.commissioningDate}
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
                                  type={"number"}
                                  label={"Number of Generating Units"}
                                  error={errors.NumberofGeneratingUnits}
                                  validate={" *"}
                                  onKeyDown={(e) => {
                                    // Prevent invalid characters like 'e', '+', '-'
                                    if (['e', 'E', '+'].includes(e.key)) {
                                      e.preventDefault();
                                    }
                                  }}
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
                            validate: {
                              atLeastOneChecked: (value) => 
                                value.some(item => item.Checked) || "Please select at least one option.",
                              otherTextRequired: (value) => {
                                const otherItem = value.find(item => item.name === "Other");
                                return !(otherItem && otherItem.Checked && !otherItem.otherText.trim()) || "This field is required when 'Other' is selected.";
                              }
                            }
                          }}
                          render={({ field }) => (
                            <div>
                              <Radiobtn
                              {...field}
                              id={"ExpectedFormofVolumeEvidence"}
                              value={checking} 
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
                          rules={{}}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              id={"OwnerofNetwork"}
                              type={"text"}
                              label={"Owner of Network and Connection Voltage"}
                              error={errors.OwnerofNetwork}
                              iconsid = {"OwnerofNetwork-tooltip"}
                              messageTooltip = {"Owner of the network to which the  Production Device is connected and the  voltage of that connection"}
                              validate={" *"}
                              
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
                              options={dropDrowList.labellingScheme}
                              displayProp={"labelDesc"}
                              valueProp={"id"}
                              label={"Other Labelling Scheme"}
                              disable
                              error={errors.otherLabellingCode}
                              // ... other props
                            />
                          )}
                        />
                      </div> */}
                      <div className="md:col-span-3"></div>

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
                              label={"Address"}
                              error={errors.address}
                              validate={" *"}
                              disabled={vDisabled}
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
                              withNullValue
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
                              disabled={vDisabled}
                              onChangeInput={onChangeDistrict}
                              withNullValue
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
                              withNullValue
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
                              validate={" *"}
                              disable
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
                              options={postCodeListForDisplay}
                              displayProp={"postCodeDisplay"}
                              valueProp={"postalCode"}
                              label={"Postcode"}
                              validate={" *"}
                              onChangeInput={onChangePostCode}
                              error={errors.postCode}
                              withNullValue
                              // ... other props
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-2"></div>

                      <div className="md:col-span-3">
                        <Controller
                          name="latitude"
                          control={control}
                          rules={{
                            required: "This field is required",
                            max: {
                              value: 90.000000,
                              message: "Please enter value between -90.000000 to 90.000000",
                            },
                            min: {
                              value: -90.000000,
                              message: "Please enter value between -90.000000 to 90.000000",
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
                              error={errors.latitude}
                              max={90.000000}
                              min={-90.000000}
                              step="0.000001"
                              validate={" *"}
                              disabled={vDisabled}
                              onKeyDown={(e) => {
                                // Prevent invalid characters like 'e', '+', '-'
                                if (['e', 'E', '+'].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onBlur={(e) => {
                                let value = parseFloat(e.target.value);
                                // Cap the value between -90.000000 and 90.000000
                                if (value > 90.000000) value = 90.000000;
                                if (value < -90.000000) value = -90.000000;
                                
                                // Optionally pad the number if needed
                                let paddedValue = padNumber(value.toString(), 6);
                                setValue("latitude", paddedValue);
                              }}
                              onChangeInput={(val) => {
                                let numericValue = parseFloat(val);
                                // Enforce the max and min range on change
                                if (numericValue > 90.000000) numericValue = 90.000000;
                                if (numericValue < -90.000000) numericValue = -90.000000;
                                let paddedValue = padNumber(numericValue.toString(), 6);
                                setValue("latitude", paddedValue);
                              }}
                            />
                          )}
                        />
                      </div>
                      
                      <div className="md:col-span-3">
                        <Controller
                          name="longitude"
                          control={control}
                          rules={{
                            required: "This field is required",
                            max: {
                              value: 180.000000,
                              message: "Please enter value between -180.000000 to 180.000000",
                            },
                            min: {
                              value: -180.000000,
                              message: "Please enter value between -180.000000 to 180.000000",
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
                              error={errors.longitude}
                              max={180.000000}
                              min={-180.000000}
                              step="0.000001"
                              validate={" *"}
                              disabled={vDisabled}
                              onKeyDown={(e) => {
                                // Prevent invalid characters like 'e', '+', '-'
                                if (['e', 'E', '+'].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onBlur={(e) => {
                                let value = parseFloat(e.target.value);
                                // Cap the value between -90.000000 and 90.000000
                                if (value > 180.000000) value = 180.000000;
                                if (value < -180.000000) value = -180.000000;
                                
                                // Optionally pad the number if needed
                                let paddedValue = padNumber(value.toString(), 6);
                                setValue("longitude", paddedValue);
                              }}
                              onChangeInput={(val) => {
                                let numericValue = parseFloat(val);
                                // Enforce the max and min range on change
                                if (numericValue > 180.000000) numericValue = 180.000000;
                                if (numericValue < -180.000000) numericValue = -180.000000;
                      
                                let paddedValue = padNumber(numericValue.toString(), 6);
                                setValue("longitude", paddedValue);
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
                              iconsid = {"Onsite-tooltip"}
                              messageTooltip = {"Is there an on-site (captive) consumer present?"}
                              // ... other props
                            />
                          )}
                        />
                        {currentOnsite?.Name == "Yes" ? 
                        
                        <div className=" ml-2 pl-3 flex justify-end border-l-2 border-r-0 border-t-0 border-b-2 border-x-gray-200 border-y-gray-200 h-10">
                        <div className="w-full mt-2">
                        <Controller
                          name="Onsitedetail"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={"Onsitedetail"}
                              type={"text"}
                              placeholder={"Please fill the form in English"}
                              error={errors.Onsitedetail}
                              validate={" *"}
                              
                            />
                          )}
                        /> </div></div>: null}
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
                              iconsid = {"Energysources-tooltip"}
                              messageTooltip = {"Auxiliary/Standby Energy Sources present?"}
                              // ... other props
                            />
                          )}
                        />
                        {currentEnergySourch?.Name == "Yes" ? 
                        
                        <div className=" ml-2 pl-3 flex justify-end border-l-2 border-r-0 border-t-0 border-b-2 border-x-gray-200 border-y-gray-200 h-10">
                        <div className="w-full mt-2">
                        <Controller
                          name="Energysourcesdetail"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={"Energysourcesdetail"}
                              type={"text"}
                              placeholder={"Please fill the form in English"}
                              error={errors.Energysourcesdetail}
                              validate={" *"}
                              
                            />
                          )}
                        /> </div></div>: null}
                      </div>

                    

                     
                      <div className="md:col-span-3">
                      <Controller
                          name="Otherimport"
                          control={control}
                          rules={{
                            required: "This field is required",
                          }}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              id={"Otherimport"}
                              type={"text"}
                              label={"Other import eletricity"}
                              validate={" *"}
                              error={errors.Otherimport}
                              iconsid = {"Otherimport-tooltip"}
                              messageTooltip = {"Please give details of how the site can import electricity by means other than through the meter(s) specified above"}
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
                            <Textarea
                              {...field}
                              id={"Othercarbon"}
                              type={"text"}
                              validate={" *"}
                              label={"Other carbon offset or energy tracking scheme"}
                              error={errors.Othercarbon}
                              iconsid = {"Othercarbon-tooltip"}
                              messageTooltip = {"Please give details (including registration id) of any carbon offset or energy tracking scheme for which the Production Facility is registered.  State ‘None’ if that is the case"}
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
                              iconsid={"Publicfunding-tooltip"}
          messageTooltip={"Has the Production Facility ever received public (government) funding (e.g. Feed in Tariff)"}
                              // ... other props
                            />
                          )}
                        />
                        {currentPublicfunding?.Name == "Feed in Tariff" ? 
                        <div className="ml-2 pl-3 flex justify-end border-l-2 border-r-0 border-t-0 border-b-2 border-x-gray-200 border-y-gray-200 h-10">
                        <div className="col">
                        <div className="w-full mt-4 bg-[#CFE5AD] h-8 flex justify-start items-center pl-2">
                          (If public (government) funding has been received, when did/will it finish?)
                        </div>
                        <div className="w-full mt-2">
                          <Controller
                            name="FundingReceivedate"
                            control={control}
                            rules={{ required: "This field is required" }}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                id={"FundingReceivedate"}
                                error={errors.FundingReceivedate}
                                validate={" *"}
                              />
                            )}
                          />
                        </div>
                      </div></div> : null }
                      </div>
                      {/*Documents Information Attachments */}
                      <div className="md:col-span-6 mt-12">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Documents Information Attachments</b>
                        </h6>
                      </div>

                      {/* Upload */}
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
                              // disabled={vDisabled}
                              error={errors.uploadFile}
                              defaultValue={deviceobj?.fileUploads}
                              onClickFile={(item) => {
                                handleClickDownloadFile(item);
                              }}
                              onChngeInput={(id, res) => {
                                handleUploadfile(id, res);
                              }}
                              onDeleteFile={(id, evidentFileID, fileName) => {
                                handleClickDeleteFile(
                                  id,
                                  evidentFileID,
                                  fileName
                                );
                              }}
                              onPreview ={(item)=>{
                                handleClickPreviewFile(item)
                              }}
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
                            <TextareaNote
                              {...field}
                              id={"note"}
                              type={"text"}
                              label={"Note"}
                              error={errors.note}
                              disabled={vDisabled}
                              // ... other props
                            />
                          )}
                        />
                      </div>
                      <div className="md:col-span-2"></div>
                      <div className="md:col-span-2"></div>
                      <div className="md:col-span-2"></div>
                      <div className="md:col-span-2"></div>
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
                            <b>Save as draft</b>
                          </button>
                        </div>
                      </div>
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
          onCloseModal={handleCloseModalConfirm} //back button
          title={"Save this Device?"}
          content={"Would you like to save this device?"}
        />
      )}

      {isOpenDoneModal && (
        <ModalDone
          data={vFormData}
          status={"ADD"}
          onChangeModalDone={handleClickBackToEdit}
          deviceID={deviceobj?.id}
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
      {isOpenLoading && <LoadPage></LoadPage>}
    </div>
  );
};

export default UpdateDevice;
