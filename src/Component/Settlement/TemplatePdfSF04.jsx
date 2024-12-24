import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
//import { useDispatch, useSelector } from "react-redux";
import { setSF02, setCount } from "../../Redux/Device/Action";
import html2pdf from "html2pdf.js";
import pdfIcon from "../assets/EV.png";
import "../Control/Css/page.css";
import { hideLoading, showLoading } from "../../Utils/Utils";
import { IoMdCheckmark } from "react-icons/io";
const PdfFormPreviewSF04 = (data, aftersign, Sign, Status,isSign,period) => {
  console.log(data)
  console.log(data.period)
  console.log(data.data);
  console.log(data.Sign);
  console.log(data.aftersign);
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

  function convertToDateTime(){
    const datetimeNow = new Date();
    const day = String(datetimeNow.getDate()).padStart(2, '0');
    const month = String(datetimeNow.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(datetimeNow.getFullYear()).slice(-2); // Get last 2 digits of the year
    const hours = String(datetimeNow.getHours()).padStart(2, '0');
    const minutes = String(datetimeNow.getMinutes()).padStart(2, '0');
    const seconds = String(datetimeNow.getSeconds()).padStart(2, '0');

// Format as dd_MM_yy_HH_mm_ss
    const formattedDate = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
    return formattedDate
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
    if(date == null){
      return ""
    }
    else{
    return date.getDate().toString().padStart(2, "0");
    }
  }

  // Function to get the month part
  function getMonth(date) {
    if(date == null){
      return ""
    }
    else{
    return (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    }
  }
  //console.log(data?.data?.capacity);
  // Function to get the year part
  function getYear(date) {
    if(date == null){
      return ""
    }
    else{
    return date.getFullYear();
    }
  }

  function convertToday(date){
    if(date){
      const dateData = date.split("T")[0]
      const day = dateData.split("-")[2]
      return day
    }
    else{
      return ""
    }
  }

  function convertToMonth(date){
    if(date){
      const dateData = date.split("T")[0]
      const month = dateData.split("-")[1]
      return month
    }
    else{
      return ""
    }
  }

  function convertToYear(date){
    if(date){
      const dateData = date.split("T")[0]
      const year = dateData.split("-")[0]
      return year
    }
    else{
      return ""
    }
  }

  const formatNumber = (value) => {
    if (typeof value !== "number" || isNaN(value)) {
      console.log("Invalid input:", value); // Log invalid input
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
  const capacity = data?.data?.totalProductionDuringPeriod;
  console.log("Raw capacity:", capacity); // Log raw value of capacity

  // Format number only if capacity is valid
  const formattedNumber = formatNumber(Number(capacity));

  // Split the formatted number into individual characters for display
  const numberSlots = formattedNumber.split("");

  console.log("Formatted number:", formattedNumber); // Log formatted output

  const pdfContentRef = useRef("");

  /*useEffect(() => {
    generatePdf();
  }, []);*/

  const generatePdf = async () => {
    showLoading();
    setload(true);
    const element = pdfContentRef.current;
    console.log(element)

    //const newVersion = version + 1;
    //console.log("VERSION ---------------", newVersion);
    //dispatch(setCount(newVersion));
    // Ensure the content is visible temporarily for PDF generation
    element.style.display = "block";

    const pdf = await html2pdf()
      .from(element)
      .set({
        html2canvas: {
          scale: 4, // Increase the scale for better image resolution
          letterRendering: true, // Improve font rendering
          useCORS: true, // Enable CORS to handle images from other origins
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          precision: 16, // Increase precision for better quality
        },
      })
      .toPdf()
      .get("pdf");
    /*.then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          // Adjust footer position
          pdf.setFontSize(8);
          pdf.text(
            `Version: 1.3                                                               Copyright © Evident Ev Limited                                                                               Page ${i}/${totalPages}`,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 7,
            { align: "center" }
          );
        }

        // Generate PDF Blob
        const pdfBlob = pdf.output("blob");

        const dataUri = pdf.output("datauristring");
        const base64String = dataUri.split(",")[1]; // Remove "data:application/pdf;base64,"


        // Create a File object from the Blob with a filename
        const pdfFile = new File(
          [pdfBlob],
          `SF-02v${newVersion}(${data?.Status}).pdf`,
          { type: "application/pdf" }
        );
        console.log(pdfFile, data);
        // Open the PDF in a new tab for preview
         const url = URL.createObjectURL(pdfBlob);
         const pdfWindow = window.open(url, '_blank');
         if (pdfWindow) pdfWindow.focus();

        // Dispatch the generated PDF Blob for storage
        dispatch(setSF02(pdfFile));

        console.log("Dispatched PDF File:", pdfFile);

        // Update the version in state to the new version
        // setVersion(newVersion);

        // Hide the content again
        element.style.display = 'none';
        hideLoading();
        setload(false);
        return base64String;
      });*/
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // Adjust footer position
      pdf.setFontSize(8);
      pdf.text(
        `Version: 1.3                                                               Copyright © Evident Ev Limited                                                                               Page ${i}/${totalPages}`,
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 7,
        { align: "center" }
      );
    }

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
    }
    // Open the PDF in a new tab for preview
    //const url = URL.createObjectURL(pdfBlob);
    // const pdfWindow = window.open(url, '_blank');
    //if (pdfWindow) pdfWindow.focus();

    // Dispatch the generated PDF Blob for storage
    //dispatch(setSF02(pdfFile));

    console.log("Dispatched PDF File:", pdfFile);

    // Update the version in state to the new version
    // setVersion(newVersion);

    // Hide the content again
    element.style.display = "none";
    hideLoading();
    setload(false);
    return filesForm;
    // .catch((error) => {
    //   console.error('Error generating PDF:', error);
    //   // Hide the content again if there's an error
    //   element.style.display = 'none';
    //   setload(false);
    //   hideLoading();
    //   // Display an alert to the user (optional)
    //   alert('An error occurred while generating the PDF. Please try again.');
    // });
  };

  

  // Expose the function to be called externally
  PdfFormPreviewSF04.generatePdf = generatePdf;

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
        <div className="page" id="page-1">
          <div className="textoutside">
            --- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---
          </div>
          <div className="headers">
            <div className="text-center mb-5 flex justify-between">
              <img
                src={pdfIcon}
                alt="Logo"
                className="w-14 h-20 mb-2 text-gray-600"
              />
              <div className="flex-col">
                <h1 className="text-lg text-gray-800">
                  Evident. I-REC Code for Electricity
                </h1>
                <h2 className="text-lg text-gray-600">SF-04: Issue Request</h2>
              </div>
            </div>
          </div>
          {/* page 1 */}
          <div className="content">
            {/*1.1 */}
            <table className="w-full border-collapse mb-4 text-xs">
              <thead>
                <tr>
                  <th colSpan="4" className="border p-2  text-left ">
                    1.1 SF-04: Issue Request
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[8px] text-gray-600 text-left "
                  >
                    <em>Complete all fields.</em>
                  </th>
                </tr>
                <tr>
                  <td className="border p-2 font-bold text-left w-1/3">Date</td>
                  <td className="border p-2 text-left ">
                    {data.isSign ? getDay(now) : ""}
                  </td>
                  <td className="border p-2 text-left ">
                    {data.isSign ? getMonth(now) : ""}
                  </td>
                  <td className="border p-2 text-left ">
                    {data.isSign ? getYear(now) : ""}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-bold ">
                    <div>Request type</div>
                    <em className="text-[10px] font-noto-sans text-gray-600 text-left">
                      (please select)
                    </em>
                  </td>
                  <td className="border text-left break-all " colSpan="3">
                    Normal
                  </td>
                </tr>
              </tbody>
            </table>
            {/*1.2*/}
            <table className="w-full border-collapse mb-4 text-xs">
              <thead>
                <tr>
                  <th colSpan="4" className="border p-2  text-left ">
                    1.2 Registrant And Facility Details
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em>
                      complete all fields. IDs, codes, and names should be as
                      displayed in the Evident Registry.
                    </em>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Organisation ID/code",
                    `${
                        data?.data.organisationId == null
                        ? ""
                        : data?.data.organisationId
                    }`,
                    "",
                  ],
                  [
                    "Organisation name",
                    `${
                         data?.data.organisationName == null
                        ? ""
                        : data?.data.organisationName
                    }`,
                    "",
                  ],
                  [
                    "Facility ID/code",
                    `${
                       data?.data.facilityID == null
                        ? ""
                        : data?.data.facilityID
                    } `,
                    "",
                  ],
                  [
                    "Facility name",
                    `${
                      data?.data.facilityName == null
                        ? ""
                        : data?.data.facilityName
                    }`,
                    "",
                  ],
                  [
                    "Request Labels",
                    `${
                      "-"
                    }`,
                    "(only Labels recoded against the Facility registration are permitted)",
                  ],
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="border p-2 font-bold w-1/3">
                      <div>{row[0]}</div>
                      <em className="text-[10px] font-noto-sans text-gray-600 text-left">
                        {row[2]}
                      </em>
                    </td>
                    <td className="border p-2 text-left break-all " colSpan="2">
                      {row[1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/*1.3*/}
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th colSpan="5" className="border p-2  text-left">
                    1.3 Production Details
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="5"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em>complete all fields.</em>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-bold text-left w-1/3">
                    Period start date
                  </td>
                  <td className="border p-2 text-left ">
                    {convertToday(data.data.periodStartDate)}
                  </td>
                  <td className="border p-2 text-left ">
                    {convertToMonth(data.data.periodStartDate)}
                  </td>
                  <td className="border p-2 text-left ">
                    {convertToYear(data.data.periodStartDate)}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold text-left w-1/3">
                    Period end date
                  </td>
                  <td className="border p-2 text-left ">
                    {convertToday(data.data.periodEndDate)}
                  </td>
                  <td className="border p-2 text-left ">
                    {convertToMonth(data.data.periodEndDate)}
                  </td>
                  <td className="border p-2 text-left ">
                    {convertToYear(data.data.periodEndDate)}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">
                    Total production during period
                  </td>
                  <td className="border text-left break-all" colSpan={3}>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="border p-2 font-bold w-1/2 text-left">
                            {data?.data?.capacity} MWh
                          </td>
                          <td className="border p-2 text-left text-xs break-all w-1/2">
                            <em>Up to 6 decimal places</em>
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={2} className="border text-center">
                            <table className="w-full border-collapse">
                              <tr>
                                {numberSlots.map((char, index) => (
                                  <td
                                    key={index}
                                    className="border p-1 text-center "
                                  >
                                    {char}
                                  </td>
                                ))}
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">
                    <div>I-REC(E) applied for</div>
                    <em className="text-[10px] font-noto-sans text-gray-600 text-left">
                      (if blank the above amount will be issued on approval)
                    </em>
                  </td>
                  <td className="border text-left break-all" colSpan={3}>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="border p-2 font-bold w-1/2 text-left">
                            {data?.data?.capacity} MWh
                          </td>
                          <td className="border p-2 text-left text-xs break-all w-1/2">
                            <em>Up to 6 decimal places</em>
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={2} className="border text-center">
                            <table className="w-full border-collapse">
                              <tr>
                                {numberSlots.map((char, index) => (
                                  <td
                                    key={index}
                                    className="border p-1 text-center "
                                  >
                                    {char}
                                  </td>
                                ))}
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
              <tr>
                <th
                  colSpan="5"
                  className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                >
                  <em>
                    Unless explicify confirmed otherwise, I-REC(E) for
                    multi-fuel generators shall only be issued for that portion
                    of electricity.
                  </em>
                </th>
              </tr>
            </table>
          </div>

          <div className="footer">
            {/* <div className="text-center text-xs text-gray-600 flex justify-between">
            <p>Version: 1.3</p>
            <p>Copyright © Evident Ev Limited</p>
            <p>Page 1/1</p>
          </div> */}
          </div>
        </div>

        {/* page 2 */}
        <div className="page" id="page-2">
          <div className="textoutside">
            --- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---
          </div>
          <div className="headers">
            <div className="text-center flex justify-between ">
              <img
                src={pdfIcon}
                alt="Logo"
                className="w-14 h-20 mb-2 text-gray-600"
              />
              <div className="flex-col">
                <h1 className="text-lg text-gray-800">
                  Evident. I-REC Code for Electricity
                </h1>
                <h2 className="text-lg text-gray-600">SF-04: Issue Request</h2>
              </div>
            </div>
          </div>
          <div className="content">
            {/*1.4*/}
            <table className="w-full border-collapse mb-4 text-xs">
              <thead>
                <tr>
                  <th colSpan="4" className="border p-2  text-left">
                    1.4 Energy Sources
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em>
                      Complete all fields - please refer to SD 02: Technologies
                      and Fuels.
                    </em>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-bold w-1/4 ">
                    Fuel
                    <p className="text-[8px] text-gray-600">
                      <em>
                        (
                        {`please list all possible fuels if Production Facility is a multifuel generator and also complete SF-04C: Fuel Consumption Statement.`}
                        )
                      </em>
                    </p>
                  </td>
                  <td className="border text-left">
                    <table className="w-full border-collapse text-xs h-24">
                      <tbody>
                        <tr>
                          <td className="border p-2 font-bold text-left w-44 h-[40px]">
                            Code
                          </td>
                          <td className="border p-2 font-bold text-left break-all h-[40px]">
                            Description
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2 text-left break-all h-[75px]">
                            {data?.data?.fuelCode}
                          </td>
                          <td className="border p-2 text-left break-all h-[75px]">
                            {data?.data?.fuelName}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold w-96">Technology</td>
                  <td className="border text-left">
                    <table className="w-full border-collapse text-xs h-24">
                      <tr>
                        <td className="border p-2 font-bold text-left w-44 h-[40px]">
                          Code
                        </td>
                        <td className="border p-2 font-bold text-left h-[40px]">
                          Description
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2 text-left break-all h-[75px]">
                          {data?.data?.technologyCode}
                        </td>
                        <td className="border p-2 text-left break-allh-[75px]">
                          {data?.data?.technologyName}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            {/*1.5*/}
            <table className="w-full border-collapse mb-4 text-xs">
              <thead>
                <tr>
                  <th colSpan="4" className="border p-2  text-left">
                    1.5 Evidence Details
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em className="font-light">
                      Complete all required fields.
                    </em>
                    <em className="font-bold">
                      All supporting Evidence must be subnitted with the Issue
                      Request.
                    </em>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="border p-2 font-bold w-1/2 h-[150px]">
                    Type of supporting evidence
                    <p className="text-[8px] text-gray-600">
                      <em>({`please select`})</em>
                    </p>
                  </td>
                  <td className="border p-2 text-left break-all w-full h-[150px]">
                    <div className="flex flex-col">
                      <p>Settlement Metering Data</p>
                      
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/*1.6*/}
            <table className="w-full border-collapse mb-5 text-xs">
              <thead>
                <tr>
                  <th colSpan="4" className="border p-2  text-left">
                    1.6 Production Auditor
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em>
                      complete all fields if a Production Auditor has reviewd
                      the information this Issue Request.
                    </em>
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2 break-all  text-[10px] font-noto-sans text-gray-600 text-left "
                  >
                    <label>
                      The undersigned Production Auditor has reviewed this Issue
                      Request and has no material reason to doubt the
                      correctness of the evidence to support the measured
                      volume.
                    </label>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-bold w-64">
                    Organisation name
                  </td>
                  <td className="border p-2 text-left break-all">{data.isSign?data.data.organisationName:""}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold w-64">Signatory</td>
                  <td className="border p-2 text-left break-all">{data.isSign?data.Sign:""}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold w-64">
                    Name{" "}
                    <em className="text-[8px] text-gray-600">
                      ({`BLOCK CAPITALS`})
                    </em>
                  </td>
                  <td className="border p-2 text-left break-all">{data.isSign?data.Sign:""}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="footer">
            {/* <div className="text-center mt-5 text-xs text-gray-600 flex justify-between">
            <p>Version: 1.3</p>
            <p>Copyright © Evident Ev Limited</p>
            <p>Page 1/1</p>
          </div> */}
          </div>
        </div>

        {/* page 3 */}
        <div className="page" id="page-3">
          <div className="textoutside">
            --- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---
          </div>
          <div className="headers">
            <div className="text-center mb-5 flex justify-between">
              <img
                src={pdfIcon}
                alt="Logo"
                className="w-14 h-20 mb-2 text-gray-600"
              />
              <div className="flex-col">
                <h1 className="text-lg text-gray-800">
                  Evident. I-REC Code for Electricity
                </h1>
                <h2 className="text-lg text-gray-600">SF-04: Issue Request</h2>
              </div>
            </div>
          </div>

          <div className="content">
            {/*1.7 */}
            <table className="w-full border-collapse mb-4 text-xs">
              <thead>
                <tr>
                  <th colSpan="4" className="border p-2  text-left">
                    1.7 Receiving Account Details
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em className="font-light">
                      Complete all fields.IDs, codes, and names should be as
                      displayed in the Evident Registry.
                    </em>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="border p-2 font-bold w-1/2 ">
                    Receiving organisation name
                    <p className="text-[8px] text-gray-600">
                      <em>
                        ({`Participant, Platform Operator, or self-consumption`}
                        )
                      </em>
                    </p>
                  </td>
                  <td className="border p-2 text-left break-all w-full">
                    <div className="flex flex-col">
                      <p>{data?.data?.receivingOrganisationName}</p>
                    </div>
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="border p-2 font-bold w-1/2 ">
                    Account ID/code
                  </td>
                  <td className="border p-2 text-left break-all w-full">
                    <div className="flex flex-col">
                    <p>{data?.data?.accountCode}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            {/*1.8 */}
            <table className="w-full border-collapse mb-5 text-xs">
              <thead>
                <tr>
                  <th colSpan="4" className="border p-2  text-left">
                    1.8 SF-04A: Issuing Declaration
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[10px] font-noto-sans text-gray-600 text-left "
                  >
                    <em className="font-light">
                      if not submitted as part of SF-04: Issue Request,for
                      example if all Issue Request data is submitted via an
                      online form,this Issuing Declaration should be copied onto
                      the Registrant's headed paper, completed and signed by on
                      authorised representative of the Registrant. It can be
                      scanned and subnitted electronically to the Issue. An
                      Issuer may accept a company stamp as an alternative to an
                      authorised representative's signature.
                    </em>
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[10px] font-noto-sans text-gray-600 text-left "
                  >
                    <label className="font-light">
                      In signing, the Registrant agrees to be subject to the
                      I-REC Code for Electricity and warrants that the energy
                      for which I-REC(E) certificates are being sought has not
                      and will not be submitted for any other energy attribute
                      tracking methodology, emissions reduction certificate, or
                      carbon offset.
                    </label>
                    <label className="font-light mt-1">
                      The Ristrant also warrants that. to the best of their
                      knowledge, the production and/or consumption attributes
                      contained within any I-REC(E) certificate issued in
                      association with this request (including all rights to the
                      specific electricity and/or emissions for the reporting of
                      any indirect carbon accounting purposes) are not delivered
                      to any other body (directly or in-directly) without the
                      component I-REC(E) certificate. This includes but is not
                      limited to electricity supply companies or national
                      governments.
                    </label>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-bold w-1/4">Signature</td>
                  <td className="border p-2 text-left break-all" colSpan="3">
                    {data?.isSign == false
                      ? ""
                      : data?.Sign}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">
                    <div className="flex text-left">
                      <p>Name</p>
                      <p className="text-[8px] text-gray-500 ml-1 mt-0">
                        <em>(BLOCK CAPITALS)</em>
                      </p>
                    </div>
                  </td>
                  <td className="border p-2 text-left break-all" colSpan="3">
                  {data?.isSign == false
                      ? ""
                      : data?.Sign}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold text-left">Date</td>
                  <td className="border p-2 text-left">
                    {data?.isSign == false ? "" : getDay(now)}{" "}
                  </td>
                  <td className="border p-2 text-left">
                    {data?.isSign == false  ? "" : getMonth(now)}{" "}
                  </td>
                  <td className="border p-2 text-left">
                    {data?.isSign == false  ? "" : getYear(now)}{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="footer">
            {/* <div className="text-center mt-5 text-xs text-gray-600 flex justify-between">
            <p>Version: 1.3</p>
            <p>Copyright © Evident Ev Limited</p>
            <p>Page 1/1</p>
          </div> */}
          </div>
        </div>

        <div className="page" id="page-4">
          {/* Page 4 content */}
          <div className="textoutside">
            --- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---
          </div>
          <div className="headers">
            <div className="text-center mb-5 flex justify-between">
              <img
                src={pdfIcon}
                alt="Logo"
                className="w-14 h-20 mb-2 text-gray-600"
              />
              <div className="flex-col">
                <h1 className="text-lg text-gray-800">
                  Evident. I-REC Code for Electricity
                </h1>
                <h2 className="text-lg text-gray-600">SF-04: Issue Request</h2>
              </div>
            </div>
          </div>

          <div className="content">
            {/* 1.9 */}
            <table className="w-full border-collapse mb-5 text-xs">
              <thead>
                <tr>
                  <th colSpan="10" className="border p-2  text-left">
                    1.9 SF-04B: Production Group Statement
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="10"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em>
                      The information in this form must be provided in Microsoft
                      Excel format. Note that Issuers are not required to
                      support registration of Production Groups and that
                      additional information may be required.
                    </em>
                    <p className="text-[8px] text-gray-600">
                      <em>{`Complete all fields`}</em>
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-bold" colSpan="3">
                    Production Group name
                    <p className="text-[8px] text-gray-600">
                      <em>
                        ({`same as Facility name in Production Details section`}
                        )
                      </em>
                    </p>
                  </td>
                  <td
                    className="border p-2 text-left break-all h-28"
                    colSpan="7"
                  ></td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold" colSpan="3">
                    Production Group ID
                    <p className="text-[8px] text-gray-600">
                      <em>
                        (
                        {`same as Facility ID recorded in the Evident Registry`}
                        )
                      </em>
                    </p>
                  </td>
                  <td
                    className="border p-2 text-left break-all h-28"
                    colSpan="7"
                  ></td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold text-left" colSpan="3">
                    Period start date
                  </td>
                  <td className="border p-2 text-left" colSpan="1">
                    {convertToday(data?.data.periodStartDate)}{" "}
                  </td>
                  <td className="border p-2 text-left" colSpan="2">
                    {convertToMonth(data?.data.periodStartDate)}{" "}
                  </td>
                  <td className="border p-2 text-left" colSpan="4">
                    {convertToYear(data?.data.periodStartDate)}{" "}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold text-left" colSpan="3">
                    Period end date
                  </td>
                  <td className="border p-2 text-left" colSpan="1">
                    {convertToday(data?.data.periodEndDate)}{" "}
                  </td>
                  <td className="border p-2 text-left" colSpan="2">
                    {convertToMonth(data?.data.periodEndDate)}{" "}
                  </td>
                  <td className="border p-2 text-left" colSpan="4">
                    {convertToYear(data?.data.periodEndDate)}{" "}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold" colSpan="6">
                    Measurement unit.
                    <p className="text-[8px] text-gray-600">
                      <em>
                        (
                        {`the same unit of measure must be used for all reading`}
                        )
                      </em>
                    </p>
                  </td>
                  <td
                    className="border p-2 text-left break-all h-28"
                    colSpan="4"
                  >
                    MWh / kWh
                  </td>
                </tr>
                <tr>
                  <th
                    colSpan="10"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em>
                      The columns in the below table should be completed and
                      provided in Microsoft Excel format. IDs, Installation
                      names, and Meter IDs used must match those provided in the
                      Production Group registration.
                    </em>
                  </th>
                </tr>
                <tr>
                  <th className="border p-2 text-left w-12" rowSpan="2">
                    ID
                  </th>
                  <th className="border p-2 text-left w-24" rowSpan="2">
                    Installation name
                  </th>
                  <th className="border p-2 text-left w-24" rowSpan="2">
                    Meter ID
                  </th>
                  <th className="border p-2 text-center" colSpan="2">
                    Opening Read
                  </th>
                  <th className="border p-2 text-center" colSpan="2">
                    Closing Read
                  </th>
                  <th className="border p-2 text-left w-24" rowSpan="2">
                    Volume
                  </th>
                </tr>
                <tr>
                  <th className="border p-2 text-center">Value</th>
                  <th className="border p-2 text-center">Date</th>
                  <th className="border p-2 text-center">Value</th>
                  <th className="border p-2 text-center">Date</th>
                </tr>
                <tr>
                  <td className="border p-2 text-left break-all h-20"></td>
                  <td className="border p-2 text-left break-all h-20"></td>
                  <td className="border p-2 text-left break-all h-20"></td>
                  <td className="border p-2 text-left break-all h-20"></td>
                  <td className="border p-2 text-left break-all h-20"></td>
                  <td className="border p-2 text-left break-all h-20"></td>
                  <td className="border p-2 text-left break-all h-20"></td>
                  <td className="border p-2 text-left break-all h-20"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="footer">
            {/* <div className="text-center mt-5 text-xs text-gray-600 flex justify-between">
            <p>Version: 1.3</p>
            <p>Copyright © Evident Ev Limited</p>
            <p>Page 1/1</p>
          </div> */}
          </div>
        </div>

        <div className="page" id="page-5">
          {/* Page 5 content */}
          <div className="textoutside">
            --- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---
          </div>
          <div className="headers">
            <div className="text-center mb-5 flex justify-between">
              <img
                src={pdfIcon}
                alt="Logo"
                className="w-14 h-20 mb-2 text-gray-600"
              />
              <div className="flex-col">
                <h1 className="text-lg text-gray-800">
                  Evident. I-REC Code for Electricity
                </h1>
                <h2 className="text-lg text-gray-600">SF-04: Issue Request</h2>
              </div>
            </div>
          </div>

          <div className="content">
            {/*1.10 */}
            <table className="w-full border-collapse mb-5 text-xs">
              <thead>
                <tr>
                  <th colSpan="10" className="border p-2  text-left">
                    1.10 SF-04C: Fuel Consumption Statement
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="10"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em>
                      This form is be used for all Issue Request relating to
                      multi-fuelled generators unless an alternative method of
                      information provision has been agreed with the responsible
                      Issuer. The information in this form must be provided in
                      microsoft Excel format. Unless expicitly confirmed
                      otherwise, I-REC(E) for multi-fuel generators shall only
                      be issued for that partion of electricity production
                      derived from renewable sources.
                    </em>
                  </th>
                </tr>
              </thead>
              <tbody>
              <tr>
                  <td className="border p-2 font-bold w-1/4">
                    Facility ID/code
                  </td>
                  <td className="border p-2 text-left break-all" colSpan="9">
                    {data?.isSign == false 
                      ? ""
                      : data?.data.Sign}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold w-1/4">Facility name</td>
                  <td className="border p-2 text-left break-all" colSpan="9">
                    {data?.isSign == false 
                      ? ""
                      : data?.data.Sign}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold text-left" colSpan="1">
                    Period start date
                  </td>
                  <td className="border p-2 text-left" colSpan="2">
                    {convertToday(data?.data?.periodStartDate)}{" "}
                  </td>
                  <td className="border p-2 text-left" colSpan="2">
                    {convertToMonth(data?.data?.periodStartDate)}{" "}
                  </td>
                  <td className="border p-2 text-left" colSpan="5">
                    {convertToYear(data?.data?.periodStartDate)}{" "}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold text-left" colSpan="1">
                    Period end date
                  </td>
                  <td className="border p-2 text-left" colSpan="2">
                    {convertToday(data?.data?.periodEndDate)}{" "}
                  </td>
                  <td className="border p-2 text-left" colSpan="2">
                    {convertToMonth(data?.data?.periodEndDate)}{" "}
                  </td>
                  <td className="border p-2 text-left" colSpan="5">
                    {convertToYear(data?.data?.periodEndDate)}{" "}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="10"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em className="font-light">
                      This column in the below table should be completed and
                      provided in Microsoft Excel format, IDs, Installation
                      names, and Meter IDs used must those provided in the
                      Production Group registration.
                    </em>
                    <em className="font-bold">
                      Please list all fuels utilised within the reporting
                      period.
                    </em>
                  </td>
                </tr>
                <tr>
                  <th className="border p-2  text-left w-12" colSpan="2">
                    Fuel code
                  </th>
                  <th className="border p-2  text-left w-24" colSpan="1">
                    Gross Calorifuc Value{" "}
                    <em className="font-light">(MJ/kg)</em>
                  </th>
                  <th className="border p-2  text-left w-24" colSpan="1">
                    Stock Balance at Stat Date{" "}
                    <em className="font-light">(kg)</em>
                  </th>
                  <th className="border p-2  text-left" colSpan="1">
                    Stock Added durinf Period{" "}
                    <em className="font-light">(kg)</em>
                  </th>
                  <th className="border p-2  text-left" colSpan="1">
                    Stock Balance at End Date{" "}
                    <em className="font-light">(kg)</em>
                  </th>
                  <th className="border p-2  text-left w-24" colSpan="1">
                    Fuel Consumed <em className="font-light">(kg)</em>
                  </th>
                  <th className="border p-2  text-left" colSpan="1">
                    Energy from Source
                  </th>
                </tr>
                <tr>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="2"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                </tr>
                <tr>
                  <td colSpan="10" className="border p-2 font-bold">
                    Renewable energy sources
                  </td>
                </tr>
                <tr>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="2"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                </tr>
                <tr>
                  <td colSpan="10" className="border p-2 font-bold">
                    Non-renewable energy sources
                  </td>
                </tr>
                <tr>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="2"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                  <td
                    className="border p-2  text-left break-all h-20"
                    colSpan="1"
                  ></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="footer">
            {/* <div className="text-center mt-5 text-xs text-gray-600 flex justify-between">
            <p>Version: 1.3</p>
            <p>Copyright © Evident Ev Limited</p>
            <p>Page 1/1</p>
          </div> */}
          </div>
        </div>

        <div className="page" id="page-6">
          {/* Page 6 content */}
          <div className="textoutside">
            --- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---
          </div>
          <div className="headers">
            <div className="text-center mb-5 flex justify-between">
              <img
                src={pdfIcon}
                alt="Logo"
                className="w-14 h-20 mb-2 text-gray-600"
              />
              <div className="flex-col">
                <h1 className="text-lg text-gray-800">
                  Evident. I-REC Code for Electricity
                </h1>
                <h2 className="text-lg text-gray-600">SF-04: Issue Request</h2>
              </div>
            </div>
          </div>

          <div className="content">
            {/*1.11 */}
            <table className="w-full border-collapse mb-5 text-xs">
              <thead>
                <tr>
                  <th colSpan="4" className="border p-2  text-left">
                    1.11 Production Auditor
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "
                  >
                    <em>
                      Complete all fields if a Production Auditor has reviewed
                      the information for this fuel Comsumption Statement.
                    </em>
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan="4"
                    className="border p-2  text-[10px] font-noto-sans text-gray-600 text-left "
                  >
                    The undersigned Production Auditor has reviewed this Fuel
                    Consumption Statement and has no material reason to doubt
                    the correctness of the evidence submitted.
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-bold w-1/4">
                    Organisation name
                  </td>
                  <td className="border p-2 text-left break-all" colSpan="3">
                    {data?.isSign == false
                      ? ""
                      : data?.data?.organisationName}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold w-1/4">Signature</td>
                  <td className="border p-2 text-left break-all" colSpan="3">
                    {data?.isSign == false
                      ? ""
                      : data?.data?.Sign}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">
                    <div className="flex text-left">
                      <p>Name</p>
                      <p className="text-[8px] text-gray-500 ml-1 mt-0">
                        <em>(BLOCK CAPITALS)</em>
                      </p>
                    </div>
                  </td>
                  <td className="border p-2 text-left break-all" colSpan="3">
                    {data?.isSign == false
                      ? ""
                      : data?.data?.Sign}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold text-left">Date</td>
                  <td className="border p-2 text-left">
                    {data?.isSign == false ? "" : getDay(now)}{" "}
                  </td>
                  <td className="border p-2 text-left">
                    {data?.isSign == false ? "" : getMonth(now)}{" "}
                  </td>
                  <td className="border p-2 text-left">
                    {data?.isSign == false ? "" : getYear(now)}{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="footer">
            {/* <div className="text-center mt-5 text-xs text-gray-600 flex justify-between">
            <p>Version: 1.3</p>
            <p>Copyright © Evident Ev Limited</p>
            <p>Page 1/1</p>
          </div> */}
          </div>
        </div>
      </div>
      {/* <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={generatePdf}>Generate PDF</button> */}
    </div>
  );
};

export default PdfFormPreviewSF04;
