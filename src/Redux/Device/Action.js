import axios from "axios";
//simport { toast } from "react-toastify"
import {
  DEVICE_FILTER_LIST_URL,
  CREATE_DEVICE_URL,
  GET_DEVICE_BY_ID_URL,
  EDIT_DEVICE_URL,
  SUBMIT_DEVICE_URL,
  WITHDRAW_DEVICE_URL,
  RETURN_DEVICE_URL,
  VERIFYING_DEVICE_URL,
  VERRIFIED_DEVICE_URL,
  DEVICE_MANAGEMENT_DASHBOARD_URL,
  DEVICE_MANAGEMENT_ASSIGNED_URL,
  DEVICE_MANAGEMENT_UN_ASSIGNED_URL,
  UPLOAD_FILE_EVIDENT_DEVICE_URL,
  DELETE_FILE_EVIDENT_DEVICE_URL,
  DOWNLOAD_FILE_EVIDENT_DEVICE_URL,
  SF02_BY_ID_URL
} from "../../Constants/ServiceURL";
import {
  ADD_STATUS,
  DELETE_STATUS,
  FAIL_REQUEST,
  SET_DEVICE_LIST,
  GET_STATUS_OBJ,
  MAKE_REQUEST,
  UPDATE_STATUS,
  SUBMIT_STATUS,
  VERIFYING_STATUS,
  RETURN_STATUS,
  VERIFIED_STATUS,
  SET_OPEN_MODAL,
  SET_CURRENT_ASSIGNED_FILTER,
  SET_CURRENT_UNASSIGNED_FILTER,
  SET_DEVICE_FILTER_LIST,
  CLEAR_MODAL,
  SET_OPEN_FAIL_MODAL,
  SET_DEVICE_DASHBOARD,
  SET_DEVICE_ASSIGNED,
  SET_DEVICE_UNASSIGNED,
  SF_02,
  DOWLOAD_SF_02,
  COUNT
} from "../../Redux/ActionType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";
// import { json } from "react-router-dom"
import { getHeaderConfig } from "../../Utils/FuncUtils";
export const makeRequest = () => {
  return {
    type: MAKE_REQUEST,
  };
};
export const failRequest = (err) => {
  return {
    type: FAIL_REQUEST,
    payload: err,
  };
};

export const setDeviceList = (data) => {
  return {
    type: SET_DEVICE_LIST,
    deviceList: data?.payload?.deviceTrackingTable,
    // totalDevice: data?.payload?.totalAmount,
    // totalCapacity:  data?.payload?.totalCapacity,
    // topCapacity: data?.payload?.deviceTopCapacity
    // deviceInfo:data?.payLoad
  };
};

export const setSF02 = (data) => {
  return {
    type: SF_02,
    filesf02: data,
    };
};

export const setCount = (data) => {
  console.log("ACTION ----------- ",data)
  return {
    type : COUNT,
    count : data
};
}

export const setDeviceDashboard = (data) => {
  return {
    type: SET_DEVICE_DASHBOARD,
    // deviceList:data?.payload?.deviceTrackingTable,
    totalDevice: data?.totalAmount,
    totalCapacity: data?.totalCapacity,
    topCapacity: data?.deviceTopCapacity,
    totalExpire : data?.totalAboutExpire,
    totalDeviceInactive : data?.totalInActive,
    totalRegistration : data?.totalRemaining
  };
};

export const setDeviceAssigned = (data, totalAssigned) => {
  console.log(data)
  return {
    type: SET_DEVICE_ASSIGNED,
    assignedList: data,
    totalAssigned: totalAssigned,
  };
};
export const setDeviceUnAssigned = (data, totalUnAssigned) => {
  return {
    type: SET_DEVICE_UNASSIGNED,
    unAssignedList: data,
    totalUnAssigned: totalUnAssigned,
  };
};

export const addDevice = (data) => {
  return {
    type: ADD_STATUS,
    data: data,
  };
};
export const deleteDevice = () => {
  return {
    type: DELETE_STATUS,
  };
};

