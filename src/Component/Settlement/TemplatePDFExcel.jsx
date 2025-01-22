import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
//import { useDispatch, useSelector } from "react-redux";
import { setSF02, setCount } from "../../Redux/Device/Action";
import html2pdf from "html2pdf.js";
import pdfIcon from "../assets/EV.png";
import "../Control/Css/pageExcel.css";
import { hideLoading, showLoading } from "../../Utils/Utils";
import { IoMdCheckmark } from "react-icons/io";
import numeral from "numeral";

const TemplatePDFExcel = (data, aftersign, Sign, Status, isSign, period) => {
  //console.log(data);
  //console.log(data.period);
  //console.log(data.data);
  //console.log(data.Sign);
  //console.log(data.aftersign);
  //const dispatch = useDispatch();
  //const filesf02 = useSelector((state) => state.device.filesf02);
  //const count = useSelector((state) => state.device.count);
  //console.log(count);
  const [load, setload] = useState(false);
  const [list, setList] = useState();
  //const [version, setVersion] = useState(count ?? 0);
  //console.log(data)

  const now = new Date();

  // const day = String(now.getDate()).padStart(2, '0'); // Day of the month with leading zero
  // const month = String(now.getMonth() + 1).padStart(2, '0'); // Month with leading zero
  // const year = now.getFullYear();

  function parseDateStringCommission(dateString) {
    const date = new Date(dateString);

    const daycom = date.getDate().toString().padStart(2, "0");
    const monthcom = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const yearcom = date.getFullYear();

    return { daycom, monthcom, yearcom };
  }

  function parseDateStringFunding(dateString) {
    const date = new Date(dateString);

    const dayfund = date.getDate().toString().padStart(2, "0");
    const monthfund = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const yearfund = date.getFullYear();

    return { dayfund, monthfund, yearfund };
  }

  function parseDateStringRequesteffect(dateString) {
    const date = new Date(dateString);

    const dayrequest = date.getDate().toString().padStart(2, "0");
    const monthrequest = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const yearrequest = date.getFullYear();

    return { dayrequest, monthrequest, yearrequest };
  }

  function convertToDateTime() {
    const datetimeNow = new Date();
    const day = String(datetimeNow.getDate()).padStart(2, "0");
    const month = String(datetimeNow.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = String(datetimeNow.getFullYear()).slice(-2); // Get last 2 digits of the year
    const hours = String(datetimeNow.getHours()).padStart(2, "0");
    const minutes = String(datetimeNow.getMinutes()).padStart(2, "0");
    const seconds = String(datetimeNow.getSeconds()).padStart(2, "0");

    // Format as dd_MM_yy_HH_mm_ss
    const formattedDate = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
    return formattedDate;
  }

  const dateStringcom = data?.data?.commissioningDate;
  const dateStringfund = data?.data?.fundingReceive;
  const datStringRequesteffect = data?.data?.registrationDate;
  const { daycom, monthcom, yearcom } =
    parseDateStringCommission(dateStringcom);
  const { dayfund, monthfund, yearfund } =
    parseDateStringFunding(dateStringfund);
  const { dayrequest, monthrequest, yearrequest } =
    parseDateStringRequesteffect(datStringRequesteffect);

  function getDay(date) {
    if (date == null) {
      return "";
    } else {
      return date.getDate().toString().padStart(2, "0");
    }
  }

  // Function to get the month part
  function getMonth(date) {
    if (date == null) {
      return "";
    } else {
      return (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    }
  }
  //console.log(data?.data?.capacity);
  // Function to get the year part
  function getYear(date) {
    if (date == null) {
      return "";
    } else {
      return date.getFullYear();
    }
  }

  function convertToday(date) {
    if (date) {
      const dateData = date.split("T")[0];
      const day = dateData.split("-")[2];
      return day;
    } else {
      return "";
    }
  }

  function convertToMonth(date) {
    if (date) {
      const dateData = date.split("T")[0];
      const month = dateData.split("-")[1];
      return month;
    } else {
      return "";
    }
  }

  function convertToYear(date) {
    if (date) {
      const dateData = date.split("T")[0];
      const year = dateData.split("-")[0];
      return year;
    } else {
      return "";
    }
  }

  const formatNumber = (value) => {
    if (typeof value !== "number" || isNaN(value)) {
      //console.log("Invalid input:", value); // Log invalid input
      return "000000000000"; // Default value if input is invalid
    }

    // Convert number to string with exactly 6 decimal places
    const numberString = value.toFixed(6);

    // Split into integer and fractional parts
    const [integerPart, fractionalPart] = numberString.split(".");

    // Pad the integer part with leading zeros to ensure it has exactly 6 digits
    const paddedIntegerPart = integerPart.padStart(6, "0");

    // Ensure the fractional part has exactly 6 digits
    const paddedFractionalPart = (fractionalPart || "").padEnd(6, "0");

    // Combine integer and fractional parts
    return paddedIntegerPart + paddedFractionalPart;
  };

  // Log capacity before formatting
  const capacity = data?.data?.totalProductionDuringPeriod * 0.001;
  //console.log("Raw capacity:", capacity); // Log raw value of capacity

  // Format number only if capacity is valid
  const formattedNumber = formatNumber(Number(capacity));

  // Split the formatted number into individual characters for display
  const numberSlots = formattedNumber.split("");

  //console.log("Formatted number:", formattedNumber); // Log formatted output

  const pdfContentRef = useRef("");

  /*useEffect(() => {
    generatePdf();
  }, []);*/



  const adjustPageContent = () => {
    const pages = Array.from(document.querySelectorAll(".pageExcel"));
    const pageHeight = 793; // ความสูง A4 landscape ใน px (96 DPI)
  
    pages.forEach((page) => {
      if (page.id === "page-3") {
        // บังคับแยกหน้า 3 ออกจากการจัดการ
        page.style.pageBreakBefore = "always";
        return;
      }
  
      let contentHeight = 0;
      const children = Array.from(page.children);
      let newPage = null;
  
      children.forEach((child) => {
        const childHeight = getElementHeight(child);
  
        // ถ้าเนื้อหาเกินหน้าให้เริ่มหน้าใหม่
        if (contentHeight + childHeight > pageHeight) {
          if (!newPage) {
            newPage = document.createElement("div");
            newPage.className = "pageExcel";
            page.parentNode.insertBefore(newPage, page.nextSibling);
          }
          newPage.appendChild(child); // ย้าย child ไปหน้าใหม่
          contentHeight = childHeight;
        } else {
          contentHeight += childHeight;
        }
      });
    });
  };
  
  // ฟังก์ชันวัดความสูงของ element รวม margin
  const getElementHeight = (element) => {
    const style = window.getComputedStyle(element);
    const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    return element.offsetHeight + margin;
  };
  
  // ฟังก์ชันแยก element ที่เกินขนาดหน้า
  const splitLargeElementRecursive = (element, maxHeight) => {
    const clone = element.cloneNode(true);
    const remainingPart = document.createElement("div");
    remainingPart.className = "splitContainer";
  
    let currentHeight = 0;
  
    Array.from(clone.children).forEach((child) => {
      const childHeight = getElementHeight(child);
  
      if (currentHeight + childHeight > maxHeight) {
        remainingPart.appendChild(child); // ย้าย child ที่เกินขอบเขต
      } else {
        currentHeight += childHeight;
      }
    });
  
    if (getElementHeight(remainingPart) > maxHeight) {
      const furtherSplit = splitLargeElementRecursive(remainingPart, maxHeight);
      return {
        firstPart: clone,
        remainingPart: furtherSplit.remainingPart,
      };
    }
  
    return {
      firstPart: clone,
      remainingPart: remainingPart,
    };
  };

  const generatePdf = async () => {
    showLoading();
    setload(true);
    setTimeout(() => {
      adjustPageContent();
    }, 0);
    const element = pdfContentRef.current;
    console.log(element);
    element.style.display = "block";
    try {
      const pdf = await html2pdf()
        .from(element)
        .set({
          html2canvas: {
            scale: 4, // Increase the scale for better image resolution
            letterRendering: true, // Improve font rendering
            useCORS: true, // Enable CORS to handle images from other origins
            allowTaint: false,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "landscape",
            precision: 16, // Increase precision for better quality
          },
          pagebreak: {
            mode: ["css", "legacy"], // สนับสนุน CSS page-break
          },
        })
        .toPdf()
        .get("pdf");

      // Generate PDF Blob
      const pdfBlob = pdf.output("blob");

      const dataUri = pdf.output("datauristring");
      const base64String = dataUri.split(",")[1]; // Remove "data:application/pdf;base64,"

      // Create a File object from the Blob with a filename
      const pdfFile = new File(
        [pdfBlob],
        `SF-04_${convertToDateTime()}(${data?.data.dataType}).pdf`,
        { type: "application/pdf" }
      );
      console.log(pdfFile, data);

      let filesForm = {
        binaryBase: base64String,
        file: pdfFile,
      };

      console.log("Dispatched PDF File:", pdfFile);

      // Hide the content again
      element.style.display = "none";
      hideLoading();
      setload(false);
      return filesForm;
    } catch (error) {
      console.log(error);
    }
  };

  // Expose the function to be called externally
  TemplatePDFExcel.generatePdf = generatePdf;

  if (load) {
    return "";
  }
  return (
    <div>
      {/*<div>
        <button onClick={generatePdf}>Preview</button>
      </div>*/}
      <div id="pdf-content" ref={pdfContentRef} className="hidden">
        {/* page 1 */}
        <div className="pageExcel" id="page-1">
          {/* page 1 */}
          <div className="contentExcel">
            <div className="mb-4">
              <label className="font-bold text-base">ตารางที่ 1 :</label>
              <label className="ml-1 text-base">
                สรุปการจัดสรรพลังงานไฟฟ้าสีเขียวสำหรับการไฟฟ้า
              </label>
            </div>
            {/*1.1 */}
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr>
                  <th className="w-[350px] border-t-2 border-b-2 border-l-2 border-r-0 border-black p-2 text-base text-left ">
                    พลังงานไฟฟ้า (kWh)
                  </th>
                  <th className="w-[200px] border-t-2 border-b-2 border-l-2 border-r-0 border-black p-2 text-base text-center ">
                    กฟภ.
                  </th>
                  <th className="w-[200px] border-t-2 border-b-2 border-l-2 border-r-0 border-black p-2 text-base text-center ">
                    กฟน.
                  </th>
                  <th className="w-[200px] border-t-2 border-b-2 border-l-2 border-r-0 border-black p-2 text-base text-center ">
                    กฟผ.
                  </th>
                  <th className="w-[200px] border-t-2 border-b-2 border-l-2 border-r-2 border-black p-2 text-base text-center ">
                    รวม
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="w-[350px] border-t-0 border-b-2 border-l-2 border-r-0 border-black p-2 text-sm ">
                    Total Contract
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.totalContractPEA
                      ? numeral(
                          data.data.dataDetailSheet1.totalContractPEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.totalContractEGAT
                      ? numeral(
                          data.data.dataDetailSheet1?.totalContractEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.totalContractMEA
                      ? numeral(
                          data.data.dataDetailSheet1?.totalContractMEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.totalContract
                      ? numeral(
                          data.data.dataDetailSheet1?.totalContract
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                </tr>
                <tr>
                  <td className="w-[350px] border-t-0 border-b-2 border-l-2 border-r-0 border-black p-2 text-sm ">
                    Total Load
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.totalLoadPEA
                      ? numeral(data.data.dataDetailSheet1?.totalLoadPEA).format(
                          "0,0.000"
                        )
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.totalLoadEGAT
                      ? numeral(
                          data.data.dataDetailSheet1?.totalLoadEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.totalLoadMEA
                      ? numeral(data.data.dataDetailSheet1?.totalLoadMEA).format(
                          "0,0.000"
                        )
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.totalLoad
                      ? numeral(data.data.dataDetailSheet1?.totalLoad).format(
                          "0,0.000"
                        )
                      : numeral(0).format("0,0.000")}
                  </td>
                </tr>
                <tr>
                  <td className="w-[350px] border-t-0 border-b-2 border-l-2 border-r-0 border-black p-2 text-sm ">
                    พลังงานไฟฟ้าที่พร้อม REC ผลิตในเดือน
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.actualGenMatchPEA
                      ? numeral(
                          data.data.dataDetailSheet1?.actualGenMatchPEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.actualGenMatchEGAT
                      ? numeral(
                          data.data.dataDetailSheet1?.actualGenMatchEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.actualGenMatchMEA
                      ? numeral(
                          data.data.dataDetailSheet1?.actualGenMatchMEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.actualGenMatch
                      ? numeral(
                          data.data.dataDetailSheet1?.actualGenMatch
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                </tr>
                <tr>
                  <td className="w-[350px] border-t-0 border-b-2 border-l-2 border-r-0 border-black p-2 text-sm ">
                    {"พลังงานไฟฟ้าพร้อม REC จาก UGT " + "1" + " Inventory"}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.ugT1InventoryMatchPEA
                      ? numeral(
                          data.data.dataDetailSheet1?.ugT1InventoryMatchPEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.ugT1InventoryMatchEGAT
                      ? numeral(
                          data.data.dataDetailSheet1?.ugT1InventoryMatchEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.ugT1InventoryMatchMEA
                      ? numeral(
                          data.data.dataDetailSheet1?.ugT1InventoryMatchMEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.ugT1InventoryMatch
                      ? numeral(
                          data.data.dataDetailSheet1?.ugT1InventoryMatch
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                </tr>
                <tr>
                  <td className="w-[350px] border-t-0 border-b-2 border-l-2 border-r-0 border-black p-2 text-sm ">
                    พลังงานไฟฟ้าระบบหลัก
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.unmatchedEnergyPEA
                      ? numeral(
                          data.data.dataDetailSheet1?.unmatchedEnergyPEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.unmatchedEnergyEGAT
                      ? numeral(
                          data.data.dataDetailSheet1?.unmatchedEnergyEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.unmatchedEnergyMEA
                      ? numeral(
                          data.data.dataDetailSheet1?.unmatchedEnergyMEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data.data.dataDetailSheet1?.unmatchedEnergy
                      ? numeral(
                          data.data.dataDetailSheet1?.unmatchedEnergy
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* page 2 */}
        <div className="pageExcel" id="page-2">
          <div className="contentExcel">
            <div className="mb-4">
              <label className="font-bold text-base">ตารางที่ 2 :</label>
              <label className="ml-1 text-base">
                สรุปการจัดสรรปริมาณพลังงานไฟฟ้าสีเขียวพร้อม REC แยกตามโรงไฟฟ้า
              </label>
            </div>
            {/*1.4*/}
            <table className="border-collapse border border-black w-full text-center">
              <thead>
                <tr>
                  <th className="border p-2" rowSpan="3">
                    โรงไฟฟ้า
                  </th>
                  <th className="border p-2" colSpan="2">
                    กฟภ.
                  </th>
                  <th className="border p-2" colSpan="2">
                    กฟน.
                  </th>
                  <th className="border p-2" colSpan="2">
                    กฟผ.
                  </th>
                  <th className="border p-2" colSpan="2">
                    รวม (kWh)
                  </th>
                </tr>
                <tr>
                  <th className="border p-2" colSpan="2">
                    พลังงานไฟฟ้าพร้อม REC (kWh)
                  </th>
                  <th className="border p-2" colSpan="2">
                    พลังงานไฟฟ้าพร้อม REC (kWh)
                  </th>
                  <th className="border p-2" colSpan="2">
                    พลังงานไฟฟ้าพร้อม REC (kWh)
                  </th>
                  <th className="border p-2" colSpan="2">
                    พลังงานไฟฟ้าพร้อม REC (kWh)
                  </th>
                </tr>
                <tr>
                  <th className="w-[100px] border p-2">จากโรงไฟฟ้า</th>
                  <th className="w-[100px] border p-2">จาก UGT1 Inventory</th>
                  <th className="w-[100px] border p-2">จากโรงไฟฟ้า</th>
                  <th className="w-[100px] border p-2">จาก UGT1 Inventory</th>
                  <th className="w-[100px] border p-2">จากโรงไฟฟ้า</th>
                  <th className="w-[100px] border p-2">จาก UGT1 Inventory</th>
                  <th className="w-[100px] border p-2">จากโรงไฟฟ้า</th>
                  <th className="w-[100px] border p-2">จาก UGT1 Inventory</th>
                </tr>
              </thead>
              <tbody>
                {data.data.dataListDetailSheet2 && 
                (data.data.dataListDetailSheet2.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-left break-all">
                      {item?.deviceName}
                    </td>
                    <td className="border p-2 break-all">
                      {item?.matchSupplyPEA
                        ? numeral(item?.matchSupplyPEA).format("0,0.000")
                        : numeral(0).format("0,0.000")}
                    </td>
                    <td className="border p-2 break-all">
                      {item?.ugt1InventoryMatchedPEA
                        ? numeral(item?.ugt1InventoryMatchedPEA).format(
                            "0,0.000"
                          )
                        : numeral(0).format("0,0.000")}
                    </td>
                    <td className="border p-2 break-all">
                      {item?.matchSupplyEGAT
                        ? numeral(item?.matchSupplyEGAT).format("0,0.000")
                        : numeral(0).format("0,0.000")}
                    </td>
                    <td className="border p-2 break-all">
                      {item?.ugt1InventoryMatchedEGAT
                        ? numeral(item?.ugt1InventoryMatchedEGAT).format(
                            "0,0.000"
                          )
                        : numeral(0).format("0,0.000")}
                    </td>
                    <td className="border p-2 break-all">
                      {item?.matchSupplyMEA
                        ? numeral(item?.matchSupplyMEA).format("0,0.000")
                        : numeral(0).format("0,0.000")}
                    </td>
                    <td className="border p-2 break-all">
                      {item?.ugt1InventoryMatchedMEA
                        ? numeral(item?.ugt1InventoryMatchedMEA).format(
                            "0,0.000"
                          )
                        : numeral(0).format("0,0.000")}
                    </td>
                    <td className="border p-2 break-all">
                      {item?.matchSupply
                        ? numeral(item?.matchSupply).format("0,0.000")
                        : numeral(0).format("0,0.000")}
                    </td>
                    <td className="border p-2 break-all">
                      {item?.ugt1InventoryMatched
                        ? numeral(item?.ugt1InventoryMatched).format("0,0.000")
                        : numeral(0).format("0,0.000")}
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                )))}
                <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
                  <tr>
                    <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                    300,000,000
                    </td>
                    <td className="border p-2 break-all">
                      300,000,000
                    </td>
                    {/* Add more columns as needed */}
                  </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* page 3 */}
        <div className="pageExcel" id="page-3">
          <div className="contentExcel">
            <div className="mb-4">
              <label className="font-bold text-base">ตารางที่ 3 :</label>
              <label className="ml-1 text-base">ปริมาณ UGT1 Inventory</label>
            </div>
            {/*1.4*/}
            <table className="border-collapse border border-black w-full text-center">
              <thead>
                <tr>
                  <th className="border p-2" rowSpan="2">
                    โรงไฟฟ้า
                  </th>
                  <th className="border p-2" colSpan="10">
                    ปริมาณ UGT1 Inventory (kWh)
                  </th>
                </tr>
                <tr>
                  <th className="w-[100px] border p-2 break-all">
                    UGT1 Inventory สะสมของเดอืนกอ่นหนา้
                  </th>
                  <th className="w-[100px] border p-2">
                    (หัก) UGT1 Inventory ที่หมดอายุ
                  </th>
                  <th className="w-[100px] border p-2">
                    (หัก) UGT1Inventory ที่ใช้สำหรับ UGT2 เดือนปัจจุบัน
                  </th>
                  <th className="w-[100px] border p-2">
                    (หัก) UGT1Inventory ที่ใช้สำหรับ UGT1 settlement
                    เดือนปัจจุบัน
                  </th>
                  <th className="w-[100px] border p-2">
                    (เพิ่ม) UGT1Inventory ที่เหลือจาก UGT1 settlement
                    เดือนปัจจุบัน
                  </th>
                  <th className="w-[100px] border p-2">
                    UGT1Inventory สะสม คงเหลือ
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Sari Solar Farm by EGAT
                  </td>
                  <td className="border p-2 break-all">300,000,000.000</td>
                  <td className="border p-2 break-all">300,000,000.000</td>
                  <td className="border p-2 break-all">300,000,000.000</td>
                  <td className="border p-2 break-all">300,000,000.000</td>
                  <td className="border p-2 break-all">300,000,000.000</td>
                  <td className="border p-2 break-all">300,000,000.000</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">
                    [UAT01] Rati Wind by EGAT
                  </td>
                  <td className="border p-2 break-all">28.750</td>
                  <td className="border p-2 break-all">0</td>
                  <td className="border p-2 break-all">40.729</td>
                  <td className="border p-2 break-all">1.979</td>
                  <td className="border p-2 break-all">115.000</td>
                  <td className="border p-2 break-all">0</td>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all">รวม</td>
                  <td className="border p-2 break-all">58.750</td>
                  <td className="border p-2 break-all">1.250</td>
                  <td className="border p-2 break-all">83.229</td>
                  <td className="border p-2 break-all">3.750</td>
                  <td className="border p-2 break-all">235.000</td>
                  <td className="border p-2 break-all">5.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={generatePdf}>Generate PDF</button> */}
    </div>
  );
};

export default TemplatePDFExcel;
