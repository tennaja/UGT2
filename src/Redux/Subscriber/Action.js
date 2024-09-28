import axios from "axios";
import {
  GET_SUBSCRIBER_DASHBOARD_OBJ,
  GET_SUBSCRIBER_ASSIGN_OBJ,
  GET_SUBSCRIBER_UNASSIGN_OBJ,
  GET_SUBSCRIBER_FILTER_LIST,
  GET_SUBSCRIBER_INFO,
  SET_OPEN_FAIL_MODAL,
  CREATE_SUBSCRIBER_STATUS,
  CREATE_AGGREGATE_SUBSCRIBER_STATUS,
  GET_SUB_DISTRICTBENE_LIST,
  GET_DISTRICTBENE_LIST,
  GET_POSTCODEBENE_LIST,
  GET_PROVINCEBENE_LIST,
  EDIT_SUBSCRIBER_STATUS,
  EDIT_AGGREGATE_STATUS,
  FAIL_REQUEST,
  CLEAR_MODAL,
  GET_SUB_DISTRICTBENE_LIST_ALL,
  GET_DISTRICTBENE_LIST_ADD,
  GET_POSTCODEBENE_LIST_ADD,
  GET_PROVINCEBENE_LIST_ADD,
  GET_SUB_DISTRICTBENE_LIST_ADD,
  GET_DISTRICTBENE_LIST_EDIT,
  GET_POSTCODEBENE_LIST_EDIT,
  GET_PROVINCEBENE_LIST_EDIT,
  GET_SUB_DISTRICTBENE_LIST_EDIT,
  GET_HISTORY_LOG_ACTIVE,
  GET_HISTORY_LOG_INACTIVE,
  GTE_BINARY_FILE_HISTORY,
  RENEW_SUBSCRIBER_STATUS,
  RENEW_AGGREGATE_STATUS,
  GET_RENEW_SUBSCRIBER_INFO,
  GET_RENEW_EDIT_SUBSCRIBER_INFO,
  WITHDRAWN_SUBSCRIBER_STATUS
} from "../../Redux/ActionType";
import {
  DASHBOARD_LIST_URL,
  ASSIGN_LIST_URL,
  UNASSIGN_LIST_URL,
  FILTER_LIST_URL,
  SUBSCRIBER_INFO_URL,
  CREATE_SUBSCRIBER_URL,
  CREATE_AGGREGATE_URL,
  SUB_DISTRICT_LIST_URL,
  DISTRICT_LIST_URL,
  PROVINCE_LIST_URL,
  EDIT_SUBSCRIBER_URL,
  EDIT_AGGREGATE_URL,
  POSTCODE_LIST_URL,
  HISTORY_URL,
  BINARY_FILE_HISTORY_URL,
  WITHDRAWN_SUBSCRIBER_URL,
  RENEW_SUBSCRIBER_URL,
  RENEW_AGGREGATE_URL,
  RENEW_SUBSCRIBER_INFO_URL,
  RENEW_EDIT_SUBSCRIBER_INFO_URL
} from "../../Constants/ServiceURL";
import { getHeaderConfig } from "../../Utils/FuncUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const optimizeParam = (param) => {
  let optimizeParam = "?";
  for (let key in param) {
    optimizeParam += key + "=" + param[key] + "&";
  }
  optimizeParam = optimizeParam.slice(0, -1);
  return optimizeParam;
};

export const clearModal = (data) => {
  return {
    type: CLEAR_MODAL,
  };
};

export const failRequest = (err) => {
  return {
    type: FAIL_REQUEST,
    payload: err,
  };
};

export const setOpenFailModal = () => {
  return {
    type: SET_OPEN_FAIL_MODAL,
  };
};

