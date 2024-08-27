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
} from "../../Constants/ServiceURL";
import { getHeaderConfig } from "../../Utils/FuncUtils";

export const optimizeParam = (param) => {
  let optimizeParam = "?";
  for (let key in param) {
    optimizeParam += key + "=" + param[key] + "&";
  }
  optimizeParam = optimizeParam.slice(0, -1);
  return optimizeParam;
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
  let queryStringUtilityId = "";
  if (findUtilityId.utility?.length > 0) {
    findUtilityId.utility.forEach((element) => {
      queryStringUtilityId += `findUtilityId=${element}` + "&";
    });
    queryStringUtilityId = queryStringUtilityId.slice(0, -1);
  }
  const URL = `${DASHBOARD_LIST_URL}/${UgtGroupId}?${queryStringUtilityId}`;
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
  const defualtParam = {
    findUgtGroupId: fetchParameter.findUgtGroupId,
    PageSize: fetchParameter.PageSize,
    PageNumber: fetchParameter.PageNumber,
  };
  const filterParam = {
    findStatusId: fetchParameter.findStatusId,
    findUtilityId: fetchParameter.findUtilityId,
  };
  let queryStringUtilityId = "";
  let queryStringStatusId = "";

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
  const URL = `${ASSIGN_LIST_URL}${optimizeParam(
    defualtParam
  )}&${queryStringUtilityId}&${queryStringStatusId}`;
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
  const defualtParam = {
    findUgtGroupId: fetchParameter.findUgtGroupId,
    PageSize: fetchParameter.PageSize,
    PageNumber: fetchParameter.PageNumber,
  };
  const filterParam = {
    findStatusId: fetchParameter.findStatusId,
    findUtilityId: fetchParameter.findUtilityId,
  };
  let queryStringUtilityId = "";
  let queryStringStatusId = "";

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
  const URL = `${UNASSIGN_LIST_URL}${optimizeParam(
    defualtParam
  )}&${queryStringUtilityId}&${queryStringStatusId}`;

  return async (dispatch) => {
    await axios.get(URL).then(
      (response) => {
        if (response?.status == 200) {
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
export const SubscriberInfo = (id, callback) => {
  const URL = `${SUBSCRIBER_INFO_URL}/${id}`;
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
        if (response?.status == 200 || response?.status == 201) {
          dispatch(createSubscriber(response?.data));
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.status);
      },
      (error) => {
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
        dispatch(setDistrictBeneList(districtList));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

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
        dispatch(setSubDistrictBeneList(subdistrictList));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

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
          dispatch(setProvinceBeneList(res?.data));
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
