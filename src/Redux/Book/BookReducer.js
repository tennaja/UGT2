import { FAIL_REQUEST, MAKE_REQUEST,ADD_STATUS, DELETE_STATUS, GET_STATUS_OBJ, UPDATE_STATUS} from "../../Redux/ActionType"

const initialstate = {
    loading: true,

    booklist: [],
    bookobj: {},
    errmessage: ''
}

export const BookReducer = (state = initialstate, action) => {

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
        
            // case GET_STATUS_LIST:return {
            //         loading: false,
            //         errmessage: '',
            //         booklist:action.payload,
            //         bookobj:{}
            //     }
            case ADD_STATUS:return{
                    ...state,
                    loading:false
            }    

            case DELETE_STATUS:return{
                ...state,
                loading:false
            }
     
            case GET_STATUS_OBJ:return{
                ...state,
                loading:false,
                bookobj:action.payload
            }

            case UPDATE_STATUS:return{
                ...state,
                loading:false
            }
        default: return state
    }
}