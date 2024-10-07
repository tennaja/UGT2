import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Input from "../Control/Input";
import MySelect from "../Control/Select";
import { initialvalueForSelectField } from "../../Utils/FuncUtils";
import { Modal, ScrollArea } from "@mantine/core";
import {
  FetchProvinceBeneList,
  FetchPostcodeBeneList,
  FetchDistrictBeneList,
  FetchSubDistrictBeneList,
} from "../../Redux/Subscriber/Action";
import { FetchCountryList } from "../../Redux/Dropdrow/Action";
import * as _ from "lodash";
import { SubscriberFilterList } from "../../Redux/Subscriber/Action";

const ModalBeneficiary = (props) => {
  const {
    // register,
    handleSubmit,
    resetField,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const {
    editStatus,
    onCloseModal,
    listData,
    beneficiaryData,
    beneficiaryDataEdit,
    beneficiaryDataIndex,
    buttonTypeColor = "primary",
    editPageStatus = false,
  } = props;
  const dispatch = useDispatch();
  const statusBeneficiaryList = useSelector(
    (state) => state.subscriber?.filterList
  );
  //console.log(statusBeneficiaryList.findStatus);
  /*useState([
    {
        id:1,
        value:"Active",
        label:"Active",
    },
    {
        id:2,
        value:"Inactive",
        label:"Inactive"
    }
  ])*/

  useEffect(() => {
    if (editStatus === true) {
      dispatch(
        FetchDistrictBeneList(beneficiaryDataEdit.beneficiaryProviceCode)
      );
      dispatch(
        FetchSubDistrictBeneList(
          beneficiaryDataEdit.beneficiaryDistrictCode,
          beneficiaryDataEdit.beneficiaryProviceCode
        )
      );
      dispatch(SubscriberFilterList());
    } else {
      dispatch(FetchCountryList());
      dispatch(FetchProvinceBeneList(764));
      dispatch(FetchPostcodeBeneList());
      dispatch(SubscriberFilterList());
    }
  }, []);

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

  const countryList = useSelector((state) => state.dropdrow.countryList);
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

  const [isCheckBoxConfirmAdd, setIsCheckBoxConfirmAdd] = useState(false);
  const [isCheckBoxConfirmEdit, setIsCheckBoxCOnfirmEdit] = useState(false);
  const [isErrorCheckBox, setIsErrorCheckBox] = useState(false);

  const onChangeCheckBoxConfirmAdd = () => {
    setIsCheckBoxConfirmAdd(!isCheckBoxConfirmAdd);
    //console.log(isCheckBoxConfirmAdd)
  };

  useEffect(() => {
    const initContry = initialvalueForSelectField(
      countryBeneficiaryList,
      "alpha2",
      "th"
    );
    setValue("beneficiaryCountryCode", initContry);
  }, [countryBeneficiaryList]);

  useEffect(() => {
    const initStatus = initialvalueForSelectField(
      statusBeneficiaryList.findStatus,
      "statusName",
      editPageStatus === true
        ? beneficiaryDataEdit.beneficiaryStatus
        : editStatus === true
        ? beneficiaryDataEdit.beneficiaryStatus
        : "Active"
    );
    //console.log("Status");
    //console.log(initStatus);
    setValue("beneficiaryStatus", initStatus);
  }, [statusBeneficiaryList]);

  useEffect(() => {
    if (editStatus === true) {
      let disCount = districtBeneficiaryList.filter(
        (item) =>
          item.provinceCode === beneficiaryDataEdit.beneficiaryProviceCode
      );
      let subDisCount = subDistrictBeneficiaryList.filter(
        (item) =>
          item.provinceCode === beneficiaryDataEdit.beneficiaryProviceCode
      );

      if (disCount.length !== 0 && subDisCount.length !== 0) {
        onEdit(beneficiaryDataEdit);
      }
    }
  }, [districtBeneficiaryList, subDistrictBeneficiaryList]);

  const initialvalueForSelectField = (listItems = [], key, itemID) => {
    const initialValue = listItems?.filter((item) => item[key] == itemID);
    //console.log("List");
    //console.log(listItems);
    //console.log("Key");
    //console.log(key);
    //console.log("ItemID");
    //console.log(itemID);
    //console.log(initialValue);
    if (initialValue.length > 0) {
      return initialValue[0];
    } else {
      return null;
    }
  };

  // --------- Country, Province,District,Subdistrict,Postcode Process ---------- //
  const onChangeBeneficiaryCountry = (value) => {};
  const onChangeBeneficiaryProvince = (value) => {
    //console.log("New Value");
    //console.log(value);
    if (currentBeneficiaryDistrict?.id) {
      setValue("beneficiaryDistrictCode", null);
      setCurrentBeneficiaryDistrict(null);

      setValue("beneficiarySubdistrictCode", null);
      setCurrentBeneficiarySubDistrict(null);

      setValue("beneficiaryPostcode", null);
      setCurrentBeneficiaryPostCode(null);
      setPostCodeBeneficiaryListForDisplay([]);

      dispatch(FetchSubDistrictBeneList());
      //console.log("Change Province with Dis");
    }
    setCurrentBeneficiaryProvicne(value);
    dispatch(FetchDistrictBeneList(value?.provinceCode));
    //console.log(currentBeneficiaryDistrict);
  };

  const onChangeBeneficiaryDistrict = (value) => {
    //console.log("Before");
    //console.log(currentBeneficiaryDistrict);
    if (currentBeneficiarySubDistrict?.id) {
      setValue("beneficiarySubdistrictCode", null);
      setCurrentBeneficiarySubDistrict(null);

      setValue("beneficiaryPostcode", null);
      setCurrentBeneficiaryPostCode(null);
      setPostCodeBeneficiaryListForDisplay([]);

      //console.log("In set Null");
      //console.log(currentBeneficiaryDistrict);
    }

    //console.log("Check Value");
    //console.log(value);
    setCurrentBeneficiaryDistrict(value);
    //console.log("After");
    //console.log(currentBeneficiaryDistrict);
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
    //console.log("OnChange Sub Dis");
    //console.log(currentBeneficiaryProvince);
    //console.log(currentBeneficiaryDistrict);
    //console.log(value);
    //console.log(postCodeFilter);
    if (postCodeFilter.length > 0) {
      // console.log("Assign")
      const newPostCodeListForDisplay = _.uniqBy(postCodeFilter, "postalCode");
      //console.log("NewPostCode");
      //console.log(newPostCodeListForDisplay);
      setPostCodeBeneficiaryListForDisplay(newPostCodeListForDisplay);
      //console.log(postCodeBeneficiaryListForDisplay)
    } else {
      //console.log("Not Assign")
      setPostCodeBeneficiaryListForDisplay([]);
    }
    setCurrentBeneficiarySubDistrict(value);
  };

  const onChangeBeneficiaryPostCode = (value) => {
    setCurrentBeneficiaryPostCode(value);
  };
  // --------- Status Process ---------- //
  const onChangeBeneficiaryStatus = (value) => {
    setValue("beneficiaryStatus", value);
  };

  /*useEffect(() => {
    if (editStatus === true) {
      
    }
  }, []);*/

  const onEdit = (beneficiaryDataEdit) => {
    const defaultValieDis =
      currentBeneficiaryDistrict === null
        ? beneficiaryDataEdit.beneficiaryDistrictCode
        : currentBeneficiaryDistrict.districtCode;

    const tempProvince = initialvalueForSelectField(
      provinceBeneficiaryList,
      "provinceCode",
      beneficiaryDataEdit.beneficiaryProviceCode
    );
    const tempDistrict = initialvalueForSelectField(
      districtBeneficiaryList,
      "districtCode",
      defaultValieDis //beneficiaryDataEdit.beneficiaryDistrictCode
    );
    const tempSubDistrict = initialvalueForSelectField(
      subDistrictBeneficiaryList,
      "subdistrictCode",
      beneficiaryDataEdit.beneficiarySubdistrictCode
    );

    setCurrentBeneficiaryProvicne(tempProvince);
    setCurrentBeneficiarySubDistrict(tempSubDistrict);
    setCurrentBeneficiaryDistrict(tempDistrict);
    console.log("Curr dis",currentBeneficiaryDistrict)
    console.log("Curr Pro",currentBeneficiaryProvince)
    console.log("Curr Sub",currentBeneficiarySubDistrict)
    onChangeBeneficiarySubDistrict(tempSubDistrict);

    const postCodeFilter = postcodeBeneficiaryList.filter(
      (item) =>
        item.provinceCode == currentBeneficiaryProvince?.provinceCode &&
        item.districtCode == currentBeneficiaryDistrict?.districtCode &&
        item.postalCode == beneficiaryDataEdit.beneficiaryPostcode
    );
    /*console.log("Post filter")
      console.log(currentBeneficiaryProvince?.provinceCode)
      console.log(currentBeneficiaryDistrict?.districtCode)
      console.log(beneficiaryDataEdit.beneficiaryPostcode)
      console.log(postCodeFilter)
      console.log(postcodeBeneficiaryList)*/

    const tempPostCode = initialvalueForSelectField(
      postCodeFilter,
      "postalCode",
      beneficiaryDataEdit.beneficiaryPostcode
    );

    //setValue("year", tempYear);

    setValue("beneficiaryName", beneficiaryDataEdit.beneficiaryName);
    //setValue("beneficiaryStatus", beneficiaryDataEdit.beneficiaryStatus);
    setValue("beneficiaryCountry", beneficiaryDataEdit.beneficiaryCountry);
    setValue("beneficiaryAddress", beneficiaryDataEdit.beneficiaryAddress);
    setValue("beneficiarySubdistrictCode", tempSubDistrict || ""); //beneficiaryDataEdit.beneficiarySubdistrictCode);
    setValue(
      "beneficiarySubdistrictName",
      beneficiaryDataEdit.beneficiarySubdistrictName
    );
    setValue("beneficiaryDistrictCode", tempDistrict || ""); //beneficiaryDataEdit.beneficiaryDistrictCode);
    setValue(
      "beneficiaryDistrictName",
      beneficiaryDataEdit.beneficiaryDistrictName
    );
    setValue(
      "beneficiaryProviceCode",
      /*beneficiaryDataEdit.beneficiaryProviceCode*/ tempProvince || ""
    );
    setValue(
      "beneficiaryProviceName",
      beneficiaryDataEdit.beneficiaryProviceName
    );
    setValue(
      "beneficiaryCountryName",
      beneficiaryDataEdit.beneficiaryCountryName
    );
    setValue("beneficiaryPostcode", tempPostCode || ""); //beneficiaryDataEdit.beneficiaryPostcode);
  };

  const onlyPositiveNum = /^[+]?\d+([.]\d+)?$/;

  const onClickOk = (formData) => {
    let beneficiaryDataParam = {};
    const param = {
      beneficiaryName: formData.beneficiaryName,
      beneficiaryStatus: formData.beneficiaryStatus.statusName,
      beneficiaryCountry: formData.beneficiaryCountryCode.name,
      beneficiaryAddress: formData.beneficiaryAddress,
      beneficiarySubdistrictCode:
        formData.beneficiarySubdistrictCode.subdistrictCode,
      beneficiarySubdistrictName:
        formData.beneficiarySubdistrictCode.subdistrictNameEn,
      beneficiaryDistrictCode: formData.beneficiaryDistrictCode.districtCode,
      beneficiaryDistrictName: formData.beneficiaryDistrictCode.districtNameEn,
      beneficiaryProviceCode: formData.beneficiaryProviceCode.provinceCode,
      beneficiaryProviceName: formData.beneficiaryProviceCode.provinceNameEn,
      beneficiaryCountryCode:
        formData.beneficiaryCountryCode.alpha2.toUpperCase(),
      beneficiaryCountryName: formData.beneficiaryCountryCode.name,
      beneficiaryPostcode: formData.beneficiaryPostcode.postalCode.toString(),
    };
    beneficiaryDataParam = param;
    console.log(beneficiaryDataParam);
    if (editPageStatus === true) {
      if (editStatus === false) {
        if (isCheckBoxConfirmAdd === true) {
          beneficiaryData(beneficiaryDataParam);
          console.log("Create");
          onCloseModal();
        } else {
          //console.log("Error Checkbox");
          setIsErrorCheckBox(true);
        }
      } else {
        beneficiaryDataIndex(beneficiaryDataParam, beneficiaryDataEdit?.index);
        console.log("Edit");
        onCloseModal();
      }
    } else {
      if (editStatus === false) {
        if (isCheckBoxConfirmAdd === true) {
          beneficiaryData(beneficiaryDataParam);
          console.log("Create");
          onCloseModal();
        } else {
          console.log("Error Checkbox");
          setIsErrorCheckBox(true);
        }
      } else {
        beneficiaryDataIndex(beneficiaryDataParam, beneficiaryDataEdit?.index);
        console.log("Edit");
        onCloseModal();
      }
    }
    {
      /*if (editStatus === false) {
      beneficiaryData(beneficiaryDataParam);
      console.log("Create");
    } else {
      beneficiaryDataIndex(beneficiaryDataParam, beneficiaryDataEdit?.index);
      console.log("Edit");
    }
    onCloseModal();*/
    }
  };

  const onClickClose = () => {
    onCloseModal();
  };
  const getButtonColor = () => {
    switch (buttonTypeColor) {
      case "primary":
        return "bg-[#87BE33]";
      case "danger":
        return "bg-[#EF4835]";

      default:
        return "bg-[#87BE33]";
    }
  };

  return (
    <Modal
      size="xl"
      opened={true}
      onClose={() => onClickOk && onClickOk(false)}
      withCloseButton={false}
      closeOnClickOutside={false}
      centered
    >
      <div className="pt-4 px-4 pb-2">
        <h3 className="text-PRIMARY_TEXT font-semibold text-center">
          {editStatus === false ?"Add Beneficiary":"Edit Beneficiary"}
        </h3>

        <form className="text-sm">
          <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                {/*Input Data*/}
                <div className="md:col-span-3">
                  <Controller
                    name="beneficiaryName"
                    control={control}
                    rules={{
                      required: "This field is required",
                      validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
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
                      validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
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
                        onChangeInput={onChangeBeneficiarySubDistrict}
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
                <div className="md:col-span-2">
                  <Controller
                    name="beneficiaryStatus"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <MySelect
                        {...field}
                        id={"beneficiaryStatus"}
                        options={statusBeneficiaryList.findStatus}
                        displayProp={"statusName"}
                        valueProp={"statusName"}
                        label={"Status"}
                        error={errors.beneficiaryStatus}
                        onChangeInput={onChangeBeneficiaryStatus}
                        disable={editPageStatus === true ? false : true}
                        validate={" *"}
                      />
                    )}
                  />
                </div>
                {/*<div className="md:col-span-2 flex items-center mt-4 ml-1">
                  <input type="checkbox" checked="true" disabled="true" />
                  <label className="font-semibold" for="">
                    &nbsp; Active <span className="text-red-500">*</span>
                  </label>
                </div>*/}
              </div>
            </div>
          </div>

          {editStatus === false ? (
            <div className="flex item-center gap-3 mt-10">
              <div className="">
                <input
                  type="checkbox"
                  onChange={onChangeCheckBoxConfirmAdd}
                  checked={isCheckBoxConfirmAdd}
                  className={`${
                    isErrorCheckBox
                      ? "border border-red-700 rounded outline-none mt-2 w-5 h-5 align-top "
                      : "border-1 border-gray-300 rounded mt-2 w-5 h-5 align-top "
                  }`}
                />
                {editPageStatus === true ? (
                  <label className={`w-[95%] font-bold ml-2 mt-2`}>
                    I confirm the accuracy of the modifications. In terms of
                    changing beneficiary status, I acknowledge that the
                    modification will affect the delivery of Renewable Energy
                    Certificates (RECs). By providing this consent, I agree to
                    take full responsibility for any effects resulting from this
                    information.
                  </label>
                ) : (
                  <label className={`w-[95%] font-bold ml-2 mt-2`}>
                    I confirm the accuracy of the information. By providing this
                    consent, I agree to take full responsibility for any effects
                    resulting from this information."
                  </label>
                )}
              </div>
            </div>
          ) : undefined}
          {isErrorCheckBox && editStatus === false ? (
            <p className="absolute mt-1 mb-1 text-red-700 text-xs text-left ">
              * This field is required
            </p>
          ) : undefined}

          <div className="flex justify-center gap-3 p-2 mt-4">
            <button
              onClick={onClickClose}
              className="w-25 rounded shadow-sm px-4 py-2 font-normal bg-[#EFEFEF] hover:bg-[#78829D] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onClickOk)}
              className={`${getButtonColor()} w-25 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm hover:bg-[#4D6A00] `}
              disabled={editStatus === true?false:isCheckBoxConfirmAdd?false:true}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalBeneficiary;