export const getSubscriberManagementdashboard = (data) => {
  return {
    type: GET_SUBSCRIBER_DASHBOARD_OBJ,
    payload: data,
  };
};
export const SubscriberManagementdashboard = (param) => {
  const findUtilityId = param?.findUtilityId;
  const UgtGroupId = param?.UgtGroupId;
  const portfolioId = param?.findPortfolioId;
  let queryStringUtilityId = "";
  let queryStringPortifolioId = "";
  if (findUtilityId.utility?.length > 0) {
    findUtilityId.utility.forEach((element) => {
      queryStringUtilityId += `findUtilityId=${element}` + "&";
    });
    queryStringUtilityId = queryStringUtilityId.slice(0, -1);
  }
  if (portfolioId.portfolio?.length > 0) {
    portfolioId.portfolio.forEach((element) => {
      queryStringPortifolioId += `findPortfolioId=${element}` + "&";
    });
    queryStringPortifolioId = queryStringPortifolioId.slice(0, -1);
  }
  const URL = `${DASHBOARD_LIST_URL}/${UgtGroupId}?${queryStringUtilityId}&${queryStringPortifolioId}`;
  console.log("Dash Board URL :",URL)
  return async (dispatch) => {
    await axios.get(URL).then(
      (response) => {
        dispatch(getSubscriberManagementdashboard(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getSubscriberManagementAssign = (data, totalAssigned) => {
  return {
    type: GET_SUBSCRIBER_ASSIGN_OBJ,
    payload: data,
    totalAssigned: totalAssigned,
  };
};
export const SubscriberManagementAssign = (fetchParameter, callback) => {
  console.log("Fecth Param",fetchParameter)
  const defualtParam = {
    findUgtGroupId: fetchParameter.findUgtGroupId,
    PageSize: fetchParameter.PageSize,
    PageNumber: fetchParameter.PageNumber,
  };
  const filterParam = {
    findStatusId: fetchParameter.findStatusId,
    findUtilityId: fetchParameter.findUtilityId,
    findPortfolioId: fetchParameter.findPortfolioId
  };
  let queryStringUtilityId = "";
  let queryStringStatusId = "";
  let queryStringPortfolioId = "";
  console.log("Filter Param",filterParam)

  if (filterParam?.findUtilityId?.utility?.length > 0) {
    filterParam?.findUtilityId?.utility.forEach((element) => {
      queryStringUtilityId += `findUtilityId=${element}` + "&";
    });
    queryStringUtilityId = queryStringUtilityId.slice(0, -1);
  }
  if (filterParam?.findStatusId?.status?.length > 0) {
    filterParam?.findStatusId?.status.forEach((element) => {
      queryStringStatusId += `findStatusId=${element}` + "&";
    });
    queryStringStatusId = queryStringStatusId.slice(0, -1);
  }
  if (filterParam?.findPortfolioId?.portfolio?.length > 0) {
    console.log("portfolio come function")
    filterParam?.findPortfolioId?.portfolio.forEach((element) => {
      queryStringPortfolioId += `findPortfolioId=${element}` + "&";
    });
    
    queryStringPortfolioId = queryStringPortfolioId.slice(0, -1);
  }
  const URL = `${ASSIGN_LIST_URL}${optimizeParam(
    defualtParam
  )}&${queryStringUtilityId}&${queryStringStatusId}&${queryStringPortfolioId}`;
  console.log("URL",URL)
  return async (dispatch) => {
    await axios.get(URL).then(
      (response) => {
        if (response?.status == 200) {
          const totalUnAssigned = JSON.parse(
            response.headers.get("X-Pagination") ?? "{}"
          );
          /*   dispatch(
            getSubscriberManagementAssign(
              response.data,
              totalUnAssigned?.TotalCount
            )
          ); */
          dispatch(
            getSubscriberManagementAssign(response.data, response?.data?.length)
          );
        } else {
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getSubscriberManagementUnassign = (data, totalUnAssigned) => {
  return {
    type: GET_SUBSCRIBER_UNASSIGN_OBJ,
    payload: data,
    totalUnAssigned: totalUnAssigned,
  };
};
export const SubscriberManagementUnassign = (fetchParameter, callback) => {
  console.log("Fecth Param",fetchParameter)
  const defualtParam = {
    findUgtGroupId: fetchParameter.findUgtGroupId,
    PageSize: fetchParameter.PageSize,
    PageNumber: fetchParameter.PageNumber,
  };
  const filterParam = {
    findStatusId: fetchParameter.findStatusId,
    findUtilityId: fetchParameter.findUtilityId,
    findPortfolioId: fetchParameter.findPortfolioId
  };
  let queryStringUtilityId = "";
  let queryStringStatusId = "";
  let queryStringPortfolioId = "";
  console.log("Filter Param",filterParam)
  if (filterParam?.findUtilityId?.utility?.length > 0) {
    filterParam?.findUtilityId?.utility.forEach((element) => {
      queryStringUtilityId += `findUtilityId=${element}` + "&";
    });
    queryStringUtilityId = queryStringUtilityId.slice(0, -1);
  }
  if (filterParam?.findStatusId?.status?.length > 0) {
    filterParam?.findStatusId?.status.forEach((element) => {
      queryStringStatusId += `findStatusId=${element}` + "&";
    });
    queryStringStatusId = queryStringStatusId.slice(0, -1);
  }
  if (filterParam?.findPortfolioId?.portfolio?.length > 0) {
    filterParam?.findPortfolioId?.portfolio.forEach((element) => {
      queryStringPortfolioId += `findPortfolioId=${element}` + "&";
    });
    queryStringPortfolioId = queryStringPortfolioId.slice(0, -1);
  }
  const URL = `${UNASSIGN_LIST_URL}${optimizeParam(
    defualtParam
  )}&${queryStringUtilityId}&${queryStringStatusId}&${queryStringPortfolioId}`;
  console.log("URL Unassign",URL)
  return async (dispatch) => {
    await axios.get(URL).then(
      (response) => {
        if (response?.status == 200) {
          console.log(response)
          const totalUnAssigned = JSON.parse(
            response.headers.get("X-Pagination") ?? "{}"
          );
          /*    dispatch(
            getSubscriberManagementUnassign(
              response.data,
              totalUnAssigned?.TotalCount
            )
          ); */
          dispatch(
            getSubscriberManagementUnassign(
              response.data,
              response?.data?.length
            )
          );
        } else {
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getSubscriberFilterList = (data) => {
  return {
    type: GET_SUBSCRIBER_FILTER_LIST,
    payload: data,
  };
};
export const SubscriberFilterList = () => {
  const URL = FILTER_LIST_URL;
  return async (dispatch) => {
    await axios
      .get(URL)
      .then((response) => {
        if (response?.status == 200) {
          dispatch(getSubscriberFilterList(response.data));
          //console.log(response.data)
        } else {
          dispatch(failRequest(error.message));
        }
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
      });
  };
};

export const getSubscriberInfo = (data) => {
  return {
    type: GET_SUBSCRIBER_INFO,
    payload: data,
  };
};
export const SubscriberInfo = (id,contractId, callback) => {
  
  const URL = `${SUBSCRIBER_INFO_URL}/${id}&${contractId}`;
  console.log("URL Info",URL)
  return async (dispatch) => {
    await axios
      .get(URL)
      .then((response) => {
        if (response?.status == 200) {
          dispatch(getSubscriberInfo(response.data));
          callback && callback(response, null);
          console.log("dddd", response);
        } else {
          callback && callback(response, response?.statusText);
        }
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
        callback && callback(null, error);
      });
  };
};

// CreateSubscriber
export const createSubscriber = (data) => {
  return {
    type: CREATE_SUBSCRIBER_STATUS,
    data: data,
  };
};
export const FunctionCreateSubscriber = (data, callback) => {
  const param = data;
  const URL = CREATE_SUBSCRIBER_URL;
  return async (dispatch) => {
    await axios.post(URL, param).then(
      (response) => {
        console.log("Response Create Statue",response?.status)
        if (response?.status == 200 || response?.status == 201) {
          console.log("Create Success")
          dispatch(createSubscriber(response?.data));
        } else {
          console.log("Create not success")
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
        console.log("Create Error")
        dispatch(setOpenFailModal());
        dispatch(failRequest(error.message));
        callback && callback(error);
      }
    );
  };
};

// CreateAggregateSubscriber
export const createAggregateSubscriber = (data) => {
  return {
    type: CREATE_AGGREGATE_SUBSCRIBER_STATUS,
    data: data,
  };
};
export const FunctionCreateAggregateSubscriber = (data, callback) => {
  const param = data;
  const URL = CREATE_AGGREGATE_URL;
  return async (dispatch) => {
    await axios.post(URL, param).then(
      (response) => {
        if (response?.status == 200 || response?.status == 201) {
          dispatch(createAggregateSubscriber(response?.data));
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
        dispatch(setOpenFailModal());
        dispatch(failRequest(error.message));
        callback && callback(error);
      }
    );
  };
};

// EditSubscriber
export const editSubscriber = (data) => {
  return {
    type: EDIT_SUBSCRIBER_STATUS,
    data: data,
  };
};
export const FunctionEditSubscriber = (data, id, callback) => {
  const param = data;
  const URL = EDIT_SUBSCRIBER_URL;
  const editSubscriberURL = `${URL}/${id}`;
  return async (dispatch) => {
    //  await axios.post(URL, param ,getHeaderConfig())
    await axios.put(editSubscriberURL, param).then(
      (response) => {
        if (response?.status == 200 || response?.status == 201) {
          dispatch(editSubscriber(response?.data));
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
        console.log("error>>>>", error);

        // ststus error here
        // 400
        // 500
        dispatch(setOpenFailModal());
        dispatch(failRequest(error.message));
        callback && callback(error);
      }
    );
  };
};

// EditAggregateSubscriber
export const editAggregateSubscriber = (data) => {
  return {
    type: EDIT_AGGREGATE_STATUS,
    data: data,
  };
};
export const FunctioneditAggregateSubscriber = (data, id, callback) => {
  const param = data;
  const URL = EDIT_AGGREGATE_URL;
  const editSubscriberURL = `${URL}/${id}`;
  return async (dispatch) => {
    await axios.put(editSubscriberURL, param).then(
      (response) => {
        if (response?.status == 200 || response?.status == 201) {
          dispatch(editAggregateSubscriber(response?.data));
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
        console.log("error>>>>", error);

        // ststus error here
        // 400
        // 500
        dispatch(setOpenFailModal());
        dispatch(failRequest(error.message));
        callback && callback(error);
      }
    );
  };
};

//District bene

export const setDistrictBeneList = (data) => {
  return {
    type: GET_DISTRICTBENE_LIST,
    payload: data,
  };
};
export const FetchDistrictBeneList = (provinceCode) => {
  const districtListUrl = DISTRICT_LIST_URL;
  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {

    await axios
      .get(districtListUrl, getHeaderConfig())
      .then((res) => {
        const districtList = res.data?.filter(
          (item) => item.provinceCode == provinceCode
        );
        const districtSort = districtList.sort((a,b)=>a.id-b.id)
        dispatch(setDistrictBeneList(districtSort));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const setDistrictBeneListAdd = (data) => {
  return {
    type: GET_DISTRICTBENE_LIST_ADD,
    payload: data,
  };
};
export const FetchDistrictBeneListAdd = (provinceCode) => {
  const districtListUrl = DISTRICT_LIST_URL;
  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {

    await axios
      .get(districtListUrl, getHeaderConfig())
      .then((res) => {
        const districtList = res.data?.filter(
          (item) => item.provinceCode == provinceCode
        );
        const districtSort = districtList.sort((a,b)=>a.id-b.id)
        dispatch(setDistrictBeneListAdd(districtSort));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const setDistrictBeneListEdit = (data) => {
  return {
    type: GET_DISTRICTBENE_LIST_EDIT,
    payload: data,
  };
};
export const FetchDistrictBeneListEdit = (provinceCode) => {
  const districtListUrl = DISTRICT_LIST_URL;
  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {

    await axios
      .get(districtListUrl, getHeaderConfig())
      .then((res) => {
        const districtList = res.data?.filter(
          (item) => item.provinceCode == provinceCode
        );
        const districtSort = districtList.sort((a,b)=>a.id-b.id)
        dispatch(setDistrictBeneListEdit(districtSort));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

//Sub District Bene

export const setSubDistrictBeneList = (data) => {
  return {
    type: GET_SUB_DISTRICTBENE_LIST,
    payload: data,
  };
};
export const FetchSubDistrictBeneList = (districtCode, provinceCode) => {
  const subDistrictListUrl = SUB_DISTRICT_LIST_URL;
  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {
    await axios
      .get(subDistrictListUrl, getHeaderConfig())
      .then((res) => {
        const subdistrictList = res.data?.filter(
          (item) =>
            item.provinceCode == provinceCode &&
            item.districtCode == districtCode
        );
        const subDistrictSort = subdistrictList.sort((a,b)=> a.id-b.id)
        dispatch(setSubDistrictBeneList(subDistrictSort));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const FetchSubDistrictBeneListAll = (districtCode, provinceCode) => {
  const subDistrictListUrl = SUB_DISTRICT_LIST_URL;
  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {
    await axios
      .get(subDistrictListUrl, getHeaderConfig())
      .then((res) => {
        const subdistrictList = res.data?.sort((a,b)=> a.id - b.id)
        dispatch(setSubDistrictBeneListAll(subdistrictList));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};
export const setSubDistrictBeneListAll = (data) => {
  return {
    type: GET_SUB_DISTRICTBENE_LIST_ALL,
    payload: data,
  };
};

export const setSubDistrictBeneListAdd = (data) => {
  return {
    type: GET_SUB_DISTRICTBENE_LIST_ADD,
    payload: data,
  };
};
export const FetchSubDistrictBeneListAdd = (districtCode, provinceCode) => {
  const subDistrictListUrl = SUB_DISTRICT_LIST_URL;
  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {
    await axios
      .get(subDistrictListUrl, getHeaderConfig())
      .then((res) => {
        const subdistrictList = res.data?.filter(
          (item) =>
            item.provinceCode == provinceCode &&
            item.districtCode == districtCode
        );
        const subDistrictSort = subdistrictList.sort((a,b)=> a.id-b.id)
        dispatch(setSubDistrictBeneListAdd(subDistrictSort));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const setSubDistrictBeneListEdit = (data) => {
  return {
    type: GET_SUB_DISTRICTBENE_LIST_EDIT,
    payload: data,
  };
};
export const FetchSubDistrictBeneListEdit = (districtCode, provinceCode) => {
  const subDistrictListUrl = SUB_DISTRICT_LIST_URL;
  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {
    await axios
      .get(subDistrictListUrl, getHeaderConfig())
      .then((res) => {
        const subdistrictList = res.data?.filter(
          (item) =>
            item.provinceCode == provinceCode &&
            item.districtCode == districtCode
        );
        const subDistrictSort = subdistrictList.sort((a,b)=> a.id-b.id)
        dispatch(setSubDistrictBeneListEdit(subDistrictSort));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

//PostCode Bene

export const setPostcodeBeneList = (data) => {
  return {
    type: GET_POSTCODEBENE_LIST,
    payload: data,
  };
};
export const FetchPostcodeBeneList = (provinceCode) => {
  // const postCode = `${DEVICE_MANAGEMENT_URL}/${provinceCode}/postcode`
  // const postCodeURL = `http://10.40.76.217/dev/api/ugt/v1/geography/geography.json`;
  const postCodeURL = `${POSTCODE_LIST_URL}`;

  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {

    await axios
      .get(postCodeURL, getHeaderConfig())
      .then((res) => {
        const postCodeList = res?.data.map((item) => {
          return { ...item, postCodeDisplay: item.postalCode };
        }); //เพิ่ม key postCodeDisplay สำหรับใช้กับ control select

        dispatch(setPostcodeBeneList(postCodeList));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const setPostcodeBeneListAdd = (data) => {
  return {
    type: GET_POSTCODEBENE_LIST_ADD,
    payload: data,
  };
};
export const FetchPostcodeBeneListAdd = (provinceCode) => {
  // const postCode = `${DEVICE_MANAGEMENT_URL}/${provinceCode}/postcode`
  // const postCodeURL = `http://10.40.76.217/dev/api/ugt/v1/geography/geography.json`;
  const postCodeURL = `${POSTCODE_LIST_URL}`;

  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {

    await axios
      .get(postCodeURL, getHeaderConfig())
      .then((res) => {
        const postCodeList = res?.data.map((item) => {
          return { ...item, postCodeDisplay: item.postalCode };
        }); //เพิ่ม key postCodeDisplay สำหรับใช้กับ control select

        dispatch(setPostcodeBeneListAdd(postCodeList));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const setPostcodeBeneListEdit = (data) => {
  return {
    type: GET_POSTCODEBENE_LIST_EDIT,
    payload: data,
  };
};
export const FetchPostcodeBeneListEdit = (provinceCode) => {
  // const postCode = `${DEVICE_MANAGEMENT_URL}/${provinceCode}/postcode`
  // const postCodeURL = `http://10.40.76.217/dev/api/ugt/v1/geography/geography.json`;
  const postCodeURL = `${POSTCODE_LIST_URL}`;

  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {

    await axios
      .get(postCodeURL, getHeaderConfig())
      .then((res) => {
        const postCodeList = res?.data.map((item) => {
          return { ...item, postCodeDisplay: item.postalCode };
        }); //เพิ่ม key postCodeDisplay สำหรับใช้กับ control select

        dispatch(setPostcodeBeneListEdit(postCodeList));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

//Province Bene

export const setProvinceBeneList = (data) => {
  return {
    type: GET_PROVINCEBENE_LIST,
    payload: data,
  };
};
export const FetchProvinceBeneList = (countryID) => {
  const thailandID = 764;
  const provinceListUrl = PROVINCE_LIST_URL;
  // const provinceListUrl = `${DEVICE_MANAGEMENT_URL}/${countryID}/province`
  if (countryID == thailandID) {
    return async (dispatch) => {
      //dispatch(makeRequest());
      //setTimeout(() => {

      await axios
        .get(provinceListUrl, getHeaderConfig())
        .then((res) => {
          const datas = res?.data
          datas.sort((a,b)=>a.id - b.id)
          dispatch(setProvinceBeneList(datas));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
      // }, 2000);
    };
  } else {
    return async (dispatch) => {
      dispatch(setProvinceList([]));
    };
  }
};

export const setProvinceBeneListAdd = (data) => {
  return {
    type: GET_PROVINCEBENE_LIST_ADD,
    payload: data,
  };
};
export const FetchProvinceBeneListAdd = (countryID) => {
  const thailandID = 764;
  const provinceListUrl = PROVINCE_LIST_URL;
  // const provinceListUrl = `${DEVICE_MANAGEMENT_URL}/${countryID}/province`
  if (countryID == thailandID) {
    return async (dispatch) => {
      //dispatch(makeRequest());
      //setTimeout(() => {

      await axios
        .get(provinceListUrl, getHeaderConfig())
        .then((res) => {
          const datas = res?.data
          datas.sort((a,b)=>a.id - b.id)
          dispatch(setProvinceBeneListAdd(datas));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
      // }, 2000);
    };
  } else {
    return async (dispatch) => {
      dispatch(setProvinceList([]));
    };
  }
};

export const setProvinceBeneListEdit = (data) => {
  return {
    type: GET_PROVINCEBENE_LIST_EDIT,
    payload: data,
  };
};
export const FetchProvinceBeneListEdit = (countryID) => {
  const thailandID = 764;
  const provinceListUrl = PROVINCE_LIST_URL;
  // const provinceListUrl = `${DEVICE_MANAGEMENT_URL}/${countryID}/province`
  if (countryID == thailandID) {
    return async (dispatch) => {
      //dispatch(makeRequest());
      //setTimeout(() => {

      await axios
        .get(provinceListUrl, getHeaderConfig())
        .then((res) => {
          const datas = res?.data
          datas.sort((a,b)=>a.id - b.id)
          dispatch(setProvinceBeneListEdit(datas));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
      // }, 2000);
    };
  } else {
    return async (dispatch) => {
      dispatch(setProvinceList([]));
    };
  }
};

//Subscriber History Log
export const setHistoryLogAtive=(data)=>{
  return {
    type: GET_HISTORY_LOG_ACTIVE,
    payload: data,
  };
}

export const FetchHistoryLogActive = (subscriberId)=>{
  const URL = `${HISTORY_URL}/${subscriberId}&Y`;
  console.log("URL Info",URL)
  return async (dispatch) => {
    await axios
      .get(URL)
      .then((response) => {
        if (response?.status == 200) {
          dispatch(setHistoryLogAtive(response.data));
          //callback && callback(response, null);
          console.log("Log Active", response);
        } else {
          callback && callback(response, response?.statusText);
        }
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
        callback && callback(null, error);
      });
  };
}

export const setHistoryLogInactive=(data)=>{
  return {
    type: GET_HISTORY_LOG_INACTIVE,
    payload: data,
  };
}

export const FetchHistoryLogInactive = (subscriberId)=>{
  const URL = `${HISTORY_URL}/${subscriberId}&N`;
  console.log("URL Info",URL)
  return async (dispatch) => {
    await axios
      .get(URL)
      .then((response) => {
        if (response?.status == 200) {
          dispatch(setHistoryLogInactive(response.data));
          //callback && callback(response, null);
          console.log("Log Inactive", response);
        } else {
          callback && callback(response, response?.statusText);
        }
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
        callback && callback(null, error);
      });
  };
}

export const setBinaryFileHistory = (data) =>{
  return {
    type: GTE_BINARY_FILE_HISTORY,
    payload: data,
  };
}

export const GetBinaryFileHistory = (guid,callback) =>{
  const URL = `${BINARY_FILE_HISTORY_URL}/${guid}`;
  console.log("URL Info",URL)
  return async (dispatch) => {
    await axios
      .get(URL)
      .then((response) => {
        if (response?.status == 200) {
          dispatch(setBinaryFileHistory(response.data));
          callback && callback(response, null);
          console.log("Binary File", response);
        } else {
          callback && callback(response, response?.statusText);
        }
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
        callback && callback(null, error);
      });
  };
}

// Withdrawn Subscriber
export const withDrawSubscriber = (data) => {
  return {
    type: WITHDRAWN_SUBSCRIBER_STATUS,
    data: data,
  };
};
export const FunctionwithDrawSubscriber = (id, callback) => {
  const subscriberID = id;
  const URL = WITHDRAWN_SUBSCRIBER_URL+"/"+subscriberID;
  return async (dispatch) => {
    await axios.post(URL).then(
      (response) => {
        console.log("Response Create Statue",response?.status)
        if (response?.status == 200 || response?.status == 201) {
          console.log("Create Success")
          dispatch(withDrawSubscriber(response?.data));
          toast.success("Withdraw Subscriber Complete!", {
            position: "top-right",
            autoClose: 3000,
            style: {
              border: "1px solid #a3d744", // Green border similar to the one in your image
              color: "#6aa84f", // Green text color
              fontSize: "16px", // Adjust font size as needed
              backgroundColor: "##FFFFFF", // Light green background
            }, // 3 seconds
          });
        } else {
          console.log("Create not success")
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
        console.log("Create Error")
        dispatch(setOpenFailModal());
        dispatch(failRequest(error.message));
        callback && callback(error);
      }
    );
  };
};

// Renew Subscriber
export const renewSubscriber = (data) => {
  return {
    type: RENEW_SUBSCRIBER_STATUS,
    data: data,
  };
};
export const FunctionRenewSubscriber = (data, id, callback) => {
  const param = data;
  const URL = RENEW_SUBSCRIBER_URL;
  const renewSubscriberURL = `${URL}/${id}`;
  return async (dispatch) => {
    //  await axios.post(URL, param ,getHeaderConfig())
    await axios.put(renewSubscriberURL, param).then(
      (response) => {
        if (response?.status == 200 || response?.status == 201) {
          dispatch(renewSubscriber(response?.data));
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
        console.log("error>>>>", error);

        // ststus error here
        // 400
        // 500
        dispatch(setOpenFailModal());
        dispatch(failRequest(error.message));
        callback && callback(error);
      }
    );
  };
};

// Renew AggregateSubscriber
export const renewAggregateSubscriber = (data) => {
  return {
    type: RENEW_AGGREGATE_STATUS,
    data: data,
  };
};
export const FunctionRenewAggregateSubscriber = (data, id, callback) => {
  const param = data;
  const URL = RENEW_AGGREGATE_URL;
  const renewSubscriberURL = `${URL}/${id}`;
  return async (dispatch) => {
    await axios.put(renewSubscriberURL, param).then(
      (response) => {
        if (response?.status == 200 || response?.status == 201) {
          dispatch(renewAggregateSubscriber(response?.data));
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
        console.log("error>>>>", error);

        // ststus error here
        // 400
        // 500
        dispatch(setOpenFailModal());
        dispatch(failRequest(error.message));
        callback && callback(error);
      }
    );
  };
};
//Renew Info
export const getSubscriberRenewInfo = (data) => {
  return {
    type: GET_RENEW_SUBSCRIBER_INFO,
    payload: data,
  };
};
export const SubscriberRenewInfo = (id, callback) => {
  
  const URL = `${RENEW_SUBSCRIBER_INFO_URL}/${id}`;
  console.log("URL Info",URL)
  return async (dispatch) => {
    await axios
      .get(URL)
      .then((response) => {
        if (response?.status == 200) {
          dispatch(getSubscriberRenewInfo(response.data));
          callback && callback(response, null);
          console.log("dddd", response);
        } else {
          callback && callback(response, response?.statusText);
        }
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
        callback && callback(null, error);
      });
  };
};
//Renew Edit Info
export const getSubscriberRenewEditInfo = (data) => {
  return {
    type: GET_RENEW_EDIT_SUBSCRIBER_INFO,
    payload: data,
  };
};
export const SubscriberRenewEditInfo = (id, callback) => {
  
  const URL = `${RENEW_EDIT_SUBSCRIBER_INFO_URL}/${id}`;
  console.log("URL Info",URL)
  return async (dispatch) => {
    await axios
      .get(URL)
      .then((response) => {
        if (response?.status == 200) {
          dispatch(getSubscriberRenewEditInfo(response.data));
          callback && callback(response, null);
          console.log("dddd", response);
        } else {
          callback && callback(response, response?.statusText);
        }
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
        callback && callback(null, error);
      });
  };
};