import React ,{useState,useEffect}from "react";
import egat from "../assets/default_device.png";
import { FetchUploadFile } from "../../Redux/Device/Action";
import './UploadImg.css'
const UploadImg = (props) => {
  console.log(props)
  const { register, label, validate, disabled, error, id, onChangeInput,defaultValue=null, defaultImg=egat ,isViewMode=false, ...inputProps } = props;

  useEffect(()=>{

      //-- Initial Value --//
      if(defaultValue){
        const fileList = [{name:'file1.txt',type:'text/plain'},{name:'initFile2.pdf',type:'application/pdf'}] //Mock
        const newFileList = fileList.map((itm)=>{
          let file = []
           file = new File([""], itm.name, {type: itm.type, lastModified: new Date()})
          Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 })
          return file
  
        })
        setInitFile([...newFileList])
      }

  },[])


  const getUploadParams = async (props) => {
    console.log("----TEST UPLOAD---", props);

    var uploadData = new FormData();
    // formData?.uploadFile?.forEach((fileItem, index) => {
    //   uploadData.append("formFileList", fileItem.file);
    // });
    uploadData.append("formFile", props?.file);
    uploadData.append("name", props?.meta?.name);
    uploadData.append("notes", "test");
    console.log("uploadData", uploadData);

    const result = await FetchUploadFile(uploadData);
    console.log("result", result);
    if (result?.res?.uid) {
      Object.defineProperty(props?.file, "evidentFileID", {
        value: result?.res?.uid,
      });
    }

    getUploadParams && getUploadParams(props?.meta?.id, result);
    return { url: "https://httpbin.org/post" };
  };
  
  const handleChange = (event) => {
    
    var input = event.target;
    var file = input.files[0];
    var type = file.type;
    var output = document.getElementById("preview_img");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
    console.log(output.src)
    onChangeInput&&onChangeInput(file) //callback func()
    inputProps.onChange(file) // bind data to form
  };

  return (
    <>
      <label className={`${isViewMode? 'none' : 'cursor-pointer'}`}>
        {!isViewMode && <input  type="file" className="w-full hidden" accept=".png, .jpg, .jpeg, .svg" onChange={handleChange}  />}
        {/* <img src={defaultImg} id="preview_img" /> */}
        <div className={ `${isViewMode? 'image-container-view-only' : 'image-container'}` }>
        {/* <div className="relative inline-block	before:absolute before:top-[90%] before:left-[90%] before:origin-[-50%_-50%] before:z-1 before:w-[30px] before:h-[30px] before:rounded-[50px] before:shadow-xl"> */}
          <img src={defaultImg} alt="Preview_Img" id="preview_img" className="h-44 w-44 object-cover rounded-full flex items-center justify-center"/>
        </div> 
      </label>
    </>
  );
};

export default UploadImg;