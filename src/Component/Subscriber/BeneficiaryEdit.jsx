import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Input from "../Control/Input";
import MySelect from "../Control/Select";
import { initialvalueForSelectField } from "../../Utils/FuncUtils";
import { Modal, ScrollArea } from "@mantine/core";
import {
  FetchProvinceBeneListEdit,
  FetchPostcodeBeneListEdit,
  FetchDistrictBeneListEdit,
  FetchSubDistrictBeneListEdit,
  FetchSubDistrictBeneListAll,
} from "../../Redux/Subscriber/Action";
import { FetchCountryList } from "../../Redux/Dropdrow/Action";
import * as _ from "lodash";
import { SubscriberFilterList } from "../../Redux/Subscriber/Action";

const BeneficiaryEdit = (props) => {
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
    beneficiaryDataEdit,
    editPageStatus = false,
  } = props;
  const dispatch = useDispatch();
  const statusBeneficiaryList = useSelector(
    (state) => state.subscriber?.filterList
  );
  //console.log("data Bene Edit",beneficiaryDataEdit);
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
        FetchDistrictBeneListEdit(beneficiaryDataEdit.proviceCode)
      );
      dispatch(
        FetchSubDistrictBeneListEdit(
          beneficiaryDataEdit.districtCode,
          beneficiaryDataEdit.proviceCode
        )
      );
      dispatch(FetchPostcodeBeneListEdit());
      dispatch(FetchSubDistrictBeneListAll());
      dispatch(FetchProvinceBeneListEdit(764));
      
      dispatch(SubscriberFilterList());
    } else {
      dispatch(FetchCountryList());
      dispatch(FetchProvinceBeneListEdit(764));
      dispatch(FetchPostcodeBeneListEdit());
      dispatch(SubscriberFilterList());
    }
  }, []);

  const countryBeneficiaryList = useSelector(
    (state) => state.dropdrow.countryList
  );
  const provinceBeneficiaryList = useSelector(
    (state) => state.subscriber.provinceListEdit
  );
  const districtBeneficiaryList = useSelector(
    (state) => state.subscriber.districtListEdit
  );
  const subDistrictBeneficiaryList = useSelector(
    (state) => state.subscriber.subDistrictListEdit
  );
  const subDistrictBeneficiartListAll = useSelector((state)=>state.subscriber.subDistrictListAll)
  const postcodeBeneficiaryList = useSelector((state) => state.subscriber.postCodeListEdit);

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
        ? beneficiaryDataEdit.status
        : editStatus === true
        ? beneficiaryDataEdit.status
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
          item.provinceCode === beneficiaryDataEdit.proviceCode
      );
      let subDisCount = subDistrictBeneficiaryList.filter(
        (item) =>
          item.provinceCode === beneficiaryDataEdit.proviceCode
      );

      if (disCount.length !== 0 && subDisCount.length !== 0 && postcodeBeneficiaryList.length !== 0) {
        onEdit(beneficiaryDataEdit);
      }
    }
  }, [districtBeneficiaryList, subDistrictBeneficiaryList,postcodeBeneficiaryList]);

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

      dispatch(FetchSubDistrictBeneListEdit());
      //console.log("Change Province with Dis");
    }
    setCurrentBeneficiaryProvicne(value);
    dispatch(FetchDistrictBeneListEdit(value?.provinceCode));
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
      FetchSubDistrictBeneListEdit(
        value?.districtCode,
        currentBeneficiaryProvince?.provinceCode
      )
    );
  };

  const onChangeBeneficiarySubDistrict = (value) => {
    console.log("Post in on chenge sub",postcodeBeneficiaryList)
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

    setCurrentBeneficiaryProvicne(tempProvince);
    setCurrentBeneficiarySubDistrict(tempSubDistrict);
    setCurrentBeneficiaryDistrict(tempDistrict);

    onChangeBeneficiarySubDistrict(tempSubDistrict);
    const postCodeFilter = postcodeBeneficiaryList.filter(
      (item) =>
        item.provinceCode == currentBeneficiaryProvince?.provinceCode &&
        item.districtCode == currentBeneficiaryDistrict?.districtCode &&
        item.postalCode == beneficiaryDataEdit.postcode
    );
    //console.log("Post Code List",postcodeBeneficiaryList)
    //console.log("Curr Province",currentBeneficiaryProvince?.provinceCode)
    //console.log("Curr Dis",currentBeneficiaryDistrict?.districtCode)
    //console.log("Curr Post",beneficiaryDataEdit.postcode)

    /*console.log("Post filter")
      console.log(currentBeneficiaryProvince?.provinceCode)
      console.log(currentBeneficiaryDistrict?.districtCode)
      console.log(beneficiaryDataEdit.beneficiaryPostcode)
      console.log(postCodeFilter)
      console.log(postcodeBeneficiaryList)*/
      
      console.log("Post Code All",postcodeBeneficiaryList)
    const tempPostCode = initialvalueForSelectField(
      postcodeBeneficiaryList,
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

 

 

  return (
      <div className="pt-4 px-4 pb-2">
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
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id={"beneficiaryName"}
                        type={"text"}
                        label={"Name"}
                        error={errors.beneficiaryName}
                        validate={" *"}
                        disabled
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
                        disabled
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
                        disable
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
                        disable
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
                        options={subDistrictBeneficiartListAll}
                        displayProp={"subdistrictNameEn"}
                        valueProp={"subdistrictCode"}
                        label={"Subdistrict"}
                        validate={" *"}
                        error={errors.beneficiarySubdistrictCode}
                        onChangeInput={onChangeBeneficiarySubDistrict}
                        disable
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
                        options={postcodeBeneficiaryList}
                        displayProp={"postCodeDisplay"}
                        valueProp={"postalCode"}
                        label={"Postcode"}
                        validate={" *"}
                        onChangeInput={onChangeBeneficiaryPostCode}
                        error={errors.beneficiaryPostcode}
                        disable
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
                        disable
                        validate={" *"}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>  
        </form>
      </div>
  );
};

export default BeneficiaryEdit;