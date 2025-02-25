import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";
import "../Control/Css/pageNewExcel.css"
import { hideLoading, showLoading } from "../../Utils/Utils";
import numeral from "numeral";
const TemplatePDFExcel = ({ data }) => {
  const [load, setLoad] = useState(false);
  console.log(data)
  
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
  // Function to split content into separate pages dynamically

  const pdfContentRef = useRef("");
  const adjustPageContent = () => {
    const pages = Array.from(document.querySelectorAll(".pageExcel"));
    const pageHeight = 794; // Approx height for A4 size in px at 96 DPI

    pages.forEach((page) => {
      let contentHeight = 0;
      const children = Array.from(page.children);
      let newPage = null;

      children.forEach((child) => {
        const childHeight = getElementHeight(child);
        if (contentHeight + childHeight > pageHeight) {
         
           // Move overflowing child to new page
          contentHeight = childHeight;
        } else {
          contentHeight = childHeight;
        }
      });
    });
  };

  const getElementHeight = (element) => {
    const style = window.getComputedStyle(element);
    const margin =
      parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    return element.offsetHeight + margin;
  };

  

  const generatePdf = async () => {
    showLoading();
    setLoad(true);
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
            scale: 2, // Increase the scale for better image resolution
            letterRendering: true, // Improve font rendering
            useCORS: true, // Enable CORS to handle images from other origins
            
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "landscape",
            precision: 16, // Increase precision for better quality
          },
          pagebreak: {
            mode: ["css", "legacy"], // สนับสนุน CSS page-break
            before: ".page-break",
          },
        })
        .toPdf()
        .get("pdf");

      // Generate PDF Blob
      const pdfBlob = pdf.output("blob");

      const dataUri = pdf.output("datauristring");
      const base64String = dataUri.split(",")[1]; // Remove "data:application/pdf;base64,"
        console.log(data?.fileName)
      // Create a File object from the Blob with a filename
      const pdfFile = new File(
        [pdfBlob],
        `Report_Settlement_${data.fileName}.pdf`,
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
      setLoad(false);
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
      
      <div
        id="pdfContent"
        className="hidden"
        ref={pdfContentRef}
        style={{ pageBreakInside: "avoid" }}
      >
        <div className="pageExcel" style={{ minHeight: "210mm" }}>
          <div className="contentExcel">
            <div className="mb-4">
              <label className="font-bold text-base">ตารางที่ 1 :</label>
              <label className="ml-1 text-base">
                สรุปการจัดสรรพลังงานไฟฟ้าสีเขียวสำหรับการไฟฟ้า
              </label>
            </div>
            {/*1.1 */}
            <table className="w-full border-collapse mb-4 table-auto">
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
                    {data?.dataDetailSheet1?.totalContractPEA
                      ? numeral(
                          data?.dataDetailSheet1.totalContractPEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    
                      {data?.dataDetailSheet1?.totalContractMEA
                      ? numeral(
                          data?.dataDetailSheet1?.totalContractMEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                  {data?.dataDetailSheet1?.totalContractEGAT
                      ? numeral(
                          data?.dataDetailSheet1?.totalContractEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data?.dataDetailSheet1?.totalContract
                      ? numeral(
                          data?.dataDetailSheet1?.totalContract
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                </tr>
                <tr>
                  <td className="w-[350px] border-t-0 border-b-2 border-l-2 border-r-0 border-black p-2 text-sm ">
                    Total Load
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data?.dataDetailSheet1?.totalLoadPEA
                      ? numeral(data?.dataDetailSheet1?.totalLoadPEA).format(
                          "0,0.000"
                        )
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                  {data?.dataDetailSheet1?.totalLoadMEA
                      ? numeral(data?.dataDetailSheet1?.totalLoadMEA).format(
                          "0,0.000"
                        )
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    
                      {data?.dataDetailSheet1?.totalLoadEGAT
                      ? numeral(
                          data?.dataDetailSheet1?.totalLoadEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data?.dataDetailSheet1?.totalLoad
                      ? numeral(data?.dataDetailSheet1?.totalLoad).format(
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
                    {data?.dataDetailSheet1?.actualGenMatchPEA
                      ? numeral(
                          data?.dataDetailSheet1?.actualGenMatchPEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                  {data?.dataDetailSheet1?.actualGenMatchMEA
                      ? numeral(
                          data?.dataDetailSheet1?.actualGenMatchMEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    
                      {data?.dataDetailSheet1?.actualGenMatchEGAT
                      ? numeral(
                          data?.dataDetailSheet1?.actualGenMatchEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data?.dataDetailSheet1?.actualGenMatch
                      ? numeral(
                          data?.dataDetailSheet1?.actualGenMatch
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                </tr>
                <tr>
                  <td className="w-[350px] border-t-0 border-b-2 border-l-2 border-r-0 border-black p-2 text-sm ">
                    {"พลังงานไฟฟ้าพร้อม REC จาก UGT " + "1" + " Inventory"}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data?.dataDetailSheet1?.ugT1InventoryMatchPEA
                      ? numeral(
                          data?.dataDetailSheet1?.ugT1InventoryMatchPEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                  {data?.dataDetailSheet1?.ugT1InventoryMatchMEA
                      ? numeral(
                          data?.dataDetailSheet1?.ugT1InventoryMatchMEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    
                      {data?.dataDetailSheet1?.ugT1InventoryMatchEGAT
                      ? numeral(
                          data?.dataDetailSheet1?.ugT1InventoryMatchEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data?.dataDetailSheet1?.ugT1InventoryMatch
                      ? numeral(
                          data?.dataDetailSheet1?.ugT1InventoryMatch
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                </tr>
                <tr>
                  <td className="w-[350px] border-t-0 border-b-2 border-l-2 border-r-0 border-black p-2 text-sm ">
                    พลังงานไฟฟ้าระบบหลัก
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    {data?.dataDetailSheet1?.unmatchedEnergyPEA
                      ? numeral(
                          data?.dataDetailSheet1?.unmatchedEnergyPEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                  {data?.dataDetailSheet1?.unmatchedEnergyMEA
                      ? numeral(
                          data?.dataDetailSheet1?.unmatchedEnergyMEA
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-0 break-all border-black text-sm text-center ">
                    
                      {data?.dataDetailSheet1?.unmatchedEnergyEGAT
                      ? numeral(
                          data?.dataDetailSheet1?.unmatchedEnergyEGAT
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                  <td className="w-[200px] border-t-0 border-b-2 border-l-2 border-r-2 break-all border-black text-sm text-center ">
                    {data?.dataDetailSheet1?.unmatchedEnergy
                      ? numeral(
                          data?.dataDetailSheet1?.unmatchedEnergy
                        ).format("0,0.000")
                      : numeral(0).format("0,0.000")}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="page-break"></div>
          </div>
          {/* Add more content here */}
        </div>
        
        <div className="pageExcel" style={{ minHeight: "210mm" }}>
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
                    รวม
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
                {data?.dataListDetailSheet2 && 
                (data?.dataListDetailSheet2.map((item, index) => (
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
                
              </tbody>
            </table>
            <div className="page-break"></div>
          </div>
          
        </div>
        
        <div className="pageExcel" style={{ minHeight: "210mm" }}>
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
                    UGT1 Inventory สะสมของเดือนก่อนหน้า
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
              {data?.dataDetailSheet3?.dataDetailSheet3 && 
                (
                  data?.dataDetailSheet3?.dataDetailSheet3.map((item,index)=>(
                    <tr key={index}>
                  <td className="border p-2 text-left break-all">
                    {item.deviceName}
                  </td>
                  <td className="border p-2 break-all">{item?.columnB
                        ? numeral(item?.columnB).format("0,0.000")
                        : numeral(0).format("0,0.000")}</td>
                  <td className="border p-2 break-all">{item?.columnC
                        ? numeral(item?.columnC).format("0,0.000")
                        : numeral(0).format("0,0.000")}</td>
                  <td className="border p-2 break-all">{item?.columnD
                        ? numeral(item?.columnD).format("0,0.000")
                        : numeral(0).format("0,0.000")}</td>
                  <td className="border p-2 break-all">{item?.columnE
                        ? numeral(item?.columnE).format("0,0.000")
                        : numeral(0).format("0,0.000")}</td>
                  <td className="border p-2 break-all">{item?.columnF
                        ? numeral(item?.columnF).format("0,0.000")
                        : numeral(0).format("0,0.000")}</td>
                  <td className="border p-2 break-all">{item?.columnG
                        ? numeral(item?.columnG).format("0,0.000")
                        : numeral(0).format("0,0.000")}</td>
                </tr>
                  ))
                )
              }
              </tbody>
            </table>
          </div>
        </div>        
      </div>
      
    </div>
  );
};

export default TemplatePDFExcel;