export const setDeviceObj = (data) => {
  return {
    type: GET_STATUS_OBJ,
    payload: data,
  };
};

export const setDownloadsf02 = (data) => {
  return {
    type: DOWLOAD_SF_02,
    payload: data,
  };
};

export const updateDevice = () => {
  return {
    type: UPDATE_STATUS,
  };
};
export const submitDevice = () => {
  return {
    type: SUBMIT_STATUS,
  };
};

export const verifyingDevice = () => {
  return {
    type: VERIFYING_STATUS,
  };
};

export const verifiedDevice = () => {
  return {
    type: VERIFIED_STATUS,
    
  };
};

export const returnDevice = () => {
  return {
    type: RETURN_STATUS,
  };
};

export const setCurrentAssignedFilter = (data) => {
  return {
    type: SET_CURRENT_ASSIGNED_FILTER,
    payload: data,
  };
};
export const setCurrentUnAssignedFilter = (data) => {
  return {
    type: SET_CURRENT_UNASSIGNED_FILTER,
    payload: data,
  };
};

export const setDeviceFilterList = (data) => {
  return {
    type: SET_DEVICE_FILTER_LIST,
    payload: data,
  };
};

export const clearModal = (data) => {
  return {
    type: CLEAR_MODAL,
  };
};
export const setOpenFailModal = (message = null) => {
  return {
    type: SET_OPEN_FAIL_MODAL,
    message: message,
  };
};

