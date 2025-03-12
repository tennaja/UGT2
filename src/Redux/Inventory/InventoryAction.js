import axios from "axios"
import Swal from 'sweetalert2'
import {
    INVENTORY_LIST,
    INVENTORY_DETAIL_FILTER,
    INVENTORY_DETAIL_DATA,
    INVENTORY_DETAIL_DATA_POPUP,
    INVENTORY_DETAIL_EXCEL,
    INVENTORY_INFO_FILTER,
    INVENTORY_INFO_EXCEL,
    INVENTORY_INFO_CARD,
    INVENTORY_INFO_GRAPH
} from '../../Constants/ServiceURL'

import {
    FAIL_REQUEST,
    GET_INVENTORY_LIST,
    GET_PORTFOLIO_LIST_DROPDOWN,
    GET_INVENTORY_DETAIL_FILTER,
    GET_INVENTORY_DETAIL_DATA,
    GET_INVENTORY_DETAIL_DROPDOWN,
    GET_INVENTORY_DETAIL_DATA_POPUP,
    GET_INVENTORY_INFO_FILTER,
    GET_INVENTORY_INFO_CARD,
    GET_INVENTORY_INFO_GRAPH
} from "../ActionType"

import { getHeaderConfig } from "../../Utils/FuncUtils"

export const failRequest = (err) => {
    return {
        type: FAIL_REQUEST,
        payload: err
    }
}

// Inventory List
export const _getInventoryList = (data) => {
    //console.log(data)
    return {
      type: GET_INVENTORY_LIST,
      payload: data,
    };
  };

