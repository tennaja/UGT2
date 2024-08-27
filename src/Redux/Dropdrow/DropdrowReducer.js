import { FAIL_REQUEST, MAKE_REQUEST,GET_DROPDROW_LIST,GET_POSTCODE_LIST,GET_COUNTRY_LIST,GET_PROVINCE_LIST,SET_SUB_DISTRICT_LIST,SET_DISTRICT_LIST } from "../ActionType"

const initialstate = {
    loading: true,

    dropDrowList: [],
    dropDrowobj: {},
    provinceList:[],
    countryList:[],
    postcodeList:[],
    districtList:[],
    subDistrictList:[],
    errmessage: ''
}

export const DropdrowReducer = (state = initialstate, action) => {

    switch (action.type) {
        case MAKE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FAIL_REQUEST:
            return {
                ...state,
                loading: false,
                errmessage: action.payload
            }
        
            case GET_DROPDROW_LIST:return {
                ...state,
                    loading: false,
                    errmessage: '',
                    dropDrowList:action.payload,
                    deviceobj:{}
                }
                case GET_COUNTRY_LIST:return {
                    ...state,
                    loading: false,
                    countryList:action.payload

                }
                case GET_PROVINCE_LIST:return {
                    ...state,
                    loading: false,
                    errmessage: '',
                    provinceList:action.payload

                }
                case GET_POSTCODE_LIST:return {
                    ...state,
                    loading: false,
                    errmessage: '',
                    postcodeList:action.payload

                }
                case SET_DISTRICT_LIST:return {
                    ...state,
                    loading: false,
                    errmessage: '',
                    districtList:action.payload

                }
                case SET_SUB_DISTRICT_LIST:return {
                    ...state,
                    loading: false,
                    errmessage: '',
                    subDistrictList:action.payload

                }

 

       
        default: return state
    }
}