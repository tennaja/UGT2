import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Input from "../Control/Input";
import MySelect from "../Control/Select";
import { initialvalueForSelectField } from "../../Utils/FuncUtils";
import { Modal, ScrollArea } from "@mantine/core";
import {
  FetchProvinceBeneListAdd,
  FetchPostcodeBeneListAdd,
  FetchDistrictBeneListAdd,
  FetchSubDistrictBeneListAdd,
} from "../../Redux/Subscriber/Action";
import { FetchCountryListAdd } from "../../Redux/Dropdrow/Action";
import * as _ from "lodash";
import { SubscriberFilterList } from "../../Redux/Subscriber/Action";

const ModalBeneficiaryEdit = (props) => {
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
        FetchDistrictBeneListAdd(beneficiaryDataEdit.proviceCode)
      );
      dispatch(
        FetchSubDistrictBeneListAdd(
          beneficiaryDataEdit.districtCode,
          beneficiaryDataEdit.proviceCode
        )
      );
      dispatch(SubscriberFilterList());
      dispatch(FetchCountryListAdd());
      dispatch(FetchProvinceBeneListAdd(764));
      dispatch(FetchPostcodeBeneListAdd());
      console.log("Sub on change main",subDistrictBeneficiaryList)
    } else {
      dispatch(FetchCountryListAdd());
      dispatch(FetchProvinceBeneListAdd(764));
      dispatch(FetchPostcodeBeneListAdd());
      dispatch(SubscriberFilterList());
      console.log("Sub on create",subDistrictBeneficiaryList)
    }
  }, []);

  const countryBeneficiaryList = useSelector(
    (state) => state.dropdrow.countryListAdd
  );
  const provinceBeneficiaryList = useSelector(
    (state) => state.subscriber.provinceListAdd
  );
  const districtBeneficiaryList = useSelector(
    (state) => state.subscriber.districtListAdd
  );
  const subDistrictBeneficiaryList = useSelector(
    (state) => state.subscriber.subDistrictListAdd
  );
  const postcodeBeneficiaryList = useSelector(
    (state) => state.subscriber.postcodeListAdd
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
    
  };

  useEffect(()=>{
    if(editStatus === true){
    if(subDistrictBeneficiaryList.length === 0){
      console.log("On Sub Fetch",subDistrictBeneficiaryList)
      dispatch(
        FetchSubDistrictBeneListAdd(
          beneficiaryDataEdit.districtCode,
          beneficiaryDataEdit.proviceCode
        )
      );
    }
  }
    

  },[subDistrictBeneficiaryList])

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
      (editPageStatus === true
        ? editStatus === true ?beneficiaryDataEdit.status:"Active"
        : editStatus === true
        ? beneficiaryDataEdit.status
        : "Active")
    );
   
    setValue("beneficiaryStatus", initStatus);
  }, [statusBeneficiaryList]);

  useEffect(() => {
    if (editStatus === true) {
      let disCount = districtBeneficiaryList.filter(
        (item) =>
          item.provinceCode === beneficiaryDataEdit.proviceCode
      );
      let subDisCount = subDistrictBeneficiaryList.filter(
        (item) =>
          item.provinceCode === beneficiaryDataEdit.proviceCode
      );
      if (disCount.length !== 0 && subDisCount.length !== 0 && postcodeBeneficiaryList.length !== 0) {
        console.log("Sub before Edit",subDistrictBeneficiaryList)
        onEdit(beneficiaryDataEdit);
      }
    }
  }, [districtBeneficiaryList, subDistrictBeneficiaryList,postcodeBeneficiaryList]);

  const initialvalueForSelectField = (listItems = [], key, itemID) => {
    const initialValue = listItems?.filter((item) => item[key] == itemID);
    
    if (initialValue.length > 0) {
      return initialValue[0];
    } else {
      return null;
    }
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

      dispatch(FetchSubDistrictBeneListAdd());
     
    }
    setCurrentBeneficiaryProvicne(value);
    dispatch(FetchDistrictBeneListAdd(value?.provinceCode));
    
  };

  const onChangeBeneficiaryDistrict = (value) => {
    
    if (currentBeneficiarySubDistrict?.id) {
      setValue("beneficiarySubdistrictCode", null);
      setCurrentBeneficiarySubDistrict(null);

      setValue("beneficiaryPostcode", null);
      setCurrentBeneficiaryPostCode(null);
      setPostCodeBeneficiaryListForDisplay([]);

    
    }

    console.log("Dis Before fetch",beneficiaryDataEdit.districtCode)
      console.log("Pro Before fetch",beneficiaryDataEdit.proviceCode)
    setCurrentBeneficiaryDistrict(value);
    dispatch(
      FetchSubDistrictBeneListAdd(
        value?.districtCode,
        currentBeneficiaryProvince?.provinceCode
      )
    );
  };

  const onChangeBeneficiarySubDistrict = (value) => {
    const postCodeFilter = postcodeBeneficiaryList.filter(
      (item) =>
        item.provinceCode == (currentBeneficiaryProvince === null?beneficiaryDataEdit.proviceCode:currentBeneficiaryProvince?.provinceCode) &&
        item.districtCode == (currentBeneficiaryDistrict === null?beneficiaryDataEdit.districtCode:currentBeneficiaryDistrict?.districtCode) &&
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
        ? beneficiaryDataEdit.districtCode
        : currentBeneficiaryDistrict.districtCode;

    const tempProvince = initialvalueForSelectField(
      provinceBeneficiaryList,
      "provinceCode",
      beneficiaryDataEdit.proviceCode
    );
    const tempDistrict = initialvalueForSelectField(
      districtBeneficiaryList,
      "districtCode",
      defaultValieDis //beneficiaryDataEdit.beneficiaryDistrictCode
    );
    const tempSubDistrict = initialvalueForSelectField(
      subDistrictBeneficiaryList,
      "subdistrictCode",
      beneficiaryDataEdit.subdistrictCode
    );

    console.log("Sub On Edit",subDistrictBeneficiaryList)

    setCurrentBeneficiaryProvicne(tempProvince);
    setCurrentBeneficiarySubDistrict(tempSubDistrict);
    setCurrentBeneficiaryDistrict(tempDistrict);

    onChangeBeneficiarySubDistrict(tempSubDistrict);

    console.log("Curr temp dis",tempDistrict)
  console.log("Curr temp Pro",tempProvince)
  console.log("Curr temp Sub",tempSubDistrict)
    
  console.log("Curr dis",currentBeneficiaryDistrict)
  console.log("Curr Pro",currentBeneficiaryProvince)
  console.log("Curr Sub",currentBeneficiarySubDistrict)

    const postCodeFilter = postcodeBeneficiaryList.filter(
      (item) =>
        item.provinceCode == tempProvince?.provinceCode &&
        item.districtCode == tempDistrict?.districtCode &&
        item.postalCode == beneficiaryDataEdit.postcode
    );
    console.log("Main Post",postcodeBeneficiaryList)
    console.log("Post Filter",postCodeFilter)

    const tempPostCode = initialvalueForSelectField(
      postCodeFilter,
      "postalCode",
      beneficiaryDataEdit.postcode
    );

    //setValue("year", tempYear);

    setValue("beneficiaryName", beneficiaryDataEdit.beneficiaryName);
    //setValue("beneficiaryStatus", beneficiaryDataEdit.beneficiaryStatus);
    setValue("beneficiaryCountry", beneficiaryDataEdit.countryCode);
    setValue("beneficiaryAddress", beneficiaryDataEdit.address);
    setValue("beneficiarySubdistrictCode", tempSubDistrict || ""); //beneficiaryDataEdit.beneficiarySubdistrictCode);
    setValue(
      "beneficiarySubdistrictName",
      beneficiaryDataEdit.subdistrictName
    );
    setValue("beneficiaryDistrictCode", tempDistrict || ""); //beneficiaryDataEdit.beneficiaryDistrictCode);
    setValue(
      "beneficiaryDistrictName",
      beneficiaryDataEdit.districtName
    );
    setValue(
      "beneficiaryProviceCode",
      /*beneficiaryDataEdit.beneficiaryProviceCode*/ tempProvince || ""
    );
    setValue(
      "beneficiaryProviceName",
      beneficiaryDataEdit.proviceName
    );
    setValue(
      "beneficiaryCountryName",
      beneficiaryDataEdit.countryName
    );
    setValue("beneficiaryPostcode", tempPostCode || ""); //beneficiaryDataEdit.beneficiaryPostcode);
  };

  const onlyPositiveNum = /^[+]?\d+([.]\d+)?$/;

  const onClickOk = (formData) => {
    console.log("Form Data",formData)
    let beneficiaryDataParam = {};
    const param = {
      beneficiaryName: formData.beneficiaryName,
      status: formData.beneficiaryStatus.statusName,
      countryName: formData.beneficiaryCountryCode.name,
      address: formData.beneficiaryAddress,
      subdistrictCode:
        formData.beneficiarySubdistrictCode.subdistrictCode,
        subdistrictName:
        formData.beneficiarySubdistrictCode.subdistrictNameEn,
        districtCode: formData.beneficiaryDistrictCode.districtCode,
        districtName: formData.beneficiaryDistrictCode.districtNameEn,
        proviceCode: formData.beneficiaryProviceCode.provinceCode,
        proviceName: formData.beneficiaryProviceCode.provinceNameEn,
        countryCode:
        formData.beneficiaryCountryCode.alpha2.toUpperCase(),
      //beneficiaryCountryName: formData.beneficiaryCountryCode.name,
      postcode: formData.beneficiaryPostcode.postalCode.toString(),
      beneficiaryEvidentId: (editStatus === true?beneficiaryDataEdit.beneficiaryEvidentId:""),
      id: (editStatus === true?beneficiaryDataEdit.id:0),
      index:(editStatus === true?beneficiaryDataEdit.index:0),
      subscriberId: (editStatus === true?beneficiaryDataEdit.subscriberId:0),
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
                        disabled = {editStatus === true ? beneficiaryDataEdit.id === 0 ?false:true : false}
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
                        disabled = {editStatus === true ? beneficiaryDataEdit.id === 0 ?false:true : false}
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
                        disable = {editStatus === true ? beneficiaryDataEdit.id === 0 ?false:true : false}
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
                        disable = {editStatus === true ? beneficiaryDataEdit.id === 0 ?false:true : false}
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
                        disable = {editStatus === true ? beneficiaryDataEdit.id === 0 ?false:true : false}
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
                        disable = {editStatus === true ? beneficiaryDataEdit.id === 0 ?false:true : false}
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
                        disable={editStatus === true ? beneficiaryDataEdit.id === 0 ?true:false : true}
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

export default ModalBeneficiaryEdit;
