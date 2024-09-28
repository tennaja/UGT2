import React, { useState, useEffect } from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";

import jpgIcon from "../assets/jpg.png";
import pngIcon from "../assets/png.png";
import csvIcon from "../assets/csv.png";
import docxIcon from "../assets/docx.png";
import xlsIcon from "../assets/xls.png";
import txtIcon from "../assets/txt.png";
import pdfIcon from "../assets/pdf.png";
import pptxIcon from "../assets/pptx.png";
import svgIcon from "../assets/svg.png";

import { AiOutlineCloudUpload } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import { FetchUploadFile } from "../../Redux/Device/Action";
import { useDispatch } from "react-redux";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModelFail from "../Control/Modal/ModalFail";
import { message } from "antd";
import { LuTrash2 } from "react-icons/lu";
import { RiEyeLine } from "react-icons/ri";
import { TfiDownload } from "react-icons/tfi";

const UploadFileSubscriber = (props) => {
  const {
    register,
    label,
    validate,
    disabled,
    error,
    onChngeInput,
    onDeleteFile,
    id,
    defaultValue = null,
    isViewMode = false,
    accept="image/*, application/pdf, .doc, .docx, .xls, .xlsx, application/msword, .txt, .csv, .pptx , .ppt",
    onClickFile,
    ...inputProps
  } = props;
  

  // const [percent,setPercent] = useState(0)
  // const [status,setStatus] = useState('')
  const dispatch = useDispatch();

  const [newRender, setNewRender] = useState(false);
  const [initFile, setInitFile] = useState([]);
  const [uploaderKey, setUploaderKey] = useState(0); //for force Re-render
  const [isShowFailModal, setIsShowFailModal] = useState(false);
  const [messageFailModal, setMessageFailModal] = useState("");
  const Layout = ({
    input,
    previews,
    submitButton,
    dropzoneProps,
    files,
    extra: { maxFiles },
  }) => {
    const [myFile, setMyFile] = useState(null);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    //console.log("Previews",previews)
    const getIcon = (name) => {
      const extension = name?.split(".").pop();
      if (extension === "jpeg" || extension === "jpg") {
        return jpgIcon;
      } else if (extension === "png") {
        return pngIcon;
      } else if (extension === "svg") {
        return svgIcon;
      } else if (extension === "pdf") {
        return pdfIcon;
      } else if (extension === "doc" || extension === "docx") {
        return docxIcon;
      } else if (extension === "xls" || extension === "xlsx") {
        return xlsIcon;
      } else if (extension === "csv") {
        return csvIcon;
      } else if (extension === "pptx" || extension === "ppt") {
        return pptxIcon;
      } else if (extension === "txt") {
        return txtIcon;
      } else {
        return jpgIcon;
      }
    };

    const readableBytes = (bytes) => {
      let i = Math.floor(Math.log(bytes) / Math.log(1024)),
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + " " + sizes[i];
    };

    const handleDeleteClick = (file) => {
      setShowModalConfirm(true);
      console.log("---Delete---",file)
      setMyFile(file);
    };

    const handleClickConfirmModal = () => {
      myFile.props.fileWithMeta.remove();
        console.log("--file in delete function",myFile)
      // ---- ------//
      let id = myFile?.props?.meta?.id;
      let evidentFileID = myFile?.props?.fileWithMeta?.file?.name
        ? myFile?.props?.fileWithMeta?.file?.name
        : null;
      let fileName = myFile?.props?.meta?.name;
      // console.log("file>>",myFile)
      // console.log("evidentFileID",evidentFileID)
      // console.log("id",id)
      // if(evidentFileID){
      //   console.log('myFile',myFile)
      //   let id = myFile

      //   // ...call api here
      // }

      onDeleteFile && onDeleteFile(id, evidentFileID, fileName);
      // ----------//
      setShowModalConfirm(false);
    };

    const handleCloseModal = (val) => {
      setShowModalConfirm(false);
      // setShowModalFail(false);
      //.........
    };

    const handlePreview =(file)=>{
      console.log(file)
      if(file.binary === undefined){
        const blobResult = file instanceof Blob ? file : new Blob([file], { type: file.type });;
        console.log("Blob Result",blobResult)
      
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            console.log('Binary data as ArrayBuffer:', arrayBuffer);
            const base64Content = arrayBuffer.split(",")[1];
            
            const pdfWindow = window.open("");
          console.log("PDF",pdfWindow)
          //console.log(type)
          if (pdfWindow) {
            pdfWindow.document.write(
                `<iframe width="100%" height="100%" src="data:${file.type};base64,${base64Content}" style="border:none; position:fixed; top:0; left:0; bottom:0; right:0; width:100vw; height:100vh;"></iframe>`
            );
            pdfWindow.document.body.style.margin = "0"; // Remove any default margin
                  pdfWindow.document.body.style.overflow = "hidden"; // Hide any scrollbars
        } else {
            alert('Unable to open new tab. Please allow popups for this website.');
        }
            
        };
        reader.readAsDataURL(blobResult);
      }
      else{
          const pdfWindow = window.open("");
          console.log("PDF",pdfWindow)
          //console.log(type)
          if (pdfWindow) {
            pdfWindow.document.write(
                `<iframe width="100%" height="100%" src="data:${file.type};base64,${file.binary}" style="border:none; position:fixed; top:0; left:0; bottom:0; right:0; width:100vw; height:100vh;"></iframe>`
            );
            pdfWindow.document.body.style.margin = "0"; // Remove any default margin
                  pdfWindow.document.body.style.overflow = "hidden"; // Hide any scrollbars
        } else {
            alert('Unable to open new tab. Please allow popups for this website.');
        }
      }
    }

    const handleDownloadFile=(file)=>{
      if(file?.binary === undefined){
          console.log(file)
          const reader = new FileReader();
          reader.onload = function(e) {
          const arrayBuffer = e.target.result;
          console.log('Binary data as ArrayBuffer:', arrayBuffer);
          const base64Content = arrayBuffer.split(",")[1];
          const binaryString = atob(base64Content);
          const binaryLength = binaryString.length;
          const bytes = new Uint8Array(binaryLength);

          for (let i = 0; i < binaryLength; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const blob = new Blob([bytes], { type: file.type });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = file.name;
           link.click();
          URL.revokeObjectURL(link.href);
        };
            //const base64Content = file.binary//.split(",")[1];
          reader.readAsDataURL(file)
      }
      else{
          const base64Content = file.binary//.split(",")[1];
          const binaryString = atob(base64Content);
          const binaryLength = binaryString.length;
          const bytes = new Uint8Array(binaryLength);

          for (let i = 0; i < binaryLength; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const blob = new Blob([bytes], { type: file.type });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = file.name;
           link.click();
          URL.revokeObjectURL(link.href);
      }
    }

    return (
      <div
        className={` ${
          error &&
          "border-1 border-rose-500 rounded block w-full  outline-none py-2 px-3"
        }`}
      >
        {!isViewMode && (
            
          <div
            {...dropzoneProps}
            style={{
              border: "1px solid #d1d5db",
              borderStyle: "dashed",
              width: "100%",
              height: "100%",
              color: "#d1d5db",
            }}
          >
            {files.length < maxFiles && input}

            <AiOutlineCloudUpload className="w-[50px] h-[50px] text-[#87be33]"></AiOutlineCloudUpload>
            <label>Drop file here or click to upload</label>
            <label>
              {accept === "image/*, application/pdf, .doc, .docx, .xls, .xlsx, application/msword, .txt, .csv, .pptx , .ppt"? "Acceptable formats : jpeg,jpg,png,svg,pdf,doc, .xls, .docx, .xlsx, .pptx, .txt, .csv":
              accept === "image/*"?"Acceptable formats : jpeg,jpg,png,svg":
              accept === "application/msword"?"Acceptable formats : doc, .docx":"Acceptable formats : "+accept}
            </label>
            <label>Each file can be a maximum of 20MB</label>
          </div>

        )}

        <div className="overflow-y-auto max-h-72">
          {previews?.map((file) =>
            isViewMode ? (
              <>
                <div className="flex items-center justify-between p-2 ">
                  <div className="mr-4">
                    <img
                      src={getIcon(file?.props?.meta?.name)}
                      width={50}
                      height={50}
                    ></img>
                  </div>
                  <div className="grow">
                    <div className="flex justify-between w-full">
                      <div>
                        <label
                          onClick={() => {
                            onClickFile &&
                              onClickFile(file?.props?.file?.binary);
                          }}
                          className="text-sm text-[#6b6b6c] font-medium cursor-pointer"
                        >
                          {file?.props?.meta?.name}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-2 ">
                  <div className="mr-4">
                    <img
                      src={getIcon(file?.props?.meta?.name)}
                      width={50}
                      height={50}
                    ></img>
                    {/* {getIcon(file?.props?.meta?.name)} */}
                  </div>
                  <div className="grow">
                    <div className="flex justify-between w-full">
                      <div>
                        <label
                          onClick={() => {
                            onClickFile &&
                              onClickFile(file?.props?.fileWithMeta?.file);
                          }}
                          className="text-sm text-[#6b6b6c] font-medium cursor-pointer"
                        >
                          {file?.props?.meta?.name}
                        </label>
                      </div>
                      <div className="mr-8">
                        <label className="text-sm text-[#d1d5db] font-normal">
                          {parseInt(file?.props?.meta?.percent)} %{" "}
                        </label>
                      </div>
                    </div>{" "}
                    {file}{" "}
                    <label className="text-xs text-[#d1d5db] font-medium">
                      {/* {readableBytes(file?.props?.meta?.size)} */}
                    </label>
                  </div>
                  {file?.props?.meta?.name?.split(".").pop() === "pdf" && <button type="button"
                    onClick={() => {
                      handlePreview(file?.props?.fileWithMeta?.file);
                    }}>
                      <RiEyeLine className="pl-2 text-xl font-medium cursor-pointer h-[30px] w-[30px]"/>
                      </button>}
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadFile(file?.props?.fileWithMeta?.file);
                    }}
                  >
                    <TfiDownload className="pl-2 text-xl font-medium cursor-pointer h-[30px] w-[30px]"/>
                    
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteClick(file);
                    }}
                  >
                    <LuTrash2 className="pl-2 text-xl font-medium cursor-pointer h-[30px] w-[30px]"/>
                    
                  </button>
                </div>
              </>
            )
          )}
        </div>

        {showModalConfirm && (
          <ModalConfirm
            onClickConfirmBtn={handleClickConfirmModal}
            onCloseModal={handleCloseModal}
            title={"Confirm delete?"}
            content={"Are you sure you would like to Delete this File?"}
            buttonTypeColor="danger"
          />
        )}

        {error && error?.message && (
          <p className=" mt-1 mb-1 text-red-500 text-xs text-left ">
            {error.message}
          </p>
        )}
      </div>
    );
  };

  useEffect(() => {
    //-- Initial Value --//
    if(defaultValue){
      handleForceRerender();

      // const fileList = [{name:'file1.png',type:getType('file1.png')},{name:'initFile2.pdf',type:'application/pdf'}] //Mock
      const fileList = defaultValue?.map((item) => {
        return {
          name: item?.name,
          type: item?.type,
          id: item?.id,
          binary: item?.binary,
          guid: item?.guid
        };
      });
      //console.log("File List",fileList)
      const newFileList = fileList.map((itm) => {
        let file = [];
        file = new File([""], itm.name, {
          type: itm?.type,
          lastModified: new Date(),
          
        });
        Object.defineProperty(file, "size", { value: 1024 * 1024 + 1 });
        Object.defineProperty(file, "id", {
          value: itm?.id,
        });
        Object.defineProperty(file, "binary", {
          value: itm?.binary,
        });
        Object.defineProperty(file, "guid", {
          value: itm?.guid,
        });

        return file;
      });
      setInitFile([...newFileList]);
    
    //console.log("Default file",defaultValue)
    //setInitFile(defaultValue);
      /*for(let i = 0; i < defaultValue.length;i++){
        const file = defaultValue[i]
        const byteCharacters = atob(file.binary);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        try {
          const newBlob = new Blob(byteArrays, { type: file.type });

          // ตรวจสอบว่า newBlob เป็นวัตถุ Blob ที่ถูกต้อง
          if (newBlob instanceof Blob) {
              const url = URL.createObjectURL(newBlob);
              console.log("This is blob")
              console.log("file.type:", file.type);
              
              console.log("Test URL:", url);
              setInitFile((prevFileList) => {
                  let newFileList = [
                      ...prevFileList,
                      { guid: file.guid, name: file.name, size: newBlob.size, type: file.type, url: url,binary: file.binary },
                  ];
                  return newFileList;
              });
          } else {
              console.error("Error: newBlob is not a valid Blob object", newBlob);
          }
      } catch (error) {
          console.error("Error creating Blob or Object URL:", error);
      }
      }*/
    }
    /*if (defaultValue) {
      console.log("defaultValue", defaultValue);
      handleForceRerender();

      // const fileList = [{name:'file1.png',type:getType('file1.png')},{name:'initFile2.pdf',type:'application/pdf'}] //Mock
      const fileList = defaultValue?.map((item) => {
        return {
          name: item?.name,
          type: item?.mimeType,
          FileID: item?.uid,
        };
      });
      const newFileList = fileList.map((itm) => {
        let file = [];
        file = new File([""], itm.name, {
          type: itm?.type,
          lastModified: new Date(),
        });
        Object.defineProperty(file, "size", { value: 1024 * 1024 + 1 });
        Object.defineProperty(file, "evidentFileID", {
          value: itm?.evidentFileID,
        });

        return file;
      });
      setInitFile([...newFileList]);
    }*/
  }, [defaultValue]);

  const convertToByte =(base64)=>{
    const byteCharacters = atob(base64);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return byteArrays
  }

  const getType = (name) => {
    const extension = name?.split(".").pop();
    if (
      extension === "jpeg" ||
      extension === "jpg" ||
      extension === "png" ||
      extension === "svg"
    ) {
      return `image/${extension}`;
    } else if (
      extension === "pdf" ||
      extension === "doc" ||
      extension === "docx" ||
      extension === "xls" ||
      extension === "xlsx" ||
      extension === "csv" ||
      extension === "pptx" ||
      extension === "ppt"
    ) {
      return `application/${extension}`;
    } else if (extension === "txt") {
      return "text/plain";
    } else {
      return "";
    }
  };

  const getUploadParams = ({file}) => {
    //console.log("----TEST UPLOAD---", file);
    //console.log("----Props----",props)
    //console.log("---Default Value---",defaultValue)
        //var uploadData = new FormData();
        // formData?.uploadFile?.forEach((fileItem, index) => {
        //   uploadData.append("formFileList", fileItem.file);
        // });
        //uploadData.append("formFile", props?.file);
        //uploadData.append("name", props?.meta?.name);
        //uploadData.append("notes", "test");
        //console.log("uploadData", uploadData);

        //const result = await FetchUploadFile(uploadData);
        /*console.log("result", result);
        if (result?.res?.uid) {
        Object.defineProperty(props?.file, "evidentFileID", {
            value: result?.res?.uid,
        });
        }*/
        //console.log("Go to add file")
        onChngeInput && onChngeInput(file?.id, file);
    
    return { url: "https://httpbin.org/post" };

  };
  const handleChangeStatus = ({ meta, file, remove }, status, allFiles) => {
    // { meta ,file ,remove }, status, allFiles
    // let status = props?.meta?.status
    inputProps.onChange(allFiles);
    setNewRender(!newRender);
    console.log("status", status);
    if (status === "done") {
      // message.success(`${meta.name} upload successfully.`);
    }
    if (status === "removed") {
      // console.log("remove",remove)
      // console.log("file", file);
      // console.log("allFiles",allFiles)
      // console.log("meta", meta);
      // onDeleteFile && onDeleteFile(meta?.id)
      
      message.success(`${meta.name} remove successfully.`);
    }

    if (status === "error_file_size") {
      // Handle file size too big
      console.error(
        `${meta.name} file is too big, maximum size is ${
          meta.sizeLimit / 1024 / 1024
        } MB`
      );
      message.error("File must smaller than 20MB!");
      // setIsShowFailModal(true);
      setMessageFailModal(`${meta.name} file is too big`);
      // Remove the file
      remove();
    }
    if (status === "rejected_file_type") {
      if(accept==="image/*, application/pdf, .doc, .docx, .xls, .xlsx, application/msword, .txt, .csv, .pptx , .ppt"){
        message.error(
          "You can only upload jpeg, jpg, png, svg, pdf, doc, xls, docx, xlsx, pptx, txt and csv file!"
        );
      }
      else if(accept === "image/*"){
        message.error(
          "You can only upload jpeg, jpg, png, svg file!"
        );
      }
      else if(accept==="application/pdf"){
        message.error(
          "You can only upload pdf file!"
        );
      }
      else if(accept===".xls,.xlsx"){
        message.error(
          "You can only upload xls, xlsx file!"
        );
      }
    }
    if (status === "error_upload") {
      message.error("Upload file fail!");
      remove();
    }
    if (status === 'error') {
      console.error('Error with file:', meta);
      return;
    }
    /*if(status === "preparing"){
      console.log('File detected:', file);

      console.log('Preparing file:', meta);
      
      if (file) {
        console.log('File detected:', file);
      } else {
        console.error('No file detected');
        return;
      }
      console.log('File instance:', file instanceof Blob, file instanceof File);
      console.log('File details:', file);
      console.log('Type of file:', typeof file);
      console.log('File name:', file.name);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
      if (file && file instanceof File) {
        console.log('File is an instance of File');
      } else if (file && file instanceof Blob) {
        console.log('File is an instance of Blob');
      } else {
        console.log('File is neither Blob nor File');
      }
      // ตรวจสอบว่าไฟล์ถูกต้องและเป็นชนิดที่เราต้องการ
      if (file instanceof Blob || file instanceof File) {
        try {
          const url = URL.createObjectURL(file);
          console.log('File URL:', url); // ใช้ URL นี้ในการแสดงตัวอย่างไฟล์ หรืออื่นๆ
          setFile(file); // ส่งไฟล์ไปยัง state ในคอมโพเนนต์หลัก
        } catch (error) {
          console.error("Failed to create object URL:", error);
        }
      } else {
        console.error("Invalid file type or file not selected.");
      }
        

    
    }*/
  
    
    
    // setPercent(status.percent)
    // setStatus(status)
  };

  // const handleSubmit = (files, allFiles) => {
  //   allFiles.forEach(f => f.remove())
  // }
  const handleForceRerender = () => {
    // Increment the key to force a re-render
    setUploaderKey((prevKey) => prevKey + 1);
  };


  return (
    <>
      {label && (
        <label className="mb-1">
          <b>
            {label} <font className="text-[#f94a4a]">{validate}</font>
          </b>
        </label>
      )}
      <Dropzone
        {...inputProps}
        getUploadParams={getUploadParams}
        key={uploaderKey}
        LayoutComponent={Layout}
        disabled={disabled ? true : false}
        // onSubmit={handleSubmit}
        canRemove={false}
        initialFiles={initFile}
        maxSizeBytes={20000000}
        disableRemove={true} // Add this line to disable the remove button
        accept={accept}
        onChangeStatus={handleChangeStatus}
        styles={{
          inputLabel: { fontSize: "0px" },
          previewImage: { display: "none" },
          input: { display: "block" },
          inputLabelWithFiles: {
            fontSize: "0px",
            position: "absolute",
            zIndex: 1,
            width: "100%",
            height: "100px",
            display: "unset",
            backgroundColor: "unset",
          },
        }}
        classNames={{ preview: { padding: "0px" } }}
        inputContent="Drop Files (Custom Layout)"
      />

      {isShowFailModal && (
        <ModelFail
          onClickOk={() => {
            setIsShowFailModal(false);
          }}
          content={messageFailModal}
        />
      )}
    </>
  );
};

export default UploadFileSubscriber;
