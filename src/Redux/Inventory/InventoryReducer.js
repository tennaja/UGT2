import { FAIL_REQUEST, 
    GET_INVENTORY_LIST,
    GET_PORTFOLIO_LIST_DROPDOWN,
    GET_INVENTORY_DETAIL_FILTER,
    GET_INVENTORY_DETAIL_DATA,
    GET_INVENTORY_DETAIL_DROPDOWN,
    GET_INVENTORY_DETAIL_DATA_POPUP,
    GET_INVENTORY_INFO_FILTER,
    GET_INVENTORY_INFO_CARD,
    GET_INVENTORY_INFO_GRAPH} from "../../Redux/ActionType"

const initialstate = {
    loading: true,
    inventoryList: [],
    inventoryInfoFilter:{},
    inventoryInfoCard:{},
    inventoryInfoGraph:[],
    inventoryDropdownList: [],
    inventoryDetailFilter:{},
    inventoryDetailData:[],
    inventoryDetailDropdownList:[],
    inventoryDetailPopup:{},
}

export const InventoryReducer = (state = initialstate, action) => {
    switch (action.type) {
        case FAIL_REQUEST:
            return {
                ...state,
                loading: false,
                errmessage: action.payload
            }
        case GET_INVENTORY_LIST:
            return {
                ...state,
                inventoryList: action.payload
            }
        case GET_INVENTORY_INFO_CARD:
            return {
                ...state,
                inventoryInfoCard: action.payload
            }
        case GET_INVENTORY_INFO_GRAPH:
            return {
                ...state,
                inventoryInfoGraph: action.payload
            }
        case GET_INVENTORY_INFO_FILTER:
            return{
                ...state,
                inventoryInfoFilter: action.payload
            }
        case GET_PORTFOLIO_LIST_DROPDOWN:
            return {
                ...state,
                inventoryDropdownList: action.payload
            }
        case GET_INVENTORY_DETAIL_FILTER:
            return {
                ...state,
                inventoryDetailFilter: action.payload
            }
        case GET_INVENTORY_DETAIL_DATA:
            return {
                ...state,
                inventoryDetailData: action.payload
            }
        case GET_INVENTORY_DETAIL_DROPDOWN:
            return {
                ...state,
                inventoryDetailDropdownList: action.payload
            }
        case GET_INVENTORY_DETAIL_DATA_POPUP:
            return {
                ...state,
                inventoryDetailPopup: action.payload
            }
        default: return state
    }
}
