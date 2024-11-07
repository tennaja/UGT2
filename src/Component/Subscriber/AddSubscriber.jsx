import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Input from "../Control/Input";
import MySelect from "../Control/Select";
import { FetchDeviceDropdrowList } from "../../Redux/Dropdrow/Action";
import Collaps from "../Control/Collaps";
import plus from "../assets/plus.svg";
import * as _ from "lodash";
import ModalSubAllocated from "../Subscriber/ModalSubAllocated";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModelLoadPage from "../Control/LoadPage";
import bin from "../assets/bin-3.svg";
import { Tooltip } from "react-tooltip";
import DatePicker from "../Control/DayPicker";
import { useFieldArray } from "react-hook-form";
import * as WEB_URL from "../../Constants/WebURL";
import ModalComplete from "../Control/Modal/ModalComplete";
import { USER_GROUP_ID, UTILITY_GROUP_ID } from "../../Constants/Constants";
import {
  FetchCountryList,
  FetchProvinceList,
  FetchDistrictList,
  FetchSubDistrictList,
  FetchPostcodeList,
} from "../../Redux/Dropdrow/Action";
import {
  FunctionCreateSubscriber,
  FunctionCreateAggregateSubscriber,
  FetchProvinceBeneList,
  FetchPostcodeBeneList,
  FetchDistrictBeneList,
  FetchSubDistrictBeneList,
  clearModal,
} from "../../Redux/Subscriber/Action";
import dayjs from "dayjs";
import { FaChevronCircleLeft } from "react-icons/fa";
import numeral from "numeral";
import { hideLoading, padNumber, showLoading } from "../../Utils/Utils";
import CheckBox from "../Control/CheckBok";
import AddContract from "./AddContractMenu";
import ModalUploadFileExcel from "./ModalUploadFileExcel";
import ModalBeneficiary from "./ModalBeneficiary";
import Textarea from "../Control/Textarea";
import UploadFile from "../Control/UploadFile";
import UploadFileSubscriber from "./UploadFileSubscriber";
import warning from "../assets/warning.png";
import Beneficiary from "./Beneficiary";
import { message } from "antd";
import ModalFail from "../Control/Modal/ModalFail";
import ModalConfirmCheckBox from "./ModalConfirmCheckBox";
import ModalCompleteSubscriber from "./ModalCompleteSubscriber";
import TriWarning from "../assets/TriWarning.png";
import TextareaNoteSubscriber from "./TextareaNoteSubscriber";
import FileUpload from "./UploadFileButton";
import DatePickerSubscriber from "./DayPickerSubscriber";
import Tooltips from "@mui/material/Tooltip";
import InfoCircle from "../assets/InfoCircle.svg";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { LiaDownloadSolid } from "react-icons/lia";
import { BiErrorCircle } from "react-icons/bi";
import CollapsEdit from "./CollapsEdit";
import CollapsInfoSubscriber from "./CollapsInfoSubscriber";

