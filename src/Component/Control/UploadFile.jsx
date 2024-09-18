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
import { HiDownload } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import { FetchUploadFile } from "../../Redux/Device/Action";
import { useDispatch } from "react-redux";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModelFail from "../Control/Modal/ModalFail";
import { message } from "antd";

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
const UploadFile = (props) => {
  console.log(props)
  const {
    register,
    label,
    validate,
    disabled,
    error,
    onChngeInput,
    onPreview,
    onDeleteFile,
    id,
    defaultValue = null,
    isViewMode = false,
    onClickFile,
    onZipfile,
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
  const [fileList, setFileList] = useState(defaultValue || []);
  console.log("UOLOADFILE _________________________________________ >>>>>>",initFile)
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
    console.log(initFile)
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
      console.log(file)
      setShowModalConfirm(true);

      setMyFile(file);
    };

    const handleClickConfirmModal = () => {
      myFile.props.fileWithMeta.remove();

      // ---- ------//
      let id = myFile?.props?.meta?.id;
      let evidentFileID = myFile?.props?.fileWithMeta?.file?.evidentFileID
        ? myFile?.props?.fileWithMeta?.file?.evidentFileID
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
  
    
    const handleDownloadAll = () => {
      // Log the initFile object and its size for debugging
      console.log('initFile:', initFile);
      if (initFile) {
          console.log('initFile size:', initFile.size);
      } else {
          console.log('initFile is not set or is undefined');
      }
  
      // Extract files to download from previews and include initFile if available
      const filesToDownload = [
          ...previews.map(file => file.props.fileWithMeta.file),
          ...(initFile ? [initFile] : []) // Include initFile if it exists
      ];
  
      // Ensure all files are valid before zipping
      filesToDownload.forEach(file => {
          if (file instanceof File || file instanceof Blob) {
              console.log(`File to be zipped: ${file.name}, size: ${file.size}`);
          } else {
              console.error('Invalid file object:', file);
          }
      });
  
      downloadZip(filesToDownload);
  };
  
  const downloadZip = (files) => {
      const zip = new JSZip();
      files.forEach(file => {
          if (file instanceof File || file instanceof Blob) {
              // Add the file to the zip
              zip.file(file.name, file);
          } else {
              console.error('Invalid file object:', file);
          }
      });
  
      zip.generateAsync({ type: 'blob' }).then(content => {
          saveAs(content, 'files.zip');
      }).catch(error => {
          console.error('Error generating zip:', error);
      });
  };
  

 
    
    


    
    
    



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
              Acceptable formats : jpeg,jpg,png,svg,pdf,doc, .xls, .docx, .xlsx,
              .pptx, .txt, .csv
            </label>
            <label>Each file can be a maximum of 20MB</label>
          </div>
        )}

        <div className="overflow-y-auto max-h-72">
          {previews?.map((file) =>
          
            isViewMode ? (
              <>
                <div className="flex items-center justify-between p-3 rounded border border-slate-300 mt-2">
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
                              onClickFile(file?.props?.fileWithMeta?.file);
                          }}
                          className="text-sm text-[#6b6b6c] font-medium cursor-pointer"
                        >
                          {file?.props?.meta?.name}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between  w-36">

                    
                  <MdOutlineRemoveRedEye className="w-[25px] h-[25px] text-PRIMARY_BUTTON hover:text-[#bee4a2] cursor-pointer"
                  onClick={() => {
                    onPreview &&
                    onPreview(file?.props?.fileWithMeta?.file);
                  }}/>
                
                  <HiDownload className="w-[25px] h-[25px] text-PRIMARY_BUTTON hover:text-[#bee4a2] cursor-pointer" onClick={() => {
                            onClickFile &&
                              onClickFile(file?.props?.fileWithMeta?.file);
                          }}/>
                  <FiTrash2 className="w-[25px] h-[25px] text-PRIMARY_BUTTON hover:text-[#bee4a2] cursor-not-allowed" 
                  // onClick={() => {
                  //     handleDeleteClick(file);
                  //   }}
                    />
                  </div>
                  
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 rounded border border-slate-300 mt-2">
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
                      {!isViewMode && file?.props?.meta?.status === 'done' && (
                      <div className="flex items-center justify-between w-36">
                    <MdOutlineRemoveRedEye
                      className="w-[25px] h-[25px] text-PRIMARY_BUTTON hover:text-[#bee4a2] cursor-pointer"
                      onClick={() => {
                        onPreview && onPreview(file?.props?.fileWithMeta?.file);
                      }}
                    />
                    <HiDownload
                      className="w-[25px] h-[25px] text-PRIMARY_BUTTON hover:text-[#bee4a2] cursor-pointer"
                      onClick={() => {
                        onClickFile && onClickFile(file?.props?.fileWithMeta?.file);
                      }}
                    />
                    <FiTrash2
                      className="w-[25px] h-[25px] text-PRIMARY_BUTTON hover:text-[#bee4a2] cursor-pointer"
                      onClick={() => {
                        handleDeleteClick(file);
                      }}
                    />
                  </div>)}
                      {isViewMode && file?.props?.meta?.status === 'done' && (
                      <div className="mr-8">
                        <label className="text-sm text-[#d1d5db] font-normal">
                          {parseInt(file?.props?.meta?.percent)} %{" "}
                        </label>
                      </div>)}
                    </div>{" "}
                    {file?.props?.meta?.status !== 'done' && (
                      <div>{file}{" "}</div>
                    
                  )}
                    
                    <label className="text-xs text-[#d1d5db] font-medium">
                      {/* {readableBytes(file?.props?.meta?.size)} */}
                    </label>
                  </div>
                  {isViewMode && file?.props?.meta?.status === 'done' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteClick(file);
                    }}
                  >
                    <label className="pl-2 text-xl font-medium cursor-pointer">
                      x
                    </label>
                  </button>)}
                </div>
              </>
            )
            
          )}
          {props.value == undefined ? 
           null : <div type="button" className="w-full h-12 rounded border-2 border-[#4D6A00] mt-3 flex items-center justify-center text-PRIMARY_TEXT font-bold" onClick={handleDownloadAll}>Download All Files (.zip)</div> }
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
    if (defaultValue) {
      console.log("defaultValue", defaultValue);
      handleForceRerender();

      // const fileList = [{name:'file1.png',type:getType('file1.png')},{name:'initFile2.pdf',type:'application/pdf'}] //Mock
      const fileList = defaultValue?.map((item) => {
        return {
          name: item?.name,
          type: item?.mimeType,
          evidentFileID: item?.uid,
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
    }
  }, [defaultValue]);

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
    console.log(result?.res?.uid)
    if (result?.res?.uid) {
      Object.defineProperty(props?.file, "evidentFileID", {
        value: result?.res?.uid,
            });
    }

    onChngeInput && onChngeInput(props?.meta?.id, result);
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
      message.error(
        "You can only upload jpeg, jpg, png, svg, pdf, doc, xls, docx, xlsx, pptx, txt and csv file!"
      );
    }
    if (status === "error_upload") {
      message.error("Upload file fail!");
      remove();
    }

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
        accept="image/*, application/pdf, .doc, .docx, .xls, .xlsx, application/msword, .txt, .csv, .pptx , .ppt"
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

export default UploadFile;
