import React, { useState, useEffect } from "react";
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
} from "../../Redux/Subscriber/Action";
import dayjs from "dayjs";
import { FaChevronCircleLeft } from "react-icons/fa";
import numeral from "numeral";
import { hideLoading, padNumber, showLoading } from "../../Utils/Utils";

const AddSubscriber = () => {
  const {
    handleSubmit,
    resetField,
    setValue,
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
  const [showModalCreate, setShowModalCreateConfirm] = React.useState(false);
  const [showModalComplete, setShowModalComplete] = React.useState(false);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const [isActiveForm1, setIsActiveForm1] = useState(true);
  const [isActiveForm2, setIsActiveForm2] = useState(false);
  const [selectedCommisionDate, setSelectedCommisionDate] = useState(null);
  const [isAllocatedEnergyAmount, setIsAllocatedEnergyAmount] = useState(false);
  const [disableRequestedEffectiveDate, setDisableRequestedEffectiveDate] =
    useState(true);
  const addInput = () => {
    append({
      feederName: "",
    });
  };
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

  const [allowcatedEnergyList, setAllowcatedEnergyList] = useState([]);
  const [allowcatedEnergyDataEdit, setAllowcatedEnergyDataEdit] = useState({});
  const [isEdit, setIsEdit] = useState(false);
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
    permissionAllow();
    if (userData?.userGroup?.name !== "EGAT Subscriber Manager") {
      handleClickForm2();
    }
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
    setShowModalConfirm(true);
  };
  const addAllowcatedClose = () => {
    setIsEdit(false);
    setShowModalConfirm(false);
  };
  const allowcatedEnergyDataIndex = (obj, index) => {
    const allowcatedEnergyEditTemp = allowcatedEnergyList;
    allowcatedEnergyEditTemp[index] = obj;
    setAllowcatedEnergyList(allowcatedEnergyEditTemp);
  };
  const onClickEditBtn = (data, index) => {
    data.index = index;
    setAllowcatedEnergyDataEdit(data);
    setIsEdit(true);
    addAllowcated();
  };

  const onClickDeleteBtn = (data) => {
    const allowcatedEnergyListTemp = allowcatedEnergyList.filter(
      (item) => item.year !== data.year
    );

    setAllowcatedEnergyList(allowcatedEnergyListTemp);
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
      (a, b) => b.year - a.year
    );
    setIsAllocatedEnergyAmount(false);
    setAllowcatedEnergyList(sortedData);
  };

  const onSubmitForm1 = (formData) => {
    if (allowcatedEnergyList.length <= 0) {
      setIsAllocatedEnergyAmount(true);
    } else {
      const param = {
        ugtGroupId: currentUGTGroup?.id,
        subscriberTypeId: 1,
        //General Information
        assignedUtilityId: formData.assignUtil.id,
        tradeAccount: formData.tradeAccount,
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
        beneficiaryInfo: {
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
        },
      };
      setIsAllocatedEnergyAmount(false);
      setFormData1(param);
      setShowModalCreateConfirm(true);
    }
  };
  const handleClickConfirm = () => {
    setShowModalCreateConfirm(false);
    // setIsOpenLoading(true);
    showLoading();
    if (isActiveForm1 == true) {
      dispatch(
        FunctionCreateSubscriber(FormData1, () => {
          // setIsOpenLoading(false);
          hideLoading();
          setShowModalComplete(true);
        })
      );
    } else {
      dispatch(
        FunctionCreateAggregateSubscriber(FormData2, () => {
          // setIsOpenLoading(false);
          hideLoading();
          setShowModalComplete(true);
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
      const param = {
        ugtGroupId: currentUGTGroup?.id,
        subscriberTypeId: 2,
        assignedUtilityId: formData.assignUtil.id,
        tradeAccount: formData.tradeAccount,
        name: formData.name,
        subscriberStatusId: 2,
        aggregateAllocatedEnergy: parseInt(formData.aggregateAllocatedEnergy),
        allocateEnergyAmount: allowcatedEnergyList,
      };
      setFormData2(param);
      setShowModalCreateConfirm(true);
    }
  };

  const handleChangeCommissioningDate = (date) => {
    setSelectedCommisionDate(date);
    setValue("retailESAContractEndDate", "");
    setValue("retailESAContractDuration", "");
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

    setValue("retailESAContractDuration", durationString.trim());
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
    }
  };
  const handleClickForm2 = () => {
    if (isActiveForm2 == false) {
      setIsActiveForm1(!isActiveForm1);
      setIsActiveForm2(!isActiveForm2);
      setAllowcatedEnergyList([]);
    }
  };
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
                <div className="flex gap-3 items-center">
                  <FaChevronCircleLeft
                    className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                    size="30"
                    onClick={() => navigate(WEB_URL.SUBSCRIBER_LIST)}
                  />
                  <p className="mb-0 font-semibold text-15 text-md">
                    Subscribers Type <span style={{ color: "red" }}>*</span>
                  </p>
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
                            <div className="md:col-span-3">
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
                              <Controller
                                name="organizationName"
                                control={control}
                                rules={{
                                  required: "This field is required",
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"organizationName"}
                                    type={"text"}
                                    label={"Organization Name"}
                                    error={errors.organizationName}
                                    validate={" *"}
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
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"businessRegistrationNo"}
                                    type={"text"}
                                    label={"Business Registration No."}
                                    error={errors.businessRegistrationNo}
                                    validate={" *"}
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
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"address"}
                                    type={"text"}
                                    label={"Address"}
                                    error={errors.address}
                                    validate={" *"}
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
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"name"}
                                    type={"text"}
                                    label={"Name"}
                                    error={errors.name}
                                    validate={" *"}
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
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"lastname"}
                                    type={"text"}
                                    label={"Lastname"}
                                    error={errors.lastname}
                                    validate={" *"}
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
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"email"}
                                    type={"text"}
                                    label={"Email"}
                                    error={errors.email}
                                    validate={" *"}
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
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"mobilePhone"}
                                    type={"text"}
                                    label={"Telephone (Mobile)"}
                                    error={errors.mobilePhone}
                                    validate={" *"}
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
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"officePhone"}
                                    type={"text"}
                                    label={"Telephone (Office)"}
                                    error={errors.officePhone}
                                    validate={" *"}
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
                                }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id={"attorney"}
                                    type={"text"}
                                    label={"Attorney / Attorney-in-fact"}
                                    error={errors.attorney}
                                    validate={" *"}
                                  />
                                )}
                              />
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
                          <div className="grid gap-0 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6 mb-4">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                Subscription Information
                              </h6>
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
                            </div>
                            <div className="flex justify-between ml-2 md:col-span-6">
                              <div>
                                <strong>
                                  Allocated Energy Amount
                                  <span className="text-red-500"> *</span>
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
                            </div>
                            {allowcatedEnergyList.length > 0 && (
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

                            {allowcatedEnergyList.map((item, index) => (
                              <div
                                key={index}
                                className="px-4 md:col-span-6 text-sm"
                              >
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
                                  onClickDeleteBtn={() => {
                                    onClickDeleteBtn(item);
                                  }}
                                >
                                  <div className="grid grid-cols-3 text-center font-semibold">
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
                                      <p>{item.amount01?.toLocaleString()}</p>
                                      <p>{item.amount02?.toLocaleString()}</p>
                                      <p>{item.amount03?.toLocaleString()}</p>
                                      <p>{item.amount04?.toLocaleString()}</p>
                                      <p>{item.amount05?.toLocaleString()}</p>
                                      <p>{item.amount06?.toLocaleString()}</p>
                                      <p>{item.amount07?.toLocaleString()}</p>
                                      <p>{item.amount08?.toLocaleString()}</p>
                                      <p>{item.amount09?.toLocaleString()}</p>
                                      <p>{item.amount10?.toLocaleString()}</p>
                                      <p>{item.amount11?.toLocaleString()}</p>
                                      <p>{item.amount12?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <hr style={{ "margin-top": "2.25rem" }} />
                                    </div>
                                  </div>
                                </Collaps>
                              </div>
                            ))}
                            {isAllocatedEnergyAmount && (
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
                            <div className="md:col-span-6">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                Beneficiary Information
                              </h6>
                            </div>
                            <div className="md:col-span-3">
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* submit Form1 Subscriber */}
                    <div className="text-center my-5">
                      <button
                        onClick={handleSubmit(onSubmitForm1)}
                        className="w-1/4 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                      >
                        <b>Save</b>
                      </button>
                    </div>
                  </div>
                </form>
              )}

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
                                name="name"
                                control={control}
                                rules={{
                                  required: "This field is required",
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
                            </div>
                            <div className="md:col-span-3 flex items-center ml-1">
                              <input
                                type="checkbox"
                                disabled="true"
                                checked="true"
                              />
                              <label className="font-semibold" for="">
                                &nbsp; Active{" "}
                                <strong className="text-red-500">*</strong>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Subscription Information */}
                    <Card
                      shadow="md"
                      radius="lg"
                      className="flex w-full h-full"
                      padding="xl"
                    >
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <div className="grid gap-2 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6 ">
                              <h6 className="text-PRIMARY_TEXT font-semibold">
                                Subscription Information
                              </h6>
                            </div>
                            <div className="flex justify-between ml-2 md:col-span-6">
                              <div>
                                <strong>
                                  Allocated Energy Amount
                                  <span className="text-red-500"> *</span>
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
                            </div>
                            {allowcatedEnergyList.length > 0 && (
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

                            {allowcatedEnergyList.map((item, index) => (
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
                                  onClickDeleteBtn={() => {
                                    onClickDeleteBtn(item);
                                  }}
                                >
                                  <div className="grid grid-cols-3 text-center font-semibold">
                                    <div>
                                      <p className="text-GRAY_BUTTON ">Month</p>
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
                                      <p className="text-GRAY_BUTTON font-semibold">
                                        Allocated Energy amount (kWh)
                                      </p>
                                      <hr />
                                      <p>{item.amount01?.toLocaleString()}</p>
                                      <p>{item.amount02?.toLocaleString()}</p>
                                      <p>{item.amount03?.toLocaleString()}</p>
                                      <p>{item.amount04?.toLocaleString()}</p>
                                      <p>{item.amount05?.toLocaleString()}</p>
                                      <p>{item.amount06?.toLocaleString()}</p>
                                      <p>{item.amount07?.toLocaleString()}</p>
                                      <p>{item.amount08?.toLocaleString()}</p>
                                      <p>{item.amount09?.toLocaleString()}</p>
                                      <p>{item.amount10?.toLocaleString()}</p>
                                      <p>{item.amount11?.toLocaleString()}</p>
                                      <p>{item.amount12?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <hr style={{ "margin-top": "2.25rem" }} />
                                    </div>
                                  </div>
                                </Collaps>
                              </div>
                            ))}
                            {isAllocatedEnergyAmount && (
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
                    </Card>

                    {/* submit Form2 Aggregate */}
                    <div className="text-center my-5">
                      <button
                        onClick={handleSubmit(onSubmitForm2)}
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
      </div>
      {showModal && (
        <ModalSubAllocated
          onClickConfirmBtn={addAllowcated}
          onCloseModal={addAllowcatedClose}
          allowcatedEnergyData={allowcatedEnergyData}
          allowcatedEnergyDataIndex={allowcatedEnergyDataIndex}
          allowcatedEnergyDataEdit={allowcatedEnergyDataEdit}
          editStatus={isEdit}
          listData={allowcatedEnergyList}
        />
      )}
      {showModalCreate && (
        <ModalConfirm
          onClickConfirmBtn={handleClickConfirm}
          onCloseModal={handleCloseModalConfirm}
          title={"Are you sure?"}
          content={`Do you confirm to add Subscriber 
            ${isActiveForm1 ? " and active Beneficiary Account" : ""} ?`}
        />
      )}
      {showModalComplete && (
        <ModalComplete
          title="Done!"
          context="Create Complete"
          link={WEB_URL.SUBSCRIBER_LIST}
        />
      )}
      {isOpenLoading && <ModelLoadPage></ModelLoadPage>}
    </div>
  );
};

export default AddSubscriber;