const AddSubscriber = () => {
  const {
    handleSubmit,
    resetField,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "feeder",
    }
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModalConfirm] = React.useState(false);
  const [showUploadExcel, setShowUploadExcel] = React.useState(false);
  const [showModalBene, setShowModalBene] = React.useState(false);
  const [showModalCreate, setShowModalCreateConfirm] = React.useState(false);
  const [showModalComplete, setShowModalComplete] = React.useState(false);
  const [showModalConfirmCheck, setModalConfirmCheck] = React.useState(false);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const [isActiveForm1, setIsActiveForm1] = useState(true);
  const [isActiveForm2, setIsActiveForm2] = useState(false);
  const [selectedCommisionDate, setSelectedCommisionDate] = useState(null);
  const [isAllocatedEnergyAmount, setIsAllocatedEnergyAmount] = useState(false);
  const [isBeneficiary, setIsBeficiary] = useState(false);
  const [disableRequestedEffectiveDate, setDisableRequestedEffectiveDate] =
    useState(true);
  const [fileList, setFileList] = React.useState([]);
  const [fileListPDF, setFileListPDF] = React.useState([]);
  const [fileListExcel, setFileListExcel] = React.useState([]);
  const addInput = () => {
    append({
      feederName: "",
    });
  };
  const statusBeneficiaryList = useSelector(
    (state) => state.subscriber?.filterList
  );

  const [currentProvince, setCurrentProvicne] = useState(null);
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [currentSubDistrict, setCurrentSubDistrict] = useState(null);
  const [currentPostCode, setCurrentPostCode] = useState(null);
  const [postCodeListForDisplay, setPostCodeListForDisplay] = useState([]);
  const dropDrowList = useSelector((state) => state.dropdrow.dropDrowList);
  const countryList = useSelector((state) => state.dropdrow.countryList);
  const provinceList = useSelector((state) => state.dropdrow.provinceList);
  const districtList = useSelector((state) => state.dropdrow.districtList);
  const subDistrictList = useSelector(
    (state) => state.dropdrow.subDistrictList
  );
  const postcodeList = useSelector((state) => state.dropdrow.postcodeList);
  const userDetail = useSelector((state)=> state.login.userobj)

  const [currentBeneficiaryProvince, setCurrentBeneficiaryProvicne] =
    useState(null);
  const [currentBeneficiaryDistrict, setCurrentBeneficiaryDistrict] =
    useState(null);
  const [currentBeneficiarySubDistrict, setCurrentBeneficiarySubDistrict] =
    useState(null);
  const [currentBeneficiaryPostCode, setCurrentBeneficiaryPostCode] =
    useState(null);
  const [
    postCodeBeneficiaryListForDisplay,
    setPostCodeBeneficiaryListForDisplay,
  ] = useState([]);
  const countryBeneficiaryList = useSelector(
    (state) => state.dropdrow.countryList
  );
  const provinceBeneficiaryList = useSelector(
    (state) => state.subscriber.provinceList
  );
  const districtBeneficiaryList = useSelector(
    (state) => state.subscriber.districtList
  );
  const subDistrictBeneficiaryList = useSelector(
    (state) => state.subscriber.subDistrictList
  );
  const postcodeBeneficiaryList = useSelector(
    (state) => state.subscriber.postcodeList
  );

  const isError = useSelector((state) => state.subscriber.isOpenFailModal);
  const errorMessage = useSelector((state) => state.subscriber.errmessage);
  const isOpen = useSelector((state) => state.subscriber.isOpen);
  //console.log(errorMessage)
  //console.log(isError)

  const [allowcatedEnergyList, setAllowcatedEnergyList] = useState([]);
  const [allowcatedEnergyDataEdit, setAllowcatedEnergyDataEdit] = useState({});
  const [allowcatedExcelFileList, setAllowcatesExcelfileList] = useState([]);
  const [benefitList, setBenefitList] = useState([]);
  const [benefitDataEdit, setBenefitDataEdit] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isEditBene, setIsEditBene] = useState(false);
  const [FormData1, setFormData1] = useState("");
  const [FormData2, setFormData2] = useState("");
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const userData = useSelector((state) => state.login.userobj);
  const [permission, checkPermission] = useState("");
  const [disableUtility, setDisableUtility] = useState(false);
  const onlyPositiveNum = /^[+]?\d+([.]\d+)?$/;
  const dropdownTitle = [
    {
      name: "MR.",
      value: "MR.",
    },
    {
      name: "MISS",
      value: "MISS",
    },
    {
      name: "MRS.",
      value: "MRS.",
    },
    {
      name: "MS.",
      value: "MS.",
    },
  ];

  const [yearStartDate, setYearStartDate] = useState();
  const [monthStartDate, setMonthStartDate] = useState();
  const [dayStartDate, setDayStartDate] = useState();
  const [yearEndDate, setYearEndDate] = useState();
  const [monthEndDate, setMonthEndDate] = useState();
  const [dayEndDate, setDayEndDate] = useState();
  const yearStartDate1 = useRef(null);
  const monthStartDate1 = useRef(null);
  const dayStartDate1 = useRef(null);
  const yearEndDate1 = useRef(null);
  const monthEndDate1 = useRef(null);
  const dayEndDate1 = useRef(null);
  const [isShowFailModal, setIsShowFailModal] = useState(false);
  const [messageFailModal, setMessageFailModal] = useState("");
  const [isShowFailError, setIsShowFailError] = useState(false);
  const [test, setTest] = useState();
  const [isShowDeleteBene, setIsShowDeleteBene] = useState(false);
  const [dataBeneDelete, setDataBeneDelete] = useState();

  useEffect(() => {
    dispatch(FetchCountryList());
    dispatch(FetchDeviceDropdrowList());
    dispatch(FetchProvinceList(764));
    dispatch(FetchProvinceBeneList(764));
    dispatch(FetchPostcodeList());
    dispatch(FetchPostcodeBeneList());
    addInput();
    autoScroll();
  }, []);

  useEffect(() => {
    if (isError) {
      console.log("IsError", isError);
      setTest(isError);
      console.log("TEST", test);
    }
  }, [isError]);

  useEffect(() => {
    console.log("File Allowcate IN Main Page", allowcatedExcelFileList);
  }, [allowcatedExcelFileList]);

  useEffect(() => {
    permissionAllow();
    //if (userData?.userGroup?.name !== "EGAT Subscriber Manager") {
    //  handleClickForm2();
    //}
  }, [dropDrowList?.assignedUtility, userData]);

  useEffect(() => {
    const initContry = initialvalueForSelectField(countryList, "alpha2", "th");
    setValue("countryCode", initContry);
  }, [countryList]);

  useEffect(() => {
    const initContry = initialvalueForSelectField(
      countryBeneficiaryList,
      "alpha2",
      "th"
    );
    setValue("beneficiaryCountryCode", initContry);
  }, [countryBeneficiaryList]);

  useEffect(() => {
    dispatch(FetchDeviceDropdrowList());
  }, []);

  const initialvalueForSelectField = (listItems = [], key, itemID) => {
    const initialValue = listItems?.filter((item) => item[key] == itemID);
    if (initialValue.length > 0) {
      return initialValue[0];
    } else {
      return null;
    }
  };
  const autoScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  function downloadFileAllowCated() {
    const base64Data = allowcatedExcelFileList[0].binary; //.split(',')[1];
    const binaryString = atob(base64Data);
    const binaryLength = binaryString.length;
    const bytes = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: allowcatedExcelFileList[0].type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = allowcatedExcelFileList[0].name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const permissionAllow = () => {
    if (userData?.userGroup?.id) {
      checkPermission(userData?.userGroup?.name);
      const userGroupID = userData?.userGroup?.id;
      if (userGroupID == USER_GROUP_ID.MEA_SUBSCRIBER_MNG) {
        const utilityID = UTILITY_GROUP_ID.MEA; //MEA
        const initValue = initialvalueForSelectField(
          dropDrowList?.assignedUtility,
          "id",
          utilityID
        );
        setValue("assignUtil", initValue);
        setDisableUtility(true);
      } else if (userGroupID == USER_GROUP_ID.PEA_SUBSCRIBER_MNG) {
        const utilityID = UTILITY_GROUP_ID.PEA; //PEA
        const initValue = initialvalueForSelectField(
          dropDrowList?.assignedUtility,
          "id",
          utilityID
        );
        setValue("assignUtil", initValue);
        setDisableUtility(true);
      } else if (userGroupID == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG) {
        const utilityID = UTILITY_GROUP_ID.EGAT; //EGAT
        const initValue = initialvalueForSelectField(
          dropDrowList?.assignedUtility,
          "id",
          utilityID
        );
        setValue("assignUtil", initValue);
        setDisableUtility(true);
      }
    }
  };
  const addAllowcated = () => {
    if (yearStartDate1.current !== null && yearEndDate1.current !== null) {
      setShowModalConfirm(true);
    } else {
      setIsShowFailModal(true);
      setMessageFailModal(
        "Please select Retail ESA Contract Start Date and Retail ESA Contract End Date."
      );
    }
  };

  const addBeneficiary = () => {
    setShowModalBene(true);
  };

  const addExcelfile = () => {
    if (yearStartDate1.current !== null && yearEndDate1.current !== null) {
      console.log("Open Modal");
      setShowUploadExcel(true);
    } else {
      setIsShowFailModal(true);
      setMessageFailModal(
        "Please select Retail ESA Contract Start Date and Retail ESA Contract End Date"
      );
      message.error(
        "Please select Retail ESA Contract Start Date and Retail ESA Contract End Date"
      );
    }
  };

  const addAllowcatedClose = (event) => {
    setIsEdit(false);
    setShowModalConfirm(false);
  };
  const addBeneficiaryClose = () => {
    setIsEditBene(false);
    setShowModalBene(false);
  };
  const addExcelfileClose = () => {
    setShowUploadExcel(false);
  };
  const allowcatedEnergyDataIndex = (obj, index) => {
    const allowcatedEnergyEditTemp = allowcatedEnergyList;
    allowcatedEnergyEditTemp[index] = obj;
    setAllowcatedEnergyList(allowcatedEnergyEditTemp);
    const sortedData = [...allowcatedEnergyList].sort(
      (a, b) => a.year - b.year
    );
    setAllowcatedEnergyList(sortedData);
  };
  const benefitDataIndex = (obj, index) => {
    const benefitDataEditTemp = benefitList;
    console.log(benefitDataEditTemp[index]);
    benefitDataEditTemp[index] = obj;
    setBenefitList(benefitDataEditTemp);
    console.log(benefitList);
  };
  const onClickEditBtn = (data, index) => {
    data.index = index;
    setAllowcatedEnergyDataEdit(data);
    setIsEdit(true);
    addAllowcated();
  };

  const onClickEditBeneBtn = (data, index) => {
    data.index = index;
    console.log("Input Data");
    console.log(data);
    setBenefitDataEdit(data);
    setIsEditBene(true);
    addBeneficiary();
    setTimeout(() => {}, 0);
  };

  const onClickDeleteBtn = (data) => {
    const allowcatedEnergyListTemp = allowcatedEnergyList.filter(
      (item) => item.year !== data.year
    );

    setAllowcatedEnergyList(allowcatedEnergyListTemp);
  };
  const onClickDeleteBeneBtn = (data) => {
    const benefitListTemp = benefitList.filter(
      (item) => item.beneficiaryName !== data.beneficiaryName
    );
    setBenefitList(benefitListTemp);
    setDataBeneDelete();
  };
  const sumAllocatedEnergyAmount = (data) => {
    const total =
      data.amount01 +
      data.amount02 +
      data.amount03 +
      data.amount04 +
      data.amount05 +
      data.amount06 +
      data.amount07 +
      data.amount08 +
      data.amount09 +
      data.amount10 +
      data.amount11 +
      data.amount12;

    return total;
  };

  const sumAllAllocatedEnergyList = (list) => {
    let total = 0;
    list.map((item) => {
      total += sumAllocatedEnergyAmount(item);
    });
    return total;
  };
  const allowcatedEnergyData = (obj) => {
    const allowcatedEnergyListTemp = allowcatedEnergyList;
    allowcatedEnergyListTemp.push(obj);
    const sortedData = [...allowcatedEnergyList].sort(
      (a, b) => a.year - b.year
    );
    setIsAllocatedEnergyAmount(false);
    setAllowcatedEnergyList(sortedData);
  };

  const beneficiaryData = (obj) => {
    const beneficiaryListTemp = benefitList;
    beneficiaryListTemp.push(obj);
    const sortData = [...benefitList].sort(
      (a, b) => b.beneficiaryName - a.beneficiaryName
    );
    setIsBeficiary(false);
    setBenefitList(sortData);
    console.log(benefitList);
  };
  function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  const handleUploadfile = async (id, result) => {
    console.log("Result", result);
    const reader = new FileReader();
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      console.log("Binary data as ArrayBuffer:", arrayBuffer);
      const base64Content = arrayBuffer.split(",")[1];
      setFileList((prevFileList) => {
        console.log("prevFileList", prevFileList);
        let newFileList = [
          ...prevFileList,
          {
            guid: "",
            name: result?.name,
            size: result?.size,
            type: result?.type,
            binary: base64Content,
          },
        ];
        return newFileList;
      });
    };

    let bi = reader.readAsDataURL(result); // Reads the file's binary data as an ArrayBuffer
    //console.log("---Binary---",bi)

    //console.log("---File List---",fileList)

    //console.log("New File List",fileList)
    // console.log("fileJaa>>>",file)

    //console.log("id", id);
    //console.log("res", result);
    //console.log("file=>>", result?.res["@id"]);

    /*setFileList((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = [
        ...prevFileList,
        { fileID: result?.res?.uid, evidentFileID: result?.res["@id"] },
      ];
      return newFileList;
    });*/
  };
  const handleDeleteFile = (id, evidentFileID, fileName) => {
    // console.log('id>>',id)
    console.log("evidentFileID>>", evidentFileID);
    setFileList((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = prevFileList.filter(
        (item) => item.name !== evidentFileID
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
      const fileID = item?.guid;
      const fileName = item?.name;
      const binary = item?.binary;
      const requestParameter = {
        fileID: fileID,
        fileName: fileName,
      };
      //const response = await FetchDownloadFile(requestParameter);

      //const blob = new Blob([response.res.data], {
      //type: response.res.headers["content-type"],
      //});
      // Create a download link
      //const url = window.URL.createObjectURL(blob);
      //const a = document.createElement("a");
      //a.href = url;
      //a.download = fileName;
      //document.body.appendChild(a);
      //a.click();
      //document.body.removeChild(a);
      //window.URL.revokeObjectURL(url);
    } catch (error) {
      //  console.error("Error downloading file:", error);
    }
    hideLoading();
    // setIsOpenLoading(false);
  };

  const handleUploadfilePDF = async (id, result) => {
    // console.log("fileJaa>>>",file)
    console.log("Result", result);
    console.log("----PDF FIle---", fileListPDF);
    console.log("Lenght PDF", fileListPDF.length);
    const reader = new FileReader();
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      console.log("Binary data as ArrayBuffer:", arrayBuffer);
      const base64Content = arrayBuffer.split(",")[1];
      setFileListPDF((prevFileList) => {
        console.log("prevFileList", prevFileList);
        let newFileList = [
          ...prevFileList,
          {
            guid: "",
            name: result?.name,
            size: result?.size,
            type: result?.type,
            binary: base64Content,
          },
        ];
        return newFileList;
      });
    };

    let bi = reader.readAsDataURL(result);

    /*console.log("id", id);
    console.log("res", result);
    console.log("file=>>", result?.res["@id"]);

    setFileListPDF((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = [
        ...prevFileList,
        { fileID: result?.res?.uid, evidentFileID: result?.res["@id"] },
      ];
      return newFileList;
    });*/
  };

  const handleDeleteFilePDF = (id, evidentFileID, fileName) => {
    // console.log('id>>',id)
    console.log("evidentFileID>>", evidentFileID);
    setFileListPDF((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = prevFileList.filter(
        (item) => item.name !== evidentFileID
      );

      return newFileList;
    });

    /*console.log("evidentFileID>>", evidentFileID);
    setFileListPDF((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = prevFileList.filter(
        (item) => item.fileID !== evidentFileID
      );

      return newFileList;
    });*/
  };

  const handleClickDownloadFilePDF = async (item) => {
    // console.log('item',item)
    // console.log('item evidentFileID',item?.evidentFileID)
    // console.log('item name',item?.name)
    try {
      // setIsOpenLoading(true);
      showLoading();
      const fileID = item?.guid;
      const fileName = item?.name;
      const binary = item?.binary;
      const requestParameter = {
        fileID: fileID,
        fileName: fileName,
      };
      //const response = await FetchDownloadFile(requestParameter);

      //const blob = new Blob([response.res.data], {
      //type: response.res.headers["content-type"],
      //});
      // Create a download link
      //const url = window.URL.createObjectURL(blob);
      //const a = document.createElement("a");
      //a.href = url;
      //a.download = fileName;
      //document.body.appendChild(a);
      //a.click();
      //document.body.removeChild(a);
      //window.URL.revokeObjectURL(url);
    } catch (error) {
      //  console.error("Error downloading file:", error);
    }
    hideLoading();
    // setIsOpenLoading(false);
  };

  const handleUploadfileExcel = async (id, result) => {
    // console.log("fileJaa>>>",file)
    console.log("Result", result);
    console.log("----Excel FIle---", fileListPDF);
    console.log("Lenght Excel", fileListPDF.length);
    const reader = new FileReader();
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      console.log("Binary data as ArrayBuffer:", arrayBuffer);
      const base64Content = arrayBuffer.split(",")[1];
      setFileListExcel((prevFileList) => {
        console.log("prevFileList", prevFileList);
        let newFileList = [
          ...prevFileList,
          {
            guid: "",
            name: result?.name,
            size: result?.size,
            type: result?.type,
            binary: base64Content,
          },
        ];
        return newFileList;
      });
    };

    let bi = reader.readAsDataURL(result);

    /*console.log("id", id);
    console.log("res", result);
    console.log("file=>>", result?.res["@id"]);

    setFileListExcel((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = [
        ...prevFileList,
        { fileID: result?.res?.uid, evidentFileID: result?.res["@id"] },
      ];
      return newFileList;
    });*/
  };

  const handleDeleteFileExcel = (id, evidentFileID, fileName) => {
    // console.log('id>>',id)
    console.log("evidentFileID>>", evidentFileID);
    setFileListExcel((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = prevFileList.filter(
        (item) => item.name !== evidentFileID
      );

      return newFileList;
    });
  };

  const handleClickDownloadFileExcel = async (item) => {
    // console.log('item',item)
    // console.log('item evidentFileID',item?.evidentFileID)
    // console.log('item name',item?.name)
    try {
      // setIsOpenLoading(true);
      showLoading();
      const fileID = item?.guid;
      const fileName = item?.name;
      const binary = item?.binary;
      const requestParameter = {
        fileID: fileID,
        fileName: fileName,
      };
      //const response = await FetchDownloadFile(requestParameter);

      //const blob = new Blob([response.res.data], {
      //type: response.res.headers["content-type"],
      //});
      // Create a download link
      //const url = window.URL.createObjectURL(blob);
      //const a = document.createElement("a");
      //a.href = url;
      //a.download = fileName;
      //document.body.appendChild(a);
      //a.click();
      //document.body.removeChild(a);
      //window.URL.revokeObjectURL(url);
    } catch (error) {
      //  console.error("Error downloading file:", error);
    }
    hideLoading();
    // setIsOpenLoading(false);
  };

  const onSubmitForm1 = (formData) => {
    const filterBeneActive = benefitList.filter((items)=>items.beneficiaryStatus === "Active")
    if(filterBeneActive.length > 0){
      if (allowcatedEnergyList.length <= 0) {
        setIsAllocatedEnergyAmount(true);
      } else if (benefitList.length <= 0) {
        setIsBeficiary(true);
      } else {
        let errorCheckContractEnnergy = null;
        let errorYear = null;
        let errorMonth = null;
        let isError = false;
        const yearStart = parseInt(yearStartDate1.current);
        const yearEnd = parseInt(yearEndDate1.current);
        const diffYear = yearEnd - yearStart + 1;
        console.log("Diff Year", diffYear);
        console.log("Length Contract Amount", allowcatedEnergyList.length);
        const lengthCreateStartyear = allowcatedEnergyList.filter(
          (items) => items.year === yearStart
        );
        const lenghtCreateEndyear = allowcatedEnergyList.filter(
          (items) => items.year === yearEnd
        );
        console.log("Year Start", yearStart);
        console.log("Aloow List", allowcatedEnergyList);
        if (lengthCreateStartyear.length !== 0) {
          if (lenghtCreateEndyear.length !== 0) {
            for (let i = yearStart + 1; i < yearEnd; i++) {
              const checkDisappearData = allowcatedEnergyList.filter(
                (items) => items.year === i
              );
              if (checkDisappearData.length === 0) {
                errorYear = i;
                isError = true;
                break;
              }
            }
            if (isError === false) {
              for (let i = 0; i < allowcatedEnergyList.length; i++) {
                if (
                  onCheckErrorSubmit(
                    allowcatedEnergyList[i].year,
                    1,
                    allowcatedEnergyList[i].amount01
                  ) === false
                ) {
                  //console.log("Month 1 is not error")
                  if (
                    onCheckErrorSubmit(
                      allowcatedEnergyList[i].year,
                      2,
                      allowcatedEnergyList[i].amount02
                    ) === false
                  ) {
                    //console.log("Month 2 is not error")
                    if (
                      onCheckErrorSubmit(
                        allowcatedEnergyList[i].year,
                        3,
                        allowcatedEnergyList[i].amount03
                      ) === false
                    ) {
                      //console.log("Month 3 is not error")
                      if (
                        onCheckErrorSubmit(
                          allowcatedEnergyList[i].year,
                          4,
                          allowcatedEnergyList[i].amount04
                        ) === false
                      ) {
                        //console.log("Month 4 is not error")
                        if (
                          onCheckErrorSubmit(
                            allowcatedEnergyList[i].year,
                            5,
                            allowcatedEnergyList[i].amount05
                          ) === false
                        ) {
                          //console.log("Month 5 is not error")
                          if (
                            onCheckErrorSubmit(
                              allowcatedEnergyList[i].year,
                              6,
                              allowcatedEnergyList[i].amount06
                            ) === false
                          ) {
                            //console.log("Month 6 is not error")
                            if (
                              onCheckErrorSubmit(
                                allowcatedEnergyList[i].year,
                                7,
                                allowcatedEnergyList[i].amount07
                              ) === false
                            ) {
                              // console.log("Month 7 is not error")
                              if (
                                onCheckErrorSubmit(
                                  allowcatedEnergyList[i].year,
                                  8,
                                  allowcatedEnergyList[i].amount08
                                ) === false
                              ) {
                                // console.log("Month 8 is not error")
                                if (
                                  onCheckErrorSubmit(
                                    allowcatedEnergyList[i].year,
                                    9,
                                    allowcatedEnergyList[i].amount09
                                  ) === false
                                ) {
                                  //  console.log("Month 9 is not error")
                                  if (
                                    onCheckErrorSubmit(
                                      allowcatedEnergyList[i].year,
                                      10,
                                      allowcatedEnergyList[i].amount10
                                    ) === false
                                  ) {
                                    //   console.log("Month 10 is not error")
                                    if (
                                      onCheckErrorSubmit(
                                        allowcatedEnergyList[i].year,
                                        11,
                                        allowcatedEnergyList[i].amount11
                                      ) === false
                                    ) {
                                      //     console.log("Month 11 is not error")
                                      if (
                                        onCheckErrorSubmit(
                                          allowcatedEnergyList[i].year,
                                          12,
                                          allowcatedEnergyList[i].amount12
                                        ) === false
                                      ) {
                                        //console.log("Month 12 is not error")
                                        errorCheckContractEnnergy = false;
                                      } else {
                                        //console.log("Month 12 is error")
                                        errorCheckContractEnnergy = true;
                                        errorYear = allowcatedEnergyList[i].year;
                                        errorMonth = "Dec";
                                        break;
                                      }
                                    } else {
                                      //console.log("Month 11 is error")
                                      errorCheckContractEnnergy = true;
                                      errorYear = allowcatedEnergyList[i].year;
                                      errorMonth = "Nov";
                                      break;
                                    }
                                  } else {
                                    //console.log("Month 10 is error")
                                    errorCheckContractEnnergy = true;
                                    errorYear = allowcatedEnergyList[i].year;
                                    errorMonth = "Oct";
                                    break;
                                  }
                                } else {
                                  //console.log("Month 9 is error")
                                  errorCheckContractEnnergy = true;
                                  errorYear = allowcatedEnergyList[i].year;
                                  errorMonth = "Sep";
                                  break;
                                }
                              } else {
                                //console.log("Month 8 is error")
                                errorCheckContractEnnergy = true;
                                errorYear = allowcatedEnergyList[i].year;
                                errorMonth = "Aug";
                                break;
                              }
                            } else {
                              //console.log("Month 7 is error")
                              errorCheckContractEnnergy = true;
                              errorYear = allowcatedEnergyList[i].year;
                              errorMonth = "Jul";
                              break;
                            }
                          } else {
                            //console.log("Month 6 is error")
                            errorCheckContractEnnergy = true;
                            errorYear = allowcatedEnergyList[i].year;
                            errorMonth = "Jun";
                            break;
                          }
                        } else {
                          //console.log("Month 5 is error")
                          errorCheckContractEnnergy = true;
                          errorYear = allowcatedEnergyList[i].year;
                          errorMonth = "May";
                          break;
                        }
                      } else {
                        //console.log("Month 4 is error")
                        errorCheckContractEnnergy = true;
                        errorYear = allowcatedEnergyList[i].year;
                        errorMonth = "Apr";
                        break;
                      }
                    } else {
                      //console.log("Month 3 is error")
                      errorCheckContractEnnergy = true;
                      errorYear = allowcatedEnergyList[i].year;
                      errorMonth = "Mar";
                      break;
                    }
                  } else {
                    //console.log("Month 2 is error")
                    errorCheckContractEnnergy = true;
                    errorYear = allowcatedEnergyList[i].year;
                    errorMonth = "Feb";
                    break;
                  }
                } else {
                  //console.log("Month 1 is error")
                  errorCheckContractEnnergy = true;
                  errorYear = allowcatedEnergyList[i].year;
                  errorMonth = "Jan";
                  break;
                }
              }
              const param = {
                ugtGroupId: currentUGTGroup?.id,
                subscriberTypeId: 1,
                //General Information
                assignedUtilityId: formData.assignUtil.id,
                //subscriberCode: formData.subscriberCode,
                tradeAccount: formData.tradeAccountName,
                tradeAccountCode: formData.tradeAccountCode,
                redemptionAccountCode: formData.redemptionAccountCode,
                redemptionAccount: formData.redemptionAccountName,
                //tradeAccount: formData.tradeAccount,
                //retailESANo: formData.retailESANo,
                //retailESAContractStartDate: formData.retailESAContractStartDate,
                //retailESAContractEndDate: formData.retailESAContractEndDate,
                //retailESAContractDuration: formData?.retailESAContractDuration || "",
                //redemptionAccount: formData.redemptionAccount,
                subscriberStatusId: 1,
                //Organization Information
                organizationName: formData.organizationName,
                businessRegistrationNo: formData.businessRegistrationNo,
                address: formData.address,
                subdistrictCode: formData.subdistrictCode.subdistrictCode,
                subdistrictName: formData.subdistrictCode.subdistrictNameEn,
                districtCode: formData.districtCode.districtCode,
                districtName: formData.districtCode.districtNameEn,
                provinceCode: formData.stateCode.provinceCode,
                provinceName: formData.stateCode.provinceNameEn,
                countryCode: formData.countryCode.alpha2.toUpperCase(),
                countryName: formData.countryCode.name,
                postCode: formData.postCode.postalCode.toString(),
                //Personal Information
                title: formData.title?.value,
                name: formData.name,
                lastname: formData.lastname,
                email: formData.email,
                mobilePhone: formData.mobilePhone,
                officePhone: formData.officePhone,
                attorney: formData.attorney,
                //Subscription Information
                retailESANo: formData.retailESANo,
                retailESAContractStartDate: formData.retailESAContractStartDate,
                retailESAContractEndDate: formData.retailESAContractEndDate,
                retailESAContractDuration:
                  formData?.retailESAContractDuration || "",
                portfolioAssignment: formData.portfolioAssignment,
                optForUp: formData.optGreen ? "Active" : "Inactive",
                optForExcess: formData.optContract ? "Active" : "Inactive",
                feeder: formData.feeder,
                allocateEnergyAmount: allowcatedEnergyList,
                fileUploadContract: allowcatedExcelFileList,
                //Beneficiary Information
                beneficiaryInfo: benefitList /*{
                        beneficiaryName: formData.beneficiaryName,
                        beneficiaryStatus: "Active",
                        beneficiaryCountry: formData.beneficiaryCountryCode.name,
                        beneficiaryAddress: formData.beneficiaryAddress,
                        beneficiarySubdistrictCode:
                          formData.beneficiarySubdistrictCode.subdistrictCode,
                        beneficiarySubdistrictName:
                          formData.beneficiarySubdistrictCode.subdistrictNameEn,
                        beneficiaryDistrictCode:
                          formData.beneficiaryDistrictCode.districtCode,
                        beneficiaryDistrictName:
                          formData.beneficiaryDistrictCode.districtNameEn,
                        beneficiaryProviceCode: formData.beneficiaryProviceCode.provinceCode,
                        beneficiaryProviceName:
                          formData.beneficiaryProviceCode.provinceNameEn,
                        beneficiaryCountryCode:
                          formData.beneficiaryCountryCode.alpha2.toUpperCase(),
                        beneficiaryCountryName: formData.beneficiaryCountryCode.name,
                        beneficiaryPostcode:
                          formData.beneficiaryPostcode.postalCode.toString(),
                      }*/,
                //Attach File
                fileUpload: fileList,
                note: formData.note,
                subscriberContractHistoryLog:{action:"Create New",createBy: (userDetail.firstName+" "+userDetail.lastName)},
                userId: userDetail.userRefId
              };
              if (errorCheckContractEnnergy === false) {
                console.log("Contract Amount is not Error");
                setIsAllocatedEnergyAmount(false);
                setIsBeficiary(false);
                setFormData1(param);
                console.log(param);
                setShowModalCreateConfirm(true);
              } else {
                setIsShowFailModal(true);
                setMessageFailModal(
                  "Contract Energy Amount error in year " +
                    errorYear +
                    " on " +
                    errorMonth
                );
                console.log(
                  "Contract Amount Error",
                  errorYear + " " + errorMonth
                );
              }
            } else {
              setIsShowFailModal(true);
              setMessageFailModal(
                "Contract energy amount is not create in " + errorYear
              );
              console.log("Error create ContractEnergy is not match select Date");
            }
          } else {
            setIsShowFailModal(true);
            setMessageFailModal(
              "Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date"
            );
            console.log("Error is not Create Allowcated End Year");
          }
        } else {
          setIsShowFailModal(true);
          setMessageFailModal(
            "Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date"
          );
          console.log("Error is not Create Allowcated Start Year");
        }
      }
    }
    else{
      setIsShowFailModal(true)
      setMessageFailModal("Please create active beneficiary one or more.")
    }
  };
  const handleClickConfirm = () => {
    setShowModalCreateConfirm(false);
    // setIsOpenLoading(true);
    showLoading();
    if (isActiveForm1 == true) {
      console.log("Form 1");
      console.log(isError);
      dispatch(
        FunctionCreateSubscriber(FormData1, () => {
          //const isFailError = useSelector((state)=>state.subscriber.isOpenFailModal)
          if (isError === false) {
            console.log("Create Form 1 success");
            // setIsOpenLoading(false);
            hideLoading();
            setShowModalComplete(true);
          } else {
            console.log("Create form 1 error");
            hideLoading();
            setIsShowFailError(true);
            setMessageFailModal(errorMessage);
          }
        })
      );
    } else {
      console.log("Create form 2");
      dispatch(
        FunctionCreateAggregateSubscriber(FormData2, () => {
          // setIsOpenLoading(false);
          //hideLoading();
          //setShowModalComplete(true);
          if (isError === false) {
            console.log("Create form 2 success");
            // setIsOpenLoading(false);
            hideLoading();
            setShowModalComplete(true);
          } else {
            console.log("Create form 2 error");
            hideLoading();
            setIsShowFailError(true);
            setMessageFailModal(errorMessage);
          }
        })
      );
    }
  };

  const handleCloseModalConfirm = (val) => {
    setShowModalCreateConfirm(false);
  };

  const onSubmitForm2 = (formData) => {
    if (allowcatedEnergyList.length <= 0) {
      setIsAllocatedEnergyAmount(true);
    } else {
      let errorCheckContractEnnergy = null;
      let errorYear = null;
      let errorMonth = null;
      let isError = false;
      const yearStart = parseInt(yearStartDate1.current);
      const yearEnd = parseInt(yearEndDate1.current);
      const diffYear = yearEnd - yearStart + 1;
      console.log("Diff Year", diffYear);
      console.log("Length Contract Amount", allowcatedEnergyList.length);
      const lengthCreateStartyear = allowcatedEnergyList.filter(
        (items) => items.year === yearStart
      );
      const lenghtCreateEndyear = allowcatedEnergyList.filter(
        (items) => items.year === yearEnd
      );
      if (lengthCreateStartyear.length !== 0) {
        if (lenghtCreateEndyear.length !== 0) {
          for (let i = yearStart + 1; i < yearEnd; i++) {
            const checkDisappearData = allowcatedEnergyList.filter(
              (items) => items.year === i
            );
            if (checkDisappearData.length === 0) {
              errorYear = i;
              isError = true;
              break;
            }
          }

          if (isError === false) {
            for (let i = 0; i < allowcatedEnergyList.length; i++) {
              if (
                onCheckErrorSubmit(
                  allowcatedEnergyList[i].year,
                  1,
                  allowcatedEnergyList[i].amount01
                ) === false
              ) {
                console.log("Month 1 is not error");
                if (
                  onCheckErrorSubmit(
                    allowcatedEnergyList[i].year,
                    2,
                    allowcatedEnergyList[i].amount02
                  ) === false
                ) {
                  console.log("Month 2 is not error");
                  if (
                    onCheckErrorSubmit(
                      allowcatedEnergyList[i].year,
                      3,
                      allowcatedEnergyList[i].amount03
                    ) === false
                  ) {
                    console.log("Month 3 is not error");
                    if (
                      onCheckErrorSubmit(
                        allowcatedEnergyList[i].year,
                        4,
                        allowcatedEnergyList[i].amount04
                      ) === false
                    ) {
                      console.log("Month 4 is not error");
                      if (
                        onCheckErrorSubmit(
                          allowcatedEnergyList[i].year,
                          5,
                          allowcatedEnergyList[i].amount05
                        ) === false
                      ) {
                        console.log("Month 5 is not error");
                        if (
                          onCheckErrorSubmit(
                            allowcatedEnergyList[i].year,
                            6,
                            allowcatedEnergyList[i].amount06
                          ) === false
                        ) {
                          console.log("Month 6 is not error");
                          if (
                            onCheckErrorSubmit(
                              allowcatedEnergyList[i].year,
                              7,
                              allowcatedEnergyList[i].amount07
                            ) === false
                          ) {
                            console.log("Month 7 is not error");
                            if (
                              onCheckErrorSubmit(
                                allowcatedEnergyList[i].year,
                                8,
                                allowcatedEnergyList[i].amount08
                              ) === false
                            ) {
                              console.log("Month 8 is not error");
                              if (
                                onCheckErrorSubmit(
                                  allowcatedEnergyList[i].year,
                                  9,
                                  allowcatedEnergyList[i].amount09
                                ) === false
                              ) {
                                console.log("Month 9 is not error");
                                if (
                                  onCheckErrorSubmit(
                                    allowcatedEnergyList[i].year,
                                    10,
                                    allowcatedEnergyList[i].amount10
                                  ) === false
                                ) {
                                  console.log("Month 10 is not error");
                                  if (
                                    onCheckErrorSubmit(
                                      allowcatedEnergyList[i].year,
                                      11,
                                      allowcatedEnergyList[i].amount11
                                    ) === false
                                  ) {
                                    console.log("Month 11 is not error");
                                    if (
                                      onCheckErrorSubmit(
                                        allowcatedEnergyList[i].year,
                                        12,
                                        allowcatedEnergyList[i].amount12
                                      ) === false
                                    ) {
                                      console.log("Month 12 is not error");
                                      errorCheckContractEnnergy = false;
                                    } else {
                                      console.log("Month 12 is error");
                                      errorCheckContractEnnergy = true;
                                      errorYear = allowcatedEnergyList[i].year;
                                      errorMonth = "Dec";
                                      break;
                                    }
                                  } else {
                                    console.log("Month 11 is error");
                                    errorCheckContractEnnergy = true;
                                    errorYear = allowcatedEnergyList[i].year;
                                    errorMonth = "Nov";
                                    break;
                                  }
                                } else {
                                  console.log("Month 10 is error");
                                  errorCheckContractEnnergy = true;
                                  errorYear = allowcatedEnergyList[i].year;
                                  errorMonth = "Oct";
                                  break;
                                }
                              } else {
                                console.log("Month 9 is error");
                                errorCheckContractEnnergy = true;
                                errorYear = allowcatedEnergyList[i].year;
                                errorMonth = "Sep";
                                break;
                              }
                            } else {
                              console.log("Month 8 is error");
                              errorCheckContractEnnergy = true;
                              errorYear = allowcatedEnergyList[i].year;
                              errorMonth = "Aug";
                              break;
                            }
                          } else {
                            console.log("Month 7 is error");
                            errorCheckContractEnnergy = true;
                            errorYear = allowcatedEnergyList[i].year;
                            errorMonth = "Jul";
                            break;
                          }
                        } else {
                          console.log("Month 6 is error");
                          errorCheckContractEnnergy = true;
                          errorYear = allowcatedEnergyList[i].year;
                          errorMonth = "Jun";
                          break;
                        }
                      } else {
                        console.log("Month 5 is error");
                        errorCheckContractEnnergy = true;
                        errorYear = allowcatedEnergyList[i].year;
                        errorMonth = "May";
                        break;
                      }
                    } else {
                      console.log("Month 4 is error");
                      errorCheckContractEnnergy = true;
                      errorYear = allowcatedEnergyList[i].year;
                      errorMonth = "Apr";
                      break;
                    }
                  } else {
                    console.log("Month 3 is error");
                    errorCheckContractEnnergy = true;
                    errorYear = allowcatedEnergyList[i].year;
                    errorMonth = "Mar";
                    break;
                  }
                } else {
                  console.log("Month 2 is error");
                  errorCheckContractEnnergy = true;
                  errorYear = allowcatedEnergyList[i].year;
                  errorMonth = "Feb";
                  break;
                }
              } else {
                console.log("Month 1 is error");
                errorCheckContractEnnergy = true;
                errorYear = allowcatedEnergyList[i].year;
                errorMonth = "Jan";
                break;
              }
            }
            const param = {
              ugtGroupId: currentUGTGroup?.id,
              subscriberTypeId: 2,
              assignedUtilityId: formData.assignUtil.id,
              //tradeAccount: formData.tradeAccount,
              name: formData.name,
              tradeAccount: formData.tradeAccountName,
              tradeAccountCode: formData.tradeAccountCode,
              retailESAContractStartDate: formData.retailESAContractStartDate,
              retailESAContractEndDate: formData.retailESAContractEndDate,
              retailESAContractDuration:
                formData?.retailESAContractDuration || "",
              portfolioAssignment: formData.portfolioAssignment,
              optForUp: formData.optGreen ? "Active" : "Inactive",
              optForExcess: formData.optContract ? "Active" : "Inactive",
              subscribersFilePdf: fileListPDF,
              subscribersFileXls: fileListExcel,
              note: formData.note,
              subscriberStatusId: 1,
              //aggregateAllocatedEnergy: parseInt(formData.aggregateAllocatedEnergy),
              allocateEnergyAmount: allowcatedEnergyList,
              fileUploadContract: allowcatedExcelFileList,
              subscriberContractHistoryLog:{action:"Create New",createBy: (userDetail.firstName+" "+userDetail.lastName)},
              userId: userDetail.userRefId
            };
            if (errorCheckContractEnnergy === false) {
              console.log("Contract Amount is not Error");
              console.log("param", param);
              setFormData2(param);
              setShowModalCreateConfirm(true);
            } else {
              setIsShowFailModal(true);
              setMessageFailModal(
                "Contract Energy Amount error in year " +
                  errorYear +
                  " on " +
                  errorMonth
              );
              console.log(
                "Contract Amount Error",
                errorYear + " " + errorMonth
              );
            }
          } else {
            setIsShowFailModal(true);
            setMessageFailModal(
              "Contract energy amount is not create in " + errorYear
            );
            console.log("Error create ContractEnergy is not match select Date");
          }
        } else {
          setIsShowFailModal(true);
          setMessageFailModal(
            "Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date"
          );
          console.log("Error is not Create Allowcated End Year");
        }
      } else {
        setIsShowFailModal(true);
        setMessageFailModal(
          "Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date"
        );
        console.log("Error is not Create Allowcated Start Year");
      }
    }
  };

  const handleChangeCommissioningDate = (date) => {
    setSelectedCommisionDate(date);
    setValue("retailESAContractEndDate", "");
    setValue("retailESAContractDuration", "");
    splitStartDate(getValues("retailESAContractStartDate"));

    if (date) {
      setDisableRequestedEffectiveDate(false);
    } else {
      setDisableRequestedEffectiveDate(true);
    }
  };

  const splitStartDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    setYearStartDate(year);
    yearStartDate1.current = year;
    setMonthStartDate(month);
    monthStartDate1.current = month;
    setDayStartDate(day);
    dayStartDate1.current = day;
    console.log("Year Start", yearStartDate1.current);
    console.log("Month Start", monthStartDate1.current);
    console.log("Day Start", dayStartDate1.current);
  };

  const requestedEffectiveDateDisableDateCal = (day) => {
    let dateValue = new Date(selectedCommisionDate);
    const previousDate = new Date(dateValue);
    previousDate.setHours(0, 0, 0, 0);
    previousDate.setDate(dateValue.getDate() + 1);

    let currentDate = new Date();
    const previousCurrentDate = new Date(currentDate);
    previousCurrentDate.setDate(currentDate.getDate() - 1);
    const condition1 = day < previousDate;
    const disable = condition1;

    return disable;
  };

  const handleChangeContractEndDate = (date) => {
    let dateStart = dayjs(selectedCommisionDate).hour(0).minute(0).second(0);
    let dateEnd = dayjs(date);
    dateEnd = dateEnd.add(1, "day"); // บวก 1 วันเพื่อนับรวมวันที่สิ้นสุดด้วย

    let years = dateEnd.diff(dateStart, "year"); // หาจำนวนปีที่ต่างกัน
    dateStart = dateStart.add(years, "years"); // บวกจำนวนปีที่ต่างกันเข้าไป เพื่อไปเทียบจำนวนเดือนต่อ

    let months = dateEnd.diff(dateStart, "month"); // หาจำนวนเดือนที่ต่างกัน
    dateStart = dateStart.add(months, "months"); // บวกจำนวนเดือนที่ต่างกันเข้าไป เพื่อไปเทียบจำนวนวันต่อ

    
    let days = dateEnd.diff(dateStart, "day"); // หาจำนวนวันที่ต่างกัน

    let durationString = "";
    if (years > 0) durationString += `${years} Year(s) `;
    if (months > 0) durationString += `${months} Month(s) `;
    if (days > 0) durationString += `${days} Day(s)`;

    setValue("retailESAContractDuration", durationString.trim());
    splitEndDate(getValues("retailESAContractEndDate"));
  };
  const splitEndDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    setYearEndDate(year);
    yearEndDate1.current = year;
    setMonthEndDate(month);
    monthEndDate1.current = month;
    setDayEndDate(day);
    dayEndDate1.current = day;
    console.log("Year End", yearEndDate);
    console.log(yearEndDate1.current);
    console.log("Month End", monthEndDate);
    console.log(monthEndDate1.current);
    console.log("Day End", dayEndDate);
    console.log(dayEndDate1.current);
  };

  // --------- Country, Province,District,Subdistrict,Postcode Process ---------- //
  const onChangeCountry = (value) => {};
  const onChangeProvince = (value) => {
    if (currentDistrict?.id) {
      setValue("districtCode", null);
      setCurrentDistrict(null);

      setValue("subdistrictCode", null);
      setCurrentSubDistrict(null);

      setValue("postCode", null);
      setCurrentPostCode(null);
      setPostCodeListForDisplay([]);

      dispatch(FetchSubDistrictList());
    }
    setCurrentProvicne(value);
    dispatch(FetchDistrictList(value?.provinceCode));
  };

  const onChangeDistrict = (value) => {
    if (currentSubDistrict?.id) {
      setValue("subdistrictCode", null);
      setCurrentSubDistrict(null);
      setValue("postCode", null);
      setCurrentPostCode(null);
      setPostCodeListForDisplay([]);
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

  // --------- Country, Province,District,Subdistrict,Postcode Process ---------- //
  const onChangeBeneficiaryCountry = (value) => {};
  const onChangeBeneficiaryProvince = (value) => {
    if (currentBeneficiaryDistrict?.id) {
      setValue("beneficiaryDistrictCode", null);
      setCurrentBeneficiaryDistrict(null);

      setValue("beneficiarySubdistrictCode", null);
      setCurrentBeneficiarySubDistrict(null);

      setValue("beneficiaryPostcode", null);
      setCurrentBeneficiaryPostCode(null);
      setPostCodeBeneficiaryListForDisplay([]);

      dispatch(FetchSubDistrictBeneList());
    }
    setCurrentBeneficiaryProvicne(value);
    dispatch(FetchDistrictBeneList(value?.provinceCode));
  };

  const onChangeBeneficiaryDistrict = (value) => {
    if (currentBeneficiarySubDistrict?.id) {
      setValue("beneficiarySubdistrictCode", null);
      setCurrentBeneficiarySubDistrict(null);

      setValue("beneficiaryPostcode", null);
      setCurrentBeneficiaryPostCode(null);
      setPostCodeBeneficiaryListForDisplay([]);
    }

    setCurrentBeneficiaryDistrict(value);
    dispatch(
      FetchSubDistrictBeneList(
        value?.districtCode,
        currentBeneficiaryProvince?.provinceCode
      )
    );
  };

  const onChangeBeneficiarySubDistrict = (value) => {
    const postCodeFilter = postcodeBeneficiaryList.filter(
      (item) =>
        item.provinceCode == currentBeneficiaryProvince?.provinceCode &&
        item.districtCode == currentBeneficiaryDistrict?.districtCode &&
        item.postalCode == value?.postalCode
    );
    if (postCodeFilter.length > 0) {
      const newPostCodeListForDisplay = _.uniqBy(postCodeFilter, "postalCode");
      setPostCodeBeneficiaryListForDisplay(newPostCodeListForDisplay);
    } else {
      setPostCodeBeneficiaryListForDisplay([]);
    }

    setCurrentBeneficiarySubDistrict(value);
  };

  const onChangeBeneficiaryPostCode = (value) => {
    setCurrentBeneficiaryPostCode(value);
  };
  const handleClickForm1 = () => {
    if (isActiveForm1 == false) {
      setIsActiveForm1(!isActiveForm1);
      setIsActiveForm2(!isActiveForm2);
      setAllowcatedEnergyList([]);
      setBenefitList([]);
      setAllowcatesExcelfileList([]);
      setValue("optGreen", false);
      setValue("optContract", false);
      setFileListExcel([]);
      setFileListPDF([]);
      setFileList([]);
    }
  };
  const handleClickForm2 = () => {
    if (isActiveForm2 == false) {
      setIsActiveForm1(!isActiveForm1);
      setIsActiveForm2(!isActiveForm2);
      setAllowcatedEnergyList([]);
      setAllowcatesExcelfileList([]);
      setValue("optGreen", false);
      setValue("optContract", false);
      setFileListExcel([]);
      setFileListPDF([]);
      setFileList([]);
    }
  };

  const getStyleContractAllowcated = (
    year,
    month,
    value,
    isWarning = false
  ) => {
    const years = parseInt(year);
    const months = parseInt(month);
    const values = parseInt(value);
    const yearStart = parseInt(yearStartDate1.current);
    const yearEnd = parseInt(yearEndDate1.current);
    const monthStart = parseInt(monthStartDate1.current);
    const monthEnd = parseInt(monthEndDate1.current);
    //console.log("Value : ",values)
    if (years >= yearStart && years <= yearEnd) {
      if (years === yearStart) {
        if (yearStart !== yearEnd) {
          if (months >= monthStart) {
            if (values < 0) {
              return isWarning
                ? "bg-[#F4433614] text-[#F4433614]"
                : "bg-[#F4433614] text-[#F44336]";
            } else {
              return isWarning ? "text-white" : undefined;
            }
          } else {
            if (values !== 0) {
              return isWarning
                ? "bg-[#F4433614] text-[#F4433614]"
                : "bg-[#F4433614] text-[#F44336]";
            } else {
              return isWarning ? "text-white" : undefined;
            }
          }
        } else {
          if (months >= monthStart && months <= monthEnd) {
            if (values < 0) {
              return isWarning
                ? "bg-[#F4433614] text-[#F4433614]"
                : "bg-[#F4433614] text-[#F44336]";
            } else {
              return isWarning ? "text-white" : undefined;
            }
          } else {
            if (values !== 0) {
              return isWarning
                ? "bg-[#F4433614] text-[#F4433614]"
                : "bg-[#F4433614] text-[#F44336]";
            } else {
              return isWarning ? "text-white" : undefined;
            }
          }
        }
      } else if (years === yearEnd) {
        if (months <= monthEnd) {
          if (values < 0) {
            return isWarning
              ? "bg-[#F4433614] text-[#F4433614]"
              : "bg-[#F4433614] text-[#F44336]";
          } else {
            return isWarning ? "text-white" : undefined;
          }
        } else {
          if (values !== 0) {
            return isWarning
              ? "bg-[#F4433614] text-[#F4433614]"
              : "bg-[#F4433614] text-[#F44336]";
          } else {
            return isWarning ? "text-white" : undefined;
          }
        }
      } else {
        if (values < 0) {
          return isWarning
            ? "bg-[#F4433614] text-[#F4433614]"
            : "bg-[#F4433614] text-[#F44336]";
        } else {
          return isWarning ? "text-white" : undefined;
        }
      }
    } else {
      return isWarning
        ? "bg-[#F4433614] text-[#F4433614]"
        : "bg-[#F4433614] text-[#F44336]";
    }
  };

  const getWarningAssign = (year, month, value) => {
    const years = parseInt(year);
    const months = parseInt(month);
    const values = parseInt(value);
    const yearStart = parseInt(yearStartDate);
    const yearEnd = parseInt(yearEndDate);
    const monthStart = parseInt(monthStartDate);
    const monthEnd = parseInt(monthEndDate);
    if (years >= yearStart && years <= yearEnd) {
      if (years === yearStart) {
        if (yearStart !== yearEnd) {
          if (months >= monthStart) {
            if (values < 0) {
              return (
                <img
                  src={TriWarning}
                  alt="React Logo"
                  width={15}
                  height={15}
                  className="inline-block"
                />
              );
            } else {
              return "...";
            }
          } else {
            if (values !== 0) {
              return (
                <img
                  src={TriWarning}
                  alt="React Logo"
                  width={15}
                  height={15}
                  className="inline-block"
                />
              );
            } else {
              return "...";
            }
          }
        } else {
          if (months >= monthStart && months <= monthEnd) {
            if (values < 0) {
              return (
                <img
                  src={TriWarning}
                  alt="React Logo"
                  width={15}
                  height={15}
                  className="inline-block"
                />
              );
            } else {
              return "...";
            }
          } else {
            if (values !== 0) {
              return (
                <img
                  src={TriWarning}
                  alt="React Logo"
                  width={15}
                  height={15}
                  className="inline-block"
                />
              );
            } else {
              return "...";
            }
          }
        }
      } else if (years === yearEnd) {
        if (months <= monthEnd) {
          if (values < 0) {
            return (
              <img
                src={TriWarning}
                alt="React Logo"
                width={15}
                height={15}
                className="inline-block"
              />
            );
          } else {
            return "...";
          }
        } else {
          if (values !== 0) {
            return (
              <img
                src={TriWarning}
                alt="React Logo"
                width={15}
                height={15}
                className="inline-block"
              />
            );
          } else {
            return "...";
          }
        }
      } else {
        if (values < 0) {
          return (
            <img
              src={TriWarning}
              alt="React Logo"
              width={15}
              height={15}
              className="inline-block"
            />
          );
        } else {
          return "...";
        }
      }
    } else {
      return (
        <img
          src={TriWarning}
          alt="React Logo"
          width={15}
          height={15}
          className="inline-block"
        />
      );
    }
  };

  const onCheckErrorSubmit = (year, month, value) => {
    const years = parseInt(year);
    const months = parseInt(month);
    const values = parseInt(value);
    const yearStart = parseInt(yearStartDate);
    const yearEnd = parseInt(yearEndDate);
    const monthStart = parseInt(monthStartDate);
    const monthEnd = parseInt(monthEndDate);
    if (years >= yearStart && years <= yearEnd) {
      if (years === yearStart) {
        if (yearStart !== yearEnd) {
          if (months >= monthStart) {
            if (values < 0) {
              return true;
            } else {
              return false;
            }
          } else {
            if (values !== 0) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          if (months >= monthStart && months <= monthEnd) {
            if (values < 0) {
              return true;
            } else {
              return false;
            }
          } else {
            if (values !== 0) {
              return true;
            } else {
              return false;
            }
          }
        }
      } else if (years === yearEnd) {
        if (months <= monthEnd) {
          if (values < 0) {
            return true;
          } else {
            return false;
          }
        } else {
          if (values !== 0) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        if (values < 0) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  };

  const handleDeleteBene = (data) => {
    setIsShowDeleteBene(true);
    setDataBeneDelete(data);
  };

  const handleCloseDeleteBene = () => {
    setIsShowDeleteBene(false);
  };

  const onClickDelBene = () => {
    onClickDeleteBeneBtn(dataBeneDelete);
    setIsShowDeleteBene(false);
  };


  function downloadZip(filesData, outputZipFilename) {
    const zip = new JSZip();
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}_${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}_${now.getFullYear()}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}_${now.getMinutes().toString().padStart(2, "0")}_${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    const zipfilename = "Download_All_" + formattedDateTime;

    // Add each file to the ZIP
    filesData.forEach((file) => {
      const { name, binary } = file;

      // Decode the Base64 string and convert it to binary data
      const binaryData = atob(binary);
      const arrayBuffer = new Uint8Array(binaryData.length);

      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }

      // Add the binary data as a file to the ZIP
      zip.file(name, arrayBuffer);
      console.log("Zip", zip);
    });

    // Generate the ZIP file and trigger the download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, zipfilename);
    });
  }

  function downloadAllFileAggregate(outputZipFilename) {
    const zip = new JSZip();
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}_${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}_${now.getFullYear()}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}_${now.getMinutes().toString().padStart(2, "0")}_${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    const zipfilename = "Download_All_" + formattedDateTime;
    const PDFFile = fileListPDF;
    const ExcelFile = fileListExcel;
    const FileBinary = [];
    FileBinary.push(PDFFile[0]);
    FileBinary.push(ExcelFile[0]);
    console.log(FileBinary);
    // Add each file to the ZIP
    FileBinary.forEach((file) => {
      const { name, binary } = file;

      // Decode the Base64 string and convert it to binary data
      const binaryData = atob(binary);
      const arrayBuffer = new Uint8Array(binaryData.length);

      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }

      // Add the binary data as a file to the ZIP
      zip.file(name, arrayBuffer);
      console.log("Zip", zip);
    });

    // Generate the ZIP file and trigger the download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, zipfilename);
    });
  }

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto text-left">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                Subscriber Registration
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Subscriber Management / Subscriber
                Registration
              </p>
            </div>

            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <FaChevronCircleLeft
                      className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                      size="30"
                      onClick={
                        (/*,window.location.reload()*/) =>
                          navigate(WEB_URL.SUBSCRIBER_LIST)
                      }
                    />
                    <p className="mb-0 font-semibold text-15 text-md">
                      Subscribers Info <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-red-500">
                      * Requried field
                    </label>
                  </div>
                </div>

                <hr />
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="font-bold text-base">
                      Subscriber Type
                    </label>
                    <label className="text-red-600 ml-1 text-sm font-bold">
                      *
                    </label>
                  </div>
                  <div>
                    {/*permission === "EGAT Subscriber Manager" && (
                      <button
                        className={`h-12 px-10 mr-4 rounded duration-150 border-2 text-BREAD_CRUMB border-BREAD_CRUMB ${
                          isActiveForm1
                            ? "bg-BREAD_CRUMB text-MAIN_SCREEN_BG font-semibold"
                            : "bg-MAIN_SCREEN_BG hover:bg-BREAD_CRUMB hover:text-MAIN_SCREEN_BG"
                        }`}
                        onClick={handleClickForm1}
                      >
                        Subscriber
                      </button>
                    )*/}
                    <button
                        className={`h-12 px-10 mr-4 rounded duration-150 border-2 text-BREAD_CRUMB border-BREAD_CRUMB ${
                          isActiveForm1
                            ? "bg-BREAD_CRUMB text-MAIN_SCREEN_BG font-semibold"
                            : "bg-MAIN_SCREEN_BG hover:bg-BREAD_CRUMB hover:text-MAIN_SCREEN_BG"
                        }`}
                        onClick={handleClickForm1}
                      >
                        Subscriber
                      </button>
                    <button
                      className={`h-12 px-10 mr-4 rounded duration-150 border-2 text-BREAD_CRUMB border-BREAD_CRUMB ${
                        isActiveForm2
                          ? "bg-BREAD_CRUMB text-MAIN_SCREEN_BG font-semibold"
                          : "bg-MAIN_SCREEN_BG hover:bg-BREAD_CRUMB hover:text-MAIN_SCREEN_BG"
                      }`}
                      onClick={handleClickForm2}
                    >
                      Aggregating Subscriber
                    </button>
                  </div>
                </div>
              </div>
            </Card>
            {/*<Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
              <div className="flex flex-col gap-3">
                <div>
                  <label className="font-bold text-base">Subscriber Type</label><label className="text-red-600 ml-1 text-sm font-bold">*</label>
                </div>
                <div>
                  {permission === "EGAT Subscriber Manager" && (
                    <button
                      className={`h-12 px-10 mr-4 rounded duration-150 border-2 text-BREAD_CRUMB border-BREAD_CRUMB ${
                        isActiveForm1
                          ? "bg-BREAD_CRUMB text-MAIN_SCREEN_BG font-semibold"
                          : "bg-MAIN_SCREEN_BG hover:bg-BREAD_CRUMB hover:text-MAIN_SCREEN_BG"
                      }`}
                      onClick={handleClickForm1}
                    >
                      Subscriber
                    </button>
                  )}

                  <button
                    className={`h-12 px-10 mr-4 rounded duration-150 border-2 text-BREAD_CRUMB border-BREAD_CRUMB ${
                      isActiveForm2
                        ? "bg-BREAD_CRUMB text-MAIN_SCREEN_BG font-semibold"
                        : "bg-MAIN_SCREEN_BG hover:bg-BREAD_CRUMB hover:text-MAIN_SCREEN_BG"
                    }`}
                    onClick={handleClickForm2}
                  >
                    Aggregate Subscriber
                  </button>
                </div>
              </div>
            </Card>*/}

            <div>
              {/*Form 1 */}
              {isActiveForm1 && (
                <form>
                  <div className="flex flex-col gap-3">
                    {/* General Information */}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full overflow-visible"
                      padding="xl"
                    >
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                General Information
                              </h6>
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="assignUtil"
                                control={control}
                                defaultValue={null}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <MySelect
                                    {...field}
                                    id={"assignUtil"}
                                    options={dropDrowList.assignedUtility}
                                    displayProp={"name"}
                                    valueProp={"abbr"}
                                    label={"Assigned Utility"}
                                    validate={" *"}
                                    error={errors.assignUtil}
                                    disable={disableUtility}
                                  />
                                )}
                              />
                            </div>

                            {/*<div className="md:col-span-3">
                              <Controller
                                name="subscriberCode"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: value => /^[A-Za-z0-9\s]*$/.test(value) || 'Only English characters and numbers are allowed'
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"subscriberCode"}
                                    type={"text"}
                                    label={"Subscriber Code"}
                                    error={errors.subscriberCode}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>*/}
                            <div className="md:col-span-3"></div>

                            <div className="md:col-span-3">
                              <Controller
                                name="tradeAccountName"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"tradeAccountName"}
                                    type={"text"}
                                    label={"Trade Account Name"}
                                    error={errors.tradeAccountName}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>

                            <div className="md:col-span-3">
                              <Controller
                                name="tradeAccountCode"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"tradeAccountCode"}
                                    type={"text"}
                                    label={"Trade Account Code"}
                                    error={errors.tradeAccountCode}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>

                            <div className="md:col-span-3">
                              <Controller
                                name="redemptionAccountName"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"redemptionAccountName"}
                                    type={"text"}
                                    label={"Redemption Account Name"}
                                    error={errors.redemptionAccountName}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>

                            <div className="md:col-span-3">
                              <Controller
                                name="redemptionAccountCode"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"redemptionAccountCode"}
                                    type={"text"}
                                    label={"Redemption Account Code"}
                                    error={errors.redemptionAccountCode}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            {/*<div className="md:col-span-3">
                              <Controller
                                name="tradeAccount"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"tradeAccount"}
                                    type={"text"}
                                    label={"Trade Account"}
                                    error={errors.tradeAccount}
                                    validate={" *"}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="retailESANo"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"retailESANo"}
                                    type={"text"}
                                    label={"Retail ESA No."}
                                    error={errors.retailESANo}
                                    validate={" *"}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="redemptionAccount"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"redemptionAccount"}
                                    type={"text"}
                                    label={"Redemption Account"}
                                    error={errors.redemptionAccount}
                                    validate={" *"}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="retailESAContractStartDate"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <DatePicker
                                    {...field}
                                    id={"retailESAContractStartDate"}
                                    label={"Retail ESA Contract Start Date"}
                                    error={errors.retailESAContractStartDate}
                                    onChangeInput={
                                      handleChangeCommissioningDate
                                    }
                                    validate={" *"}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="retailESAContractEndDate"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <DatePicker
                                    {...field}
                                    id={"retailESAContractEndDate"}
                                    label={"Retail ESA Contract End Date"}
                                    error={errors.retailESAContractEndDate}
                                    onCalDisableDate={
                                      requestedEffectiveDateDisableDateCal
                                    }
                                    onChangeInput={handleChangeContractEndDate}
                                    isDisable={disableRequestedEffectiveDate}
                                    validate={" *"}
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

                            <div className="md:col-span-3">
                              <Controller
                                name="retailESAContractDuration"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"retailESAContractDuration"}
                                    type={"text"}
                                    label={"Retail ESA Contract Duration"}
                                    error={errors.retailESAContractDuration}
                                    disabled
                                  />
                                )}
                              />
                            </div>*/}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Organization Information */}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full overflow-visible"
                      padding="xl"
                    >
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                Organization Information
                              </h6>
                            </div>
                            <div className="md:col-span-6">
                              <Controller
                                name="organizationName"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"organizationName"}
                                    type={"text"}
                                    label={"Organization Name"}
                                    error={errors.organizationName}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-6">
                              <Controller
                                name="businessRegistrationNo"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"businessRegistrationNo"}
                                    type={"text"}
                                    label={"Business Registration No."}
                                    error={errors.businessRegistrationNo}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-6">
                              <Controller
                                name="address"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"address"}
                                    type={"text"}
                                    label={"Address"}
                                    error={errors.address}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
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
                                  />
                                )}
                              />
                            </div>

                            <div className="md:col-span-2">
                              <Controller
                                name="countryCode"
                                control={control}
                                defaultValue={null}
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
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Personal Information */}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full overflow-visible"
                      padding="xl"
                    >
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                Personal Information
                              </h6>
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="title"
                                control={control}
                                defaultValue={null}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <MySelect
                                    {...field}
                                    id={"title"}
                                    options={dropdownTitle}
                                    displayProp={"name"}
                                    valueProp={"value"}
                                    label={"Title"}
                                    validate={" *"}
                                    error={errors.title}
                                    // ... other props
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="name"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"name"}
                                    type={"text"}
                                    label={"Name"}
                                    error={errors.name}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="lastname"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"lastname"}
                                    type={"text"}
                                    label={"Lastname"}
                                    error={errors.lastname}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="email"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                  pattern: {
                                    value:
                                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format",
                                  },
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"email"}
                                    type={"text"}
                                    label={"Email"}
                                    error={errors.email}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="mobilePhone"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"mobilePhone"}
                                    type={"text"}
                                    label={"Telephone (Mobile)"}
                                    error={errors.mobilePhone}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="officePhone"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"officePhone"}
                                    type={"text"}
                                    label={"Telephone (Office)"}
                                    error={errors.officePhone}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>

                            <div className="md:col-span-6">
                              <Controller
                                name="attorney"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"attorney"}
                                    type={"text"}
                                    label={"Attorney / Attorney-in-fact"}
                                    error={errors.attorney}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Contract Information */}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full overflow-visible"
                      padding="xl"
                    >
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            {/*Fill Data*/}
                            <div className="md:col-span-6 mb-4">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                Contract Information
                              </h6>
                            </div>
                            <div className="md:col-span-3 ml-2">
                              <Controller
                                name="retailESANo"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"retailESANo"}
                                    type={"text"}
                                    label={"Retail ESA No."}
                                    error={errors.retailESANo}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3 ml-2">
                              <Controller
                                name="retailESAContractStartDate"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <DatePickerSubscriber
                                    {...field}
                                    id={"retailESAContractStartDate"}
                                    label={"Retail ESA Start Date"}
                                    error={errors.retailESAContractStartDate}
                                    onChangeInput={
                                      handleChangeCommissioningDate
                                    }
                                    validate={" *"}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3 ml-2">
                              <Controller
                                name="retailESAContractEndDate"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <DatePickerSubscriber
                                    {...field}
                                    id={"retailESAContractEndDate"}
                                    label={"Retail ESA End Date"}
                                    error={errors.retailESAContractEndDate}
                                    onCalDisableDate={
                                      requestedEffectiveDateDisableDateCal
                                    }
                                    onChangeInput={handleChangeContractEndDate}
                                    isDisable={disableRequestedEffectiveDate}
                                    validate={" *"}
                                    showTooltip={true}
                                    textTooltip={
                                      "Please select the Retail ESA Contract Start Date first."
                                    }
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
                            <div className="md:col-span-3 ml-2">
                              <Controller
                                name="retailESAContractDuration"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"retailESAContractDuration"}
                                    type={"text"}
                                    label={"Retail ESA Duration"}
                                    error={errors.retailESAContractDuration}
                                    disabled
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3 ml-2">
                              <Controller
                                name="portfolioAssignment"
                                control={control}
                                rules={{
                                  
                                  /*validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",*/
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"portfolioAssignment"}
                                    type={"text"}
                                    label={"Portfolio Assignment"}
                                    error={errors.portfolioAssignment}
                                    //validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            {/*Feeder Name*/}
                            <div className="flex justify-between mt-2 ml-2 md:col-span-6">
                              <div>
                                <strong>
                                  Feeder/Meter Name{" "}
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
                                <p className="m-0">Add Feeder</p>
                              </button>
                            </div>
                            <div className="mb-4 md:col-span-6">
                              {fields.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="flex items-center mb-1"
                                >
                                  <div className="flex-grow">
                                    <Controller
                                      name={`feeder[${index}].feederName`}
                                      control={control}
                                      rules={{
                                        required: "This field is required",
                                        validate: (value) =>
                                          value.trim() !== "" ||
                                          "Input cannot be just spaces",
                                      }}
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          id={index}
                                          validate={" *"}
                                          placeholder={`Feeder Name #${
                                            index + 1
                                          }`}
                                          error={
                                            errors.feeder?.[index]?.feederName
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
                            {/*Check Box*/}
                            <div className="mt-3 ml-2 mb-4 md:col-span-6">
                              <div className="font-bold col-span-3">
                                Additional Contract Condition
                              </div>
                              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                                <div className="mt-2">
                                  <Controller
                                    name="optGreen"
                                    control={control}
                                    render={({ field }) => (
                                      <CheckBox
                                        {...field}
                                        id={"optGreen"}
                                        type={"checkbox"}
                                        label={
                                          "Opt for up to 15% green electricity from UGT1"
                                        }
                                        disabled={currentUGTGroup?.id === 1?true:false}
                                        error={errors.optGreen}
                                        validate={" *"}
                                        value={
                                          field.value === undefined
                                            ? false
                                            : field.value
                                        }
                                      />
                                    )}
                                  />
                                </div>
                                <div className="mt-2">
                                  <Controller
                                    name="optContract"
                                    control={control}
                                    render={({ field }) => (
                                      <CheckBox
                                        {...field}
                                        id={"optContract"}
                                        type={"checkbox"}
                                        label={
                                          "Opt for excess UGT beyond contract"
                                        }
                                        disabled={currentUGTGroup?.id === 1?true:false}
                                        error={errors.optContract}
                                        validate={" *"}
                                        value={
                                          field.value === undefined
                                            ? false
                                            : field.value
                                        }
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            {/*Contract Energy Amount */}
                            <div className="flex justify-between ml-2 md:col-span-6">
                              <div>
                                <strong>
                                  Contracted Energy Amount
                                  <span className="text-red-500"> *</span>
                                </strong>
                              </div>
                              {/*<button
                                type="button"
                                onClick={addAllowcated}
                                className="flex items-center w-30 rounded h-10 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                              >
                                <img
                                  src={plus}
                                  alt="React Logo"
                                  width={20}
                                  height={20}
                                  className={"text-white mr-2"}
                                />
                                <p className="m-0">Add Allocation</p>
                              </button>*/}
                              <AddContract
                                actionList={[
                                  {
                                    label: "Import File",
                                    onClick: addExcelfile,
                                  },
                                  {
                                    label: "Create New",
                                    onClick: addAllowcated,
                                  },
                                ]}
                              />
                            </div>
                            {/*Sum Contract Energy Amount */}
                            {allowcatedEnergyList.length > 0 && (
                              <>
                                <div className="flex flex-col ml-2 col-span-6">
                                  <label className="mt-3 text-[#6B7280] text-xs">
                                    Total Contracted Energy Amount (kWh)
                                  </label>
                                  <span className="">
                                    <div className="break-words	font-bold">
                                      {numeral(
                                        sumAllAllocatedEnergyList(
                                          allowcatedEnergyList
                                        )
                                      ).format("0,0.00")}
                                    </div>
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 text-center mt-4 md:col-span-6 text-GRAY_BUTTON font-semibold">
                                  <div>
                                    <p>Year</p>
                                  </div>
                                  <div>
                                    <p className="m-0 p-0">
                                      Total Contracted Energy Amount (kWh)
                                    </p>
                                  </div>
                                  <div></div>
                                </div>
                              </>
                            )}
                            {/*Collaps Contract Energy Amount */}
                            {allowcatedEnergyList.length > 0 ? (
                              allowcatedEnergyList.map((item, index) => (
                                <div
                                  key={index}
                                  className="px-4 md:col-span-6 text-sm"
                                >
                                  <CollapsEdit
                                  isShowEdit={true}
                                    onClickEditBtn={() => {
                                      onClickEditBtn(item, index);
                                    }}
                                    title={item.year}
                                    total={sumAllocatedEnergyAmount(
                                      item
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                    })}
                                    onClickDeleteBtn={() => {
                                      onClickDeleteBtn(item);
                                    }}
                                  >
                                    <div className="grid grid-cols-3 text-center font-semibold">
                                      <div>
                                        <p className="text-GRAY_BUTTON">
                                          Month
                                        </p>
                                        <hr />
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            1,
                                            item.amount01
                                          )}
                                        >
                                          JAN
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            2,
                                            item.amount02
                                          )}
                                        >
                                          FEB
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            3,
                                            item.amount03
                                          )}
                                        >
                                          MAR
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            4,
                                            item.amount04
                                          )}
                                        >
                                          APR
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            5,
                                            item.amount05
                                          )}
                                        >
                                          MAY
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            6,
                                            item.amount06
                                          )}
                                        >
                                          JUN
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            7,
                                            item.amount07
                                          )}
                                        >
                                          JUL
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            8,
                                            item.amount08
                                          )}
                                        >
                                          AUG
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            9,
                                            item.amount09
                                          )}
                                        >
                                          SEP
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            10,
                                            item.amount10
                                          )}
                                        >
                                          OCT
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            11,
                                            item.amount11
                                          )}
                                        >
                                          NOV
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            12,
                                            item.amount12
                                          )}
                                        >
                                          DEC
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-GRAY_BUTTON">
                                          Contracted Energy Amount (kWh)
                                        </p>
                                        <hr />
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            1,
                                            item.amount01
                                          )}
                                        >
                                          {item.amount01?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            2,
                                            item.amount02
                                          )}
                                        >
                                          {item.amount02?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            3,
                                            item.amount03
                                          )}
                                        >
                                          {item.amount03?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            4,
                                            item.amount04
                                          )}
                                        >
                                          {item.amount04?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            5,
                                            item.amount05
                                          )}
                                        >
                                          {item.amount05?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            6,
                                            item.amount06
                                          )}
                                        >
                                          {item.amount06?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            7,
                                            item.amount07
                                          )}
                                        >
                                          {item.amount07?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            8,
                                            item.amount08
                                          )}
                                        >
                                          {item.amount08?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            9,
                                            item.amount09
                                          )}
                                        >
                                          {item.amount09?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            10,
                                            item.amount10
                                          )}
                                        >
                                          {item.amount10?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            11,
                                            item.amount11
                                          )}
                                        >
                                          {item.amount11?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            12,
                                            item.amount12
                                          )}
                                        >
                                          {item.amount12?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <hr
                                          style={{ "margin-top": "2.25rem" }}
                                        />
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            1,
                                            item.amount01,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            1,
                                            item.amount01
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            2,
                                            item.amount02,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            2,
                                            item.amount02
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            3,
                                            item.amount03,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            3,
                                            item.amount03
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            4,
                                            item.amount04,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            4,
                                            item.amount04
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            5,
                                            item.amount05,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            5,
                                            item.amount05
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            6,
                                            item.amount06,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            6,
                                            item.amount06
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            7,
                                            item.amount07,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            7,
                                            item.amount07
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            8,
                                            item.amount08,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            8,
                                            item.amount08
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            9,
                                            item.amount09,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            9,
                                            item.amount09
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            10,
                                            item.amount10,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            10,
                                            item.amount10
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            11,
                                            item.amount11,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            11,
                                            item.amount11
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            12,
                                            item.amount12,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            12,
                                            item.amount12
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </CollapsEdit>
                                </div>
                              ))
                            ) : (
                              <div className="md:col-span-6">
                              <div className={isAllocatedEnergyAmount?"text-center md:col-span-6 p-10 border-2 border-red-500 rounded-[10px]":"text-center md:col-span-6 p-10 border-2 border-gray-200 rounded-[10px]"}>
                                <label className="text-gray-400">
                                  There is no data to display.
                                </label>
                              </div>
                              {isAllocatedEnergyAmount && (
                                <div className="grid grid-cols-3 text-center mt-2 md:col-span-6">
                                  <div className=" text-left">
                                    <label className="text-red-500 text-xs">
                                      This field is required.
                                    </label>
                                  </div>
                                </div>
                              )}
                              </div>
                            )}
                            {/*Error */}
                            
                          </div>
                        </div>
                      </div>
                      {/*Download File import Contract Energy Amount */}
                      {allowcatedExcelFileList.length !== 0 ? (
                        <div className="grow bg-lime-200 mt-2 w-full p-2">
                          <div className="flex justify-content items-center">
                            <div className="mr-8"></div>
                            <label className="text-sm font-normal">
                              Download Import File :
                            </label>
                            <div>
                              <label
                                style={{ cursor: "pointer", color: "blue" }}
                                className="text-sm font-normal ml-1"
                                onClick={downloadFileAllowCated}
                              >
                                {allowcatedExcelFileList[0].name}
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : undefined}
                    </Card>

                    {/* Beneficiary Information*/}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full overflow-visible"
                      padding="xl"
                    >
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6 flex justify-between">
                              <div className="flex">
                                <h6 className="text-PRIMARY_TEXT font-semibold">
                                  Beneficiary Information
                                </h6>
                                <div className="inline-block ml-2">
                                  <Tooltips title="Physical Address Only" placement="top" arrow >
                                    <img
                                      src={InfoCircle}
                                      width={20}
                                      height={20}
                                    />
                                  </Tooltips>
                                </div>
                              </div>
                              <div>
                                <button
                                  onClick={addBeneficiary}
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
                                  <p className="m-0">Add Beneficiary</p>
                                </button>
                              </div>
                            </div>

                            <div className="mt-3 mb-4 md:col-span-6">
                            {benefitList.length > 0 && (
                              <>
                                <div className="grid grid-cols-[450px_310px_200px] text-center mt-4 md:col-span-6 text-GRAY_BUTTON font-semibold">
                                  <div>
                                    <p>Name</p>
                                  </div>
                                  <div>
                                    <p className="m-0 p-0">
                                      Status
                                    </p>
                                  </div>
                                  <div></div>
                                </div>
                              </>
                            )}
                              {benefitList.length > 0 ? (
                                benefitList.map((item, index) => (
                                  <div
                                    key={index}
                                    className="px-4 md:col-span-6 text-sm"
                                  >
                                    <CollapsInfoSubscriber
                                      onClickEditBtn={() => {
                                        onClickEditBeneBtn(item, index);
                                      }}
                                      title={item.beneficiaryName}
                                      total={item.beneficiaryStatus}
                                      onClickDeleteBtn={() => {
                                        handleDeleteBene(item);
                                      }}
                                    >
                                      <Beneficiary
                                        beneficiaryDataEdit={item}
                                        editStatus={true}
                                      />
                                    </CollapsInfoSubscriber>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center md:col-span-6 p-10 border-2 border-gray-200 rounded-[10px]">
                                  <label className="text-gray-400">
                                    There is no data to display.
                                  </label>
                                </div>
                              )}
                              {isBeneficiary && (
                                <div className="grid grid-cols-3 text-center mt-4 md:col-span-6">
                                  <div>
                                    <h6 className="text-red-500 font-semibold">
                                      * This field is required.
                                    </h6>
                                  </div>
                                </div>
                              )}
                            </div>

                            <>
                              {/*<div className="md:col-span-3">

                              <Controller
                                name="beneficiaryName"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"beneficiaryName"}
                                    type={"text"}
                                    label={"Name"}
                                    error={errors.beneficiaryName}
                                    validate={" *"}
                                    // ... other props
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="beneficiaryAddress"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"beneficiaryAddress"}
                                    type={"text"}
                                    label={"Address"}
                                    error={errors.beneficiaryAddress}
                                    validate={" *"}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="beneficiaryProviceCode"
                                control={control}
                                defaultValue={null}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <MySelect
                                    {...field}
                                    id={"beneficiaryProviceCode"}
                                    options={provinceBeneficiaryList}
                                    displayProp={"provinceNameEn"}
                                    valueProp={"provinceCode"}
                                    label={"State / Province"}
                                    validate={" *"}
                                    onChangeInput={onChangeBeneficiaryProvince}
                                    error={errors.beneficiaryProviceCode}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="beneficiaryDistrictCode"
                                control={control}
                                defaultValue={null}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <MySelect
                                    {...field}
                                    id={"beneficiaryDistrictCode"}
                                    options={districtBeneficiaryList}
                                    displayProp={"districtNameEn"}
                                    valueProp={"districtCode"}
                                    label={"District"}
                                    error={errors.beneficiaryDistrictCode}
                                    validate={" *"}
                                    onChangeInput={onChangeBeneficiaryDistrict}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="beneficiarySubdistrictCode"
                                control={control}
                                defaultValue={null}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <MySelect
                                    {...field}
                                    id={"beneficiarySubdistrictCode"}
                                    options={subDistrictBeneficiaryList}
                                    displayProp={"subdistrictNameEn"}
                                    valueProp={"subdistrictCode"}
                                    label={"Subdistrict"}
                                    validate={" *"}
                                    error={errors.beneficiarySubdistrictCode}
                                    onChangeInput={
                                      onChangeBeneficiarySubDistrict
                                    }
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="beneficiaryCountryCode"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                  <MySelect
                                    {...field}
                                    id={"beneficiaryCountryCode"}
                                    options={countryBeneficiaryList}
                                    displayProp={"name"}
                                    valueProp={"alpha2"}
                                    label={"Country"}
                                    error={errors.beneficiaryCountryCode}
                                    onChangeInput={onChangeBeneficiaryCountry}
                                    disable
                                    validate={" *"}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Controller
                                name="beneficiaryPostcode"
                                control={control}
                                defaultValue={null}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <MySelect
                                    {...field}
                                    id={"beneficiaryPostcode"}
                                    options={postCodeBeneficiaryListForDisplay}
                                    displayProp={"postCodeDisplay"}
                                    valueProp={"postalCode"}
                                    label={"Postcode"}
                                    validate={" *"}
                                    onChangeInput={onChangeBeneficiaryPostCode}
                                    error={errors.beneficiaryPostcode}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-2 flex items-center mt-4 ml-1">
                              <input
                                type="checkbox"
                                checked="true"
                                disabled="true"
                              />
                              <label className="font-semibold" for="">
                                &nbsp; Active{" "}
                                <span className="text-red-500">*</span>
                              </label>
                            </div>*/}
                            </>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/*Documents Information Attachments*/}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full overflow-visible"
                      padding="xl"
                    >
                      <div className="md:col-span-6 mt-4">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Documents Information Attachments</b>
                        </h6>
                      </div>
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                        <div className="md:col-span-3">
                          <Controller
                            name="uploadFile"
                            control={control}
                            render={({ field }) => (
                              <UploadFileSubscriber
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
                                //validate={" *"}
                                // ... other props
                              />
                            )}
                          />
                          {fileList.length !== 0 && (
                            <div className="mt-3">
                              <button
                                className="items-center px-2 py-2 border-[#4D6A00] border-2 w-full rounded-[5px] text-center "
                                onClick={(e) => {e.preventDefault(); downloadZip(fileList, 'output.zip');}}
                              >
                                <div className="flex items-center justify-center ">
                                  <LiaDownloadSolid className=" w-5 h-5 text-PRIMARY_TEXT cursor-pointer" />
                                  <label className="text-PRIMARY_TEXT ml-2 font-semibold cursor-pointer">
                                    Download All file in (.zip)
                                  </label>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-3">
                          <Controller
                            name="note"
                            control={control}
                            rules={{}}
                            render={({ field }) => (
                              <TextareaNoteSubscriber
                                {...field}
                                id={"note"}
                                type={"text"}
                                label={"Note"}
                                error={errors.note}
                                // ... other props
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="mt-3 mb-4 md:col-span-3"></div>
                    </Card>

                    {/* submit Form1 Subscriber */}
                    <div className="flex flex-col items-end mt-3 mb-5">
                          {Object.keys(errors).length !== 0 && (
                            
                            <div className="justify-items-end">
                              <div className="font-medium text-lg flex items-center w-96 justify-center border-solid bg-[#fdeeee] border-red-300 border-3   my-2 p-4 text-red-400 ">
                              <div className="mr-2">
                                <BiErrorCircle className="w-[25px] h-[25px] text-red-600" />
                              </div>
                              <div className="">
                                One of fields is incorrect or invalid
                              </div>
                            </div>
                            </div>
                            
                          )}
                      <button
                        onClick={handleSubmit(onSubmitForm1)}
                        className="w-96 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                      >
                        <b>Save</b>
                      </button>
                    </div>
                  </div>
                </form>
              )}
              {/*Form 2 */}
              {isActiveForm2 && (
                <form onSubmit={handleSubmit(onSubmitForm2)}>
                  <div className="flex flex-col gap-3">
                    {/* General Information */}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full"
                      padding="xl"
                    >
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                General Information
                              </h6>
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="assignUtil"
                                control={control}
                                defaultValue={null}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <MySelect
                                    {...field}
                                    id={"assignUtil"}
                                    options={dropDrowList.assignedUtility}
                                    displayProp={"name"}
                                    valueProp={"abbr"}
                                    label={"Assigned Utility"}
                                    validate={" *"}
                                    error={errors.assignUtil}
                                    disable={disableUtility}
                                    // ... other props
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="name"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"name"}
                                    type={"text"}
                                    label={"Name"}
                                    error={errors.name}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                    // ... other props
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="tradeAccountName"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"tradeAccountName"}
                                    type={"text"}
                                    label={"Trade Account Name"}
                                    error={errors.tradeAccountName}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                    // ... other props
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3">
                              <Controller
                                name="tradeAccountCode"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"tradeAccountCode"}
                                    type={"text"}
                                    label={"Trade Account Code"}
                                    error={errors.tradeAccountCode}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                    // ... other props
                                  />
                                )}
                              />
                            </div>

                            {/*<div className="md:col-span-3">
                              <Controller
                                name="tradeAccount"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"tradeAccount"}
                                    type={"text"}
                                    label={"Trade Account"}
                                    error={errors.tradeAccount}
                                    validate={" *"}
                                    // ... other props
                                  />
                                )}
                              />
                            </div>
                            
                            <div className="md:col-span-3">
                              <Controller
                                name="aggregateAllocatedEnergy"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                  pattern: {
                                    value: onlyPositiveNum,
                                    message:
                                      "Please enter only numeric characters.",
                                  },
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"aggregateAllocatedEnergy"}
                                    type={"number"}
                                    step="0.01"
                                    label={"Aggregate Allocated Energy (kWh)"}
                                    error={errors.aggregateAllocatedEnergy}
                                    validate={" *"}
                                    onBlur={(e) => {
                                      let value = e?.target?.value;
                                      // เรียก fucntion Pad ตัวเลขให้เป็นแค่ 2 หลัก
                                      let val = padNumber(value, 2);
                                      setValue("aggregateAllocatedEnergy", val);
                                    }}
                                    // ... other props
                                  />
                                )}
                              />
                            </div>*/}
                            {/*<div className="md:col-span-3 flex items-center ml-1">
                              <input
                                type="checkbox"
                                disabled="true"
                                checked="true"
                              />
                              <label className="font-semibold" for="">
                                &nbsp; Active{" "}
                                <strong className="text-red-500">*</strong>
                              </label>
                            </div>*/}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Subscription Information */}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full overflow-visible"
                      padding="xl"
                    >
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6 mb-4">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                Contract Information
                              </h6>
                            </div>
                            {/*<div className="md:col-span-3 ml-2">
                              <Controller
                                name="retailESANo"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"retailESANo"}
                                    type={"text"}
                                    label={"Retail ESA No."}
                                    error={errors.retailESANo}
                                    validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>*/}
                            <div className="md:col-span-3 ml-2">
                              <Controller
                                name="retailESAContractStartDate"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <DatePickerSubscriber
                                    {...field}
                                    id={"retailESAContractStartDate"}
                                    label={"Retail ESA Start Date"}
                                    error={errors.retailESAContractStartDate}
                                    onChangeInput={
                                      handleChangeCommissioningDate
                                    }
                                    validate={" *"}
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3 ml-2">
                              <Controller
                                name="retailESAContractEndDate"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <DatePickerSubscriber
                                    {...field}
                                    id={"retailESAContractEndDate"}
                                    label={"Retail ESA End Date"}
                                    error={errors.retailESAContractEndDate}
                                    onCalDisableDate={
                                      requestedEffectiveDateDisableDateCal
                                    }
                                    onChangeInput={handleChangeContractEndDate}
                                    isDisable={disableRequestedEffectiveDate}
                                    validate={" *"}
                                    showTooltip={true}
                                    textTooltip={
                                      "Please select the Retail ESA Contract Start Date first."
                                    }
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
                            <div className="md:col-span-3 ml-2">
                              <Controller
                                name="retailESAContractDuration"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"retailESAContractDuration"}
                                    type={"text"}
                                    label={"Retail ESA Duration"}
                                    error={errors.retailESAContractDuration}
                                    disabled
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>
                            <div className="md:col-span-3 ml-2">
                              <Controller
                                name="portfolioAssignment"
                                control={control}
                                rules={{
                                  
                                  /*validate: (value) =>
                                    value.trim() !== "" ||
                                    "Input cannot be just spaces",*/
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"portfolioAssignment"}
                                    type={"text"}
                                    label={"Portfolio Assignment"}
                                    error={errors.portfolioAssignment}
                                    //validate={" *"}
                                    placeholder="Please fill the form in English"
                                  />
                                )}
                              />
                            </div>

                            {/*<div className="flex justify-between mt-2 ml-2 md:col-span-6">
                              <div>
                                <strong>
                                  Feeder Name{" "}
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
                                <p className="m-0">Add Feeder</p>
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
                                      name={`feeder[${index}].feederName`}
                                      control={control}
                                      rules={{
                                        required: "This field is required",
                                      }}
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          id={index}
                                          validate={" *"}
                                          placeholder={`Feeder Name #${
                                            index + 1
                                          }`}
                                          error={
                                            errors.feeder?.[index]?.feederName
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
                            </div>*/}

                            <div className="mt-3 ml-2 mb-4 md:col-span-6">
                              <div className="font-bold col-span-3">
                                Additional Contract Condition
                              </div>
                              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                                <div className="mt-2">
                                  <Controller
                                    name="optGreen"
                                    control={control}
                                    render={({ field }) => (
                                      <CheckBox
                                        {...field}
                                        id={"optGreen"}
                                        type={"checkbox"}
                                        label={
                                          "Opt for up to 15% green electricity from UGT1"
                                        }
                                        disabled={currentUGTGroup?.id === 1?true:false}
                                        error={errors.optGreen}
                                        validate={" *"}
                                        value={
                                          field.value === undefined
                                            ? false
                                            : field.value
                                        }
                                      />
                                    )}
                                  />
                                </div>
                                <div className="mt-2">
                                  <Controller
                                    name="optContract"
                                    control={control}
                                    render={({ field }) => (
                                      <CheckBox
                                        {...field}
                                        id={"optContract"}
                                        type={"checkbox"}
                                        label={
                                          "Opt for excess UGT beyond contract"
                                        }
                                        disabled={currentUGTGroup?.id === 1?true:false}
                                        error={errors.optContract}
                                        validate={" *"}
                                        value={
                                          field.value === undefined
                                            ? false
                                            : field.value
                                        }
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between ml-2 md:col-span-6">
                              <div>
                                <strong>
                                  Contracted Energy Amount
                                  <span className="text-red-500"> *</span>
                                </strong>
                              </div>
                              {/*<button
                                type="button"
                                onClick={addAllowcated}
                                className="flex items-center w-30 rounded h-10 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                              >
                                <img
                                  src={plus}
                                  alt="React Logo"
                                  width={20}
                                  height={20}
                                  className={"text-white mr-2"}
                                />
                                <p className="m-0">Add Allocation</p>
                              </button>*/}
                              <AddContract
                                actionList={[
                                  {
                                    label: "Import File",
                                    onClick: addExcelfile,
                                  },
                                  {
                                    label: "Create New",
                                    onClick: addAllowcated,
                                  },
                                ]}
                              />
                            </div>
                            {allowcatedEnergyList.length > 0 && (
                              <>
                                <div className="flex flex-col ml-2 col-span-6">
                                  <label className="mt-3 text-[#6B7280] text-xs">
                                    Total Contracted Energy Amount (kWh)
                                  </label>
                                  <span className="">
                                    <div className="break-words	font-bold">
                                      {numeral(
                                        sumAllAllocatedEnergyList(
                                          allowcatedEnergyList
                                        )
                                      ).format("0,0.00")}
                                    </div>
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 text-center mt-4 md:col-span-6 text-GRAY_BUTTON font-semibold">
                                  <div>
                                    <p>Year</p>
                                  </div>
                                  <div>
                                    <p className="m-0 p-0">
                                      Total Contracted Energy Amount (kWh)
                                    </p>
                                  </div>
                                  <div></div>
                                </div>
                              </>
                            )}
                            {/*Collaps Contract Energy Amount Form 2*/}
                            {allowcatedEnergyList.length > 0 ? (
                              allowcatedEnergyList.map((item, index) => (
                                <div
                                  key={index}
                                  className="px-4 md:col-span-6 text-sm"
                                >
                                  <CollapsEdit
                                    onClickEditBtn={() => {
                                      onClickEditBtn(item, index);
                                    }}
                                    title={item.year}
                                    total={sumAllocatedEnergyAmount(
                                      item
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                    })}
                                    onClickDeleteBtn={() => {
                                      onClickDeleteBtn(item);
                                    }}
                                  >
                                    <div className="grid grid-cols-3 text-center font-semibold">
                                      <div>
                                        <p className="text-GRAY_BUTTON">
                                          Month
                                        </p>
                                        <hr />
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            1,
                                            item.amount01
                                          )}
                                        >
                                          JAN
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            2,
                                            item.amount02
                                          )}
                                        >
                                          FEB
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            3,
                                            item.amount03
                                          )}
                                        >
                                          MAR
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            4,
                                            item.amount04
                                          )}
                                        >
                                          APR
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            5,
                                            item.amount05
                                          )}
                                        >
                                          MAY
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            6,
                                            item.amount06
                                          )}
                                        >
                                          JUN
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            7,
                                            item.amount07
                                          )}
                                        >
                                          JUL
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            8,
                                            item.amount08
                                          )}
                                        >
                                          AUG
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            9,
                                            item.amount09
                                          )}
                                        >
                                          SEP
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            10,
                                            item.amount10
                                          )}
                                        >
                                          OCT
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            11,
                                            item.amount11
                                          )}
                                        >
                                          NOV
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            12,
                                            item.amount12
                                          )}
                                        >
                                          DEC
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-GRAY_BUTTON">
                                          Contracted Energy Amount (kWh)
                                        </p>
                                        <hr />
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            1,
                                            item.amount01
                                          )}
                                        >
                                          {item.amount01?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            2,
                                            item.amount02
                                          )}
                                        >
                                          {item.amount02?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            3,
                                            item.amount03
                                          )}
                                        >
                                          {item.amount03?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            4,
                                            item.amount04
                                          )}
                                        >
                                          {item.amount04?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            5,
                                            item.amount05
                                          )}
                                        >
                                          {item.amount05?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            6,
                                            item.amount06
                                          )}
                                        >
                                          {item.amount06?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            7,
                                            item.amount07
                                          )}
                                        >
                                          {item.amount07?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            8,
                                            item.amount08
                                          )}
                                        >
                                          {item.amount08?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            9,
                                            item.amount09
                                          )}
                                        >
                                          {item.amount09?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            10,
                                            item.amount10
                                          )}
                                        >
                                          {item.amount10?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            11,
                                            item.amount11
                                          )}
                                        >
                                          {item.amount11?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            12,
                                            item.amount12
                                          )}
                                        >
                                          {item.amount12?.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <hr
                                          style={{ "margin-top": "2.25rem" }}
                                        />
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            1,
                                            item.amount01,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            1,
                                            item.amount01
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            2,
                                            item.amount02,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            2,
                                            item.amount02
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            3,
                                            item.amount03,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            3,
                                            item.amount03
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            4,
                                            item.amount04,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            4,
                                            item.amount04
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            5,
                                            item.amount05,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            5,
                                            item.amount05
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            6,
                                            item.amount06,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            6,
                                            item.amount06
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            7,
                                            item.amount07,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            7,
                                            item.amount07
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            8,
                                            item.amount08,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            8,
                                            item.amount08
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            9,
                                            item.amount09,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            9,
                                            item.amount09
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            10,
                                            item.amount10,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            10,
                                            item.amount10
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            11,
                                            item.amount11,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            11,
                                            item.amount11
                                          )}
                                        </p>
                                        <p
                                          className={getStyleContractAllowcated(
                                            item.year,
                                            12,
                                            item.amount12,
                                            true
                                          )}
                                        >
                                          {getWarningAssign(
                                            item.year,
                                            12,
                                            item.amount12
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </CollapsEdit>
                                </div>
                              ))
                            ) : (
                              <div className="md:col-span-6">
                              <div className={isAllocatedEnergyAmount?"text-center md:col-span-6 p-10 border-2 border-red-500 rounded-[10px]":"text-center md:col-span-6 p-10 border-2 border-gray-200 rounded-[10px]"}>
                                <label className="text-gray-400">
                                  There is no data to display.
                                </label>
                              </div>
                              {isAllocatedEnergyAmount && (
                                <div className="grid grid-cols-3 text-center mt-2 md:col-span-6">
                                  <div className=" text-left">
                                    <label className="text-red-500 text-xs">
                                      This field is required.
                                    </label>
                                  </div>
                                </div>
                              )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {allowcatedExcelFileList.length !== 0 ? (
                        <div className="grow bg-lime-200 mt-2 w-full">
                          <div className="flex justify-content items-center">
                            <div className="mr-8"></div>
                            <label className="text-sm font-normal">
                              Download Import File :
                            </label>
                            <div>
                              <label
                                style={{ cursor: "pointer", color: "blue" }}
                                className="text-sm font-normal ml-1"
                                onClick={downloadFileAllowCated}
                              >
                                {allowcatedExcelFileList[0].name}
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : undefined}
                    </Card>

                    {/*Documents Information Attachments*/}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full overflow-visible"
                      padding="xl"
                    >
                      <div className="md:col-span-6 mt-4">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Documents Information Attachments</b>
                        </h6>
                      </div>
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                        <div className="md:col-span-3">
                          <div>
                            <Controller
                              name="uploadFilePDF"
                              control={control}
                              rules={{
                                required: "This field is required",
                              }}
                              render={({ field }) => (
                                <UploadFileSubscriber
                                  {...field}
                                  id={"uploadFilePDF"}
                                  type={"file"}
                                  multiple={false}
                                  maxFiles={1}
                                  accept={".pdf"}
                                  label={"หนังสือยืนยันหน่วย (.pdf)"}
                                  disabled={
                                    fileListPDF.length === 0 ? false : true
                                  }
                                  onChngeInput={(id, res) => {
                                    handleUploadfilePDF(id, res);
                                  }}
                                  onDeleteFile={(
                                    id,
                                    evidentFileID,
                                    fileName
                                  ) => {
                                    handleDeleteFilePDF(
                                      id,
                                      evidentFileID,
                                      fileName
                                    );
                                  }}
                                  onClickFile={(item) => {
                                    handleClickDownloadFilePDF(item);
                                  }}
                                  error={errors.uploadFilePDF}
                                  validate={" *"}
                                  filesData={fileListPDF}
                                  setFilesData={setFileListPDF}
                                  // ... other props
                                />
                              )}
                            />
                          </div>
                          <div className="mt-5">
                            <Controller
                              name="uploadFileExcel"
                              control={control}
                              rules={{
                                required: "This field is required",
                              }}
                              render={({ field }) => (
                                <UploadFileSubscriber
                                  {...field}
                                  id={"uploadFileExcel"}
                                  type={"file"}
                                  multiple={false}
                                  maxFiles={1}
                                  accept={".xls,.xlsx"}
                                  disabled={
                                    fileListExcel.length === 0 ? false : true
                                  }
                                  label={
                                    "ข้อมูลหน่วยแยกผู้รับ (blinded) in detail (.xls)"
                                  }
                                  onChngeInput={(id, res) => {
                                    handleUploadfileExcel(id, res);
                                  }}
                                  onDeleteFile={(
                                    id,
                                    evidentFileID,
                                    fileName
                                  ) => {
                                    handleDeleteFileExcel(
                                      id,
                                      evidentFileID,
                                      fileName
                                    );
                                  }}
                                  onClickFile={(item) => {
                                    handleClickDownloadFileExcel(item);
                                  }}
                                  error={errors.uploadFileExcel}
                                  validate={" *"}
                                  // ... other props
                                />
                              )}
                            />
                          </div>
                          {/*fileListExcel.length !== 0 && fileListPDF.length !== 0?<div className="mt-3">
                            <button
                              className="items-center px-2 py-2 border-[#4D6A00] border-2 w-full rounded-[5px] text-center"
                              onClick={() =>
                                downloadAllFileAggregate(
                                  "TestDownloadAggregateFileZip"
                                )
                              }
                            >
                              <div className="flex items-center justify-center cursor-pointer">
                                <LiaDownloadSolid className=" w-5 h-5 text-PRIMARY_TEXT" />
                                <label className="text-PRIMARY_TEXT ml-2 font-semibold cursor-pointer">
                                  Download All file in (.zip)
                                </label>
                              </div>
                            </button>
                          </div>:undefined*/}
                        </div>
                        <div className="md:col-span-3">
                          <Controller
                            name="note"
                            control={control}
                            rules={{}}
                            render={({ field }) => (
                              <TextareaNoteSubscriber
                                {...field}
                                id={"note"}
                                type={"text"}
                                label={"Note"}
                                error={errors.note}
                                // ... other props
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="mt-3 mb-4 md:col-span-3"></div>
                    </Card>

                    {/* submit Form2 Aggregate */}
                    <div className="flex flex-col items-end mt-3 mb-5">
                    {Object.keys(errors).length !== 0 && (
                            
                            <div className="justify-items-end">
                              <div className="font-medium text-lg flex items-center w-96 justify-center border-solid bg-[#fdeeee] border-red-300 border-3   my-2 p-4 text-red-400 ">
                              <div className="mr-2">
                                <BiErrorCircle className="w-[25px] h-[25px] text-red-600" />
                              </div>
                              <div className="">
                                One of fields is incorrect or invalid
                              </div>
                            </div>
                            </div>
                            
                          )}
                      <button
                        onClick={handleSubmit(onSubmitForm2)}
                        className="w-96 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                      >
                        <b>Save</b>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {/*Modal Manual Create Contract Energy Amount */}
      {showModal && (
        <ModalSubAllocated
          onClickConfirmBtn={addAllowcated}
          onCloseModal={addAllowcatedClose}
          allowcatedEnergyData={allowcatedEnergyData}
          allowcatedEnergyDataIndex={allowcatedEnergyDataIndex}
          allowcatedEnergyDataEdit={allowcatedEnergyDataEdit}
          editStatus={isEdit}
          listData={allowcatedEnergyList}
          yearStart={yearStartDate1.current}
          yearEnd={yearEndDate1.current}
        />
      )}
      {/*Modal Create Beneficiary */}
      {showModalBene && (
        <ModalBeneficiary
          onClickConfirmBtn={addBeneficiary}
          onCloseModal={addBeneficiaryClose}
          beneficiaryData={beneficiaryData}
          beneficiaryDataIndex={benefitDataIndex}
          beneficiaryDataEdit={benefitDataEdit}
          editStatus={isEditBene}
          listData={benefitList}
        />
      )}
      {/*Modal Create Upload File Contract Energy Amount */}
      {showUploadExcel && (
        <ModalUploadFileExcel
          allowcatedExcelFileList={allowcatedExcelFileList}
          setAllowcatesExcelfileList={setAllowcatesExcelfileList}
          setAllowcatedEnergyList={setAllowcatedEnergyList}
          onClickConfirmBtn={addExcelfile}
          onCloseModal={addExcelfileClose}
          listData={allowcatedEnergyList}
          yearStart={parseInt(yearStartDate1.current)}
          yearEnd={parseInt(yearEndDate1.current)}
          setIsShowFailModal={setIsShowFailModal}
          setMessageFailModal={setMessageFailModal}
        />
      )}
      {/*Modal Confirm Create Subscriber */}
      {showModalCreate && (
        <ModalConfirmCheckBox
          onClickConfirmBtn={handleClickConfirm}
          onCloseModal={handleCloseModalConfirm}
          title={"Save this Subscriber?"}
          content={
            "You confirm all the information is completed with accuracy and conforms to the evidence(s) attached."
          }
          content2={
            "By providing your consent, you agree to take full responsibility for any effects resulting from this information. Would you like to save this subscriber?"
          }
          textCheckBox={
            "I consent and confirm the accuracy of the information and attached evidences"
          }
          sizeModal="md"
        />
      )}
      {/*Modal Confirm Delete Beneficiary */}
      {isShowDeleteBene && (
        <ModalConfirmCheckBox
          onClickConfirmBtn={onClickDelBene}
          onCloseModal={handleCloseDeleteBene}
          title={"Delete Beneficiary ?"}
          content={
            "This Beneficiary information hasn't been saved in the system yet. Do you confirm to delete it?"
          }
          //content2={"By providing your consent, you agree to take full responsibility for any effects resulting from this information. Would you like to save this subscriber?"}
          //textCheckBox={"I consent and confirm the accuracy of the information and attached evidences"}
          showCheckBox={false}
          textButton={"Delete"}
          buttonTypeColor={"danger"}
          sizeModal="md"
        />
      )}
      {/*Modal Create Complete */}
      {isOpen && (
        <ModalCompleteSubscriber
          title="Registration Complete!"
          context="Registration Complete!"
          link={WEB_URL.SUBSCRIBER_LIST}
        />
      )}
      {isOpenLoading && <ModelLoadPage></ModelLoadPage>}
      {/*Modal Fail */}
      {isShowFailModal && (
        <ModalFail
          onClickOk={() => {
            setIsShowFailModal(false);
          }}
          content={messageFailModal}
        />
      )}
      {/*Madal Fail Save */}
      {isError && (
        <ModalFail
          onClickOk={() => {
            dispatch(clearModal());
          }}
          content={errorMessage}
        />
      )}
    </div>
  );
};

export default AddSubscriber;
