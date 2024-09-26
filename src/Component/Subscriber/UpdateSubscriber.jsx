import React, { useState, useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@mantine/core";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Input from "../Control/Input";
import MySelect from "../Control/Select";
import { FetchDeviceDropdrowList } from "../../Redux/Dropdrow/Action";
import Collaps from "../Control/Collaps";
import plus from "../assets/plus.svg";
import * as _ from "lodash";
import ModalSubAllocated from "../Subscriber/ModalSubAllocated";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import bin from "../assets/bin-3.svg";
import { Tooltip } from "react-tooltip";
import DatePicker from "../Control/DayPicker";
import { useFieldArray } from "react-hook-form";
import * as WEB_URL from "../../Constants/WebURL";
import ModalComplete from "../Control/Modal/ModalComplete";
import { SubscriberInfo } from "../../Redux/Subscriber/Action";
import LoadPage from "../Control/LoadPage";

import {
  FetchCountryList,
  FetchProvinceList,
  FetchDistrictList,
  FetchSubDistrictList,
  FetchPostcodeList,
} from "../../Redux/Dropdrow/Action";
import {
  FetchDistrictBeneList,
  FetchSubDistrictBeneList,
  FetchProvinceBeneList,
  FetchPostcodeBeneList,
  FunctionEditSubscriber,
  FunctioneditAggregateSubscriber,
  clearModal,
} from "../../Redux/Subscriber/Action";
import dayjs from "dayjs";
import { FaChevronCircleLeft } from "react-icons/fa";
import numeral from "numeral";
import { hideLoading, padNumber, showLoading } from "../../Utils/Utils";
import { Filter } from "lucide-react";
import CheckBox from "../Control/CheckBok";
import AddContract from "./AddContractMenu";
import ModalUploadFileExcel from "./ModalUploadFileExcel";
import warning from "../assets/warning.png";
import BeneficiaryEdit from "./BeneficiaryEdit";
import ModalBeneficiaryEdit from "./ModalBeneficiaryEdit";
import UploadFileSubscriberEdit from "./UploadFileSubscriberEdit";
import Textarea from "../Control/Textarea";
import ModalConfirmCheckBox from "./ModalConfirmCheckBox"
import ModalFail from "../Control/Modal/ModalFail";
import ModalConfirmRemark from "./ModalConfirmRemark";
import ModalCompleteSubscriber from "./ModalCompleteSubscriber";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js';
import CollapsSubscriberEdit from "./CollapsSubscriberEdit";
import TriWarning from "../assets/TriWarning.png"
import TextareaNoteSubscriber from "./TextareaNoteSubscriber";

const UpdateSubscriber = () => {
  const {
    // register,
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
  const { state } = useLocation();
  const [showModal, setShowModalConfirm] = React.useState(false);
  const [showUploadExcel,setShowUploadExcel] = React.useState(false);
  const [showModalBene,setShowModalBene] = React.useState(false);
  const [showModalCreate, setShowModalCreateConfirm] = React.useState(false);
  const [showModalCreateRemark,setShowMadalCreateRemark] = React.useState(false);
  const [showModalComplete, setShowModalComplete] = React.useState(false);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const [isActiveForm1, setIsActiveForm1] = useState(true);
  const [isActiveForm2, setIsActiveForm2] = useState(false);
  const [selectedCommisionDate, setSelectedCommisionDate] = useState(null);
  const [disableRequestedEffectiveDate, setDisableRequestedEffectiveDate] =
    useState(true);
  const addInput = (data) => {
    if (data?.length > 0) {
      //console.log("Data",data)
      for (let i = 0; i < data?.length; i++) {
        const filterName = fields.filter((items)=> items.feederName === data[i]?.feederName)
        //console.log("Filter",filterName)
          if(filterName.length === 0){
          append({
            feederName: data[i]?.feederName,
          });
        }
      }
    } else {
      //console.log("Append Empty")
      append({
        feederName: "",
      });
    }
  };

  const [currentProvince, setCurrentProvicne] = useState(null);
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [currentSubDistrict, setCurrentSubDistrict] = useState(null);
  const [currentPostCode, setCurrentPostCode] = useState(null);
  const [postCodeListForDisplay, setPostCodeListForDisplay] = useState([]);
  const [fileList,setFileList] = useState([])
  const dropDrowList = useSelector((state) => state.dropdrow.dropDrowList);
  const countryList = useSelector((state) => state.dropdrow.countryList);
  const provinceList = useSelector((state) => state.dropdrow.provinceList);
  const districtList = useSelector((state) => state.dropdrow.districtList);
  const userDetail = useSelector((state)=> state.login.userobj)
  //console.log("user detail",userDetail)
  //console.log("UserName",userDetail.firstName)
  //console.log("UserLast",userDetail.lastName)
  const EditBeneficiary = true;
  const onlyPositiveNum = /^[+]?\d+([.]\d+)?$/;
  const subDistrictList = useSelector(
    (state) => state.dropdrow.subDistrictList
  );
  const postcodeList = useSelector((state) => state.dropdrow.postcodeList);

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
  const [allowcatedEnergyList, setAllowcatedEnergyList] = useState([]);
  const [allowcatedEnergyDataEdit, setAllowcatedEnergyDataEdit] = useState({});
  const [allowcatedExcelFileList,setAllowcatesExcelfileList] = useState([]);
  const [benefitList,setBenefitList] = useState([]);
  const [benefitDataEdit,setBenefitDataEdit] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isEditBene,setIsEditBene] = useState(false);
  const [FormData1, setFormData1] = useState("");
  const [FormData2, setFormData2] = useState("");
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const details = useSelector((state) => state.subscriber.detailInfoList);

  const [yearStartDate,setYearStartDate] = useState()
  const [monthStartDate,setMonthStartDate] = useState()
  const [dayStartDate,setDayStartDate] = useState()
  const [yearEndDate,setYearEndDate] = useState()
  const [monthEndDate,setMonthEndDate] = useState()
  const [dayEndDate,setDayEndDate] = useState()
  const yearStartDate1 = useRef(null)
  const monthStartDate1 = useRef(null)
  const dayStartDate1 = useRef(null)
  const yearEndDate1 = useRef(null)
  const monthEndDate1 = useRef(null)
  const dayEndDate1 = useRef(null)
  const [isShowFailModal, setIsShowFailModal] = useState(false);
  const [messageFailModal, setMessageFailModal] = useState("");
  const [isShowFailError, setIsShowFailError] = useState(false);
  const [test,setTest] = useState()
  const [isBeneficiary,setIsBeficiary] = useState(false);
  const [statusList,setStatusList] = useState([
  {
    id: "Active",
    statusName:"Active"
  },
  {
    id: "Inactive",
    statusName: "Inactive"
  },
  {
    id:"All",
    statusName:"All"
  }])
  const [statusFilterBene,setStatusFilterBene] = useState("Active")
  const [fileListPDF, setFileListPDF] = React.useState([]);
  const [fileListExcel, setFileListExcel] = React.useState([]);
  const [remark,setRemark] = useState({}) 
  const RefRemark = useRef({})
  const [isDefaultShow,setDefaultShow] = useState(false)
  const [isShownSnap,setIsShowSnap] = useState(false)

  const isError = useSelector((state)=>state.subscriber.isOpenFailModal)
  const errorMessage = useSelector((state)=>state.subscriber.errmessage)
  const isOpen = useSelector((state)=>state.subscriber.isOpen)

  const contentRef = useRef();
  


  useEffect(() => {
    // check if all data are loaded and have values
    if (
      details != null &&
      dropDrowList &&
      countryList &&
      provinceList &&
      districtList &&
      subDistrictList &&
      postcodeList &&
      countryBeneficiaryList &&
      provinceBeneficiaryList &&
      districtBeneficiaryList &&
      subDistrictBeneficiaryList &&
      postcodeBeneficiaryList
    ) {
      if (details?.subscriberDetail?.subscriberTypeId == 1) {
        setDefualtDataOnEdit();
      } else if (details?.subscriberDetail?.subscriberTypeId == 2) {
        handleClickForm2();
        setDefualtDataOnEdit();
      }
    }
  }, [
    details,
    dropDrowList,
    /*countryList,
    provinceList,
    districtList,
    subDistrictList,
    postcodeList,
    countryBeneficiaryList,
    provinceBeneficiaryList,
    districtBeneficiaryList,
    subDistrictBeneficiaryList,
    postcodeBeneficiaryList,*/
  ]);

  /* useEffect(() => {
    if (details != null) {
      if (details?.subscriberDetail?.statusSubscriberType == 1) {
        setDefualtDataOnEdit();
      } else if (details?.subscriberDetail?.statusSubscriberType == 2) {
        handleClickForm2();
        setDefualtDataOnEdit();
      }
    }
  }, [details]); */

  useEffect(()=>{
    if(isError){
      console.log("IsError",isError)
      setTest(isError)
      console.log("TEST",test)
    }
  },[isError])

  useEffect(() => {
    if (details?.subscriberDetail?.subscriberTypeId == 1) {
      // set defualt province
      const tempProvince = initialvalueForSelectField(
        provinceList,
        "provinceCode",
        details.subscriberDetail.provinceCode
      );
      setValue("stateCode", tempProvince || "");
      onChangeProvince(tempProvince);
    }
  }, [provinceList]);

  useEffect(() => {
    if (details?.subscriberDetail?.subscriberTypeId == 1) {
      // set defualt provinceBene
      const tempProvinceBene = initialvalueForSelectField(
        provinceBeneficiaryList,
        "provinceCode",
        details.beneficiaryInfo.proviceCode
      );
      setValue("beneficiaryProviceCode", tempProvinceBene || "");
      onChangeBeneficiaryProvince(tempProvinceBene);
    }
  }, [provinceBeneficiaryList]);

  useEffect(() => {
    if (details?.subscriberDetail?.subscriberTypeId == 1) {
      // set defualt district
      const tempDistrict = initialvalueForSelectField(
        districtList,
        "districtCode",
        details.subscriberDetail.districtCode
      );
      setValue("districtCode", tempDistrict || "");
      onChangeDistrict(tempDistrict);
    }
  }, [districtList]);

  useEffect(() => {
    if (details?.subscriberDetail?.subscriberTypeId == 1) {
      // set defualt districtBene
      const tempDistrictBene = initialvalueForSelectField(
        districtBeneficiaryList,
        "districtCode",
        details.beneficiaryInfo.districtCode
      );
      setValue("beneficiaryDistrictCode", tempDistrictBene || "");
      onChangeBeneficiaryDistrict(tempDistrictBene);
    }
  }, [districtBeneficiaryList]);

  useEffect(() => {
    if (details?.subscriberDetail?.subscriberTypeId == 1) {
      // set defualt subdistrict
      const tempSubdistrict = initialvalueForSelectField(
        subDistrictList,
        "subdistrictCode",
        details.subscriberDetail.subdistrictCode
      );
      setValue("subdistrictCode", tempSubdistrict || "");
      onChangeSubDistrict(tempSubdistrict);
    }
  }, [subDistrictList]);

  useEffect(() => {
    if (details?.subscriberDetail?.subscriberTypeId == 1) {
      // set defualt subdistrictBene
      const tempSubdistrictBene = initialvalueForSelectField(
        subDistrictBeneficiaryList,
        "subdistrictCode",
        details.beneficiaryInfo.subdistrictCode
      );
      setValue("beneficiarySubdistrictCode", tempSubdistrictBene || "");
      onChangeBeneficiarySubDistrict(tempSubdistrictBene);
    }
  }, [subDistrictBeneficiaryList]);

  useEffect(() => {
    if (details?.subscriberDetail?.subscriberTypeId == 1) {
      // set defualt postcodeBene
      const tempPostcode = initialvalueForSelectField(
        postcodeList,
        "postalCode",
        details.subscriberDetail.postCode
      );
      setValue("postCode", tempPostcode);
      onChangePostCode(tempPostcode);
    }
  }, [postcodeList]);

  useEffect(() => {
    if (details?.subscriberDetail?.subscriberTypeId == 1) {
      // set defualt postcodeBene

      const tempPostcodeBene = initialvalueForSelectField(
        postcodeBeneficiaryList,
        "postalCode",
        details.beneficiaryInfo.postcode
      );
      setValue("beneficiaryPostcode", tempPostcodeBene);
      onChangeBeneficiaryPostCode(tempPostcodeBene);
    }
  }, [postcodeBeneficiaryList]);

  useEffect(() => {
    // setIsOpenLoading(true);
    showLoading();

    dispatch(
      SubscriberInfo(state?.code,state?.contract, () => {
        // setIsOpenLoading(false);
        dispatch(FetchCountryList());
        dispatch(FetchDeviceDropdrowList());
        dispatch(FetchProvinceList(764));
        dispatch(FetchProvinceBeneList(764));
        dispatch(FetchPostcodeList());
        dispatch(FetchPostcodeBeneList());
        hideLoading();
      })
    );
    
    autoScroll();
  }, []);

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

  useEffect(()=>{
    console.log("Bene",benefitList)
  },[benefitList])

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
  const addAllowcated = () => {
    //setShowModalConfirm(true);
    if(yearStartDate1.current !== null && yearEndDate1.current !== null){
      setShowModalConfirm(true);
    }
    else{
      setIsShowFailModal(true)
      setMessageFailModal("Please select Retail ESA Contract Start Date and Retail ESA Contract End Date.")
    }
  };
  const addAllowcatedClose = () => {
    setIsEdit(false);
    setShowModalConfirm(false);
  };
  const addExcelfileClose=()=>{
    setShowUploadExcel(false)
  }

  const addExcelfile =()=>{
    if(yearStartDate1.current !== null && yearEndDate1.current !== null){
      console.log("Open Modal")
    setShowUploadExcel(true);
    }
    else{
      setIsShowFailModal(true)
      setMessageFailModal("Please select Retail ESA Contract Start Date and Retail ESA Contract End Date")
      message.error("Please select Retail ESA Contract Start Date and Retail ESA Contract End Date")
    }
    
  };


  const setDefualtDataOnEdit = () => {
    setRemark(details?.subscriberRemark)
    if (details?.subscriberDetail?.subscriberTypeId == 1) {
      // General Information
      const tempAssignUtil = initialvalueForSelectField(
        dropDrowList?.assignedUtility,
        "id",
        details.subscriberDetail.assignedUtilityId
      );
      addInput(details?.feeder);
      //console.log("details", details);
      //console.log("dropDrowList", dropDrowList);
      setValue("assignUtil", tempAssignUtil || "");
      setValue("tradeAccount", details?.subscriberDetail?.tradeAccount || "");
      setValue("tradeAccountCode",details?.subscriberDetail?.tradeAccountCode || "")
      setValue(
        "redemptionAccount",
        details?.subscriberDetail?.redemptionAccount || ""
      );
      setValue("redemptionAccountCode",details?.subscriberDetail?.redemptionAccountCode || "")
      setValue("retailESANo", details?.subscriberDetail?.retailESANo || "");
      
      setValue(
        "retailESAContractStartDate",
        details?.subscriberDetail?.retailESAContractStartDate || ""
      );
      setValue(
        "retailESAContractEndDate",
        details?.subscriberDetail?.retailESAContractEndDate || ""
      );
      setValue(
        "retailESAContractDuration",
        details?.subscriberDetail?.retailESAContractDuration || ""
      );

      splitStartDate(details?.subscriberDetail?.retailESAContractStartDate);
      splitEndDate(details?.subscriberDetail?.retailESAContractEndDate);

      // Organization Information
      setValue(
        "organizationName",
        details?.subscriberDetail?.organizationName || ""
      );
      setValue(
        "businessRegistrationNo",
        details?.subscriberDetail?.businessRegistrationNo || ""
      );
      setValue("address", details?.subscriberDetail?.address || "");

      // Personal Information
      const tempTitle = initialvalueForSelectField(
        dropdownTitle,
        "name",
        details.subscriberDetail.title
      );
      setValue("title", tempTitle || "");
      setValue("name", details?.subscriberDetail?.name || "");
      setValue("lastname", details?.subscriberDetail?.lastname || "");
      setValue("mobilePhone", details?.subscriberDetail?.mobilePhone || "");
      setValue("officePhone", details?.subscriberDetail?.officePhone || "");
      setValue("attorney", details?.subscriberDetail?.attorney || "");
      setValue("email", details?.subscriberDetail?.email || "");
      setValue("note",details?.subscriberDetail?.note)
      // Subscription Information

      setAllowcatedEnergyList(details?.allocateEnergyAmount);
      const tempStatusFilter = initialvalueForSelectField(
        statusList,
        "id",
        "Active"
      );
      setValue("statusFilter",tempStatusFilter)
      setValue("portfolioAssignment",details?.subscriberDetail?.portfolioAssignment)
      setValue("optGreen",details?.subscriberDetail?.optForUp === "Active"?true:false)
      setValue("optContract",details?.subscriberDetail?.optForExcess === "Active"?true:false)

      // Beneficiary Information
      setValue(
        "beneficiaryName",
        details?.beneficiaryInfo?.beneficiaryName || ""
      );
      //const InitialBeneActive = details?.beneficiaryInfo.filter((items)=> items.status === "Active")
      setBenefitList(details?.beneficiaryInfo)
      setAllowcatesExcelfileList(details?.fileUploadContract)
      //setFileList(details?.fileUpload)
      setValue("beneficiaryAddress", details?.beneficiaryInfo?.address || "");
    } else if (details?.subscriberDetail?.subscriberTypeId == 2) {
      const tempAssignUtil = initialvalueForSelectField(
        dropDrowList?.assignedUtility,
        "id",
        details.subscriberDetail.assignedUtilityId
      );
      setValue("tradeAccountCode",details?.subscriberDetail?.tradeAccountCode || "");
      setValue("assignUtil", tempAssignUtil || "");
      setValue("tradeAccount", details?.subscriberDetail?.tradeAccount || "");
      setValue(
        "retailESAContractStartDate",
        details?.subscriberDetail?.retailESAContractStartDate || ""
      );
      setValue(
        "retailESAContractEndDate",
        details?.subscriberDetail?.retailESAContractEndDate || ""
      );
      setValue(
        "retailESAContractDuration",
        details?.subscriberDetail?.retailESAContractDuration || ""
      );

      splitStartDate(details?.subscriberDetail?.retailESAContractStartDate);
      splitEndDate(details?.subscriberDetail?.retailESAContractEndDate);
      setValue("note",details?.subscriberDetail?.note)
      // Subscription Information

      setAllowcatedEnergyList(details?.allocateEnergyAmount);
      const tempStatusFilter = initialvalueForSelectField(
        statusList,
        "id",
        "Active"
      );
      setValue("statusFilter",tempStatusFilter)
      setValue("portfolioAssignment",details?.subscriberDetail?.portfolioAssignment)
      setValue("optGreen",details?.subscriberDetail?.optForUp === "Active"?true:false)
      setValue("optContract",details?.subscriberDetail?.optForExcess === "Active"?true:false)
      setAllowcatesExcelfileList(details?.fileUploadContract)
      setValue("name", details?.subscriberDetail?.name || "");
      setValue(
        "aggregateAllocatedEnergy",
        details?.subscriberDetail?.aggregateAllocatedEnergy || ""
      );
      //setAllowcatedEnergyList(details?.allocateEnergyAmountInfo);
    }
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
  const onClickEditBtn = (data, index) => {
    data.index = index;
    setAllowcatedEnergyDataEdit(data);
    setIsEdit(true);
    addAllowcated();
  };

  const onClickDeleteBtn = (data) => {
    console.log("Contract data",data)
    const allowcatedEnergyListTemp = allowcatedEnergyList.filter(
      (item) => item.year !== data.year
    );
    console.log("Contract Temp",allowcatedEnergyListTemp)

    setAllowcatedEnergyList(allowcatedEnergyListTemp);

    console.log("Contract List",allowcatedEnergyList)
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
    setAllowcatedEnergyList(sortedData);
  };

  const onSubmitForm1 = (formData) => {
    if (allowcatedEnergyList.length > 0) {
      const param = {
        ugtGroupId: currentUGTGroup?.id,
        subscriberTypeId: 1,
        //General Information
        assignedUtilityId: formData.assignUtil.id,
        tradeAccount: formData.tradeAccount,
        tradeAccountCode:formData.tradeAccountCode,
        retailESANo: formData.retailESANo,
        retailESAContractStartDate: formData.retailESAContractStartDate,
        retailESAContractEndDate: formData.retailESAContractEndDate,
        retailESAContractDuration: formData?.retailESAContractDuration || "",
        redemptionAccount: formData.redemptionAccount,
        subscriberStatusId: 2,
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
        postcode: formData.postCode.postalCode.toString(),
        //Personal Information
        title: formData.title?.value,
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        mobilePhone: formData.mobilePhone,
        officePhone: formData.officePhone,
        attorney: formData.attorney,
        //Subscription Information
        feeder: formData.feeder,
        allocateEnergyAmount: allowcatedEnergyList,
        //Beneficiary Information
        beneficiaryInfo: benefitList,
        //{
          //beneficiaryName: formData.beneficiaryName,
        //  beneficiaryStatus: "ACTIVE",
        //  beneficiaryCountry: formData.beneficiaryCountryCode.name,
        //  beneficiaryAddress: formData.beneficiaryAddress,
        //  beneficiarySubdistrictCode:
        //    formData.beneficiarySubdistrictCode.subdistrictCode,
        //  beneficiarySubdistrictName:
        //    formData.beneficiarySubdistrictCode.subdistrictNameEn,
        //  beneficiaryDistrictCode:
        //    formData.beneficiaryDistrictCode.districtCode,
        //  beneficiaryDistrictName:
        //    formData.beneficiaryDistrictCode.districtNameEn,
        //  beneficiaryProviceCode: formData.beneficiaryProviceCode.provinceCode,
        //  beneficiaryProviceName:
        //    formData.beneficiaryProviceCode.provinceNameEn,
        //  beneficiaryCountryCode:
        //    formData.beneficiaryCountryCode.alpha2.toUpperCase(),
        //  beneficiaryCountryName: formData.beneficiaryCountryCode.name,
        //  beneficiaryPostcode:
         //   formData.beneficiaryPostcode.postalCode.toString(),
        //},
      };
      console.log("Param",param)
      setFormData1(param);
      setShowModalCreateConfirm(true);
    }
  };

  const onSubmitForm1New = (formData) => {
    if (allowcatedEnergyList.length > 0) {      
      if(details?.subscriberDetail.activePortfolioStatus === "N"){
        //Not assign to portfolio or inactive
        let errorCheckContractEnnergy = null
        let errorYear = null
        let errorMonth = null
        let isErrorAllow = false
        const yearStart = parseInt(yearStartDate1.current)
        const yearEnd = parseInt(yearEndDate1.current)
        const diffYear = (yearEnd-yearStart)+1
        console.log("Diff Year",diffYear)
        console.log("Length Contract Amount",allowcatedEnergyList.length)
        const lengthCreateStartyear = allowcatedEnergyList.filter((items)=> items.year === yearStart)
        const lenghtCreateEndyear = allowcatedEnergyList.filter((items)=>items.year === yearEnd)
        if(lengthCreateStartyear.length !== 0){
            if(lenghtCreateEndyear.length !== 0){
              for(let i = yearStart+1;i < yearEnd;i++){
                const checkDisappearData = allowcatedEnergyList.filter((items)=> items.year === i)
                if(checkDisappearData.length === 0){
                  errorYear = i;
                  isErrorAllow = true
                  break;
                }
              }
                if(isErrorAllow === false){
                    for(let i = 0;i < allowcatedEnergyList.length;i++){
                      if(onCheckErrorSubmit(allowcatedEnergyList[i].year,1,allowcatedEnergyList[i].amount01) === false){
                          //console.log("Month 1 is not error")
                          if(onCheckErrorSubmit(allowcatedEnergyList[i].year,2,allowcatedEnergyList[i].amount02) === false){
                            //console.log("Month 2 is not error")
                              if(onCheckErrorSubmit(allowcatedEnergyList[i].year,3,allowcatedEnergyList[i].amount03) === false){
                                //console.log("Month 3 is not error")
                                if(onCheckErrorSubmit(allowcatedEnergyList[i].year,4,allowcatedEnergyList[i].amount04) === false){
                                  //console.log("Month 4 is not error")
                                    if(onCheckErrorSubmit(allowcatedEnergyList[i].year,5,allowcatedEnergyList[i].amount05) === false){
                                      //console.log("Month 5 is not error")
                                        if(onCheckErrorSubmit(allowcatedEnergyList[i].year,6,allowcatedEnergyList[i].amount06) === false){
                                          //console.log("Month 6 is not error")
                                          if(onCheckErrorSubmit(allowcatedEnergyList[i].year,7,allowcatedEnergyList[i].amount07) === false){
                                          // console.log("Month 7 is not error")
                                            if(onCheckErrorSubmit(allowcatedEnergyList[i].year,8,allowcatedEnergyList[i].amount08) === false){
                                            // console.log("Month 8 is not error")
                                              if(onCheckErrorSubmit(allowcatedEnergyList[i].year,9,allowcatedEnergyList[i].amount09) === false){
                                              //  console.log("Month 9 is not error")
                                                if(onCheckErrorSubmit(allowcatedEnergyList[i].year,10,allowcatedEnergyList[i].amount10) === false){
                                              //   console.log("Month 10 is not error")
                                                  if(onCheckErrorSubmit(allowcatedEnergyList[i].year,11,allowcatedEnergyList[i].amount11) === false){
                                              //     console.log("Month 11 is not error")
                                                    if(onCheckErrorSubmit(allowcatedEnergyList[i].year,12,allowcatedEnergyList[i].amount12) === false)
                                                    {
                                                      //console.log("Month 12 is not error")
                                                      errorCheckContractEnnergy = false                                            
                                                    }
                                                    else{
                                                      //console.log("Month 12 is error")
                                                      errorCheckContractEnnergy = true;
                                                      errorYear = allowcatedEnergyList[i].year;
                                                      errorMonth = "Dec";
                                                      break;
                                                    }
                                                  }
                                                  else{
                                                    //console.log("Month 11 is error")
                                                    errorCheckContractEnnergy = true;
                                                    errorYear = allowcatedEnergyList[i].year;
                                                    errorMonth = "Nov";
                                                    break;
                                                  }
                                                }
                                                else{
                                                  //console.log("Month 10 is error")
                                                  errorCheckContractEnnergy = true;
                                                  errorYear = allowcatedEnergyList[i].year;
                                                  errorMonth = "Oct";
                                                  break;
                                                }
                                              }
                                              else{
                                                //console.log("Month 9 is error")
                                                errorCheckContractEnnergy = true;
                                                errorYear = allowcatedEnergyList[i].year;
                                                errorMonth = "Sep";
                                                break;
                                              }
                                            }
                                            else{
                                              //console.log("Month 8 is error")
                                              errorCheckContractEnnergy = true;
                                              errorYear = allowcatedEnergyList[i].year;
                                              errorMonth = "Aug";
                                              break;
                                            }
                                          }
                                          else{
                                            //console.log("Month 7 is error")
                                            errorCheckContractEnnergy = true;
                                            errorYear = allowcatedEnergyList[i].year;
                                            errorMonth = "Jul";
                                            break;
                                          }
                                        }
                                        else{
                                          //console.log("Month 6 is error")
                                          errorCheckContractEnnergy = true;
                                          errorYear = allowcatedEnergyList[i].year;
                                          errorMonth = "Jun";
                                          break;
                                        }
                                    }
                                    else{
                                      //console.log("Month 5 is error")
                                      errorCheckContractEnnergy = true;
                                      errorYear = allowcatedEnergyList[i].year;
                                      errorMonth = "May";
                                      break;
                                    }
                                }
                                else{
                                  //console.log("Month 4 is error")
                                  errorCheckContractEnnergy = true;
                                  errorYear = allowcatedEnergyList[i].year;
                                  errorMonth = "Apr";
                                  break;
                                }
                              }
                              else{
                                //console.log("Month 3 is error")
                                errorCheckContractEnnergy = true;
                                errorYear = allowcatedEnergyList[i].year;
                                errorMonth = "Mar";
                                break;
                              }
                          }
                          else{
                            //console.log("Month 2 is error")
                            errorCheckContractEnnergy = true;
                            errorYear = allowcatedEnergyList[i].year;
                            errorMonth = "Feb";
                            break;
                          }
                      }
                      else{
                        //console.log("Month 1 is error")
                        errorCheckContractEnnergy = true;
                        errorYear = allowcatedEnergyList[i].year;
                        errorMonth = "Jan";
                        break;
                      }
                  }
                const param = {
                      subscriberId: details?.subscriberDetail?.subscriberId,
                      subscribersContractInformationId: details?.subscriberDetail.subscribersContractInformationId,
                      ugtGroupId: currentUGTGroup?.id,
                      subscriberTypeId: 1,
                      //General Information
                      assignedUtilityId: formData.assignUtil.id,
                      //subscriberCode: formData.subscriberCode,
                      tradeAccount: formData.tradeAccount,
                      tradeAccountCode: formData.tradeAccountCode,
                      redemptionAccountCode: formData.redemptionAccountCode,
                      redemptionAccount: formData.redemptionAccount,
                      //tradeAccount: formData.tradeAccount,
                      //retailESANo: formData.retailESANo,
                      //retailESAContractStartDate: formData.retailESAContractStartDate,
                      //retailESAContractEndDate: formData.retailESAContractEndDate,
                      //retailESAContractDuration: formData?.retailESAContractDuration || "",
                      //redemptionAccount: formData.redemptionAccount,
                      subscriberStatusId: details?.subscriberDetail.subscriberStatusId,
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
                      retailESAContractDuration: formData?.retailESAContractDuration || "",
                      portfolioAssignment: formData.portfolioAssignment,
                      optForUp: formData.optGreen?"Active":"Inactive",
                      optForExcess: formData.optContract?"Active":"Inactive",
                      feeder: formData.feeder,
                      allocateEnergyAmount: allowcatedEnergyList,
                      fileUploadContract: allowcatedExcelFileList,
                      //Beneficiary Information
                      beneficiaryInfo:benefitList,
                      subscriberRemark:null /*{
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
                      fileUpload:fileList,
                      note:formData.note,
                      fileUploadSubscriberContractHistoryLog:[],
                      subscriberContractHistoryLog:{action:"Edit",createBy: (userDetail.firstName+" "+userDetail.lastName)}
                    };
                if(errorCheckContractEnnergy === false){
                 // console.log("Contract Amount is not Error")
                    //setIsAllocatedEnergyAmount(false);
                    setIsBeficiary(false)
                    setFormData1(param);
                    console.log(param)
                    setShowModalCreateConfirm(true);
                }
                else{
                  setIsShowFailModal(true)
                  setMessageFailModal("Contract Energy Amount error in year "+errorYear+" on "+errorMonth)
                  console.log("Contract Amount Error",errorYear+" "+errorMonth)
                }
                }
                else{
                  setIsShowFailModal(true)
                  setMessageFailModal("Contract energy amount is not create in " + errorYear)
                  console.log("Error create ContractEnergy is not match select Date")
                }
              }
              else{
                setIsShowFailModal(true)
                setMessageFailModal("Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date")
                console.log("Error is not Create Allowcated End Year")
              }
          }
          else{
            setIsShowFailModal(true)
            setMessageFailModal("Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date")
            console.log("Error is not Create Allowcated Start Year")
          }
      }
      else{
        //Assign to Portfolio and Active
        let errorCheckContractEnnergy = null
        let errorYear = null
        let errorMonth = null
        let isErrorAllow = false
        const yearStart = parseInt(yearStartDate1.current)
        const yearEnd = parseInt(yearEndDate1.current)
        const diffYear = (yearEnd-yearStart)+1
        console.log("Diff Year",diffYear)
        console.log("Length Contract Amount",allowcatedEnergyList.length)
        const lengthCreateStartyear = allowcatedEnergyList.filter((items)=> items.year === yearStart)
        const lenghtCreateEndyear = allowcatedEnergyList.filter((items)=>items.year === yearEnd)
        if(lengthCreateStartyear.length !== 0){
            if(lenghtCreateEndyear.length !== 0){
              for(let i = yearStart+1;i < yearEnd;i++){
                const checkDisappearData = allowcatedEnergyList.filter((items)=> items.year === i)
                if(checkDisappearData.length === 0){
                  errorYear = i;
                  isErrorAllow = true
                  break;
                }
              }
                if(isErrorAllow === false){
                    for(let i = 0;i < allowcatedEnergyList.length;i++){
                      if(onCheckErrorSubmit(allowcatedEnergyList[i].year,1,allowcatedEnergyList[i].amount01) === false){
                          //console.log("Month 1 is not error")
                          if(onCheckErrorSubmit(allowcatedEnergyList[i].year,2,allowcatedEnergyList[i].amount02) === false){
                            //console.log("Month 2 is not error")
                              if(onCheckErrorSubmit(allowcatedEnergyList[i].year,3,allowcatedEnergyList[i].amount03) === false){
                                //console.log("Month 3 is not error")
                                if(onCheckErrorSubmit(allowcatedEnergyList[i].year,4,allowcatedEnergyList[i].amount04) === false){
                                  //console.log("Month 4 is not error")
                                    if(onCheckErrorSubmit(allowcatedEnergyList[i].year,5,allowcatedEnergyList[i].amount05) === false){
                                      //console.log("Month 5 is not error")
                                        if(onCheckErrorSubmit(allowcatedEnergyList[i].year,6,allowcatedEnergyList[i].amount06) === false){
                                          //console.log("Month 6 is not error")
                                          if(onCheckErrorSubmit(allowcatedEnergyList[i].year,7,allowcatedEnergyList[i].amount07) === false){
                                          // console.log("Month 7 is not error")
                                            if(onCheckErrorSubmit(allowcatedEnergyList[i].year,8,allowcatedEnergyList[i].amount08) === false){
                                            // console.log("Month 8 is not error")
                                              if(onCheckErrorSubmit(allowcatedEnergyList[i].year,9,allowcatedEnergyList[i].amount09) === false){
                                              //  console.log("Month 9 is not error")
                                                if(onCheckErrorSubmit(allowcatedEnergyList[i].year,10,allowcatedEnergyList[i].amount10) === false){
                                              //   console.log("Month 10 is not error")
                                                  if(onCheckErrorSubmit(allowcatedEnergyList[i].year,11,allowcatedEnergyList[i].amount11) === false){
                                              //     console.log("Month 11 is not error")
                                                    if(onCheckErrorSubmit(allowcatedEnergyList[i].year,12,allowcatedEnergyList[i].amount12) === false)
                                                    {
                                                      //console.log("Month 12 is not error")
                                                      errorCheckContractEnnergy = false                                            
                                                    }
                                                    else{
                                                      //console.log("Month 12 is error")
                                                      errorCheckContractEnnergy = true;
                                                      errorYear = allowcatedEnergyList[i].year;
                                                      errorMonth = "Dec";
                                                      break;
                                                    }
                                                  }
                                                  else{
                                                    //console.log("Month 11 is error")
                                                    errorCheckContractEnnergy = true;
                                                    errorYear = allowcatedEnergyList[i].year;
                                                    errorMonth = "Nov";
                                                    break;
                                                  }
                                                }
                                                else{
                                                  //console.log("Month 10 is error")
                                                  errorCheckContractEnnergy = true;
                                                  errorYear = allowcatedEnergyList[i].year;
                                                  errorMonth = "Oct";
                                                  break;
                                                }
                                              }
                                              else{
                                                //console.log("Month 9 is error")
                                                errorCheckContractEnnergy = true;
                                                errorYear = allowcatedEnergyList[i].year;
                                                errorMonth = "Sep";
                                                break;
                                              }
                                            }
                                            else{
                                              //console.log("Month 8 is error")
                                              errorCheckContractEnnergy = true;
                                              errorYear = allowcatedEnergyList[i].year;
                                              errorMonth = "Aug";
                                              break;
                                            }
                                          }
                                          else{
                                            //console.log("Month 7 is error")
                                            errorCheckContractEnnergy = true;
                                            errorYear = allowcatedEnergyList[i].year;
                                            errorMonth = "Jul";
                                            break;
                                          }
                                        }
                                        else{
                                          //console.log("Month 6 is error")
                                          errorCheckContractEnnergy = true;
                                          errorYear = allowcatedEnergyList[i].year;
                                          errorMonth = "Jun";
                                          break;
                                        }
                                    }
                                    else{
                                      //console.log("Month 5 is error")
                                      errorCheckContractEnnergy = true;
                                      errorYear = allowcatedEnergyList[i].year;
                                      errorMonth = "May";
                                      break;
                                    }
                                }
                                else{
                                  //console.log("Month 4 is error")
                                  errorCheckContractEnnergy = true;
                                  errorYear = allowcatedEnergyList[i].year;
                                  errorMonth = "Apr";
                                  break;
                                }
                              }
                              else{
                                //console.log("Month 3 is error")
                                errorCheckContractEnnergy = true;
                                errorYear = allowcatedEnergyList[i].year;
                                errorMonth = "Mar";
                                break;
                              }
                          }
                          else{
                            //console.log("Month 2 is error")
                            errorCheckContractEnnergy = true;
                            errorYear = allowcatedEnergyList[i].year;
                            errorMonth = "Feb";
                            break;
                          }
                      }
                      else{
                        //console.log("Month 1 is error")
                        errorCheckContractEnnergy = true;
                        errorYear = allowcatedEnergyList[i].year;
                        errorMonth = "Jan";
                        break;
                      }
                  }
                
                if(errorCheckContractEnnergy === false){
                 // console.log("Contract Amount is not Error")
                    //setIsAllocatedEnergyAmount(false);
                    setIsBeficiary(false)
                    //setFormData1(param);
                    //console.log(param)
                    setShowMadalCreateRemark(true);
                }
                else{
                  setIsShowFailModal(true)
                  setMessageFailModal("Contract Energy Amount error in year "+errorYear+" on "+errorMonth)
                  console.log("Contract Amount Error",errorYear+" "+errorMonth)
                }
                }
                else{
                  setIsShowFailModal(true)
                  setMessageFailModal("Contract energy amount is not create in " + errorYear)
                  console.log("Error create ContractEnergy is not match select Date")
                }
              }
              else{
                setIsShowFailModal(true)
                setMessageFailModal("Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date")
                console.log("Error is not Create Allowcated End Year")
              }
          }
          else{
            setIsShowFailModal(true)
            setMessageFailModal("Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date")
            console.log("Error is not Create Allowcated Start Year")
          }
      }
    }
  };

  const onCheckErrorSubmit=(year,month,value,)=>{
    const years = parseInt(year)
    const months = parseInt(month)
    const values = parseInt(value)
    const yearStart = parseInt(yearStartDate)
    const yearEnd = parseInt(yearEndDate)  
    const monthStart = parseInt(monthStartDate)
    const monthEnd = parseInt(monthEndDate)
    if(years >= yearStart && years <= yearEnd){
      
      if(years === yearStart){
        if(yearStart !== yearEnd){
          if(months >= monthStart){
            if(values === 0){
              return true
            }
            else{
              return false
            }          
          }
          else{
            if(values !== 0){
              return true
            }
            else{
              return false
            } 
            
            
          }
        }
        else{
          if(months >= monthStart && months <= monthEnd){
            if(values === 0){
              return true
            }
            else{
              return false
            } 
          }
          else{
            if(values !== 0){
              return true
            }
            else{
              return false
            } 
          }
        }
      }
      else if(years === yearEnd){
        if(months <= monthEnd){
          if(values === 0){
            return true
          }
          else{
            return false
          }   
        }
        else{
          if(values !== 0){
            return true
          }
          else{
            return false
          } 
          
        }
      }
      else{
        if(values === 0){
          return true
        }
        else{
          return false
        } 
      }
    }
    else{
      
      return true
    }

  }

  const handleClickConfirm = () => {
    setShowModalCreateConfirm(false);
    setShowMadalCreateRemark(false);
    // setIsOpenLoading(true);
    showLoading();
    if (isActiveForm1 == true) {
      if(details?.subscriberDetail.activePortfolioStatus === "N"){
        console.log("Param Form1",FormData1)
          dispatch(
            FunctionEditSubscriber(FormData1, details?.subscriberDetail?.subscriberId, () => {
              if (isError === false) {
                console.log("Create Form 1 success")
              // setIsOpenLoading(false);
                hideLoading();
                setShowModalComplete(true);}
              else{
                console.log("Create form 1 error")
                hideLoading();
                setIsShowFailError(true)
                setMessageFailModal(errorMessage)
              }
              // setIsOpenLoading(false);
              //hideLoading();
              //setShowModalComplete(true);
            })
          );
       }
       else{
        createPdfPDFForm1()
        /*const param = {
          subscriberId: details?.subscriberDetail?.subscriberId,
          subscribersContractInformationId: details?.subscriberDetail.subscribersContractInformationId,
          ugtGroupId: currentUGTGroup?.id,
          subscriberTypeId: 1,
          //General Information
          assignedUtilityId: details?.subscriberDetail.assignedUtilityId,
          //subscriberCode: formData.subscriberCode,
          tradeAccount: getValues("tradeAccount"),
          tradeAccountCode: getValues("tradeAccountCode"),
          redemptionAccountCode: getValues("redemptionAccountCode"),
          redemptionAccount: getValues("redemptionAccount"),
          //tradeAccount: formData.tradeAccount,
          //retailESANo: formData.retailESANo,
          //retailESAContractStartDate: formData.retailESAContractStartDate,
          //retailESAContractEndDate: formData.retailESAContractEndDate,
          //retailESAContractDuration: formData?.retailESAContractDuration || "",
          //redemptionAccount: formData.redemptionAccount,
          subscriberStatusId: details?.subscriberDetail.subscriberStatusId,
          //Organization Information
          organizationName: getValues("organizationName"),
          businessRegistrationNo: getValues("businessRegistrationNo"),
          address: getValues("address"),
          subdistrictCode: getValues("subdistrictCode").subdistrictCode,
          subdistrictName: getValues("subdistrictCode").subdistrictNameEn,
          districtCode: getValues("districtCode").districtCode,
          districtName: getValues("districtCode").districtNameEn,
          provinceCode: getValues("stateCode").provinceCode,
          provinceName: getValues("stateCode").provinceNameEn,
          countryCode: getValues("countryCode").alpha2.toUpperCase(),
          countryName: getValues("countryCode").name,
          postCode: getValues("postCode").postalCode.toString(),
          //Personal Information
          title: getValues("title")?.value,
          name: getValues("name"),
          lastname: getValues("lastname"),
          email: getValues("email"),
          mobilePhone: getValues("mobilePhone"),
          officePhone: getValues("officePhone"),
          attorney: getValues("attorney"),
          //Subscription Information
          retailESANo: getValues("retailESANo"),
          retailESAContractStartDate: getValues("retailESAContractStartDate"),
          retailESAContractEndDate: getValues("retailESAContractEndDate"),
          retailESAContractDuration: getValues("retailESAContractDuration") || "",
          portfolioAssignment: getValues("portfolioAssignment"),
          optForUp: getValues("optGreen")?"Active":"Inactive",
          optForExcess: getValues("optContract")?"Active":"Inactive",
          feeder: getValues("feeder"),
          allocateEnergyAmount: allowcatedEnergyList,
          fileUploadContract: allowcatedExcelFileList,
          //Beneficiary Information
          beneficiaryInfo:benefitList,
          //Attach File
          fileUpload:fileList,
          note:getValues("note"),
          subscriberRemark:RefRemark.current
        };
        dispatch(
          FunctionEditSubscriber(param, details?.subscriberDetail?.subscriberId, () => {
            if (isError === false) {
              
              console.log("Create Form 1 success")
            // setIsOpenLoading(false);
              hideLoading();
              setShowMadalCreateRemark(false);
              setShowModalComplete(true);}
            else{
              console.log("Create form 1 error")
              hideLoading();
              setIsShowFailError(true)
              setShowMadalCreateRemark(false);
              setMessageFailModal(errorMessage)
            }
            // setIsOpenLoading(false);
            //hideLoading();
            //setShowModalComplete(true);
          })
        );*/
       }
    } else {
      if(details?.subscriberDetail.activePortfolioStatus === "N"){
            dispatch(
              FunctioneditAggregateSubscriber(
                FormData2,
                details?.subscriberDetail?.subscriberId,
                () => {
                  if (isError === false) {
                    console.log("Create form 2 success")
                    // setIsOpenLoading(false);
                      hideLoading();
                      setShowModalComplete(true);}
                    else{
                      console.log("Create form 2 error")
                      hideLoading();
                      setIsShowFailError(true)
                      setMessageFailModal(errorMessage)
                    }
                  // setIsOpenLoading(false);
                  //hideLoading();
                  //setShowModalComplete(true);
                }
              )
            );
          }
          else{
            createPdfPDFForm2()
            /*const param = {
              subscriberId: details?.subscriberDetail?.subscriberId,
              subscribersContractInformationId: details?.subscriberDetail.subscribersContractInformationId,
              ugtGroupId: currentUGTGroup?.id,
              subscriberTypeId: 2,
              assignedUtilityId: details?.subscriberDetail.assignedUtilityId,
              //tradeAccount: formData.tradeAccount,
              name: getValues("name"),
              tradeAccount:getValues("tradeAccount"),
              tradeAccountCode:getValues("tradeAccountCode"),
              retailESAContractStartDate: getValues("retailESAContractStartDate"),
              retailESAContractEndDate: getValues("retailESAContractEndDate"),
              retailESAContractDuration: getValues("retailESAContractDuration") || "",
              portfolioAssignment: getValues("portfolioAssignment"),
              optForUp: getValues("optGreen")?"Active":"Inactive",
              optForExcess: getValues("optContract")?"Active":"Inactive",
              subscribersFilePdf:fileListPDF,
              subscribersFileXls:fileListExcel,
              note:getValues("note"),
              subscriberStatusId: details?.subscriberDetail.subscriberStatusId,
              //aggregateAllocatedEnergy: parseInt(formData.aggregateAllocatedEnergy),
              allocateEnergyAmount: allowcatedEnergyList,
              fileUploadContract: allowcatedExcelFileList,
              subscriberRemark:RefRemark.current,
            };
            dispatch(
              FunctioneditAggregateSubscriber(
                param,
                details?.subscriberDetail?.subscriberId,
                () => {
                  if (isError === false) {
                    console.log("Create form 2 success")
                    // setIsOpenLoading(false);
                      hideLoading();
                      setShowMadalCreateRemark(false);
                      setShowModalComplete(true);}
                    else{
                      console.log("Create form 2 error")
                      hideLoading();
                      setShowMadalCreateRemark(false);
                      setIsShowFailError(true)
                      setMessageFailModal(errorMessage)
                    }
                  // setIsOpenLoading(false);
                  //hideLoading();
                  //setShowModalComplete(true);
                }
              )
            );*/
          }
    }
  };

  const handleCloseModalConfirm = (val) => {
    setShowModalCreateConfirm(false);
  };

  const handleCloseModalConfirmRemark=()=>{
    setShowMadalCreateRemark(false)
  }

  const onSubmitForm2 = (formData) => {
    const param = {
      ugtGroupId: currentUGTGroup?.id,
      subscriberTypeId: 2,
      assignedUtilityId: formData.assignUtil.id,
      tradeAccount: formData.tradeAccount,
      name: formData.name,
      subscriberStatusId: 2,
      aggregateAllocatedEnergy: parseInt(formData.aggregateAllocatedEnergy),
      allocateEnergyAmount: allowcatedEnergyList,
      fileUploadSubscriberContractHistoryLog:structrueSend,
      subscriberContractHistoryLog:{action:"Edit",createBy: (userDetail.firstName+" "+userDetail.lastName)}
    };
    setFormData2(param);
    setShowModalCreateConfirm(true);
  };

  const onSubmitForm2New = (formData) => {
    if (allowcatedEnergyList.length > 0) {      
        if(details?.subscriberDetail.activePortfolioStatus === "N"){
        //Not assign to portfolio or inactive
        let errorCheckContractEnnergy = null
        let errorYear = null
        let errorMonth = null
        let isError = false
        const yearStart = parseInt(yearStartDate1.current)
        const yearEnd = parseInt(yearEndDate1.current)
        const diffYear = (yearEnd-yearStart)+1
        console.log("Diff Year",diffYear)
        console.log("Length Contract Amount",allowcatedEnergyList.length)
        const lengthCreateStartyear = allowcatedEnergyList.filter((items)=> items.year === yearStart)
        const lenghtCreateEndyear = allowcatedEnergyList.filter((items)=>items.year === yearEnd)
        if(lengthCreateStartyear.length !== 0){
            if(lenghtCreateEndyear.length !== 0){
              for(let i = yearStart+1;i < yearEnd;i++){
                const checkDisappearData = allowcatedEnergyList.filter((items)=> items.year === i)
                if(checkDisappearData.length === 0){
                  errorYear = i;
                  isError = true
                  break;
                }
              }
                
                if(isError === false){
                    for(let i = 0;i < allowcatedEnergyList.length;i++){
                      if(onCheckErrorSubmit(allowcatedEnergyList[i].year,1,allowcatedEnergyList[i].amount01) === false){
                          //console.log("Month 1 is not error")
                          if(onCheckErrorSubmit(allowcatedEnergyList[i].year,2,allowcatedEnergyList[i].amount02) === false){
                            //console.log("Month 2 is not error")
                              if(onCheckErrorSubmit(allowcatedEnergyList[i].year,3,allowcatedEnergyList[i].amount03) === false){
                                //console.log("Month 3 is not error")
                                if(onCheckErrorSubmit(allowcatedEnergyList[i].year,4,allowcatedEnergyList[i].amount04) === false){
                                  //console.log("Month 4 is not error")
                                    if(onCheckErrorSubmit(allowcatedEnergyList[i].year,5,allowcatedEnergyList[i].amount05) === false){
                                      //console.log("Month 5 is not error")
                                        if(onCheckErrorSubmit(allowcatedEnergyList[i].year,6,allowcatedEnergyList[i].amount06) === false){
                                          //console.log("Month 6 is not error")
                                          if(onCheckErrorSubmit(allowcatedEnergyList[i].year,7,allowcatedEnergyList[i].amount07) === false){
                                            //console.log("Month 7 is not error")
                                            if(onCheckErrorSubmit(allowcatedEnergyList[i].year,8,allowcatedEnergyList[i].amount08) === false){
                                              //console.log("Month 8 is not error")
                                              if(onCheckErrorSubmit(allowcatedEnergyList[i].year,9,allowcatedEnergyList[i].amount09) === false){
                                                //console.log("Month 9 is not error")
                                                if(onCheckErrorSubmit(allowcatedEnergyList[i].year,10,allowcatedEnergyList[i].amount10) === false){
                                                  //console.log("Month 10 is not error")
                                                  if(onCheckErrorSubmit(allowcatedEnergyList[i].year,11,allowcatedEnergyList[i].amount11) === false){
                                                    //console.log("Month 11 is not error")
                                                    if(onCheckErrorSubmit(allowcatedEnergyList[i].year,12,allowcatedEnergyList[i].amount12) === false)
                                                    {
                                                      //console.log("Month 12 is not error")
                                                      errorCheckContractEnnergy = false                                            
                                                    }
                                                    else{
                                                      //console.log("Month 12 is error")
                                                      errorCheckContractEnnergy = true;
                                                      errorYear = allowcatedEnergyList[i].year;
                                                      errorMonth = "Dec";
                                                      break;
                                                    }
                                                  }
                                                  else{
                                                    //console.log("Month 11 is error")
                                                    errorCheckContractEnnergy = true;
                                                    errorYear = allowcatedEnergyList[i].year;
                                                    errorMonth = "Nov";
                                                    break;
                                                  }
                                                }
                                                else{
                                                  //console.log("Month 10 is error")
                                                  errorCheckContractEnnergy = true;
                                                  errorYear = allowcatedEnergyList[i].year;
                                                  errorMonth = "Oct";
                                                  break;
                                                }
                                              }
                                              else{
                                                //console.log("Month 9 is error")
                                                errorCheckContractEnnergy = true;
                                                errorYear = allowcatedEnergyList[i].year;
                                                errorMonth = "Sep";
                                                break;
                                              }
                                            }
                                            else{
                                              //console.log("Month 8 is error")
                                              errorCheckContractEnnergy = true;
                                              errorYear = allowcatedEnergyList[i].year;
                                              errorMonth = "Aug";
                                              break;
                                            }
                                          }
                                          else{
                                            //console.log("Month 7 is error")
                                            errorCheckContractEnnergy = true;
                                            errorYear = allowcatedEnergyList[i].year;
                                            errorMonth = "Jul";
                                            break;
                                          }
                                        }
                                        else{
                                          //console.log("Month 6 is error")
                                          errorCheckContractEnnergy = true;
                                          errorYear = allowcatedEnergyList[i].year;
                                          errorMonth = "Jun";
                                          break;
                                        }
                                    }
                                    else{
                                      //console.log("Month 5 is error")
                                      errorCheckContractEnnergy = true;
                                      errorYear = allowcatedEnergyList[i].year;
                                      errorMonth = "May";
                                      break;
                                    }
                                }
                                else{
                                  //console.log("Month 4 is error")
                                  errorCheckContractEnnergy = true;
                                  errorYear = allowcatedEnergyList[i].year;
                                  errorMonth = "Apr";
                                  break;
                                }
                              }
                              else{
                                //console.log("Month 3 is error")
                                errorCheckContractEnnergy = true;
                                errorYear = allowcatedEnergyList[i].year;
                                errorMonth = "Mar";
                                break;
                              }
                          }
                          else{
                            //console.log("Month 2 is error")
                            errorCheckContractEnnergy = true;
                            errorYear = allowcatedEnergyList[i].year;
                            errorMonth = "Feb";
                            break;
                          }
                      }
                      else{
                        //console.log("Month 1 is error")
                        errorCheckContractEnnergy = true;
                        errorYear = allowcatedEnergyList[i].year;
                        errorMonth = "Jan";
                        break;
                      }
                  }
                    const param = {
                      subscriberId: details?.subscriberDetail?.subscriberId,
                      subscribersContractInformationId: details?.subscriberDetail.subscribersContractInformationId,
                      ugtGroupId: currentUGTGroup?.id,
                      subscriberTypeId: 2,
                      assignedUtilityId: formData.assignUtil.id,
                      //tradeAccount: formData.tradeAccount,
                      name: formData.name,
                      tradeAccount:formData.tradeAccount,
                      tradeAccountCode:formData.tradeAccountCode,
                      retailESAContractStartDate: formData.retailESAContractStartDate,
                      retailESAContractEndDate: formData.retailESAContractEndDate,
                      retailESAContractDuration: formData?.retailESAContractDuration || "",
                      portfolioAssignment: formData.portfolioAssignment,
                      optForUp: formData.optGreen?"Active":"Inactive",
                      optForExcess: formData.optContract?"Active":"Inactive",
                      subscribersFilePdf:fileListPDF,
                      subscribersFileXls:fileListExcel,
                      note:formData.note,
                      subscriberStatusId: details?.subscriberDetail.subscriberStatusId,
                      //aggregateAllocatedEnergy: parseInt(formData.aggregateAllocatedEnergy),
                      allocateEnergyAmount: allowcatedEnergyList,
                      fileUploadContract: allowcatedExcelFileList,
                      subscriberRemark:null,
                      fileUploadSubscriberContractHistoryLog:[],
                      subscriberContractHistoryLog:{action:"Edit",createBy: (userDetail.firstName+" "+userDetail.lastName)}
                    };
                    if(errorCheckContractEnnergy === false){
                      //console.log("Contract Amount is not Error")
                      //console.log("param",param)
                      setFormData2(param);
                      setShowModalCreateConfirm(true);
                    }
                    else{
                      setIsShowFailModal(true)
                      setMessageFailModal("Contract Energy Amount error in year "+errorYear+" on "+errorMonth)
                      //console.log("Contract Amount Error",errorYear+" "+errorMonth)
                    }
                }
                else{
                  setIsShowFailModal(true)
                  setMessageFailModal("Contract energy amount is not create in " + errorYear)
                  //console.log("Error create ContractEnergy is not match select Date")
                }
              }
              else{
                setIsShowFailModal(true)
                setMessageFailModal("Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date")
                //console.log("Error is not Create Allowcated End Year")
              }
          }
          else{
            setIsShowFailModal(true)
            setMessageFailModal("Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date")
            //console.log("Error is not Create Allowcated Start Year")
          }
      }
      else{
        //Assign to Portfolio and Active
        let errorCheckContractEnnergy = null
        let errorYear = null
        let errorMonth = null
        let isErrorAllow = false
        const yearStart = parseInt(yearStartDate1.current)
        const yearEnd = parseInt(yearEndDate1.current)
        const diffYear = (yearEnd-yearStart)+1
        console.log("Diff Year",diffYear)
        console.log("Length Contract Amount",allowcatedEnergyList.length)
        const lengthCreateStartyear = allowcatedEnergyList.filter((items)=> items.year === yearStart)
        const lenghtCreateEndyear = allowcatedEnergyList.filter((items)=>items.year === yearEnd)
        if(lengthCreateStartyear.length !== 0){
            if(lenghtCreateEndyear.length !== 0){
              for(let i = yearStart+1;i < yearEnd;i++){
                const checkDisappearData = allowcatedEnergyList.filter((items)=> items.year === i)
                if(checkDisappearData.length === 0){
                  errorYear = i;
                  isErrorAllow = true
                  break;
                }
              }
                if(isErrorAllow === false){
                    for(let i = 0;i < allowcatedEnergyList.length;i++){
                      if(onCheckErrorSubmit(allowcatedEnergyList[i].year,1,allowcatedEnergyList[i].amount01) === false){
                          //console.log("Month 1 is not error")
                          if(onCheckErrorSubmit(allowcatedEnergyList[i].year,2,allowcatedEnergyList[i].amount02) === false){
                            //console.log("Month 2 is not error")
                              if(onCheckErrorSubmit(allowcatedEnergyList[i].year,3,allowcatedEnergyList[i].amount03) === false){
                                //console.log("Month 3 is not error")
                                if(onCheckErrorSubmit(allowcatedEnergyList[i].year,4,allowcatedEnergyList[i].amount04) === false){
                                  //console.log("Month 4 is not error")
                                    if(onCheckErrorSubmit(allowcatedEnergyList[i].year,5,allowcatedEnergyList[i].amount05) === false){
                                      //console.log("Month 5 is not error")
                                        if(onCheckErrorSubmit(allowcatedEnergyList[i].year,6,allowcatedEnergyList[i].amount06) === false){
                                          //console.log("Month 6 is not error")
                                          if(onCheckErrorSubmit(allowcatedEnergyList[i].year,7,allowcatedEnergyList[i].amount07) === false){
                                          // console.log("Month 7 is not error")
                                            if(onCheckErrorSubmit(allowcatedEnergyList[i].year,8,allowcatedEnergyList[i].amount08) === false){
                                            // console.log("Month 8 is not error")
                                              if(onCheckErrorSubmit(allowcatedEnergyList[i].year,9,allowcatedEnergyList[i].amount09) === false){
                                              //  console.log("Month 9 is not error")
                                                if(onCheckErrorSubmit(allowcatedEnergyList[i].year,10,allowcatedEnergyList[i].amount10) === false){
                                              //   console.log("Month 10 is not error")
                                                  if(onCheckErrorSubmit(allowcatedEnergyList[i].year,11,allowcatedEnergyList[i].amount11) === false){
                                              //     console.log("Month 11 is not error")
                                                    if(onCheckErrorSubmit(allowcatedEnergyList[i].year,12,allowcatedEnergyList[i].amount12) === false)
                                                    {
                                                      //console.log("Month 12 is not error")
                                                      errorCheckContractEnnergy = false                                            
                                                    }
                                                    else{
                                                      //console.log("Month 12 is error")
                                                      errorCheckContractEnnergy = true;
                                                      errorYear = allowcatedEnergyList[i].year;
                                                      errorMonth = "Dec";
                                                      break;
                                                    }
                                                  }
                                                  else{
                                                    //console.log("Month 11 is error")
                                                    errorCheckContractEnnergy = true;
                                                    errorYear = allowcatedEnergyList[i].year;
                                                    errorMonth = "Nov";
                                                    break;
                                                  }
                                                }
                                                else{
                                                  //console.log("Month 10 is error")
                                                  errorCheckContractEnnergy = true;
                                                  errorYear = allowcatedEnergyList[i].year;
                                                  errorMonth = "Oct";
                                                  break;
                                                }
                                              }
                                              else{
                                                //console.log("Month 9 is error")
                                                errorCheckContractEnnergy = true;
                                                errorYear = allowcatedEnergyList[i].year;
                                                errorMonth = "Sep";
                                                break;
                                              }
                                            }
                                            else{
                                              //console.log("Month 8 is error")
                                              errorCheckContractEnnergy = true;
                                              errorYear = allowcatedEnergyList[i].year;
                                              errorMonth = "Aug";
                                              break;
                                            }
                                          }
                                          else{
                                            //console.log("Month 7 is error")
                                            errorCheckContractEnnergy = true;
                                            errorYear = allowcatedEnergyList[i].year;
                                            errorMonth = "Jul";
                                            break;
                                          }
                                        }
                                        else{
                                          //console.log("Month 6 is error")
                                          errorCheckContractEnnergy = true;
                                          errorYear = allowcatedEnergyList[i].year;
                                          errorMonth = "Jun";
                                          break;
                                        }
                                    }
                                    else{
                                      //console.log("Month 5 is error")
                                      errorCheckContractEnnergy = true;
                                      errorYear = allowcatedEnergyList[i].year;
                                      errorMonth = "May";
                                      break;
                                    }
                                }
                                else{
                                  //console.log("Month 4 is error")
                                  errorCheckContractEnnergy = true;
                                  errorYear = allowcatedEnergyList[i].year;
                                  errorMonth = "Apr";
                                  break;
                                }
                              }
                              else{
                                //console.log("Month 3 is error")
                                errorCheckContractEnnergy = true;
                                errorYear = allowcatedEnergyList[i].year;
                                errorMonth = "Mar";
                                break;
                              }
                          }
                          else{
                            //console.log("Month 2 is error")
                            errorCheckContractEnnergy = true;
                            errorYear = allowcatedEnergyList[i].year;
                            errorMonth = "Feb";
                            break;
                          }
                      }
                      else{
                        //console.log("Month 1 is error")
                        errorCheckContractEnnergy = true;
                        errorYear = allowcatedEnergyList[i].year;
                        errorMonth = "Jan";
                        break;
                      }
                  }
                
                if(errorCheckContractEnnergy === false){
                    // console.log("Contract Amount is not Error")
                    //setIsAllocatedEnergyAmount(false);
                    setIsBeficiary(false)
                    //setFormData1(param);
                    //console.log(param)
                    setShowMadalCreateRemark(true);
                }
                else{
                  setIsShowFailModal(true)
                  setMessageFailModal("Contract Energy Amount error in year "+errorYear+" on "+errorMonth)
                  console.log("Contract Amount Error",errorYear+" "+errorMonth)
                }
                }
                else{
                  setIsShowFailModal(true)
                  setMessageFailModal("Contract energy amount is not create in " + errorYear)
                  console.log("Error create ContractEnergy is not match select Date")
                }
              }
              else{
                setIsShowFailModal(true)
                setMessageFailModal("Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date")
                console.log("Error is not Create Allowcated End Year")
              }
          }
          else{
            setIsShowFailModal(true)
            setMessageFailModal("Contract energy amount is not match with Retail ESA Contract Start Date and Retail ESA Contract End Date")
            console.log("Error is not Create Allowcated Start Year")
          }
      }
    }
  };

  const commissioningDateDisableDateCal = (day) => {
    let dateValue = new Date();
    const previousDate = new Date(dateValue);
    previousDate.setDate(dateValue.getDate() - 1);
    return day > previousDate;
  };
  const handleChangeCommissioningDate = (date) => {
    setSelectedCommisionDate(date);
    setValue("retailESAContractEndDate", "");
    setValue("retailESAContractDuration", "");
    splitStartDate(getValues("retailESAContractStartDate"))
    if (date) {
      setDisableRequestedEffectiveDate(false);
    } else {
      setDisableRequestedEffectiveDate(true);
    }
  };

  const splitStartDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    setYearStartDate(year);
    yearStartDate1.current = year
    setMonthStartDate(month);
    monthStartDate1.current = month
    setDayStartDate(day);
    dayStartDate1.current = day
    //console.log("Year Start",yearStartDate1.current)
    //console.log("Month Start",monthStartDate1.current)
    //console.log("Day Start",dayStartDate1.current)
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

    let years = dateEnd.diff(dateStart, "year"); // หาจำนวนปีที่ต่างกัน
    dateStart = dateStart.add(years, "years"); // บวกจำนวนปีที่ต่างกันเข้าไป เพื่อไปเทียบจำนวนเดือนต่อ

    let months = dateEnd.diff(dateStart, "month"); // หาจำนวนเดือนที่ต่างกัน
    dateStart = dateStart.add(months, "months"); // บวกจำนวนเดือนที่ต่างกันเข้าไป เพื่อไปเทียบจำนวนวันต่อ

    dateEnd = dateEnd.add(1, "day"); // บวก 1 วันเพื่อนับรวมวันที่สิ้นสุดด้วย
    let days = dateEnd.diff(dateStart, "day"); // หาจำนวนวันที่ต่างกัน

    let durationString = "";
    if (years > 0) durationString += `${years} Year(s) `;
    if (months > 0) durationString += `${months} Month(s) `;
    if (days > 0) durationString += `${days} Day(s)`;
    splitEndDate(getValues("retailESAContractEndDate"))

    setValue("retailESAContractDuration", durationString.trim());
  };

  const splitEndDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    setYearEndDate(year);
    yearEndDate1.current = year
    setMonthEndDate(month);
    monthEndDate1.current = month
    setDayEndDate(day);
    dayEndDate1.current = day
    //console.log("Year End",yearEndDate)
    //console.log(yearEndDate1.current)
    //console.log("Month End",monthEndDate)
    //console.log(monthEndDate1.current)
    //console.log("Day End",dayEndDate)
    //console.log(dayEndDate1.current)
  };

  // --------- Country, Province,District,Subdistrict,Postcode Process ---------- //
  const onChangeCountry = (value) => {};
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

  // --------- Country, Province,District,Subdistrict,Postcode Process ---------- //
  const onChangeBeneficiaryCountry = (value) => {};
  const onChangeBeneficiaryProvince = (value) => {
    if (currentBeneficiaryDistrict?.id) {
      setValue("beneficiaryDistrictCode", null); //set value to null
      setCurrentBeneficiaryDistrict(null);

      setValue("beneficiarySubdistrictCode", null); //set value to null
      setCurrentBeneficiarySubDistrict(null);

      setValue("beneficiaryPostcode", null); //set value to null
      setCurrentBeneficiaryPostCode(null);
      setPostCodeBeneficiaryListForDisplay([]); // clear post code list option

      dispatch(FetchSubDistrictBeneList());
    }
    setCurrentBeneficiaryProvicne(value);
    dispatch(FetchDistrictBeneList(value?.provinceCode));
  };

  const onChangeBeneficiaryDistrict = (value) => {
    if (currentBeneficiarySubDistrict?.id) {
      setValue("beneficiarySubdistrictCode", null); //set value to null
      setCurrentBeneficiarySubDistrict(null);

      setValue("beneficiaryPostcode", null); //set value to null
      setCurrentBeneficiaryPostCode(null);
      setPostCodeBeneficiaryListForDisplay([]); // clear post code list option
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
    }
  };
  const handleClickForm2 = () => {
    if (isActiveForm2 == false) {
      setIsActiveForm1(!isActiveForm1);
      setIsActiveForm2(!isActiveForm2);
      setAllowcatedEnergyList([]);
    }
  };

  const getStyleContractAllowcated=(year,month,value,isWarning = false)=>{
    const years = parseInt(year)
    const months = parseInt(month)
    const values = parseInt(value)
    const yearStart = parseInt(yearStartDate1.current)
    const yearEnd = parseInt(yearEndDate1.current)  
    const monthStart = parseInt(monthStartDate1.current)
    const monthEnd = parseInt(monthEndDate1.current)
    if(years >= yearStart && years <= yearEnd){
      
      if(years === yearStart){
        if(yearStart !== yearEnd){
          if(months >= monthStart){
              if(values === 0){
                return isWarning?"bg-[#F4433614] text-[#F4433614]":"bg-[#F4433614] text-[#F44336]"
              }
              else{
                return isWarning?"text-white":undefined
              }   
          }
          else{
            
            if(values !== 0){
              return isWarning?"bg-[#F4433614] text-[#F4433614]":"bg-[#F4433614] text-[#F44336]"
            }
            else{
              return isWarning?"text-white":undefined
            } 
          }
        }
        else{
          if(months >= monthStart && months <= monthEnd){
            if(values === 0){
              return isWarning?"bg-[#F4433614] text-[#F4433614]":"bg-[#F4433614] text-[#F44336]"
            }
            else{
              return isWarning?"text-white":undefined
            } 
          }
          else{
            if(values !== 0){
              return isWarning?"bg-[#F4433614] text-[#F4433614]":"bg-[#F4433614] text-[#F44336]"
            }
            else{
              return isWarning?"text-white":undefined
            } 
          }
        }
      }
      else if(years === yearEnd){
        if(months <= monthEnd){
          if(values === 0){
            return isWarning?"bg-[#F4433614] text-[#F4433614]":"bg-[#F4433614] text-[#F44336]"
          }
          else{
            return isWarning?"text-white":undefined
          }   
        }
        else{
          if(values !== 0){
            return isWarning?"bg-[#F4433614] text-[#F4433614]":"bg-[#F4433614] text-[#F44336]"
          }
          else{
            return isWarning?"text-white":undefined
          } 
        }
      }
      else{
        if(values === 0){
          return isWarning?"bg-[#F4433614] text-[#F4433614]":"bg-[#F4433614] text-[#F44336]"
        }
        else{
          return isWarning?"text-white":undefined
        } 
      }
    }
    else{
      return isWarning?"bg-[#F4433614] text-[#F4433614]":"bg-[#F4433614] text-[#F44336]"
    }

  }

  const getWarningAssign=(year,month,value,)=>{
    const years = parseInt(year)
    const months = parseInt(month)
    const values = parseInt(value)
    const yearStart = parseInt(yearStartDate)
    const yearEnd = parseInt(yearEndDate)  
    const monthStart = parseInt(monthStartDate)
    const monthEnd = parseInt(monthEndDate)
    if(years >= yearStart && years <= yearEnd){
      
      if(years === yearStart){
        if(yearStart !== yearEnd){
          if(months >= monthStart){
            if(values === 0){
              return <img src={TriWarning} alt="React Logo" width={15} height={15} className="inline-block"/>
            }
            else{
              return "..."
            }          
          }
          else{
            if(values !== 0){
              return <img src={TriWarning} alt="React Logo" width={15} height={15} className="inline-block"/>
            }
            else{
              return "..."
            } 
            
            
          }
        }
        else{
          if(months >= monthStart && months <= monthEnd){
            if(values === 0){
              return <img src={TriWarning} alt="React Logo" width={15} height={15} className="inline-block"/>
            }
            else{
              return "..."
            } 
          }
          else{
            if(values !== 0){
              return <img src={TriWarning} alt="React Logo" width={15} height={15} className="inline-block"/>
            }
            else{
              return "..."
            } 
          }
        }
      }
      else if(years === yearEnd){
        if(months <= monthEnd){
          if(values === 0){
            return <img src={TriWarning} alt="React Logo" width={15} height={15} className="inline-block"/>
          }
          else{
            return "..."
          }   
        }
        else{
          if(values !== 0){
            return <img src={TriWarning} alt="React Logo" width={15} height={15} className="inline-block"/>
          }
          else{
            return "..."
          } 
          
        }
      }
      else{
        if(values === 0){
          return <img src={TriWarning} alt="React Logo" width={15} height={15} className="inline-block"/>
        }
        else{
          return "..."
        } 
      }
    }
    else{
      
      return <img src={TriWarning} alt="React Logo" width={15} height={15} className="inline-block"/>
    }

  }

  const downloadFile =(items)=>{
    const base64Content = items.binary//.split(",")[1];
    const binaryString = atob(base64Content);
    const binaryLength = binaryString.length;
    const bytes = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
     bytes[i] = binaryString.charCodeAt(i);
     }

    const blob = new Blob([bytes], { type: items.type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = items.name;
    link.click();
    URL.revokeObjectURL(link.href);
}

const addBeneficiary =()=>{
  setShowModalBene(true);
}
const onClickEditBeneBtn=(data,index)=>{
  data.index = index;
  console.log("Input Data Bene",data)
  //console.log(data)
  setBenefitDataEdit(data);
  setIsEditBene(true)
  addBeneficiary();
}

const onClickDeleteBeneBtn =(data)=>{
  console.log("Input Del",data)
  const benefitListTemp = benefitList.filter(
    (item)=>item.beneficiaryName !== data.beneficiaryName
  );
  console.log("Filter Del",benefitListTemp)
  setBenefitList(benefitListTemp);
  console.log("Bene List", benefitList)
}



const addBeneficiaryClose = () => {
  setIsEditBene(false);
  setShowModalBene(false);
};

const beneficiaryData =(obj)=>{
  console.log("On save data")
  const beneficiaryListTemp = benefitList;
  beneficiaryListTemp.push(obj);
  const sortData = [...benefitList].sort(
    (a,b) => b.beneficiaryName - a.beneficiaryName
  );
  setIsBeficiary(false);
  setBenefitList(sortData)
  //console.log(benefitList)
}

const benefitDataIndex = (obj,index)=>{
    
  const benefitDataEditTemp = benefitList;
  //console.log(benefitDataEditTemp[index])
  benefitDataEditTemp[index] = obj;
  setBenefitList(benefitDataEditTemp);
  console.log("On Efit Data",benefitList)
}

const handleChangeStatusBene =(value)=>{
  //console.log("Get Value",getValues("statusFilter").id)
  setStatusFilterBene(value.id)
  //setBenefitList(benefitList)
}

const handleUploadfile = async (id, result) => {
  //console.log("Result",result)

  const blobResult = result instanceof Blob ? result : new Blob([result], { type: result.type });;
  //console.log("Blob Result",blobResult)

  const reader = new FileReader();
  reader.onload = function(e) {
      const arrayBuffer = e.target.result;
      //console.log('Binary data as ArrayBuffer:', arrayBuffer);
      const base64Content = arrayBuffer.split(",")[1];
      
      // ป้องกันไม่ให้ setFileList ทำงานซ้ำโดยไม่จำเป็น
      setFileList((prevFileList) => {
          // ตรวจสอบว่าข้อมูลที่เพิ่มไม่ซ้ำกับข้อมูลที่มีอยู่
          const newFile = { guid: result?.guid === undefined?"":result?.guid, name: result?.name, size: result?.size, type: result?.type, binary: result?.id === undefined?base64Content:result?.binary, id: result?.id === undefined ? 0 : result?.id };
          const exists = prevFileList.some(file => file.name === newFile.name && file.size === newFile.size);
          //console.log("New file",newFile)
          //console.log("Exist file",exists)

          if (exists) return prevFileList; // ถ้าไฟล์ซ้ำ จะไม่ทำการอัปเดต list

          return [...prevFileList, newFile]; // ถ้าไฟล์ไม่ซ้ำ จะเพิ่มไฟล์เข้าไปใน list
      });
  };
  reader.readAsDataURL(blobResult);

  //console.log("File List",fileList)

    /*const reader = new FileReader();
     reader.onload = function(e) {
      const arrayBuffer = e.target.result;
      console.log('Binary data as ArrayBuffer:', arrayBuffer);
      const base64Content = arrayBuffer.split(",")[1];
      setFileList((prevFileList) => {
        console.log("prevFileList", prevFileList);
        let newFileList = [
          ...prevFileList,
          {guid: "", name: result?.name, size: result?.size,type: result?.type,binary: base64Content,id:(result?.id === undefined?0: result?.id)},
        ];
        return newFileList;
      });
    };

    reader.readAsDataURL(result)*/
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
  const param = {
    ugtGroupId: currentUGTGroup?.id,
    subscriberTypeId: 1,
    //General Information
    assignedUtilityId: details?.subscriberDetail.assignedUtilityId,
    //subscriberCode: formData.subscriberCode,
    tradeAccount: getValues("tradeAccount"),
    tradeAccountCode: getValues("tradeAccountCode"),
    redemptionAccountCode: getValues("redemptionAccountCode"),
    redemptionAccount: getValues("redemptionAccount"),
    //tradeAccount: formData.tradeAccount,
    //retailESANo: formData.retailESANo,
    //retailESAContractStartDate: formData.retailESAContractStartDate,
    //retailESAContractEndDate: formData.retailESAContractEndDate,
    //retailESAContractDuration: formData?.retailESAContractDuration || "",
    //redemptionAccount: formData.redemptionAccount,
    subscriberStatusId: details?.subscriberDetail.subscriberStatusId,
    //Organization Information
    organizationName: getValues("organizationName"),
    businessRegistrationNo: getValues("businessRegistrationNo"),
    address: getValues("address"),
    subdistrictCode: getValues("subdistrictCode").subdistrictCode,
    subdistrictName: getValues("subdistrictCode").subdistrictNameEn,
    districtCode: getValues("districtCode").districtCode,
    districtName: getValues("districtCode").districtNameEn,
    provinceCode: getValues("stateCode").provinceCode,
    provinceName: getValues("stateCode").provinceNameEn,
    countryCode: getValues("countryCode").alpha2.toUpperCase(),
    countryName: getValues("countryCode").name,
    postCode: getValues("postCode").postalCode.toString(),
    //Personal Information
    title: getValues("title")?.value,
    name: getValues("name"),
    lastname: getValues("lastname"),
    email: getValues("email"),
    mobilePhone: getValues("mobilePhone"),
    officePhone: getValues("officePhone"),
    attorney: getValues("attorney"),
    //Subscription Information
    retailESANo: getValues("retailESANo"),
    retailESAContractStartDate: getValues("retailESAContractStartDate"),
    retailESAContractEndDate: getValues("retailESAContractEndDate"),
    retailESAContractDuration: getValues("retailESAContractDuration") || "",
    portfolioAssignment: getValues("portfolioAssignment"),
    optForUp: getValues("optGreen")?"Active":"Inactive",
    optForExcess: getValues("optContract")?"Active":"Inactive",
    feeder: getValues("feeder"),
    allocateEnergyAmount: allowcatedEnergyList,
    fileUploadContract: allowcatedExcelFileList,
    //Beneficiary Information
    beneficiaryInfo:benefitList,
    //Attach File
    fileUpload:fileList,
    note:getValues("note"),
    subscriberRemark:remark
  };
  console.log("Param",param)
  console.log("File",fileList)
  try {
    // setIsOpenLoading(true);
    showLoading();
    const fileID = item?.guid;
    const fileName = item?.name;
    const binary = item?.binary
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

const handleClickDownloadFileExcel = async (item) => {
  // console.log('item',item)
 // console.log('item evidentFileID',item?.evidentFileID)
 // console.log('item name',item?.name)
 console.log("File Excel",fileListExcel)
 try {
   // setIsOpenLoading(true);
   showLoading();
   const fileID = item?.guid;
   const fileName = item?.name;
   const binary = item?.binary
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

const handleUploadfileExcel = async (id, result) => {
  // console.log("fileJaa>>>",file)
  const blobResult = result instanceof Blob ? result : new Blob([result], { type: result.type });;
  //console.log("Blob Result",blobResult)

  const reader = new FileReader();
  reader.onload = function(e) {
      const arrayBuffer = e.target.result;
      //console.log('Binary data as ArrayBuffer:', arrayBuffer);
      const base64Content = arrayBuffer.split(",")[1];
      
      // ป้องกันไม่ให้ setFileList ทำงานซ้ำโดยไม่จำเป็น
      setFileListExcel((prevFileList) => {
          // ตรวจสอบว่าข้อมูลที่เพิ่มไม่ซ้ำกับข้อมูลที่มีอยู่
          const newFile = { guid: result?.guid === undefined?"":result?.guid, name: result?.name, size: result?.size, type: result?.type, binary: result?.id === undefined?base64Content:result?.binary, id: result?.id === undefined ? 0 : result?.id };
          const exists = prevFileList.some(file => file.name === newFile.name && file.size === newFile.size);
          //console.log("New file",newFile)
          //console.log("Exist file",exists)

          if (exists) return prevFileList; // ถ้าไฟล์ซ้ำ จะไม่ทำการอัปเดต list

          return [...prevFileList, newFile]; // ถ้าไฟล์ไม่ซ้ำ จะเพิ่มไฟล์เข้าไปใน list
      });
  };
  reader.readAsDataURL(blobResult);
};

const handleClickDownloadFilePDF = async (item) => {
  // console.log('item',item)
  // console.log('item evidentFileID',item?.evidentFileID)
  // console.log('item name',item?.name)
  console.log("File Excel",fileListPDF)
  try {
    // setIsOpenLoading(true);
    showLoading();
    const fileID = item?.guid;
    const fileName = item?.name;
    const binary = item?.binary
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

const handleUploadfilePDF = async (id, result) => {
  const blobResult = result instanceof Blob ? result : new Blob([result], { type: result.type });;
  //console.log("Blob Result",blobResult)

  const reader = new FileReader();
  reader.onload = function(e) {
      const arrayBuffer = e.target.result;
      //console.log('Binary data as ArrayBuffer:', arrayBuffer);
      const base64Content = arrayBuffer.split(",")[1];
      
      // ป้องกันไม่ให้ setFileList ทำงานซ้ำโดยไม่จำเป็น
      setFileListPDF((prevFileList) => {
          // ตรวจสอบว่าข้อมูลที่เพิ่มไม่ซ้ำกับข้อมูลที่มีอยู่
          const newFile = { guid: result?.guid === undefined?"":result?.guid, name: result?.name, size: result?.size, type: result?.type, binary: result?.id === undefined?base64Content:result?.binary, id: result?.id === undefined ? 0 : result?.id };
          const exists = prevFileList.some(file => file.name === newFile.name && file.size === newFile.size);
          //console.log("New file",newFile)
          //console.log("Exist file",exists)

          if (exists) return prevFileList; // ถ้าไฟล์ซ้ำ จะไม่ทำการอัปเดต list

          return [...prevFileList, newFile]; // ถ้าไฟล์ไม่ซ้ำ จะเพิ่มไฟล์เข้าไปใน list
      });
  };
  reader.readAsDataURL(blobResult);
};

const getDate =(Date)=>{
    
  const dateToText = Date.toString()
  const date = dateToText.split("T")[0]
  const dateSplit = date.split("-")
  const year = dateSplit[0]
  const month = dateSplit[1]
  const day = dateSplit[2]
   
  return day+"-"+month+"-"+year
  
}

const getTime=(Date)=>{
  
  //console.log(Date)
  const dateToText = Date.toString()
  const time = dateToText.split("T")[1]
  const timeFull = time.split(".")[0]
  return timeFull
}

const createPdfPDFForm1 = () => {
  setDefaultShow(true)
  setIsShowSnap(true)
  setTimeout(()=>{
    // เลือก DOM element ที่ต้องการแปลงเป็น PDF
  const element = contentRef.current//document.getElementById('pdf-content');

  // กำหนดตัวเลือกสำหรับ html2pdf
  const options = {
    margin: 0,
    filename: 'webscreen.pdf',
    image: { type: 'jpeg', quality: 50 },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    html2canvas: { scale: 2}, // เพิ่ม scale เพื่อเพิ่มความละเอียด
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait'},
  };

  // สร้าง PDF ด้วย html2pdf และดึง base64 string
  html2pdf()
    .from(element)
    .set(options)
    .outputPdf('datauristring') // ดึงข้อมูลออกมาเป็น Base64 string
    .then((pdfBase64) => {
      console.log(pdfBase64); // แสดง base64 string ใน console
      const base64Content = pdfBase64.split(",")[1];
      const now = new Date();
      const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}_${now.getMinutes().toString().padStart(2, '0')}_${now.getSeconds().toString().padStart(2, '0')}`;
      const structrueSend =[{
        id:0,
        guid:"",
        name: formattedDateTime+".pdf",
        binary: base64Content,
        type: "application/pdf"
      }]
      console.log(userDetail)
      const param = {
        subscriberId: details?.subscriberDetail?.subscriberId,
        subscribersContractInformationId: details?.subscriberDetail.subscribersContractInformationId,
        ugtGroupId: currentUGTGroup?.id,
        subscriberTypeId: 1,
        //General Information
        assignedUtilityId: details?.subscriberDetail.assignedUtilityId,
        //subscriberCode: formData.subscriberCode,
        tradeAccount: getValues("tradeAccount"),
        tradeAccountCode: getValues("tradeAccountCode"),
        redemptionAccountCode: getValues("redemptionAccountCode"),
        redemptionAccount: getValues("redemptionAccount"),
        //tradeAccount: formData.tradeAccount,
        //retailESANo: formData.retailESANo,
        //retailESAContractStartDate: formData.retailESAContractStartDate,
        //retailESAContractEndDate: formData.retailESAContractEndDate,
        //retailESAContractDuration: formData?.retailESAContractDuration || "",
        //redemptionAccount: formData.redemptionAccount,
        subscriberStatusId: details?.subscriberDetail.subscriberStatusId,
        //Organization Information
        organizationName: getValues("organizationName"),
        businessRegistrationNo: getValues("businessRegistrationNo"),
        address: getValues("address"),
        subdistrictCode: getValues("subdistrictCode").subdistrictCode,
        subdistrictName: getValues("subdistrictCode").subdistrictNameEn,
        districtCode: getValues("districtCode").districtCode,
        districtName: getValues("districtCode").districtNameEn,
        provinceCode: getValues("stateCode").provinceCode,
        provinceName: getValues("stateCode").provinceNameEn,
        countryCode: getValues("countryCode").alpha2.toUpperCase(),
        countryName: getValues("countryCode").name,
        postCode: getValues("postCode").postalCode.toString(),
        //Personal Information
        title: getValues("title")?.value,
        name: getValues("name"),
        lastname: getValues("lastname"),
        email: getValues("email"),
        mobilePhone: getValues("mobilePhone"),
        officePhone: getValues("officePhone"),
        attorney: getValues("attorney"),
        //Subscription Information
        retailESANo: getValues("retailESANo"),
        retailESAContractStartDate: getValues("retailESAContractStartDate"),
        retailESAContractEndDate: getValues("retailESAContractEndDate"),
        retailESAContractDuration: getValues("retailESAContractDuration") || "",
        portfolioAssignment: getValues("portfolioAssignment"),
        optForUp: getValues("optGreen")?"Active":"Inactive",
        optForExcess: getValues("optContract")?"Active":"Inactive",
        feeder: getValues("feeder"),
        allocateEnergyAmount: allowcatedEnergyList,
        fileUploadContract: allowcatedExcelFileList,
        //Beneficiary Information
        beneficiaryInfo:benefitList,
        //Attach File
        fileUpload:fileList,
        note:getValues("note"),
        subscriberRemark:RefRemark.current,
        fileUploadSubscriberContractHistoryLog:structrueSend,
        subscriberContractHistoryLog:{action:"Edit",createBy: (userDetail.firstName+" "+userDetail.lastName)}

      };
      console.log(param)
      dispatch(
        FunctionEditSubscriber(param, details?.subscriberDetail?.subscriberId, () => {
          if (isError === false) {
            
            console.log("Create Form 1 success")
          // setIsOpenLoading(false);
            hideLoading();
            setShowMadalCreateRemark(false);
            setShowModalComplete(true);}
          else{
            console.log("Create form 1 error")
            hideLoading();
            setIsShowFailError(true)
            setShowMadalCreateRemark(false);
            setMessageFailModal(errorMessage)
          }
          // setIsOpenLoading(false);
          //hideLoading();
          //setShowModalComplete(true);
        })
      );
        //const binaryString = atob(base64Content);
        //const binaryLength = binaryString.length;
        //const bytes = new Uint8Array(binaryLength);

        //for (let i = 0; i < binaryLength; i++) {
        //bytes[i] = binaryString.charCodeAt(i);
        //}

        //const blob = new Blob([bytes], { type: "application/pdf" });
        //const link = document.createElement("a");
        //link.href = URL.createObjectURL(blob);
        //link.download = "TestGeneratePDF.pdf";
        //link.click();
        //URL.revokeObjectURL(link.href);
      // คุณสามารถใช้ base64 string ได้ตามต้องการ เช่น ส่งไปเซิร์ฟเวอร์หรือใช้ใน client
      return structrueSend
    });
    setDefaultShow(false)
    setIsShowSnap(false)
  },500)
};

const createPdfPDFForm2 = () => {
  setDefaultShow(true)
  setIsShowSnap(true)
  setTimeout(()=>{
    // เลือก DOM element ที่ต้องการแปลงเป็น PDF
  const element = contentRef.current//document.getElementById('pdf-content');

  // กำหนดตัวเลือกสำหรับ html2pdf
  const options = {
    margin: 0,
    filename: 'webscreen.pdf',
    image: { type: 'jpeg', quality: 50 },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    html2canvas: { scale: 2}, // เพิ่ม scale เพื่อเพิ่มความละเอียด
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait'},
  };

  // สร้าง PDF ด้วย html2pdf และดึง base64 string
  html2pdf()
    .from(element)
    .set(options)
    .outputPdf('datauristring') // ดึงข้อมูลออกมาเป็น Base64 string
    .then((pdfBase64) => {
      console.log(pdfBase64); // แสดง base64 string ใน console
      const base64Content = pdfBase64.split(",")[1];
      const now = new Date();
      const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}_${now.getMinutes().toString().padStart(2, '0')}_${now.getSeconds().toString().padStart(2, '0')}`;
      const structrueSend =[{
        id:0,
        guid:"",
        name: formattedDateTime+".pdf",
        binary: base64Content,
        type: "application/pdf"
      }]
      console.log(userDetail)
      const param = {
        subscriberId: details?.subscriberDetail?.subscriberId,
        subscribersContractInformationId: details?.subscriberDetail.subscribersContractInformationId,
        ugtGroupId: currentUGTGroup?.id,
        subscriberTypeId: 2,
        assignedUtilityId: details?.subscriberDetail.assignedUtilityId,
        //tradeAccount: formData.tradeAccount,
        name: getValues("name"),
        tradeAccount:getValues("tradeAccount"),
        tradeAccountCode:getValues("tradeAccountCode"),
        retailESAContractStartDate: getValues("retailESAContractStartDate"),
        retailESAContractEndDate: getValues("retailESAContractEndDate"),
        retailESAContractDuration: getValues("retailESAContractDuration") || "",
        portfolioAssignment: getValues("portfolioAssignment"),
        optForUp: getValues("optGreen")?"Active":"Inactive",
        optForExcess: getValues("optContract")?"Active":"Inactive",
        subscribersFilePdf:fileListPDF,
        subscribersFileXls:fileListExcel,
        note:getValues("note"),
        subscriberStatusId: details?.subscriberDetail.subscriberStatusId,
        //aggregateAllocatedEnergy: parseInt(formData.aggregateAllocatedEnergy),
        allocateEnergyAmount: allowcatedEnergyList,
        fileUploadContract: allowcatedExcelFileList,
        subscriberRemark:RefRemark.current,
        fileUploadSubscriberContractHistoryLog:structrueSend,
        subscriberContractHistoryLog:{action:"Edit",createBy: (userDetail.firstName+" "+userDetail.lastName)}
      };
      dispatch(
        FunctioneditAggregateSubscriber(
          param,
          details?.subscriberDetail?.subscriberId,
          () => {
            if (isError === false) {
              console.log("Create form 2 success")
              // setIsOpenLoading(false);
                hideLoading();
                setShowMadalCreateRemark(false);
                setShowModalComplete(true);}
              else{
                console.log("Create form 2 error")
                hideLoading();
                setShowMadalCreateRemark(false);
                setIsShowFailError(true)
                setMessageFailModal(errorMessage)
              }
            // setIsOpenLoading(false);
            //hideLoading();
            //setShowModalComplete(true);
          }
        )
      );
        //const binaryString = atob(base64Content);
        //const binaryLength = binaryString.length;
        //const bytes = new Uint8Array(binaryLength);

        //for (let i = 0; i < binaryLength; i++) {
        //bytes[i] = binaryString.charCodeAt(i);
        //}

        //const blob = new Blob([bytes], { type: "application/pdf" });
        //const link = document.createElement("a");
        //link.href = URL.createObjectURL(blob);
        //link.download = "TestGeneratePDF.pdf";
        //link.click();
        //URL.revokeObjectURL(link.href);
      // คุณสามารถใช้ base64 string ได้ตามต้องการ เช่น ส่งไปเซิร์ฟเวอร์หรือใช้ใน client
      return structrueSend
    });
    setDefaultShow(false)
    setIsShowSnap(false)
  },500)
};

const TestFile =()=>{
  const structrueFile = createPdf();
  setTimeout(()=>{
    console.log("Structrue",structrueFile)
  },1000)
  
}

const onCloseModalError=()=>{
  setDefaultShow(false)
  setIsShowSnap(false)
  dispatch(clearModal())
}


  return (
    <div ref={contentRef} style={{ width: '100%', padding: '20px', background: '#f5f5f5' }}>
      <div>
        {isShownSnap === false?
        <div className="min-h-screen p-6 items-center justify-center">
          <div className="container max-w-screen-lg mx-auto">
            <div className="text-left flex flex-col gap-3">
              <div>
                <h2 className="font-semibold text-xl text-black">
                  {details?.subscriberDetail?.organizationName !== ""
                    ? details?.subscriberDetail?.organizationName
                    : details?.subscriberDetail?.name}
                </h2>
                <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                  {currentUGTGroup?.name} / Subscriber Management / Subscriber
                  Info /{" "}
                  <span className="truncate">
                    {details?.subscriberDetail?.organizationName !== ""
                      ? details?.subscriberDetail?.organizationName
                      : details?.subscriberDetail?.name}
                  </span>
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
                    onClick={() => navigate(WEB_URL.SUBSCRIBER_LIST)}
                  />
                  <p className="mb-0 font-semibold text-15 text-md">
                    Subscribers Info <span style={{ color: "red" }}>*</span>
                  </p>
                </div>
                <div><label className="text-xs text-red-500">* Requried field</label></div>
                </div>
                  <hr/>
                  <div className="flex flex-col gap-3">
              <div>
                  <label className="font-bold text-base">Subscriber Type</label><label className="text-red-600 ml-1 text-sm font-bold">*</label>
                </div>
                <div>
                    {details?.subscriberDetail?.subscriberTypeId == 1 && (
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
                    {details?.subscriberDetail?.subscriberTypeId == 2 && (
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
                    )}
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
                    {details?.subscriberDetail?.subscriberTypeId == 1 && (
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
                    {details?.subscriberDetail?.subscriberTypeId == 2 && (
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
                    )}
                  </div>
              </div>
            </Card>*/}

              <div>
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
                                  defaultValue={3}
                                  rules={{
                                    required: "This field is required",
                                  }}
                                  render={({ field }) => (
                                    <MySelect
                                      {...field}
                                      id={"assignUtil"}
                                      options={dropDrowList.assignedUtility}
                                      displayProp={"name"}
                                      valueProps={"abbr"}
                                      label={"Assigned Utility"}
                                      error={errors.assignUtil}
                                      disable={true}
                                      validate={" *"}
                                      // ... other props
                                    />
                                  )}
                                />{" "}
                              </div>
                              <div className="md:col-span-3">
                              </div>

                              <div className="md:col-span-3">
                                <Controller
                                  name="tradeAccount"
                                  control={control}
                                  rules={{
                                    required: "This field is required",
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"tradeAccount"}
                                      type={"text"}
                                      label={"Trade Account Name"}
                                      error={errors.tradeAccount}
                                      validate={" *"}
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"tradeAccountCode"}
                                      type={"text"}
                                      label={"Trade Account Code"}
                                      error={errors.tradeAccountCode}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"redemptionAccount"}
                                      type={"text"}
                                      label={"Redemption Account"}
                                      error={errors.redemptionAccount}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"redemptionAccountCode"}
                                      type={"text"}
                                      label={"Redemption Account Code"}
                                      error={errors.redemptionAccountCode}
                                      validate={" *"}
                                      // ... other props
                                    />
                                  )}
                                />
                              </div>

                              {/*<div className="md:col-span-3">
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
                                      // ... other props
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
                                      // ... other props
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
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"organizationName"}
                                      type={"text"}
                                      label={"Organization Name"}
                                      error={errors.organizationName}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"businessRegistrationNo"}
                                      type={"text"}
                                      label={"Business Registration No."}
                                      error={errors.businessRegistrationNo}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"address"}
                                      type={"text"}
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"name"}
                                      type={"text"}
                                      label={"Name"}
                                      error={errors.name}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"lastname"}
                                      type={"text"}
                                      label={"Lastname"}
                                      error={errors.lastname}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                    pattern: {
                                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                      message: "Invalid email format"
                                    }
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"email"}
                                      type={"text"}
                                      label={"Email"}
                                      error={errors.email}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"mobilePhone"}
                                      type={"text"}
                                      label={"Telephone (Mobile)"}
                                      error={errors.mobilePhone}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"officePhone"}
                                      type={"text"}
                                      label={"Telephone (Office)"}
                                      error={errors.officePhone}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"attorney"}
                                      type={"text"}
                                      label={"Attorney / Attorney-in-fact"}
                                      error={errors.attorney}
                                      validate={" *"}
                                      // ... other props
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
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
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
                              <div className="md:col-span-3 ml-2">
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
                              <div className="md:col-span-3 ml-2">
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
                              </div>
                              <div className="md:col-span-3 ml-2">
                                <Controller
                                  name="portfolioAssignment"
                                  control={control}
                                  rules={{
                                    required: "This field is required",
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"portfolioAssignment"}
                                      type={"text"}
                                      label={"Portfolio Assignment"}
                                      error={errors.portfolioAssignment}
                                      validate={" *"}
                                      placeholder="Please fill the form in English"
                                    />
                                  )}
                                />
                              </div>


                              <div className="flex justify-between mt-2 ml-2 md:col-span-6">
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
                                {fields?.map((item, index) => (
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
                                          validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
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
                                            // ... other props
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
                                <div className="font-bold col-span-3">Additional Contract Condition</div>
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
                                      label={"Opt for up to 15% green electricity from UGT1"}
                                      error={errors.optGreen}
                                      validate={" *"}
                                      value={field.value === undefined?false:field.value}
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
                                      label={"Opt for excess UGT beyond contract"}
                                      error={errors.optContract}
                                      validate={" *"}
                                      value={field.value === undefined?false:field.value}
                                      
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
                              {/*<div className="flex justify-between ml-2 md:col-span-6">
                                <div>
                                  <strong>
                                    Allocated Energy Amount
                                    <span className="text-red-500">*</span>
                                  </strong>
                                </div>
                                <button
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
                                </button>
                              </div>*/}
                              {allowcatedEnergyList?.length > 0 && (
                                <>
                                  <div className="flex flex-col ml-2 col-span-6">
                                    <label className="mt-3 text-[#6B7280] text-xs">
                                      Total Allocated Energy (kWh)
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

                              {allowcatedEnergyList.length > 0? allowcatedEnergyList.map((item, index) => (
                                <div
                                  key={index}
                                  className="px-4 md:col-span-6 text-sm"
                                >
                                  <CollapsSubscriberEdit
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
                                    isDefaultShow={isDefaultShow}
                                  >
                                    <div className="grid grid-cols-3 text-center font-semibold">
                                      <div>
                                        <p className="text-GRAY_BUTTON">Month</p>
                                        <hr />
                                        <p className={getStyleContractAllowcated(item.year,1,item.amount01)}>JAN</p>
                                        <p className={getStyleContractAllowcated(item.year,2,item.amount02)}>FEB</p>
                                        <p className={getStyleContractAllowcated(item.year,3,item.amount03)}>MAR</p>
                                        <p className={getStyleContractAllowcated(item.year,4,item.amount04)}>APR</p>
                                        <p className={getStyleContractAllowcated(item.year,5,item.amount05)}>MAY</p>
                                        <p className={getStyleContractAllowcated(item.year,6,item.amount06)}>JUN</p>
                                        <p className={getStyleContractAllowcated(item.year,7,item.amount07)}>JUL</p>
                                        <p className={getStyleContractAllowcated(item.year,8,item.amount08)}>AUG</p>
                                        <p className={getStyleContractAllowcated(item.year,9,item.amount09)}>SEP</p>
                                        <p className={getStyleContractAllowcated(item.year,10,item.amount10)}>OCT</p>
                                        <p className={getStyleContractAllowcated(item.year,11,item.amount11)}>NOV</p>
                                        <p className={getStyleContractAllowcated(item.year,12,item.amount12)}>DEC</p>
                                        
                                      </div>
                                      <div>
                                        <p className="text-GRAY_BUTTON">
                                        Contracted Energy amount (kWh)
                                        </p>
                                        <hr />
                                        <p className={getStyleContractAllowcated(item.year,1,item.amount01)}>{item.amount01?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,2,item.amount02)}>{item.amount02?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,3,item.amount03)}>{item.amount03?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,4,item.amount04)}>{item.amount04?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,5,item.amount05)}>{item.amount05?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,6,item.amount06)}>{item.amount06?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,7,item.amount07)}>{item.amount07?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,8,item.amount08)}>{item.amount08?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,9,item.amount09)}>{item.amount09?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,10,item.amount10)}>{item.amount10?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,11,item.amount11)}>{item.amount11?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,12,item.amount12)}>{item.amount12?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      </div>
                                      <div>
                                      <hr style={{ "margin-top": "2.25rem" }} />
                                        <p className={getStyleContractAllowcated(item.year,1,item.amount01,true)}>{getWarningAssign(item.year,1,item.amount01)}</p>
                                        <p className={getStyleContractAllowcated(item.year,2,item.amount02,true)}>{getWarningAssign(item.year,2,item.amount02)}</p>
                                        <p className={getStyleContractAllowcated(item.year,3,item.amount03,true)}>{getWarningAssign(item.year,3,item.amount03)}</p>
                                        <p className={getStyleContractAllowcated(item.year,4,item.amount04,true)}>{getWarningAssign(item.year,4,item.amount04)}</p>
                                        <p className={getStyleContractAllowcated(item.year,5,item.amount05,true)}>{getWarningAssign(item.year,5,item.amount05)}</p>
                                        <p className={getStyleContractAllowcated(item.year,6,item.amount06,true)}>{getWarningAssign(item.year,6,item.amount06)}</p>
                                        <p className={getStyleContractAllowcated(item.year,7,item.amount07,true)}>{getWarningAssign(item.year,7,item.amount07)}</p>
                                        <p className={getStyleContractAllowcated(item.year,8,item.amount08,true)}>{getWarningAssign(item.year,8,item.amount08)}</p>
                                        <p className={getStyleContractAllowcated(item.year,9,item.amount09,true)}>{getWarningAssign(item.year,9,item.amount09)}</p>
                                        <p className={getStyleContractAllowcated(item.year,10,item.amount10,true)}>{getWarningAssign(item.year,10,item.amount10)}</p>
                                        <p className={getStyleContractAllowcated(item.year,11,item.amount11,true)}>{getWarningAssign(item.year,11,item.amount11)}</p>
                                        <p className={getStyleContractAllowcated(item.year,12,item.amount12,true)}>{getWarningAssign(item.year,12,item.amount12)}</p>
                                      </div>
                                    </div>
                                  </CollapsSubscriberEdit>
                                </div>
                              )):
                              <div className="text-center md:col-span-6 p-10 border-2 border-gray-200 rounded-[10px]">
                                <label className="text-gray-400">There is no data to display.</label>
                              </div>}
                              {allowcatedEnergyList?.length == 0 && (
                                <div className="grid grid-cols-3 text-center mt-4 md:col-span-6">
                                  <div>
                                    <h6 className="text-red-500 font-semibold">
                                      This field is required
                                    </h6>
                                  </div>
                                </div>
                              )}
                              
                            </div>
                            {allowcatedExcelFileList.length !== 0?
                                <div className="grow bg-lime-200 mt-2 w-full p-2">
                                  <div className="flex justify-content items-center">
                                      <div className="mr-8">
                                      </div>
                                        <label className="text-sm font-normal">
                                          Download Import File : 
                                        </label>
                                        <div>
                                        <label style={{ cursor: 'pointer', color: 'blue' }} className="text-sm font-normal ml-1" onClick={()=>downloadFile(allowcatedExcelFileList[0])}>
                                        {allowcatedExcelFileList[0].name}
                                        </label>
                                      </div>
                                  </div>
                                </div>:undefined}
                          </div>
                        </div>
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
                                <div>
                                  <h6 className="text-PRIMARY_TEXT font-semibold">
                                    Beneficiary Information
                                  </h6>
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <div className="col-span-2 px-2 border-2 mr-2 rounded-[10px]">
                                      <Controller
                                        name="statusFilter"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                          <MySelect
                                            {...field}
                                            id={"statusFilter"}
                                            typeSelect={2}
                                            options={statusList}
                                            valueProp={"id"}
                                            displayProp={"statusName"}
                                            placeholder={"Find Status"}
                                            onChangeInput={(value) => {
                                              handleChangeStatusBene(value);
                                            }}
                                          />
                                        )}
                                      />
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

                                  
                                </div>
                              </div>

                              <div className="mt-3 mb-4 md:col-span-6">
                              {benefitList.length > 0? benefitList.map((item, index) => (
                                statusFilterBene === "All"?
                                <div
                                  key={index}
                                  className="px-4 md:col-span-6 text-sm"
                                >
                                  <CollapsSubscriberEdit
                                    onClickEditBtn={() => {
                                      onClickEditBeneBtn(item, index);
                                    }}
                                    title={item.beneficiaryName}
                                    total={item.status}
                                    onClickDeleteBtn={() => {
                                      onClickDeleteBeneBtn(item);
                                    }}
                                    isDefaultShow={isDefaultShow}
                                    isShowDelete={item.id === 0 ?true:false}
                                  >
                                    <BeneficiaryEdit beneficiaryDataEdit={item} editStatus={true}/>
                                  </CollapsSubscriberEdit>
                                </div>:
                                item.status === statusFilterBene ?
                                <div
                                key={index}
                                className="px-4 md:col-span-6 text-sm"
                              >
                                <CollapsSubscriberEdit
                                  onClickEditBtn={() => {
                                    onClickEditBeneBtn(item, index);
                                  }}
                                  title={item.beneficiaryName}
                                  total={item.status}
                                  onClickDeleteBtn={() => {
                                    onClickDeleteBeneBtn(item);
                                  }}
                                  isDefaultShow={isDefaultShow}
                                  isShowDelete={item.id === 0 ?true:false}
                                >
                                  <BeneficiaryEdit beneficiaryDataEdit={item} editStatus={true}/>
                                </CollapsSubscriberEdit>
                              </div>:undefined
                              )):
                              <div className="text-center md:col-span-6 p-10 border-2 border-gray-200 rounded-[10px]">
                              <label className="text-gray-400">There is no data to display.</label>
                            </div>}
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

                      {/*Documents Information Attachments */}
                      <Card 
                            shadow="md"
                            radius="lg"
                            className="flex w-full h-full overflow-visible"
                            padding="xl">
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
                                      <UploadFileSubscriberEdit
                                        {...field}
                                        id={"uploadFile"}
                                        type={"file"}
                                        multiple
                                        label={"File upload"}
                                        defaultValue={details?.fileUpload}
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
                      

                      {/*Remark */}
                      {details?.subscriberRemark && <Card>
                        <div className="md:col-span-6">
                            
                              <hr className="mt-3 mb-3"/>
                              {details?.subscriberRemark &&
                              details?.subscriberRemark.map((items,index)=>(
                                <div key={items.id} className="bg-[#F5F5F5] px-5 py-4 mb-3 rounded-[10px]">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <label className="text-black font-bold text-lg">{items.remarkName}</label>
                                    </div>
                                    <div>
                                      <label className="text-sm">{"Date: "+getDate(items.createdDateTime)+" | Time: "+getTime(items.createdDateTime)}</label>
                                    </div>
                                  </div>
                                  <hr className="mt-0"/>
                                  <div>
                                    <label className="mt-2 font-medium text-base">{items.remarkDetail}</label>
                                  </div>
                                  <div className="mt-3 text-right">
                                    <label className="text-sm">{"By "+items.createdBy}</label>
                                  </div>
                                </div>
                              ))}
                      </div>
                      </Card>}
                      {/* submit button */}
                      <div className="text-center my-5">
                        <button
                          onClick={handleSubmit(onSubmitForm1New)}
                          className="w-1/4 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                        >
                          <b>Save</b>
                        </button>
                      </div>

                      
                    </div>
                  </form>
                )}

                {isActiveForm2 && (
                  <form onSubmit={handleSubmit(onSubmitForm2New)}>
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
                                  defaultValue={3}
                                  rules={{
                                    required: "This field is required",
                                  }}
                                  render={({ field }) => (
                                    <MySelect
                                      {...field}
                                      id={"assignUtil"}
                                      options={dropDrowList.assignedUtility}
                                      displayProp={"name"}
                                      valueProps={"abbr"}
                                      label={"Assigned Utility "}
                                      validate={" *"}
                                      disable={true}
                                      error={errors.assignUtil}
                                      // ... other props
                                    />
                                  )}
                                />{" "}
                              </div>
                              <div className="md:col-span-3">
                                <Controller
                                  name="name"
                                  control={control}
                                  rules={{
                                    required: "This field is required",
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"name"}
                                      type={"text"}
                                      label={"Name"}
                                      error={errors.name}
                                      validate={" *"}
                                      // ... other props
                                    />
                                  )}
                                />
                              </div>
                              <div className="md:col-span-3">
                                <Controller
                                  name="tradeAccount"
                                  control={control}
                                  rules={{
                                    required: "This field is required",
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
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
                                  name="tradeAccountCode"
                                  control={control}
                                  rules={{
                                    required: "This field is required",
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"tradeAccountCode"}
                                      type={"text"}
                                      label={"Trade Account Code"}
                                      error={errors.tradeAccountCode}
                                      validate={" *"}
                                      // ... other props
                                    />
                                  )}
                                />
                              </div>
                              
                              {/*<div className="md:col-span-3">
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
                              </div>
                              <div className="md:col-span-3 flex items-center ml-1">
                                <input
                                  type="checkbox"
                                  disabled="true"
                                  checked="true"
                                />
                                <label for="">
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
                              
                              <div className="md:col-span-3 ml-2">
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
                              <div className="md:col-span-3 ml-2">
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
                              <div className="md:col-span-3 ml-2">
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
                              </div>
                              <div className="md:col-span-3 ml-2">
                                <Controller
                                  name="portfolioAssignment"
                                  control={control}
                                  rules={{
                                    required: "This field is required",
                                    validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      id={"portfolioAssignment"}
                                      type={"text"}
                                      label={"Portfolio Assignment"}
                                      error={errors.portfolioAssignment}
                                      validate={" *"}
                                      placeholder="Please fill the form in English"
                                    />
                                  )}
                                />
                              </div>

                              {/*Check Box*/}
                              <div className="mt-3 ml-2 mb-4 md:col-span-6">
                                <div className="font-bold col-span-3">Additional Contract Condition</div>
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
                                      label={"Opt for up to 15% green electricity from UGT1"}
                                      error={errors.optGreen}
                                      validate={" *"}
                                      value={field.value === undefined?false:field.value}
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
                                      label={"Opt for excess UGT beyond contract"}
                                      error={errors.optContract}
                                      validate={" *"}
                                      value={field.value === undefined?false:field.value}
                                      
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
                              {allowcatedEnergyList?.length > 0 && (
                                <>
                                  <div className="flex flex-col ml-2 col-span-6">
                                    <label className="mt-3 text-[#6B7280] text-xs">
                                      Total Contracted Energy (kWh)
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
                                        Total Allocated Energy Amount (kWh)
                                      </p>
                                    </div>
                                    <div></div>
                                  </div>
                                </>
                              )}

                              {allowcatedEnergyList.length > 0? allowcatedEnergyList.map((item, index) => (
                                <div
                                  key={index}
                                  className="px-4 md:col-span-6 text-sm"
                                >
                                  <CollapsSubscriberEdit
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
                                    isDefaultShow={isDefaultShow}
                                  >
                                    <div className="grid grid-cols-3 text-center font-semibold">
                                      <div>
                                        <p className="text-GRAY_BUTTON">Month</p>
                                        <hr />
                                        <p className={getStyleContractAllowcated(item.year,1,item.amount01)}>JAN</p>
                                        <p className={getStyleContractAllowcated(item.year,2,item.amount02)}>FEB</p>
                                        <p className={getStyleContractAllowcated(item.year,3,item.amount03)}>MAR</p>
                                        <p className={getStyleContractAllowcated(item.year,4,item.amount04)}>APR</p>
                                        <p className={getStyleContractAllowcated(item.year,5,item.amount05)}>MAY</p>
                                        <p className={getStyleContractAllowcated(item.year,6,item.amount06)}>JUN</p>
                                        <p className={getStyleContractAllowcated(item.year,7,item.amount07)}>JUL</p>
                                        <p className={getStyleContractAllowcated(item.year,8,item.amount08)}>AUG</p>
                                        <p className={getStyleContractAllowcated(item.year,9,item.amount09)}>SEP</p>
                                        <p className={getStyleContractAllowcated(item.year,10,item.amount10)}>OCT</p>
                                        <p className={getStyleContractAllowcated(item.year,11,item.amount11)}>NOV</p>
                                        <p className={getStyleContractAllowcated(item.year,12,item.amount12)}>DEC</p>
                                        
                                      </div>
                                      <div>
                                        <p className="text-GRAY_BUTTON">
                                        Contracted Energy amount (kWh)
                                        </p>
                                        <hr />
                                        <p className={getStyleContractAllowcated(item.year,1,item.amount01)}>{item.amount01?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,2,item.amount02)}>{item.amount02?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,3,item.amount03)}>{item.amount03?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,4,item.amount04)}>{item.amount04?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,5,item.amount05)}>{item.amount05?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,6,item.amount06)}>{item.amount06?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,7,item.amount07)}>{item.amount07?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,8,item.amount08)}>{item.amount08?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,9,item.amount09)}>{item.amount09?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,10,item.amount10)}>{item.amount10?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,11,item.amount11)}>{item.amount11?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                        <p className={getStyleContractAllowcated(item.year,12,item.amount12)}>{item.amount12?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      </div>
                                      <div>
                                      <hr style={{ "margin-top": "2.25rem" }} />
                                        <p className={getStyleContractAllowcated(item.year,1,item.amount01,true)}>{getWarningAssign(item.year,1,item.amount01)}</p>
                                        <p className={getStyleContractAllowcated(item.year,2,item.amount02,true)}>{getWarningAssign(item.year,2,item.amount02)}</p>
                                        <p className={getStyleContractAllowcated(item.year,3,item.amount03,true)}>{getWarningAssign(item.year,3,item.amount03)}</p>
                                        <p className={getStyleContractAllowcated(item.year,4,item.amount04,true)}>{getWarningAssign(item.year,4,item.amount04)}</p>
                                        <p className={getStyleContractAllowcated(item.year,5,item.amount05,true)}>{getWarningAssign(item.year,5,item.amount05)}</p>
                                        <p className={getStyleContractAllowcated(item.year,6,item.amount06,true)}>{getWarningAssign(item.year,6,item.amount06)}</p>
                                        <p className={getStyleContractAllowcated(item.year,7,item.amount07,true)}>{getWarningAssign(item.year,7,item.amount07)}</p>
                                        <p className={getStyleContractAllowcated(item.year,8,item.amount08,true)}>{getWarningAssign(item.year,8,item.amount08)}</p>
                                        <p className={getStyleContractAllowcated(item.year,9,item.amount09,true)}>{getWarningAssign(item.year,9,item.amount09)}</p>
                                        <p className={getStyleContractAllowcated(item.year,10,item.amount10,true)}>{getWarningAssign(item.year,10,item.amount10)}</p>
                                        <p className={getStyleContractAllowcated(item.year,11,item.amount11,true)}>{getWarningAssign(item.year,11,item.amount11)}</p>
                                        <p className={getStyleContractAllowcated(item.year,12,item.amount12,true)}>{getWarningAssign(item.year,12,item.amount12)}</p>
                                      </div>
                                    </div>
                                  </CollapsSubscriberEdit>
                                </div>
                              )):
                              <div className="text-center md:col-span-6 p-10 border-2 border-gray-200 rounded-[10px]">
                              <label className="text-gray-400">There is no data to display.</label>
                            </div>}
                              {allowcatedEnergyList?.length == 0 && (
                                <div className="grid grid-cols-3 text-center mt-4 md:col-span-6">
                                  <div>
                                    <h6 className="text-red-500 font-semibold">
                                      This field is required
                                    </h6>
                                  </div>
                                </div>
                              )}
                              
                            </div>
                            {allowcatedExcelFileList.length !== 0?
                                <div className="grow bg-lime-200 mt-2 w-full p-2">
                                  <div className="flex justify-content items-center">
                                      <div className="mr-8">
                                      </div>
                                        <label className="text-sm font-normal">
                                          Download Import File : 
                                        </label>
                                        <div>
                                        <label style={{ cursor: 'pointer', color: 'blue' }} className="text-sm font-normal ml-1" onClick={()=>downloadFile(allowcatedExcelFileList[0])}>
                                        {allowcatedExcelFileList[0].name}
                                        </label>
                                      </div>
                                  </div>
                                </div>:undefined}
                          </div>
                        </div>
                      </Card>
                      {/*<Card
                        shadow="md"
                        radius="lg"
                        className="flex w-full h-full"
                        padding="xl"
                      >
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                          <div className="lg:col-span-2">
                            <div className="grid gap-2 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                              <div className="md:col-span-6">
                                <h6 className="text-PRIMARY_TEXT font-semibold">
                                  Contract Information
                                </h6>
                              </div>
                              <div className="flex justify-between ml-2 md:col-span-6">
                                <div>
                                  <strong>
                                    Allocated Energy Amount
                                    <span className="text-red-500">*</span>
                                  </strong>
                                </div>
                                <button
                                  type="button"
                                  onClick={addAllowcated}
                                  className="flex items-center w-30 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                                >
                                  <img
                                    src={plus}
                                    alt="React Logo"
                                    width={20}
                                    height={20}
                                    className={"text-white mr-2"}
                                  />
                                  <p className="m-0">Add Allocation</p>
                                </button>
                              </div>
                              {allowcatedEnergyList?.length > 0 && (
                                <>
                                  <div className="flex flex-col ml-2 col-span-6">
                                    <label className="mt-3 text-[#6B7280] text-xs">
                                      Total Allocated Energy (kWh)
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
                                        Total Allocated Energy Amount (kWh)
                                      </p>
                                    </div>
                                    <div></div>
                                  </div>
                                </>
                              )}

                              {allowcatedEnergyList?.map((item, index) => (
                                <div key={index} className="px-4 md:col-span-6">
                                  <Collaps
                                    onClickEditBtn={() => {
                                      onClickEditBtn(item, index);
                                    }}
                                    title={item.year}
                                    total={sumAllocatedEnergyAmount(
                                      item
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                    })}
                                    onClickDeleteBtn={() =>
                                      onClickDeleteBtn(item)
                                    }
                                  >
                                    <div className="grid grid-cols-3 text-center">
                                      <div>
                                        <p className="text-GRAY_BUTTON">Month</p>
                                        <hr />
                                        <p>JAN</p>
                                        <p>FEB</p>
                                        <p>MAR</p>
                                        <p>APR</p>
                                        <p>MAY</p>
                                        <p>JUN</p>
                                        <p>JUL</p>
                                        <p>AUG</p>
                                        <p>SEP</p>
                                        <p>OCT</p>
                                        <p>NOV</p>
                                        <p>DEC</p>
                                      </div>
                                      <div>
                                        <p className="text-GRAY_BUTTON">
                                          Allocated Energy amount (kWh)
                                        </p>
                                        <hr />
                                        <p>
                                          {numeral(item.amount01).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount02).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount03).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount04).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount05).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount06).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount07).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount08).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount09).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount10).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount11).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                        <p>
                                          {numeral(item.amount12).format(
                                            "0,0.00"
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <hr style={{ "margin-top": "2.25rem" }} />
                                      </div>
                                    </div>
                                  </Collaps>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>*/}

                      {/*Documents Information Attachments*/}                 
                      <Card 
                            shadow="md"
                            radius="lg"
                            className="flex w-full h-full overflow-visible"
                            padding="xl">
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
                                      <UploadFileSubscriberEdit
                                        {...field}
                                        id={"uploadFilePDF"}
                                        type={"file"}
                                        multiple = {false}
                                        maxFiles={1}
                                        accept = {".pdf"}
                                        label={"หนังสือยืนยันหน่วย (.pdf)"}
                                        defaultValue={details?.subscribersFilePdf}
                                        disabled = {fileListPDF.length === 0?false:true}
                                        onChngeInput={(id, res) => {
                                          handleUploadfilePDF(id, res);
                                        }}
                                        onDeleteFile={(id, evidentFileID, fileName) => {
                                          handleDeleteFilePDF(id, evidentFileID, fileName);
                                        }}
                                        onClickFile={(item) => {
                                          handleClickDownloadFilePDF(item);
                                        }}
                                        error={errors.uploadFilePDF}
                                        validate={" *"}
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
                                      <UploadFileSubscriberEdit
                                        {...field}
                                        id={"uploadFileExcel"}
                                        type={"file"}
                                        multiple = {false}
                                        maxFiles={1}
                                        accept = {".xls,.xlsx"}
                                        defaultValue={details?.subscribersFileXls}
                                        disabled = {fileListExcel.length === 0?false:true}
                                        label={"ข้อมูลหน่วยแยกผู้รับ (blinded) in detail (.xls)"}
                                        onChngeInput={(id, res) => {
                                          handleUploadfileExcel(id, res);
                                        }}
                                        onDeleteFile={(id, evidentFileID, fileName) => {
                                          handleDeleteFileExcel(id, evidentFileID, fileName);
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
                                  
                                </div>
                                {/*Note */}
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
                      
                      
                      {/*Remark */}
                      {details?.subscriberRemark && <Card>
                        <div className="md:col-span-6">
                            
                              <hr className="mt-3 mb-3"/>
                              {details?.subscriberRemark &&
                              details?.subscriberRemark.map((items,index)=>(
                                <div key={items.id} className="bg-[#F5F5F5] px-5 py-4 mb-3 rounded-[10px]">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <label className="text-black font-bold text-lg">{items.remarkName}</label>
                                    </div>
                                    <div>
                                      <label className="text-sm">{"Date: "+getDate(items.createdDateTime)+" | Time: "+getTime(items.createdDateTime)}</label>
                                    </div>
                                  </div>
                                  <hr className="mt-0"/>
                                  <div>
                                    <label className="mt-2 font-medium text-base">{items.remarkDetail}</label>
                                  </div>
                                  <div className="mt-3 text-right">
                                    <label className="text-sm">{"By "+items.createdBy}</label>
                                  </div>
                                </div>
                              ))}
                      </div>
                      </Card>}
                      {/* submit button */}
                      <div className="text-center my-5">
                        <button
                          onClick={handleSubmit(onSubmitForm2New)}
                          className="w-1/4 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
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
        </div>:
        <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                {details?.subscriberDetail?.organizationName !== ""
                  ? details?.subscriberDetail?.organizationName
                  : details?.subscriberDetail?.name}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Subscriber Management / Subscriber
                Info /{" "}
                <span className="truncate">
                  {details?.subscriberDetail?.organizationName !== ""
                    ? details?.subscriberDetail?.organizationName
                    : details?.subscriberDetail?.name}
                </span>
              </p>
            </div>
            
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <FaChevronCircleLeft
                    className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                    size="30"
                    onClick={() =>
                      navigate(WEB_URL.SUBSCRIBER_INFO, {
                        state: { id: state?.code },
                      })
                    }
                  />
                  <p className="mb-0  font-semibold">
                    Subscribers Type <span style={{ color: "red" }}>*</span>
                  </p>
                </div>

                <div>
                  {details?.subscriberDetail?.subscriberTypeId == 1 && (
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
                  {details?.subscriberDetail?.subscriberTypeId == 2 && (
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
                  )}
                </div>
              </div>
            </Card>

            <div>
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
                              <div className="w-full">
                                <label>
                                  <b>Assigned Utility</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("assignUtil")?.name}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3">
                            </div>

                            <div className="md:col-span-3">
                              <div className="w-full">
                                <label>
                                  <b>Trade Account Name</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("tradeAccount")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3">
                            <div className="w-full">
                                <label>
                                  <b>Trade Account Code</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("tradeAccountCode")}</label>
                              </div>
                            </div>

                            <div className="md:col-span-3">
                              <div className="w-full">
                                <label>
                                  <b>Redemption Account</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("redemptionAccount")}</label>
                              </div>
                            </div>

                            <div className="md:col-span-3">
                              <div className="w-full">
                                <label>
                                  <b>Redemption Account Code</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("redemptionAccountCode")}</label>
                              </div>
                            </div>
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
                              <div className="w-full">
                                <label>
                                  <b>Organization Name</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("organizationName")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-6">
                              <div className="w-full">
                                <label>
                                  <b>Business Registration No.</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("businessRegistrationNo")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-6">
                            <div className="w-full">
                                <label>
                                  <b>Address</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("address")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                            <div className="w-full">
                                <label>
                                  <b>State / Province</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("stateCode")?.provinceNameEn}</label>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                            <div className="w-full">
                                <label>
                                  <b>District</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("districtCode")?.districtNameEn}</label>
                              </div>
                            </div>

                            <div className="md:col-span-2">
                            <div className="w-full">
                                <label>
                                  <b>Subdistrict</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("subdistrictCode")?.subdistrictNameEn}</label>
                              </div>
                            </div>

                            <div className="md:col-span-2">
                            <div className="w-full">
                                <label>
                                  <b>Country</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("countryCode")?.name}</label>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                            <div className="w-full">
                                <label>
                                  <b>Postcode</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("postCode")?.postCodeDisplay}</label>
                              </div>
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
                            <div className="w-full">
                                <label>
                                  <b>Title</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("title")?.name}</label>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                            <div className="w-full">
                                <label>
                                  <b>Name</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("name")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                            <div className="w-full">
                                <label>
                                  <b>Lastname</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("lastname")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                            <div className="w-full">
                                <label>
                                  <b>Email</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("email")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                            <div className="w-full">
                                <label>
                                  <b>Telephone (Mobile)</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("mobilePhone")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <div className="w-full">
                                <label>
                                  <b>Telephone (Office)</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("officePhone")}</label>
                              </div>
                            </div>

                            <div className="md:col-span-6">
                              <div className="w-full">
                                <label>
                                  <b>Attorney / Attorney-in-fact</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("attorney")}</label>
                              </div>
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
                            <div className="md:col-span-6 mb-4">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                Contract Information
                              </h6>
                            </div>
                            <div className="md:col-span-3 ml-2">
                            <div className="w-full">
                                <label>
                                  <b>Retail ESA No.</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("retailESANo")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3 ml-2">
                              <div className="w-full">
                                <label>
                                  <b>Retail ESA Contract Start Date</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("retailESAContractStartDate")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3 ml-2">
                            <div className="w-full">
                                <label>
                                  <b>Retail ESA Contract End Date</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("retailESAContractEndDate")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3 ml-2">
                            <div className="w-full">
                                <label>
                                  <b>Retail ESA Contract Duration</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("retailESAContractDuration")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3 ml-2">
                            <div className="w-full">
                                <label>
                                  <b>Portfolio Assignment</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("portfolioAssignment")}</label>
                              </div>
                            </div>


                            <div className="flex justify-between mt-2 ml-2 md:col-span-6">
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
                              {fields?.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="flex items-center mb-1"
                                >
                                  <div className="flex-grow">
                                  <label>{getValues("feeder")[index].feederName}</label>
                                    
                                  </div>
                                  
                                </div>
                              ))}
                            </div>

                            {/*Check Box*/}
                            <div className="mt-3 ml-2 mb-4 md:col-span-6">
                              <div className="font-bold col-span-3">Additional Contract Condition</div>
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
                                    label={"Opt for up to 15% green electricity from UGT1"}
                                    error={errors.optGreen}
                                    validate={" *"}
                                    value={field.value === undefined?false:field.value}
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
                                    label={"Opt for excess UGT beyond contract"}
                                    error={errors.optContract}
                                    validate={" *"}
                                    value={field.value === undefined?false:field.value}
                                    
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
                            {allowcatedEnergyList?.length > 0 && (
                              <>
                                <div className="flex flex-col ml-2 col-span-6">
                                  <label className="mt-3 text-[#6B7280] text-xs">
                                    Total Contracted Energy (kWh)
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
                                      Total Allocated Energy Amount (kWh)
                                    </p>
                                  </div>
                                  <div></div>
                                </div>
                              </>
                            )}

                            {allowcatedEnergyList.map((item, index) => (
                              <div
                                key={index}
                                className="px-4 md:col-span-6 text-sm"
                              >
                                <CollapsSubscriberEdit
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
                                  isDefaultShow={isDefaultShow}
                                >
                                  <div className="grid grid-cols-3 text-center font-semibold">
                                    <div>
                                      <p className="text-GRAY_BUTTON">Month</p>
                                      <hr />
                                      <p className={getStyleContractAllowcated(item.year,1,item.amount01)}>JAN</p>
                                      <p className={getStyleContractAllowcated(item.year,2,item.amount02)}>FEB</p>
                                      <p className={getStyleContractAllowcated(item.year,3,item.amount03)}>MAR</p>
                                      <p className={getStyleContractAllowcated(item.year,4,item.amount04)}>APR</p>
                                      <p className={getStyleContractAllowcated(item.year,5,item.amount05)}>MAY</p>
                                      <p className={getStyleContractAllowcated(item.year,6,item.amount06)}>JUN</p>
                                      <p className={getStyleContractAllowcated(item.year,7,item.amount07)}>JUL</p>
                                      <p className={getStyleContractAllowcated(item.year,8,item.amount08)}>AUG</p>
                                      <p className={getStyleContractAllowcated(item.year,9,item.amount09)}>SEP</p>
                                      <p className={getStyleContractAllowcated(item.year,10,item.amount10)}>OCT</p>
                                      <p className={getStyleContractAllowcated(item.year,11,item.amount11)}>NOV</p>
                                      <p className={getStyleContractAllowcated(item.year,12,item.amount12)}>DEC</p>
                                      
                                    </div>
                                    <div>
                                      <p className="text-GRAY_BUTTON">
                                      Contracted Energy amount (kWh)
                                      </p>
                                      <hr />
                                      <p className={getStyleContractAllowcated(item.year,1,item.amount01)}>{item.amount01?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,2,item.amount02)}>{item.amount02?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,3,item.amount03)}>{item.amount03?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,4,item.amount04)}>{item.amount04?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,5,item.amount05)}>{item.amount05?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,6,item.amount06)}>{item.amount06?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,7,item.amount07)}>{item.amount07?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,8,item.amount08)}>{item.amount08?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,9,item.amount09)}>{item.amount09?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,10,item.amount10)}>{item.amount10?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,11,item.amount11)}>{item.amount11?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,12,item.amount12)}>{item.amount12?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                    </div>
                                    <div>
                                    <hr style={{ "margin-top": "2.25rem" }} />
                                      <p className={getStyleContractAllowcated(item.year,1,item.amount01,true)}>{getWarningAssign(item.year,1,item.amount01)}</p>
                                      <p className={getStyleContractAllowcated(item.year,2,item.amount02,true)}>{getWarningAssign(item.year,2,item.amount02)}</p>
                                      <p className={getStyleContractAllowcated(item.year,3,item.amount03,true)}>{getWarningAssign(item.year,3,item.amount03)}</p>
                                      <p className={getStyleContractAllowcated(item.year,4,item.amount04,true)}>{getWarningAssign(item.year,4,item.amount04)}</p>
                                      <p className={getStyleContractAllowcated(item.year,5,item.amount05,true)}>{getWarningAssign(item.year,5,item.amount05)}</p>
                                      <p className={getStyleContractAllowcated(item.year,6,item.amount06,true)}>{getWarningAssign(item.year,6,item.amount06)}</p>
                                      <p className={getStyleContractAllowcated(item.year,7,item.amount07,true)}>{getWarningAssign(item.year,7,item.amount07)}</p>
                                      <p className={getStyleContractAllowcated(item.year,8,item.amount08,true)}>{getWarningAssign(item.year,8,item.amount08)}</p>
                                      <p className={getStyleContractAllowcated(item.year,9,item.amount09,true)}>{getWarningAssign(item.year,9,item.amount09)}</p>
                                      <p className={getStyleContractAllowcated(item.year,10,item.amount10,true)}>{getWarningAssign(item.year,10,item.amount10)}</p>
                                      <p className={getStyleContractAllowcated(item.year,11,item.amount11,true)}>{getWarningAssign(item.year,11,item.amount11)}</p>
                                      <p className={getStyleContractAllowcated(item.year,12,item.amount12,true)}>{getWarningAssign(item.year,12,item.amount12)}</p>
                                    </div>
                                  </div>
                                </CollapsSubscriberEdit>
                              </div>
                            ))}
                            {allowcatedEnergyList?.length == 0 && (
                              <div className="grid grid-cols-3 text-center mt-4 md:col-span-6">
                                <div>
                                  <h6 className="text-red-500 font-semibold">
                                    This field is required
                                  </h6>
                                </div>
                              </div>
                            )}
                            
                          </div>
                          {allowcatedExcelFileList.length !== 0?
                              <div className="grow bg-lime-200 mt-2 w-full p-2">
                                <div className="flex justify-content items-center">
                                    <div className="mr-8">
                                    </div>
                                      <label className="text-sm font-normal">
                                        Download Import File : 
                                      </label>
                                      <div>
                                      <label style={{ cursor: 'pointer', color: 'blue' }} className="text-sm font-normal ml-1" onClick={()=>downloadFile(allowcatedExcelFileList[0])}>
                                      {allowcatedExcelFileList[0].name}
                                      </label>
                                    </div>
                                </div>
                              </div>:undefined}
                        </div>
                      </div>
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
                              <div>
                                <h6 className="text-PRIMARY_TEXT font-semibold">
                                  Beneficiary Information
                                </h6>
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <div className="col-span-2 px-2 border-2 mr-2 rounded-[10px]">
                                  <label>{getValues("statusFilter")?.statusName}</label>
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

                                
                              </div>
                            </div>

                            <div className="mt-3 mb-4 md:col-span-6">
                            {benefitList.map((item, index) => (
                              statusFilterBene === "All"?
                              <div
                                key={index}
                                className="px-4 md:col-span-6 text-sm"
                              >
                                <CollapsSubscriberEdit
                                  onClickEditBtn={() => {
                                    onClickEditBeneBtn(item, index);
                                  }}
                                  title={item.beneficiaryName}
                                  total={item.status}
                                  onClickDeleteBtn={() => {
                                    onClickDeleteBeneBtn(item);
                                  }}
                                  isDefaultShow={isDefaultShow}
                                  isShowDelete={item.id === 0 ?true:false}
                                >
                                  <div className="pt-4 px-4 pb-2">
                                    <form className="text-sm">
                                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                                        <div className="lg:col-span-2">
                                          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                            {/*Input Data*/}
                                            <div className="md:col-span-3">
                                            <div className="w-full">
                                                <label>
                                                  <b>Name</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.beneficiaryName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-3">
                                            <div className="w-full">
                                                <label>
                                                  <b>Address</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.address}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>State / Province</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.proviceName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>District</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.districtName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>Subdistrict</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.subdistrictName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>Country</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.countryName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>Postcode</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.postcode}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>Status</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.status}</label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>  
                                    </form>
                                  </div>
                                </CollapsSubscriberEdit>
                              </div>:
                              item.status === statusFilterBene ?
                              <div
                              key={index}
                              className="px-4 md:col-span-6 text-sm"
                            >
                              <CollapsSubscriberEdit
                                onClickEditBtn={() => {
                                  onClickEditBeneBtn(item, index);
                                }}
                                title={item.beneficiaryName}
                                total={item.status}
                                onClickDeleteBtn={() => {
                                  onClickDeleteBeneBtn(item);
                                }}
                                isDefaultShow={isDefaultShow}
                                isShowDelete={item.id === 0 ?true:false}
                              >
                                <form className="text-sm">
                                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                                        <div className="lg:col-span-2">
                                          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                            {/*Input Data*/}
                                            <div className="md:col-span-3">
                                            <div className="w-full">
                                                <label>
                                                  <b>Name</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.beneficiaryName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-3">
                                            <div className="w-full">
                                                <label>
                                                  <b>Address</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.address}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>State / Province</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.proviceName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>District</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.districtName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>Subdistrict</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.subdistrictName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>Country</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.countryName}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>Postcode</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.postcode}</label>
                                              </div>
                                            </div>
                                            <div className="md:col-span-2">
                                            <div className="w-full">
                                                <label>
                                                  <b>Status</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                                </label>
                                              </div>
                                              <div className="mt-2 w-full">
                                                <label>{item.status}</label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>  
                                    </form>
                              </CollapsSubscriberEdit>
                            </div>:undefined
                            ))}
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
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/*Documents Information Attachments */}
                    <Card 
                          shadow="md"
                          radius="lg"
                          className="flex w-full h-full overflow-visible"
                          padding="xl">
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
                                    <UploadFileSubscriberEdit
                                      {...field}
                                      id={"uploadFile"}
                                      type={"file"}
                                      multiple
                                      label={"File upload"}
                                      defaultValue={details?.fileUpload}
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
                              <div className="w-full">
                                <label>
                                  <b>Note</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label className="break-all">{getValues("note")}</label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 mb-4 md:col-span-3"></div>
                    </Card>
                    {/* submit button */}
                    {/*<div className="text-center my-5">
                      <button
                        onClick={handleSubmit(onSubmitForm1New)}
                        className="w-1/4 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                      >
                        <b>Save</b>
                      </button>
                    </div>*/}
                   
                    {/*Remark */}
                    {details?.subscriberRemark && <Card>
                      <div className="md:col-span-6">
                          
                            <hr className="mt-3 mb-3"/>
                            {details?.subscriberRemark &&
                            details?.subscriberRemark.map((items,index)=>(
                              <div key={items.id} className="bg-[#F5F5F5] px-5 py-4 mb-3 rounded-[10px]">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <label className="text-black font-bold text-lg">{items.remarkName}</label>
                                  </div>
                                  <div>
                                    <label className="text-sm">{"Date: "+getDate(items.createdDateTime)+" | Time: "+getTime(items.createdDateTime)}</label>
                                  </div>
                                </div>
                                <hr className="mt-0"/>
                                <div>
                                  <label className="mt-2 font-medium text-base">{items.remarkDetail}</label>
                                </div>
                                <div className="mt-3 text-right">
                                  <label className="text-sm">{"By "+items.createdBy}</label>
                                </div>
                              </div>
                            ))}
                    </div>
                    </Card>}
                    

                    
                  </div>
                </form>
              )}

              {isActiveForm2 && (
                <form onSubmit={handleSubmit(onSubmitForm2New)}>
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
                            <div className="w-full">
                                <label>
                                  <b>Assigned Utility</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("assignUtil")?.name}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3">
                            <div className="w-full">
                                <label>
                                  <b>Name</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("name")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3">
                            <div className="w-full">
                                <label>
                                  <b>Trade Account Name</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("tradeAccount")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3">
                            <div className="w-full">
                                <label>
                                  <b>Trade Account Code</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("tradeAccountCode")}</label>
                              </div>
                            </div>
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
                            
                            <div className="md:col-span-3 ml-2">
                            <div className="w-full">
                                <label>
                                  <b>Retail ESA Contract Start Date</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("retailESAContractStartDate")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3 ml-2">
                            <div className="w-full">
                                <label>
                                  <b>Retail ESA Contract End Date</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("retailESAContractEndDate")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3 ml-2">
                            <div className="w-full">
                                <label>
                                  <b>Retail ESA Contract Duration</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("retailESAContractDuration")}</label>
                              </div>
                            </div>
                            <div className="md:col-span-3 ml-2">
                            <div className="w-full">
                                <label>
                                  <b>Portfolio Assignment</b><b className="text-[#f94a4a] ml-[5px]">*</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label>{getValues("portfolioAssignment")}</label>
                              </div>
                            </div>

                            {/*Check Box*/}
                            <div className="mt-3 ml-2 mb-4 md:col-span-6">
                              <div className="font-bold col-span-3">Additional Contract Condition</div>
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
                                    label={"Opt for up to 15% green electricity from UGT1"}
                                    error={errors.optGreen}
                                    validate={" *"}
                                    value={field.value === undefined?false:field.value}
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
                                    label={"Opt for excess UGT beyond contract"}
                                    error={errors.optContract}
                                    validate={" *"}
                                    value={field.value === undefined?false:field.value}
                                    
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
                            {allowcatedEnergyList?.length > 0 && (
                              <>
                                <div className="flex flex-col ml-2 col-span-6">
                                  <label className="mt-3 text-[#6B7280] text-xs">
                                    Total Contracted Energy (kWh)
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
                                      Total Allocated Energy Amount (kWh)
                                    </p>
                                  </div>
                                  <div></div>
                                </div>
                              </>
                            )}

                            {allowcatedEnergyList.map((item, index) => (
                              <div
                                key={index}
                                className="px-4 md:col-span-6 text-sm"
                              >
                                <CollapsSubscriberEdit
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
                                  isDefaultShow={isDefaultShow}
                                >
                                  <div className="grid grid-cols-3 text-center font-semibold">
                                    <div>
                                      <p className="text-GRAY_BUTTON">Month</p>
                                      <hr />
                                      <p className={getStyleContractAllowcated(item.year,1,item.amount01)}>JAN</p>
                                      <p className={getStyleContractAllowcated(item.year,2,item.amount02)}>FEB</p>
                                      <p className={getStyleContractAllowcated(item.year,3,item.amount03)}>MAR</p>
                                      <p className={getStyleContractAllowcated(item.year,4,item.amount04)}>APR</p>
                                      <p className={getStyleContractAllowcated(item.year,5,item.amount05)}>MAY</p>
                                      <p className={getStyleContractAllowcated(item.year,6,item.amount06)}>JUN</p>
                                      <p className={getStyleContractAllowcated(item.year,7,item.amount07)}>JUL</p>
                                      <p className={getStyleContractAllowcated(item.year,8,item.amount08)}>AUG</p>
                                      <p className={getStyleContractAllowcated(item.year,9,item.amount09)}>SEP</p>
                                      <p className={getStyleContractAllowcated(item.year,10,item.amount10)}>OCT</p>
                                      <p className={getStyleContractAllowcated(item.year,11,item.amount11)}>NOV</p>
                                      <p className={getStyleContractAllowcated(item.year,12,item.amount12)}>DEC</p>
                                      
                                    </div>
                                    <div>
                                      <p className="text-GRAY_BUTTON">
                                      Contracted Energy amount (kWh)
                                      </p>
                                      <hr />
                                      <p className={getStyleContractAllowcated(item.year,1,item.amount01)}>{item.amount01?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,2,item.amount02)}>{item.amount02?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,3,item.amount03)}>{item.amount03?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,4,item.amount04)}>{item.amount04?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,5,item.amount05)}>{item.amount05?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,6,item.amount06)}>{item.amount06?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,7,item.amount07)}>{item.amount07?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,8,item.amount08)}>{item.amount08?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,9,item.amount09)}>{item.amount09?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,10,item.amount10)}>{item.amount10?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,11,item.amount11)}>{item.amount11?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                      <p className={getStyleContractAllowcated(item.year,12,item.amount12)}>{item.amount12?.toLocaleString(undefined, {minimumFractionDigits: 2,})}</p>
                                    </div>
                                    <div>
                                    <hr style={{ "margin-top": "2.25rem" }} />
                                      <p className={getStyleContractAllowcated(item.year,1,item.amount01,true)}>{getWarningAssign(item.year,1,item.amount01)}</p>
                                      <p className={getStyleContractAllowcated(item.year,2,item.amount02,true)}>{getWarningAssign(item.year,2,item.amount02)}</p>
                                      <p className={getStyleContractAllowcated(item.year,3,item.amount03,true)}>{getWarningAssign(item.year,3,item.amount03)}</p>
                                      <p className={getStyleContractAllowcated(item.year,4,item.amount04,true)}>{getWarningAssign(item.year,4,item.amount04)}</p>
                                      <p className={getStyleContractAllowcated(item.year,5,item.amount05,true)}>{getWarningAssign(item.year,5,item.amount05)}</p>
                                      <p className={getStyleContractAllowcated(item.year,6,item.amount06,true)}>{getWarningAssign(item.year,6,item.amount06)}</p>
                                      <p className={getStyleContractAllowcated(item.year,7,item.amount07,true)}>{getWarningAssign(item.year,7,item.amount07)}</p>
                                      <p className={getStyleContractAllowcated(item.year,8,item.amount08,true)}>{getWarningAssign(item.year,8,item.amount08)}</p>
                                      <p className={getStyleContractAllowcated(item.year,9,item.amount09,true)}>{getWarningAssign(item.year,9,item.amount09)}</p>
                                      <p className={getStyleContractAllowcated(item.year,10,item.amount10,true)}>{getWarningAssign(item.year,10,item.amount10)}</p>
                                      <p className={getStyleContractAllowcated(item.year,11,item.amount11,true)}>{getWarningAssign(item.year,11,item.amount11)}</p>
                                      <p className={getStyleContractAllowcated(item.year,12,item.amount12,true)}>{getWarningAssign(item.year,12,item.amount12)}</p>
                                    </div>
                                  </div>
                                </CollapsSubscriberEdit>
                              </div>
                            ))}
                            {allowcatedEnergyList?.length == 0 && (
                              <div className="grid grid-cols-3 text-center mt-4 md:col-span-6">
                                <div>
                                  <h6 className="text-red-500 font-semibold">
                                    This field is required
                                  </h6>
                                </div>
                              </div>
                            )}
                            
                          </div>
                          {allowcatedExcelFileList.length !== 0?
                              <div className="grow bg-lime-200 mt-2 w-full p-2">
                                <div className="flex justify-content items-center">
                                    <div className="mr-8">
                                    </div>
                                      <label className="text-sm font-normal">
                                        Download Import File : 
                                      </label>
                                      <div>
                                      <label style={{ cursor: 'pointer', color: 'blue' }} className="text-sm font-normal ml-1" onClick={()=>downloadFile(allowcatedExcelFileList[0])}>
                                      {allowcatedExcelFileList[0].name}
                                      </label>
                                    </div>
                                </div>
                              </div>:undefined}
                        </div>
                      </div>
                    </Card>

                    {/*Documents Information Attachments*/}                 
                    <Card 
                          shadow="md"
                          radius="lg"
                          className="flex w-full h-full overflow-visible"
                          padding="xl">
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
                                    <UploadFileSubscriberEdit
                                      {...field}
                                      id={"uploadFilePDF"}
                                      type={"file"}
                                      multiple = {false}
                                      accept = {".pdf"}
                                      label={"หนังสือยืนยันหน่วย (.pdf)"}
                                      defaultValue={details?.subscribersFilePdf}
                                      disabled = {fileListPDF.length === 0?false:true}
                                      onChngeInput={(id, res) => {
                                        handleUploadfilePDF(id, res);
                                      }}
                                      onDeleteFile={(id, evidentFileID, fileName) => {
                                        handleDeleteFilePDF(id, evidentFileID, fileName);
                                      }}
                                      onClickFile={(item) => {
                                        handleClickDownloadFilePDF(item);
                                      }}
                                      error={errors.uploadFilePDF}
                                      validate={" *"}
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
                                    <UploadFileSubscriberEdit
                                      {...field}
                                      id={"uploadFileExcel"}
                                      type={"file"}
                                      multiple = {false}
                                      accept = {".xls,.xlsx"}
                                      defaultValue={details?.subscribersFileXls}
                                      disabled = {fileListExcel.length === 0?false:true}
                                      label={"ข้อมูลหน่วยแยกผู้รับ (blinded) in detail (.xls)"}
                                      onChngeInput={(id, res) => {
                                        handleUploadfileExcel(id, res);
                                      }}
                                      onDeleteFile={(id, evidentFileID, fileName) => {
                                        handleDeleteFileExcel(id, evidentFileID, fileName);
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
                                
                              </div>
                              {/*Note */}
                          <div className="md:col-span-3">
                            <div className="w-full">
                                <label>
                                  <b>Note</b>
                                </label>
                              </div>
                              <div className="mt-2 w-full">
                                <label className="break-all">{getValues("note")}</label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 mb-4 md:col-span-3"></div>
                    </Card>
                    {/* submit button */}
                    {/*<div className="text-center my-5">
                      <button
                        onClick={handleSubmit(onSubmitForm2New)}
                        className="w-1/4 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                      >
                        <b>Save</b>
                      </button>
                    </div>*/}

                    {/*Remark */}
                    {details?.subscriberRemark && <Card>
                      <div className="md:col-span-6">
                          
                            <hr className="mt-3 mb-3"/>
                            {details?.subscriberRemark &&
                            details?.subscriberRemark.map((items,index)=>(
                              <div key={items.id} className="bg-[#F5F5F5] px-5 py-4 mb-3 rounded-[10px]">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <label className="text-black font-bold text-lg">{items.remarkName}</label>
                                  </div>
                                  <div>
                                    <label className="text-sm">{"Date: "+getDate(items.createdDateTime)+" | Time: "+getTime(items.createdDateTime)}</label>
                                  </div>
                                </div>
                                <hr className="mt-0"/>
                                <div>
                                  <label className="mt-2 font-medium text-base">{items.remarkDetail}</label>
                                </div>
                                <div className="mt-3 text-right">
                                  <label className="text-sm">{"By "+items.createdBy}</label>
                                </div>
                              </div>
                            ))}
                    </div>
                    </Card>}

                    
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>}

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
      {showModalCreate && (
        <ModalConfirmCheckBox
        onClickConfirmBtn={handleClickConfirm}
        onCloseModal={handleCloseModalConfirm}
        title={"Save Changes this Subscriber?"}
        content={"You confirm all changed information is completed with accuracy and conforms to the evidence(s) attached."}
        content2={"By providing your consent, you agree to take full responsibility for any effects resulting from this modification. Would you like to save changes for this subscriber?"}
        textCheckBox={"I consent and confirm the accuracy of the modifications and attached evidences."}
        sizeModal = {"md"}
      />
      )}

      {showModalCreateRemark && (
          <ModalConfirmRemark
          onClickConfirmBtn={handleClickConfirm}
          onCloseModal={handleCloseModalConfirmRemark}
          title={"Save Changes this Subscriber?"}
          content={"You confirm all changed information is completed with accuracy and conforms to the evidence(s) attached."}
          content2={"By providing your consent, you agree to take full responsibility for any effects resulting from this modification. Would you like to save changes for this subscriber?"}
          textCheckBox={"I consent and confirm the accuracy of the modifications and attached evidences."}
          setRemark={RefRemark}
          remark={details?.subscriberRemark}
          userName={userDetail}
        />
      )}
      {/*showModalComplete && (
        <ModalComplete
          title="Done!"
          context="Edit Complete"
          link={WEB_URL.SUBSCRIBER_LIST}
        />
      )*/}
      {showUploadExcel&&(
        <ModalUploadFileExcel
        allowcatedExcelFileList = {allowcatedExcelFileList}
        setAllowcatesExcelfileList = {setAllowcatesExcelfileList}
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
      {/*Modal Create Beneficiary */}
      {showModalBene &&(
        <ModalBeneficiaryEdit
          onClickConfirmBtn={addBeneficiary}
          onCloseModal={addBeneficiaryClose}
          beneficiaryData={beneficiaryData}
          beneficiaryDataIndex={benefitDataIndex}
          beneficiaryDataEdit={benefitDataEdit}
          editStatus={isEditBene}
          listData={benefitList}
          editPageStatus = {true}
        />
      )}
      {/*Modal Create Complete */}
      {isOpen && (
        <ModalCompleteSubscriber
          title="Edit Complete"
          context="Edit Complete"
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
      {isError &&
      (
        <ModalFail
          onClickOk={() => {
            onCloseModalError
          }}
          content={errorMessage}
        />
      )}
      {isOpenLoading && <LoadPage></LoadPage>}
      </div>
    </div>
    
  );
};

export default UpdateSubscriber;
