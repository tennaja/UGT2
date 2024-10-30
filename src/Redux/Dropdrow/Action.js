import axios from "axios";
//simport { toast } from "react-toastify"

import {
  FAIL_REQUEST,
  GET_DROPDROW_LIST,
  MAKE_REQUEST,
  GET_POSTCODE_LIST,
  GET_COUNTRY_LIST,
  GET_PROVINCE_LIST,
  SET_DISTRICT_LIST,
  SET_SUB_DISTRICT_LIST,
  GET_COUNTRY_LIST_ADD,
} from "../../Redux/ActionType";
import {
  SUB_DISTRICT_LIST_URL,
  DISTRICT_LIST_URL,
  PROVINCE_LIST_URL,
  FORM_MASTTER_URL,
  COUNTRY_LIST_URL,
  POSTCODE_LIST_URL,
} from "../../Constants/ServiceURL";
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

export const setDropdrowList = (data) => {
  return {
    type: GET_DROPDROW_LIST,
    payload: data,
  };
};

export const setProvinceList = (data) => {
  return {
    type: GET_PROVINCE_LIST,
    payload: data,
  };
};

export const setCountryList = (data) => {
  return {
    type: GET_COUNTRY_LIST,
    payload: data,
  };
};

export const setCountryListAdd = (data) => {
  return {
    type: GET_COUNTRY_LIST_ADD,
    payload: data,
  };
};

export const setPostcodeList = (data) => {
  return {
    type: GET_POSTCODE_LIST,
    payload: data,
  };
};

export const setDistrictList = (data) => {
  return {
    type: SET_DISTRICT_LIST,
    payload: data,
  };
};

export const setSubDistrictList = (data) => {
  return {
    type: SET_SUB_DISTRICT_LIST,
    payload: data,
  };
};

export const FetchDeviceDropdrowList = () => {
  return async (dispatch) => {
    //dispatch(makeRequest());
    //setTimeout(() => {
    // const fromMasterURL = FORM_MASTTER_URL
    // const fromMasterURL =  'http://10.40.76.217/dev/api/ugt/v1/device-management/form-master'
    const fromMasterURL = `${FORM_MASTTER_URL}`;
    await axios
      .get(fromMasterURL, getHeaderConfig())
      .then((res) => {
        dispatch(setDropdrowList(res.data.formMaster));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const FetchCountryList = () => {
  // const countryListURL =
  //   "http://10.40.76.217/dev/api/ugt/v1/countries-code/en/world.json";

  const countryListURL = `${COUNTRY_LIST_URL}`;
  return async (dispatch) => {
    //setTimeout(() => {
    await axios
      .get(`${countryListURL}`, getHeaderConfig())
      .then((res) => {
        const datas = res?.data
          datas.sort((a,b)=>a.id - b.id)
        dispatch(setCountryList(datas));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const FetchCountryListAdd = () => {
  // const countryListURL =
  //   "http://10.40.76.217/dev/api/ugt/v1/countries-code/en/world.json";

  const countryListURL = `${COUNTRY_LIST_URL}`;
  return async (dispatch) => {
    //setTimeout(() => {
    await axios
      .get(`${countryListURL}`, getHeaderConfig())
      .then((res) => {
        dispatch(setCountryListAdd(res?.data));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const FetchProvinceList = (countryID) => {
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
          datas.sort((a,b)=>a.provinceNameEn - b.provinceNameEn)
          dispatch(setProvinceList(datas));
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

export const FetchDistrictList = (provinceCode) => {
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
        const datas = districtList
          datas.sort((a,b)=>a.districtNameEn - b.districtNameEn)
        dispatch(setDistrictList(datas));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const FetchSubDistrictList = (districtCode, provinceCode) => {
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
        const datas = subdistrictList
          datas.sort((a,b)=>a.subdistrictNameEn - b.subdistrictNameEn)
        dispatch(setSubDistrictList(datas));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};

export const FetchPostcodeList = (provinceCode) => {
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
        const datas = postCodeList
          datas.sort((a,b)=>a.id - b.id)
        dispatch(setPostcodeList(datas));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
    // }, 2000);
  };
};
