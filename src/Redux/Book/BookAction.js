import axios from "axios"
//simport { toast } from "react-toastify"

import { ADD_STATUS, DELETE_STATUS, FAIL_REQUEST, GET_STATUS_OBJ, MAKE_REQUEST, UPDATE_STATUS } from "../../Redux/ActionType"


export const makeRequest=()=>{
    return{
        type:MAKE_REQUEST
    }
}
export const failRequest=(err)=>{
    return{
        type:FAIL_REQUEST,
        payload:err
    }
}



// export const getBookList=(data)=>{
//   return{
//       type:GET_STATUS_LIST,
//       payload:data
//   }
// }
export const addBook=()=>{
  return{
      type:ADD_STATUS
  }
}
export const deleteBook=()=>{
  return{
      type:DELETE_STATUS
  }
}

export const getBookObj=(data)=>{
  return{
      type:GET_STATUS_OBJ,
      payload:data
  }
}

export const updateBook=()=>{
  return{
      type:UPDATE_STATUS
  }
}



/*BOOK */
export const FetchBookList=()=>{
 
  return (dispatch)=>{
    //dispatch(makeRequest());
    //setTimeout(() => {
    
      axios.get('https://localhost:7251/Books/GetBookAll').then(res=>{
          const booklist=res.data.bookList;
       
          dispatch(getBookList(booklist));
        }).catch(err=>{
          dispatch(failRequest(err.message))
        })
   // }, 2000);
   
  }
}

export const FunctionAddBook=(data)=>{
  return (dispatch)=>{
    dispatch(makeRequest());
    //setTimeout(() => {
      axios.post('https://localhost:7251/Books/InsertBook',data).then(res=>{
    
          dispatch(addBook());
         // toast.success('User Added successfully.')
        }).catch(err=>{
          dispatch(failRequest(err.message))
        })
   // }, 2000);
   
  }
}

export const Removebook=(code)=>{
  return (dispatch)=>{
    dispatch(makeRequest());

    //setTimeout(() => {

 
        axios.post('https://localhost:7251/Books/DeleteBook', {
          id: code.id
        
      })
      .then((response) => {

        dispatch(deleteBook());
      }, (error) => {
        dispatch(failRequest(error.message))
      });
   // }, 2000);
   
  }


  
}
export const FetchBookObj=(code)=>{
  return (dispatch)=>{
    dispatch(makeRequest());
    
    //setTimeout(() => {
      axios.post('https://localhost:7251/Books/GetBookAllBySearch', {
         id: code
        
      })
      .then((response) => {

        dispatch(getBookObj(response.data.bookList));
      }, (error) => {
        dispatch(failRequest(error.message))
      });

   
  }

}
export const FunctionUpdateBook=(data)=>{
  return (dispatch)=>{
    dispatch(makeRequest());

        axios.post('https://localhost:7251/Books/UpdateBook', {
          id: data.id,
          bookName: data.bookName
        
      })
      .then((response) => {

        dispatch(getBookObj(response.data.bookList));
      }, (error) => {
        dispatch(failRequest(error.message))
      });
  }
}