export const getInventoryList = (data, callback) => {
    /*Swal.fire({
        title: 'Please Wait...',
        html: `กำลังโหลด...`,
        allowOutsideClick: false,
        showConfirmButton: false,
        timerProgressBar: true,
        backdrop: `
    rgba(0,0,0,0.4) !important
  `,
        didOpen: () => {
            Swal.showLoading();
            // ✅ ปรับ z-index ให้ Swal อยู่หน้าสุด
    document.querySelector(".swal2-container").style.zIndex = "9999";
    document.querySelector(".swal2-popup").style.zIndex = "10000";
        },
    })*/
    const param = data;
    const URL = INVENTORY_LIST;
    return async (dispatch) => {
      await axios.post(URL, param).then(
        (response) => {
          //console.log("Response Create Statue",response?.status)
          if (response?.status == 200 ) {
           // console.log("Create Success")
            //console.log(response?.data)
            dispatch(_getInventoryList(response?.data));
          } else {
            //console.log("Create not success")
            //dispatch(setOpenFailModal());
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          //console.log("Create Error")
          //dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
          callback && callback(error);
        }
      ).finally(() => {
        /*setTimeout(() => {
            Swal.close()
        }, 300);*/
    });;
    };
};

//Get Inventory Info Filter
export const _getInventoryInfoFilter = (data) => {
    return {
        type: GET_INVENTORY_INFO_FILTER,
        payload: data
    }
}

export const getInventoryInfoFilter = (roleId,utilityId) => {

    const URL = `${INVENTORY_INFO_FILTER}?RoleId=${roleId}&UtilityId=${utilityId}`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getInventoryInfoFilter(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

//Get Inventory Info Card
export const _getInventoryInfoCard = (data) => {
    return {
        type: GET_INVENTORY_INFO_CARD,
        payload: data
    }
}

export const getInventoryInfoCard = (data, callback) => {
    const param = data;
    const URL = INVENTORY_INFO_CARD;
    Swal.fire({
        title: 'Please Wait...',
        html: `กำลังโหลด...`,
        allowOutsideClick: false,
        showConfirmButton: false,
        timerProgressBar: true,
        backdrop: `
    rgba(0,0,0,0.4) !important
  `,
        didOpen: () => {
            Swal.showLoading();
            // ✅ ปรับ z-index ให้ Swal อยู่หน้าสุด
    document.querySelector(".swal2-container").style.zIndex = "9999";
    document.querySelector(".swal2-popup").style.zIndex = "10000";
        },
    })
    return async (dispatch) => {
      await axios.post(URL, param).then(
        (response) => {
          //console.log("Response Create Statue",response?.status)
          if (response?.status == 200) {
            //console.log("Create Success")
            //console.log(response?.data)
            dispatch(_getInventoryInfoCard(response?.data));
          } else {
            //console.log("Create not success")
            //dispatch(setOpenFailModal());
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          //console.log("Create Error")
          //dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
          callback && callback(error);
        }
      ).catch((error) => {
        dispatch(failRequest(error.message))
    }).finally(() => {
        setTimeout(() => {
            Swal.close()
        }, 300);
    });;
    };
};

//Get Inventory Info Graph
export const _getInventoryInfoGraph = (data) => {
    return {
        type: GET_INVENTORY_INFO_GRAPH,
        payload: data
    }
}

export const getInventoryInfoGraph = (data, callback) => {
    const param = data;
    const URL = INVENTORY_INFO_GRAPH;
    return async (dispatch) => {
      await axios.post(URL, param).then(
        (response) => {
          //console.log("Response Create Statue",response?.status)
          if (response?.status == 200 || response?.status == 201) {
            //console.log("Create Success")
            //console.log(response?.data)
            dispatch(_getInventoryInfoGraph(response?.data));
          } else {
           // console.log("Create not success")
            //dispatch(setOpenFailModal());
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          //console.log("Create Error")
          //dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
          callback && callback(error);
        }
      );
    };
};

//Get Inventory List Dropdown
export const _getInventoryDropdownList = (data) => {
    //console.log(data)
    return {
      type: GET_PORTFOLIO_LIST_DROPDOWN,
      payload: data,
    };
  };

export const getInventoryDropdownList = (data, callback) => {
    const param = data;
    const URL = INVENTORY_LIST;
    return async (dispatch) => {
      await axios.post(URL, param).then(
        (response) => {
          //console.log("Response Create Statue",response?.status)
          if (response?.status == 200 || response?.status == 201) {
            //console.log("Create Success")
            //console.log(response?.data)
            dispatch(_getInventoryDropdownList(response?.data));
          } else {
            //console.log("Create not success")
            //dispatch(setOpenFailModal());
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          //console.log("Create Error")
          //dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
          callback && callback(error);
        }
      );
    };
};

//Get Inventory Detail Filter
export const _getInventoryDetailFilter = (data) => {
    return {
        type: GET_INVENTORY_DETAIL_FILTER,
        payload: data
    }
}

export const getInventoryDetailFilter = (ugtGroupId, portfolioId,roleId,utilityId) => {

    const URL = `${INVENTORY_DETAIL_FILTER}/${ugtGroupId}?portfolioId=${portfolioId}&RoleId=${roleId}&UtilityId=${utilityId}`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getInventoryDetailFilter(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

//Data Detail
export const _getInventoryDetailData = (data) => {
    //console.log(data)
    return {
      type: GET_INVENTORY_DETAIL_DATA,
      payload: data,
    };
  };

export const getInventoryDetailData = (data, callback) => {
    Swal.fire({
            title: 'Please Wait...',
            html: `กำลังโหลด...`,
            allowOutsideClick: false,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
        })
    
    const param = data;
    const URL = INVENTORY_DETAIL_DATA;
    return async (dispatch) => {
      await axios.post(URL, param).then(
        (response) => {
          //console.log("Response Create Statue",response?.status)
          if (response?.status == 200 || response?.status == 201) {
            dispatch(_getInventoryDetailData(response?.data));
          } else {
            //console.log("Create not success")
            //dispatch(setOpenFailModal());
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          //console.log("Create Error")
          //dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
          callback && callback(error);
        }
      ).catch((error) => {
                  dispatch(failRequest(error.message))
              }).finally(() => {
                  setTimeout(() => {
                      Swal.close()
                  }, 300);
              });
    };
};

//Data Detail Dropdown
export const _getInventoryDetailDropdown = (data) => {
    //console.log(data)
    return {
      type: GET_INVENTORY_DETAIL_DROPDOWN,
      payload: data,
    };
  };

export const getInventoryDetailDropdown = (data, callback) => {

    const param = data;
    const URL = INVENTORY_DETAIL_DATA;
    return async (dispatch) => {
      await axios.post(URL, param).then(
        (response) => {
          //console.log("Response Create Statue",response?.status)
          if (response?.status == 200 || response?.status == 201) {
            dispatch(_getInventoryDetailDropdown(response?.data));
          } else {
            //console.log("Create not success")
            //dispatch(setOpenFailModal());
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          //console.log("Create Error")
          //dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
          callback && callback(error);
        }
      );
    };
};

//Get Inventory Detail Popup
export const _getInventoryDetailPopup = (data) => {
    return {
        type: GET_INVENTORY_DETAIL_DATA_POPUP,
        payload: data
    }
}

export const getInventoryDetailPopup = (portfolioId, deviceId, year,month,unit,convertUnit,roleId,utilityId) => {

    const URL = `${INVENTORY_DETAIL_DATA_POPUP}?PortfolioId=${portfolioId}&DeviceId=${deviceId}&Year=${year}&Month=${month}&UnitPrefix=${unit}&Unit=${convertUnit}&RoleId=${roleId}&UtilityId=${utilityId}`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getInventoryDetailPopup(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

//Download Excel Detail
export const downloadExcelInventoryDetail = (data, callback) => {
    Swal.fire({
        title: 'Please Wait...',
        html: `กำลังโหลด...`,
        allowOutsideClick: false,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        },
    })
    const param = data;
    const URLLINK = INVENTORY_DETAIL_EXCEL;
    return async (dispatch) => {
      await axios.post(URLLINK, param).then(
        (response) => {
          //console.log("Response Create Statue",response?.status)
          if (response?.status == 200 || response?.status == 201) {
            //console.log(response)
            const binaryString = atob(response.data);
            const binaryLength = binaryString.length;
            const bytes = new Uint8Array(binaryLength);

            for (let i = 0; i < binaryLength; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "ExportReport_"+data.startDate+"_"+data.endDate+".xlsx";
            link.click();
            URL.revokeObjectURL(link.href);

          } else {
            //console.log("Create not success")
            //dispatch(setOpenFailModal());
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          //console.log("Create Error")
          //dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
          callback && callback(error);
        }
      ).catch((error) => {
        dispatch(failRequest(error.message))
    }).finally(() => {
        setTimeout(() => {
            Swal.close()
        }, 300);
    });
    };
};

//Download Excel INFO
export const downloadExcelInventoryInfo = (data, callback) => {
    Swal.fire({
        title: 'Please Wait...',
        html: `กำลังโหลด...`,
        allowOutsideClick: false,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        },
    })
    const param = data;
    const URLLINK = INVENTORY_INFO_EXCEL;
    return async (dispatch) => {
      await axios.post(URLLINK, param).then(
        (response) => {
          //console.log("Response Create Statue",response?.status)
          if (response?.status == 200 || response?.status == 201) {
            //console.log(response)
            const binaryString = atob(response.data);
            const binaryLength = binaryString.length;
            const bytes = new Uint8Array(binaryLength);

            for (let i = 0; i < binaryLength; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "ExportReport_"+data.startDate+"_"+data.endDate+".xlsx";
            link.click();
            URL.revokeObjectURL(link.href);

          } else {
            //console.log("Create not success")
            //dispatch(setOpenFailModal());
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          //console.log("Create Error")
          //dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
          callback && callback(error);
        }
      ).catch((error) => {
        dispatch(failRequest(error.message))
    }).finally(() => {
        setTimeout(() => {
            Swal.close()
        }, 300);
    });
    };
};