export const FetchFilterList = () => {
  const deviceFilterListURL = DEVICE_FILTER_LIST_URL;
  return (dispatch) => {
    //   const test = [{
    //     "id": 1,
    //     "statusName": "Draftddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
    // }]
    axios
      .get(deviceFilterListURL, getHeaderConfig())
      .then((res) => {
        // const data = res.data //Master
        if (res?.status == 200) {
          const data = {
            ...res.data,
            // findStatus: test,
          };
          dispatch(setDeviceFilterList(data));
          console.log(data)
        } else {
          dispatch(failRequest(err.message));
        }

        //Mock
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const FetchDeviceManagementDashboard = (fetchParameter = {}) => {
  const { findUgtGroupId = "", findUtilityId } = fetchParameter;
console.log(findUgtGroupId)
  let queryString = "";
  if (findUtilityId?.length > 0) {
    findUtilityId?.forEach((element) => {
      queryString = queryString + `findUtilityId=${element}` + "&";
    });
  }

  const deviceManagementDashboardURL = `${DEVICE_MANAGEMENT_DASHBOARD_URL}?findUgtGroupId=${findUgtGroupId}&${queryString}`;
  return async (dispatch) => {
    await axios
      .get(deviceManagementDashboardURL, getHeaderConfig())
      .then((res) => {
        if (res?.status == 200) {
          dispatch(setDeviceDashboard(res.data));
          console.log(res.data)
        } else {
          dispatch(failRequest(err.message));
        }
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const FetchDeviceManagementAssigned = (fetchParameter, callback) => {
  const {
    findTypeId,
    findUtilityId,
    findStatusId,
    pageNumber,
    pageSize,
    findUgtGroupId = "",
  } = fetchParameter;
  const ugtGroupID = findUgtGroupId;
  let queryString = "";
  if (findTypeId?.length > 0) {
    findTypeId?.forEach((element) => {
      queryString = queryString + `findTypeId=${element}` + "&";
    });
  }

  if (findUtilityId?.length > 0) {
    findUtilityId?.forEach((element) => {
      queryString = queryString + `findUtilityId=${element}` + "&";
    });
  }

  if (findStatusId?.length > 0) {
    findStatusId?.forEach((element) => {
      queryString = queryString + `findStatusId=${element}` + "&";
    });
  }

  const deviceManagementURL = `${DEVICE_MANAGEMENT_ASSIGNED_URL}?PageNumber=${pageNumber}&PageSize=${pageSize}&findUgtGroupId=${ugtGroupID}&${queryString}`;
  return async (dispatch) => {
    await axios
      .get(deviceManagementURL, getHeaderConfig())
      .then((res) => {
        if (res?.status == 200) {
          const totalAssigned = JSON.parse(
            res.headers.get("X-Pagination") ?? "{}"
          );
          // dispatch(setDeviceAssigned(res.data, totalAssigned?.TotalCount));

          // remove unused field
          const filterData = res?.data?.map(
            ({ typeId, code, statusId, utilityContractId, ...item }) => ({
              ...item,
            })
          );
          // dispatch(setDeviceAssigned(res.data, res?.data?.length));
          dispatch(setDeviceAssigned(filterData, filterData?.length));
        } else {
          dispatch(failRequest(err.message));
        }
        callback && callback(res?.status);
      })
      .catch((err) => {
        console.log("err assign", err);
        dispatch(failRequest(err.message));
        callback && callback(err);
      });
    // }, 2000);
  };
};

export const FetchDeviceManagementUnAssigned = (fetchParameter, callback) => {
  // 'http://10.40.76.217/dev/api/ugt/v1/device-management/unassigned?findUgtGroupId=1&findStatusId=1&findStatusId=2&PageNumber=1&PageSize=5'
  const {
    findTypeId,
    findUtilityId,
    findStatusId,
    pageNumber,
    pageSize,
    findUgtGroupId = "",
  } = fetchParameter;
  const ugtGroupID = findUgtGroupId;
  let queryString = "";
  if (findTypeId?.length > 0) {
    findTypeId?.forEach((element) => {
      queryString = queryString + `findTypeId=${element}` + "&";
    });
  }

  if (findUtilityId?.length > 0) {
    findUtilityId?.forEach((element) => {
      queryString = queryString + `findUtilityId=${element}` + "&";
    });
  }

  if (findStatusId?.length > 0) {
    findStatusId?.forEach((element) => {
      queryString = queryString + `findStatusId=${element}` + "&";
    });
  }

  const deviceManagementURL = `${DEVICE_MANAGEMENT_UN_ASSIGNED_URL}?PageNumber=${pageNumber}&PageSize=${pageSize}&findUgtGroupId=${ugtGroupID}&${queryString}`;
  return async (dispatch) => {
    await axios
      .get(deviceManagementURL, getHeaderConfig())
      .then((res) => {
        if (res?.status == 200) {
          const totalUnAssigned = JSON.parse(
            res.headers.get("X-Pagination") ?? "{}"
          );
          // dispatch(setDeviceUnAssigned(res.data, totalUnAssigned?.TotalCount));

          // remove unused field
          const filterData = res?.data?.map(
            ({ typeId, code, statusId, utilityContractId, ...item }) => ({
              ...item,
            })
          );
          // dispatch(setDeviceUnAssigned(res.data, res?.data?.length));
          dispatch(setDeviceUnAssigned(filterData, filterData?.length));
        } else {
          dispatch(failRequest(err.message));
        }
        callback && callback(res?.status);
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
        callback && callback(err);
      });
    // }, 2000);
  };
};



export const FunctionAddDevice = (data, callback) => {
  console.log(data)
  const parameterForCreate = {
    assignedUtilityId: data?.assignedUtilityCode?.id, //assignedUtilityCode.id //number
    imageFile: data?.deviceImg,
    name: data?.name, //name //string
    registrantOrganisationCode: "string", // ??
    defaultAccountCode: data?.defaultAccountCode, //defaultAccountCode //string
    ppaNo: data?.ppaNo, //ppaNo //string
    deviceOwner: data?.owner, //owner //string
    deviceCode: data?.code, //code //string
    deviceNameBySO: data?.deviceNameBySO, //deviceNameBySO //string
    deviceFuelCode: data?.fuelCode?.code, //fuelCode.code //"string"
    deviceTechnologyId: data?.technologyCode.id, // technologyCode.id //number
    capacity: data?.capacity, // capacity //number
    commissioningDate: data?.commissioningDate, //commissioningDate // YYYY-MM-DD
    registrationDate: data?.registrationDate, //registrationDate // YYYY-MM-DD
    otherLabellingSchemeId: data?.otherLabellingCode?.id, // otherLabellingCode.id // number
    address: data?.address,
    subdistrictCode: data?.subdistrictCode.subdistrictCode, //subdistrictCode.subdistrictCode // number
    subdistrictName: data?.subdistrictCode.subdistrictNameEn, //subdistrictNameEn //string
    districtCode: data?.districtCode.districtCode, //districtCode.districtCode //number
    districtName: data?.districtCode.districtNameEn, //districtCode.districtNameEn //string
    proviceCode: data?.stateCode.provinceCode, //stateCode.provinceCode //number
    proviceName: data?.stateCode.provinceNameEn, //stateCode.provinceNameEn //string
    countryCode: data?.countryCode?.alpha2, //countryCode //"string",
    countryName: data?.countryCode?.name,
    postcode: `${data?.postCode?.postalCode}`, //postalCode //string
    latitude: data?.latitude ? parseFloat(data?.latitude) : 0, //latitude // number
    longitude: data?.longitude ? parseFloat(data?.longitude) : 0, //longitude //number
    fileUploads: data?.uploadFile, //data?.uploadFile
    notes: data?.note, //note//"string",
    issuerCode: data?.issuerCode?.issuerCode, //issuerCode?.issuerCode // string
    issuerId: data?.issuerCode?.id,
    ugtStartDate: "2023-11-09", // ??
    ugtEndDate: "2023-11-09", // ??
    ugtGroup: data?.ugtGroup,
    GeneratingUnit : data.NumberofGeneratingUnits,
    OwnerNetwork : data.OwnerofNetwork,
    OnSiteConsumer: data.Onsite?.Name,
    OtherImportEletricity: data.Otherimport,
    EnergySource: data.Energysources?.Name,
    OtherCarbonOffset: data.Othercarbon,
    PublicFunding: data.Publicfunding?.Name,
    FundingReceive :"2023-11-09",
    IsMeteringData : data.ExpectedFormofVolumeEvidence[0]?.Checked ? "True" : "False" ,
    IsContractSaleInvoice : data.ExpectedFormofVolumeEvidence[1]?.Checked ? "True" : "False" ,
    IsOther : data.ExpectedFormofVolumeEvidence[2]?.Checked ? "True" : "False" ,
    OtherDescription : data.ExpectedFormofVolumeEvidence[2]?.otherText,
    deviceMeasurements : data?.devicemeasure
     
    
  };
console.log(parameterForCreate)
  const createDeviceURL = CREATE_DEVICE_URL;
  return async (dispatch) => {
    dispatch(makeRequest());

    await axios
      .post(createDeviceURL, parameterForCreate, getHeaderConfig())
      .then(
        (response) => {
          if (response?.status == 200 || response?.status == 201) {
            dispatch(addDevice(response?.data?.device));
          } else {
            dispatch(setOpenFailModal());
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          // ststus error here
          // 400
          // 500
          dispatch(setOpenFailModal(error?.response?.data?.detail));
          // dispatch(failRequest(error.message))
          callback && callback(error);
        }
      );
  };
};

export const FunctionEditDevice = (data, callback) => {
  const deviceID = `${data?.id}`;
  const editDeviceURL = `${EDIT_DEVICE_URL}/${deviceID}`;
  
  
  const parameterForEdit = {
    
    assignedUtilityId: data?.assignedUtilityCode?.id, //assignedUtilityCode.id //number
    imageFile: data?.deviceImg,
    name: data?.name, //name //string
    issuerId: data?.issuerCode?.id,
    registrantOrganisationCode: "string", // ??
    defaultAccountCode: data?.defaultAccountCode, //defaultAccountCode //string
    ppaNo: data?.ppaNo, //ppaNo //string
    deviceOwner: data?.owner, //owner //string
    deviceCode: data?.code, //code //string
    deviceNameBySO: data?.deviceNameBySO, //deviceNameBySO //string
    deviceFuelCode: data?.fuelCode?.code, //fuelCode.code //"string"
    deviceTechnologyId: data?.technologyCode.id, // technologyCode.id //number
    capacity: data?.capacity, // capacity //number
    commissioningDate: data?.commissioningDate, //commissioningDate // YYYY-MM-DD
    registrationDate: data?.registrationDate, //registrationDate // YYYY-MM-DD
    otherLabellingSchemeId: data?.otherLabellingCode?.id, // otherLabellingCode.id // number
    address: data?.address,
    subdistrictCode: data?.subdistrictCode.subdistrictCode, //subdistrictCode.subdistrictCode // number
    subdistrictName: data?.subdistrictCode.subdistrictNameEn, //subdistrictNameEn //string
    districtCode: data?.districtCode.districtCode, //districtCode.districtCode //number
    districtName: data?.districtCode.districtNameEn, //districtCode.districtNameEn //string
    proviceCode: data?.stateCode.provinceCode, //stateCode.provinceCode //number
    proviceName: data?.stateCode.provinceNameEn, //stateCode.provinceNameEn //string
    countryCode: data?.countryCode?.alpha2, //countryCode //"string",
    countryName: data?.countryCode?.name,
    postcode: `${data?.postCode?.postalCode}`, //postalCode //string
    latitude: data?.latitude ? parseFloat(data?.latitude) : 0, //latitude // number
    longitude: data?.longitude ? parseFloat(data?.longitude) : 0, //longitude //number
    fileUploads: data?.uploadFile,
    notes: data?.note, //note//"string",
    issuerCode: data?.issuerCode?.issuerCode, //issuerCode?.issuerCode // string
    active: "yes", // คุณม่ำบอก ใส่ yes ไปก่อน
    GeneratingUnit : data.NumberofGeneratingUnits,
    OwnerNetwork : data.OwnerofNetwork,
    OnSiteConsumer: data.Onsite?.Name,
    OtherImportEletricity: data.Otherimport,
    EnergySource: data.Energysources?.Name,
    OtherCarbonOffset: data.Othercarbon,
    PublicFunding: data.Publicfunding?.Name,
    FundingReceive :"2023-11-09",
    IsMeteringData : data.ExpectedFormofVolumeEvidence[0]?.Checked ? "True" : "False" ,
    IsContractSaleInvoice : data.ExpectedFormofVolumeEvidence[1]?.Checked ? "True" : "False" ,
    IsOther : data.ExpectedFormofVolumeEvidence[2]?.Checked ? "True" : "False" ,
    OtherDescription : data.ExpectedFormofVolumeEvidence[2]?.otherText,
    deviceMeasurements : data?.devicemeasure
  };

  return async (dispatch) => {
    dispatch(makeRequest());
    await axios.put(editDeviceURL, parameterForEdit, getHeaderConfig()).then(
      (response) => {
        if (response.status == 200 || response?.status == 201) {
          dispatch(updateDevice());
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
        console.log("error", error);
        // dispatch(setOpenFailModal())
        // dispatch(failRequest(error.message))
        // callback && callback(error)

        dispatch(setOpenFailModal(error?.response?.data?.detail));
        // dispatch(failRequest(error.message))
        callback && callback(error);
      }
    );
  };
};

export const WithdrawDevice = (id, callbackFunc) => {
  const deviceID = id;
  const note = "MOCK";
  const withdrawDeviceUrl = `${WITHDRAW_DEVICE_URL}/${deviceID}?notes=${note}`;
  return async (dispatch) => {
    dispatch(makeRequest());

    await axios.put(withdrawDeviceUrl, getHeaderConfig()).then(
      (response) => {
        if (response?.status == 200) {
          dispatch(deleteDevice());
          toast.success("Withdarw Complete!", {
            position: "top-right",
            autoClose: 3000,
            style: {
              border: "1px solid #a3d744", // Green border similar to the one in your image
              color: "#6aa84f", // Green text color
              fontSize: "16px", // Adjust font size as needed
              backgroundColor: "##FFFFFF", // Light green background
            }, // 3 seconds
          });
          callbackFunc();
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
      },
      (error) => {
        dispatch(setOpenFailModal());
        dispatch(failRequest(error.message));
      }
    );
    // }, 2000);
  };
};



export const ReturnDevice = (id,re,us,callbackFunc) => {
  const deviceID = id;
  const remark = re;
  const name = us;
  const returnDeviceUrl = `${RETURN_DEVICE_URL}/${deviceID}?remark=${remark}&username=${name}`;

  return async (dispatch) => {
    dispatch(makeRequest());

    await axios.put(returnDeviceUrl, getHeaderConfig()).then(
      (response) => {
        console.log(response)
        if (response?.status == 200) {
          dispatch(returnDevice());
          toast.success("Return Complete!", {
            position: "top-right",
            autoClose: 3000,
            style: {
              border: "1px solid #a3d744", // Green border similar to the one in your image
              color: "#6aa84f", // Green text color
              fontSize: "16px", // Adjust font size as needed
              backgroundColor: "##FFFFFF", // Light green background
            }, // 3 seconds
          });
          callbackFunc();
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
      },
      (error) => {
        dispatch(setOpenFailModal());
        callbackFunc(error.message);
        dispatch(failRequest(error.message));
      }
    );
  };
};


export const SubmitDevice = (id,name,sigDate,orid,orname,cont,bu,coun,e,t,files, callbackFunc) => {
  const deviceID = id;
  const username = name;
  const SignatureDateTime = "2024-08-27T15:41:55";
  const organisationId = orid;
  const organisationName = orname;
  const contactPerson = cont;
  const businessAddress = bu;
  const country = coun;
  const email = e;
  const telephone = t;
  const submitDeviceURL = `${SUBMIT_DEVICE_URL}/${deviceID}?username=${username}&SignatureDateTime=${SignatureDateTime}&organisationId=${organisationId}&organisationName=${organisationName}&contactPerson=${contactPerson}&businessAddress=${businessAddress}&country=${country}&email=${email}&telephone=${telephone}`;

  return async (dispatch) => {
    dispatch(makeRequest());
    const formData = new FormData();
    formData.append('file', files);
    await axios.put(submitDeviceURL,formData, getHeaderConfig()).then(
      (response) => {
        if (response?.status == 200) {
          dispatch(submitDevice());
          toast.success("Submit Complete!", {
            position: "top-right",
            autoClose: 3000,
            style: {
              border: "1px solid #a3d744", // Green border similar to the one in your image
              color: "#6aa84f", // Green text color
              fontSize: "16px", // Adjust font size as needed
              backgroundColor: "##FFFFFF", // Light green background
            }, // 3 seconds
          });
          callbackFunc();
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
      },
      (error) => {
        dispatch(setOpenFailModal());
        callbackFunc(error.message);
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const VerifingDevice = (id, callbackFunc) => {
  const deviceID = id; 
  const verifyingDeviceURL = `${VERIFYING_DEVICE_URL}/${deviceID}`;

  return async (dispatch) => {
    dispatch(makeRequest());

    await axios.put(verifyingDeviceURL, getHeaderConfig()).then(
      (response) => {
        if (response?.status == 200) {
          dispatch(verifyingDevice());
          toast.success("Send to Verify Complete!", {
            position: "top-right",
            autoClose: 3000,
            style: {
              border: "1px solid #a3d744", // Green border similar to the one in your image
              color: "#6aa84f", // Green text color
              fontSize: "16px", // Adjust font size as needed
              backgroundColor: "##FFFFFF", // Light green background
            }, // 3 seconds
          });
          callbackFunc();
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
      },
      (error) => {
        dispatch(setOpenFailModal());
        callbackFunc(error.message);
        dispatch(failRequest(error.message));
      }
    );
  };
};


export const VerifiedDevice = (id,files, callbackFunc) => {
  console.log(files)
  const deviceID = id;
  
  const verifiedDeviceURL = `${VERRIFIED_DEVICE_URL}/${deviceID}`;

  return async (dispatch) => {
    dispatch(makeRequest());
    const formData = new FormData();
    formData.append('file', files);
    await axios.put(verifiedDeviceURL,formData, getHeaderConfig()).then(
      (response) => {
        if (response?.status == 200) {
          dispatch(verifiedDevice());
          toast.success("Verify Complete!", {
            position: "top-right",
            autoClose: 3000,
            style: {
              border: "1px solid #a3d744", // Green border similar to the one in your image
              color: "#6aa84f", // Green text color
              fontSize: "16px", // Adjust font size as needed
              backgroundColor: "##FFFFFF", // Light green background
            }, // 3 seconds
          });
          callbackFunc();
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
          console.log("ERROR")
        }
      },
      (error) => {
        dispatch(setOpenFailModal());
        callbackFunc(error.message);
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const FetchGetDeviceByID = (deviceID, callback) => {
  const deviceManagementURL = `${GET_DEVICE_BY_ID_URL}/${deviceID}`;
  return async (dispatch) => {
    await axios
      .get(deviceManagementURL, getHeaderConfig())
      .then((res) => {
        if (res?.status == 200) {
          // dispatch(setDeviceObj(res?.data?.device));
          dispatch(setDeviceObj(res?.data));
          callback && callback(res, null);
        } else {
          // dispatch(failRequest(err.message))
          callback && callback(res, res?.statusText);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(failRequest(err.message));
        callback && callback(null, err);
      });
    // }, 2000);
  };
};

export const FetchSF02ByID = (deviceID, callback) => {
  const devicesf02URL = `${SF02_BY_ID_URL}/${deviceID}`;
  return async (dispatch) => {
    await axios
      .get(devicesf02URL, {...getHeaderConfig(),responseType: 'blob',})
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        if (response?.status == 200) {
          // dispatch(setDeviceObj(res?.data?.device));\
          console.log(url)
          dispatch(setDownloadsf02(url));
          callback && callback(response, null);
        } 
        else if (response?.status === 404) {
          const notFoundURL = '/not-found';
          console.log("Page not found:", notFoundURL);
          dispatch(setDownloadsf02(notFoundURL));
          callback && callback(response, "Page not found");
        }
        else {
          // dispatch(failRequest(err.message))
          callback && callback(response, response?.title);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(failRequest(err.message));
        callback && callback(null, err);
      });
    // }, 2000);
  };
};

export const FetchUploadFile = async (uploadParameter) => {
  const uploadFileURL = `${UPLOAD_FILE_EVIDENT_DEVICE_URL}`;
  // const uploadFileURL = 'https://localhost:44377/api/uploadfile/20231212165143'
  try {
    const result = await axios.post(uploadFileURL, uploadParameter);

    return { res: result?.data, unSuccess: false };
  } catch (error) {
    return { res: null, unSuccess: true };
  }
};

export const FetchDownloadFile = async (requestParameter) => {
  const fileID = requestParameter?.fileID;
  const fileName = requestParameter?.fileName;
  // let urlDownload = `https://localhost:7061/api/ugt/v1/downloadfile?fileID=${fileID}&fileName=${fileName}`;
  const url = `${DOWNLOAD_FILE_EVIDENT_DEVICE_URL}?fileID=${fileID}&fileName=${fileName}`;

  try {
    // const result = await axios.get(uploadFileURL, uploadParameter);
    const response = await axios.get(url, {
      responseType: "blob",
    });

    return { res: response, unSuccess: false };
  } catch (error) {
    return { res: null, unSuccess: true };
  }
};

export const FetchDeleteFile = async (requestParamter) => {
  const url = `${DELETE_FILE_EVIDENT_DEVICE_URL}`;
  try {
    const result = await axios.post(url, requestParamter);

    return { res: result?.data, unSuccess: false };
  } catch (error) {
    return { res: null, unSuccess: true };
  }
};

// -------------- //
