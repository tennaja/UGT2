import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {setSF02,setCount} from "../../Redux/Device/Action"
import html2pdf from 'html2pdf.js';
import pdfIcon from '../assets/EV.png';
import './page.css'

const PdfFormPreview = (data,Sign) => {
  console.log(data.data)
  console.log(data.Sign)
  const dispatch = useDispatch();
  const filesf02 = useSelector((state)=> state.device.filesf02) 
  const count = useSelector((state) => state.device.count)
  console.log(count)
  const [load,setload] = useState(false)
  const [list, setList] = useState();
  const [version, setVersion] = useState(count ?? 0);
  
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0'); // Day of the month with leading zero
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month with leading zero
  const year = now.getFullYear();

  console.log(version)
  // useEffect(() => {
  //   if(Sign){
      
  //   }
  // }, [data.data.id]); // Added dependency to avoid potential issue with useEffect

  const pdfContentRef = useRef("");
  
  useEffect(()=>{
    generatePdf();
  },[])

  const generatePdf = () => {
    setload(true);
    const element = pdfContentRef.current;
    
    const newVersion = (version + 1);
    console.log("VERSION ---------------",newVersion)
    dispatch(setCount(newVersion))
    // Ensure the content is visible temporarily for PDF generation
    element.style.display = 'block';
  
    html2pdf()
      .from(element)
      .set({
        html2canvas: {
          scale: 4, // Increase the scale for better image resolution
          letterRendering: true, // Improve font rendering
          useCORS: true // Enable CORS to handle images from other origins
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          precision: 16 // Increase precision for better quality
        }
      })
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
  
          // Adjust footer position
          pdf.setFontSize(8);
          pdf.text(
            `Version: 1.3                                                               Copyright © Evident Ev Limited                                                                               Page ${i}/${totalPages}`,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 7,
            { align: 'center' }
          );
  
        }
  
        // Generate PDF Blob
        const pdfBlob = pdf.output('blob');
        
  // Create a File object from the Blob with a filename
        const pdfFile = new File([pdfBlob], `SF-02v${newVersion}.pdf`, { type: 'application/pdf' });
        console.log(pdfFile,data)
        // Open the PDF in a new tab for preview
        const url = URL.createObjectURL(pdfBlob);
        const pdfWindow = window.open(url, '_blank');
        if (pdfWindow) pdfWindow.focus();
  
        
        // Dispatch the generated PDF Blob for storage
        dispatch(setSF02(pdfFile));
        
        console.log('Dispatched PDF File:', pdfFile);
        
        
        
        // Update the version in state to the new version
        // setVersion(newVersion);

        // Hide the content again
        element.style.display = 'none';
        setload(false);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        // Hide the content again if there's an error
        element.style.display = 'none';
        setload(false);
        // Display an alert to the user (optional)
        alert('An error occurred while generating the PDF. Please try again.');
      });
  };
 if(load){
  return ""
 }
  return (
    <div>
      <div id="pdf-content" ref={pdfContentRef} className="hidden">
        <div className="page" id="page-1">
        <div className="textoutside">--- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---</div>
        <div className="headers">
        <div className="text-center mb-5 flex justify-between">
            <img src={pdfIcon}  alt="Logo" className="w-14 h-20 mb-2 text-gray-600" />
            <div className='flex-col'>
            <h1 className="text-lg text-gray-800">Evident. I-REC Code for Electricity</h1>
            <h2 className="text-lg text-gray-600">SF-02: Production Facility Registration</h2>
            </div>
            
          </div>
          </div>
          {/* page 1 */}
          <div className='content'>
          <table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="4" className="border p-2  text-left ">1.1 SF-02: Production Facility Registration</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left "><em>complete all fields.</em></th>
              </tr>
              <tr>
                <td className="border p-2 font-bold text-left w-1/3">Date</td>
                <td className="border p-2 text-left ">{data?.Sign == "" ? "" :day}</td>
                <td className="border p-2 text-left ">{data?.Sign == "" ? "" :month}</td>
                <td className="border p-2 text-left ">{data?.Sign == "" ? "" :year}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-bold ">Registration type</td>
                <td className="border text-left break-all " colSpan="3">

                    <table className="w-full border-collapse">

                        <tbody>
                            <tr>
                            <td className="border p-2 font-bold w-1/3 ">New</td>
                            <td className="border p-2 text-left break-all "></td>
                            
                            </tr>
                            <tr>
                            <td className="border p-2 font-bold w-1/3  ">Change of details</td>
                            <td className="border p-2 text-left break-all " ></td>
                            
                            </tr>
                        </tbody>
                    </table>
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-bold ">Submitter status
                <p className='text-[8px] text-gray-600'><em>({`please confirm and, if yes,
provide evidence and
completed SF-02C: Owner’s
Declaration with your
submission`})</em></p>
                </td>
                <td className="border p-2 text-left break-all w-40" colSpan="2">Is the Registrant also the owner of the
                Production Facility?</td>
                <td className="border p-2 text-left break-all " colSpan="2">Yes</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th colSpan="4" className="border p-2  text-left ">1.2 Registrant Contact Details</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">complete all fields.</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Organisation ID/code', ``],
                ['Organisation name', ''],
                ['Contact person', ''],
                ['Business address', ''],
                ['Country', ''],
                ['e-mail', `${data?.Sign == "" ? "" : data?.Sign.email}`],
                ['Telephone', '']
              ].map((row, index) => (
                <tr key={index}>
                  <td className="border p-2 font-bold break-all w-1/3">{row[0]}</td>
                  <td className="border p-2 text-left break-all " colSpan="2">{row[1]}</td>
                </tr>
              ))}
            </tbody>
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
        <div className="textoutside">--- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---</div>
        <div className="headers">
          
        <div className="text-center flex justify-between ">
        <img src={pdfIcon}  alt="Logo" className="w-14 h-20 mb-2 text-gray-600" />
            <div className='flex-col'>
            <h1 className="text-lg text-gray-800">Evident. I-REC Code for Electricity</h1>
            <h2 className="text-lg text-gray-600">SF-02: Production Facility Registration</h2>
            </div>
            </div>
          </div>
          <div className='content'>
          <table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="4" className="border p-2  text-left">1.3 Production Facility Details</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">complete all fields.</th>
              </tr>
            </thead>
            <tbody>
            <tr>
                <td className="border p-2 font-bold w-72 ">Facility name
                <p className='text-[8px] text-gray-600'>({`including postal or zip code`})</p>
                </td>
                <td className="border p-2 text-left break-all " >{data?.data?.name}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Facility address</td>
                <td className="border p-2 text-left break-all" >Expression</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Country</td>
                <td className="border p-2 text-left break-all" >{data?.data?.countryCode}</td>
              </tr>
              <tr>
                <td className="border p-2  font-bold"><div className="flex text-left"><p>Latitude</p><p className='text-[8px] text-gray-500 ml-1'>(±n.nnnnnn)</p></div></td>
                <td className="border p-2 text-left break-all" >{data?.data?.latitude}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold"><div className="flex text-left"><p>Longitude</p><p className='text-[8px] text-gray-500 ml-1'>(±n.nnnnnn)</p></div></td>
                <td className="border p-2 text-left break-all" >{data?.data?.longitude}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Installed capacity</td>
                <td className="border text-left break-all" >

                    <table className='w-full text-xs'>

                        <tbody>
                            <tr>
                            <td className="border p-2 font-bold w-1/2">{data?.data?.capacity} MW</td>
                            <td className="border p-2 text-left text-xs break-all w-1/2"><em>Up to 6 decimal places</em></td>
                            </tr>
                            <tr>
                            <td className="border text-center w-1/2">
                            <table className='w-full border-collapse' >

                        <tbody>
                            <tr>
                            <td className="border p-2 text-center items-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            </tr>
                        </tbody>
                    </table>
                            </td>
                            <td className="border text-center w-1/2">
                            <table className='w-full border-collapse' >

                        <tbody>
                            <tr>
                            <td className="border p-2 text-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            <td className="border p-2 text-center w-1/6">x</td>
                            </tr>
                        </tbody>
                    </table>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-bold w-60">Meter or Measurement ID(s)</td>
                <td className="border p-2 text-left break-all" ></td>
              </tr>
              <tr>
                <td className="border p-2 font-bold w-64 ">Number of generating units</td>
                <td className="border p-2 text-left break-all" >{data?.data?.generatingUnit}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Commissioning date</td>
                <td className="border p-2 text-left break-all" >Expression</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Owner of the network to which the Production Device is connected and the voltage of that connection</td>
                <td className="border p-2 text-left break-all" >{data?.data?.deviceOwner}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">If the Production Device is not connected directly to the grid, specify the circumstances, and additional relevant meter registration numbers</td>
                <td className="border p-2 text-left break-all" ></td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Expected form of volume evidence
                <p className='text-[8px] text-gray-600'>({`if other please specify`})</p>
                </td>
                <td className="border p-2 text-left break-all" >{data?.data?.isMeteringData == "True" ? "Metering data / " : ""}  {data.data.isContractSaleInvoice == "True" ? "Contract sales invoice / " : ""}  {data.data.isOther == "True" ? "Other / " : ""} {data.data.otherDescription}</td>
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

        <div className="page" id="page-3">
        <div className="textoutside">--- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---</div>
        <div className="headers">
        <div className="text-center mb-5 flex justify-between">
            <img src={pdfIcon}  alt="Logo" className="w-14 h-20 mb-2 text-gray-600" />
            <div className='flex-col'>
            <h1 className="text-lg text-gray-800">Evident. I-REC Code for Electricity</h1>
            <h2 className="text-lg text-gray-600">SF-02: Production Facility Registration</h2>
            </div>
            
          </div>
          </div>

<div className='content'>
<table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="4" className="border p-2  text-left">1.4 Removal Type and Code</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">Complete all fields - please refer to SD 02: Technologies and Fuels.</th>
              </tr>
            </thead>
            <tbody>
            
              <tr>
                <td className="border p-2 font-bold w-1/4 " >Fuel
                <p className='text-[8px] text-gray-600'>({`please list all possible fuels if Production Facility is a multifuel generator`})</p></td>
                <td className="border text-left" >

                    <table className='w-full border-collapse text-xs h-24' >

                        <tbody >
                            <tr>
                            <td className="border p-2 font-bold text-left w-44">Code</td>
                            <td className="border p-2 font-bold text-left break-all ">Description</td>
                            </tr>
                            <tr>
                            <td className="border p-2 text-left break-all ">
                           
                            </td>
                            <td className="border p-2 text-left break-all ">
                            
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-bold w-96" >technology</td>
                <td className="border text-left" >

                    <table className='w-full border-collapse text-xs' >

                        
                            <tr>
                            <td className="border p-2 font-bold text-left w-44">Code</td>
                            <td className="border p-2 font-bold text-left ">Description</td>
                            </tr>
                            <tr>
                            <td className="border p-2 text-left break-all">
                           
                            </td>
                            <td className="border p-2 text-left break-all">
                            
                            </td>
                            </tr>
                        
                    </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="4" className="border p-2  text-left">1.5 Business Details</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">Complete all required fields.</th>
              </tr>
            </thead>
            <tbody>
            <tr>
                <td className="border p-2 font-bold w-1/2">Is there an on-site (captive) consumer present?
                <p className='text-[8px] text-gray-600'>({`if yes please provide details`})</p></td>
                <td className="border p-2 text-left break-all w-full" >{data?.data?.onSiteConsumer}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Auxiliary/standby energy sources present?
                <p className='text-[8px] text-gray-600'>({`if yes please provide details`})</p>
                </td>
                <td className="border p-2 text-left break-all" colSpan="3">{data?.data?.energySource}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Please give details of how the site can import electricity by means other than through the meter(s) specified above</td>
                <td className="border p-2 text-left break-all" colSpan="3">{data?.data?.otherImportEletricity}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Please give details (including registration id) of any carbon offset or energy tracking scheme for which the Production Facility is registered.  State ‘None’ if that is the case</td>
                <td className="border p-2 text-left break-all" colSpan="3">{data?.data?.otherCarbonOffset}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Please identify any Labelling Scheme(s) for which the Production Facility is accredited</td>
                <td className="border p-2 text-left break-all" colSpan="3"></td>
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
          <div className="textoutside">--- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---</div>
        <div className="headers">
        <div className="text-center mb-5 flex justify-between">
            <img src={pdfIcon}  alt="Logo" className="w-14 h-20 mb-2 text-gray-600" />
            <div className='flex-col'>
            <h1 className="text-lg text-gray-800">Evident. I-REC Code for Electricity</h1>
            <h2 className="text-lg text-gray-600">SF-02: Production Facility Registration</h2>
            </div>
            
          </div>
          </div>

<div className='content'>
<table className="w-full border-collapse mb-5 text-xs">
            
            <tbody>
            
              <tr>
                <td className="border p-2 font-bold w-1/2">Has the Production Facility ever received public (government) funding (e.g. Feed in Tariff)?</td>
                <td className="border p-2 text-left break-all w-full" colSpan="3">{data?.data?.publicFunding}</td>
              </tr>
              <tr>
                <td className="border p-2 text-left">(if public (government) funding has been received when did/will it finish?)</td>
                <td className="border p-2 text-left ">DD</td>
                <td className="border p-2 text-left ">MM</td>
                <td className="border p-2 text-left w-36">YYYY</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold text-left">Requested effective date of registration: (no earlier than 12 months prior to submitting this form)</td>
                <td className="border p-2 text-left">DD</td>
                <td className="border p-2 text-left">MM</td>
                <td className="border p-2 text-left">YYYY</td>
              </tr>
              
              
            </tbody>
          </table>
          <table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="4" className="border p-2  text-left">1.6 Business Details</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">complete all fields.</th>
              </tr>
            </thead>
            <tbody>
            <tr>
                <td className="border p-2 font-bold w-64">Name of proposed Verification Agent
                <p className='text-[8px] text-gray-600'>({`if not the Issuer`})</p>
                </td>
                <td className="border p-2 text-left break-all" ></td>
              </tr>
            </tbody>
          </table>
          <table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="4" className="border p-2  text-left">1.7 Business Details</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">Please use this field to provide any further information you feel   relevant to this registration</th>
              </tr>
            </thead>
            <tbody>
            <tr>
                <td className="border p-2  h-72 break-all" colSpan="4"></td>  
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
          <div className="textoutside">--- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---</div>
        <div className="headers">
        <div className="text-center mb-5 flex justify-between">
            <img src={pdfIcon}  alt="Logo" className="w-14 h-20 mb-2 text-gray-600" />
            <div className='flex-col'>
            <h1 className="text-lg text-gray-800">Evident. I-REC Code for Electricity</h1>
            <h2 className="text-lg text-gray-600">SF-02: Production Facility Registration</h2>
            </div>
            
          </div>
          </div>

<div className='content'>
<table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="4" className="border p-2  text-left">1.8 Confirmation Signature</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">complete all fields.</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td className="border p-2 h-96 break-all" colSpan="4">By submitting this form I confirm acceptance of Evident’s Privacy Policy, as published on 
https://evident.global/privacy and any such policies as published by the responsible Issuer.

I acknowledge and agree that the information provided will be used by Evident for the purpose of providing services relating to I‑REC Electricity certificates and that Evident may share this information with other organisations as may be necessary for the provision of these services.
</td>  
              </tr>
             
              <tr>
              <td className="border p-2 font-bold w-1/4" >Signature</td>
              <td className="border p-2 text-left break-all" colSpan="3">{data?.Sign == "" ? "" :data?.Sign?.firstName + " " +data?.Sign?.lastName}</td>
                
              </tr>
              <tr>
              <td className="border p-2 font-bold" >Name</td>
              <td className="border p-2 text-left break-all" colSpan="3">{ data?.Sign == "" ? "" : data?.Sign?.firstName + " " +data?.Sign?.lastName}</td>
                
              </tr>
              <tr>
                <td className="border p-2 font-bold text-left">Date</td>
                <td className="border p-2 text-left">{data?.Sign == "" ? "" : day}</td>
                <td className="border p-2 text-left">{data?.Sign == "" ? "" :month}</td>
                <td className="border p-2 text-left">{data?.Sign == "" ? "" :year}</td>
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
          <div className="textoutside">--- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---</div>
        <div className="headers">
        <div className="text-center mb-5 flex justify-between">
            <img src={pdfIcon}  alt="Logo" className="w-14 h-20 mb-2 text-gray-600" />
            <div className='flex-col'>
            <h1 className="text-lg text-gray-800">Evident. I-REC Code for Electricity</h1>
            <h2 className="text-lg text-gray-600">SF-02: Production Facility Registration</h2>
            </div>
            
          </div>
          </div>

<div className='content'>
<table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="4" className="border p-2  text-left">1.9 SF-02A: Registrant’s Declaration</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">If not submitted with SF-02: Production Facility Registration, for example if all registration data is submitted via an online form, this Registrant’s Declaration should be copied onto the Registrant’s headed paper, completed and signed by an authorised representative of the Registrant. It can be scanned and submitted electronically to the Issuer. An Issuer may accept a company stamp as an alternative to an authorised representative’s signature.  Text within [square brackets] should be replaced with the appropriate content.</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td className="border p-2 h-96 break-all" colSpan="4">On behalf of the Registrant, [insert Registrant organisation name here], I agree to be subject to the I‑REC Code for Electricity and warrant that the information contained in this application is truthful and exhaustive.

Any planned changes concerning the information given in this form will be announced in advance to the Facility Verifier (if any) and the Issuer. Any unplanned changes will be reported to the Facility Verifier (if any) and the Issuer at the first possible occasion.

The Production Facility Owner and the Registrant as their agent accept the possibility of unannounced control and auditing visits to their own premises and/or the premises of the Production Facility, as prescribed in the I‑REC Code for Electricity.
 
I confirm that all necessary permissions of the Production Facility Owner have been granted to the Registrant and we therefore undertake that, for the same units of electrical energy, our organisation will not receive or apply for any certificates or other instruments representing the associated renewable or carbon attributes or the calculated displacement (‘offset’) of these attributes from the electricity production. We also, to the best of our knowledge, have the right to separate renewable attributes from the associated physical electricity generation and are not required by legislation or contract to retain these attributes for any reason.</td>  
              </tr>
             
              <tr>
              <td className="border p-2 font-bold w-1/4" >Signature</td>
              <td className="border p-2 text-left break-all" colSpan="3">{data?.Sign == "" ? "" : data?.Sign?.firstName + " " +data?.Sign?.lastName}</td>
              </tr>
              <tr>
              <td className="border p-2 font-bold" ><div className="flex text-left"><p>Name</p><p className='text-[8px] text-gray-500 ml-1 mt-0'>(BLOCK   CAPITALS)</p></div></td>
              <td className="border p-2 text-left break-all" colSpan="3">{data?.Sign == "" ? "" : data?.Sign?.firstName  + " " +data?.Sign?.lastName}</td>
                
              </tr>
              <tr>
                <td className="border p-2 font-bold text-left">Date</td>
                <td className="border p-2 text-left">{data?.Sign == "" ? "" :day}</td>
                <td className="border p-2 text-left">{data?.Sign == "" ? "" :month}</td>
                <td className="border p-2 text-left">{data?.Sign == "" ? "" :year}</td>
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

        <div className="page" id="page-7">
          {/* Page 7 content */}
          <div className="textoutside">--- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---</div>
        <div className="headers">
        <div className="text-center mb-5 flex justify-between">
            <img src={pdfIcon}  alt="Logo" className="w-14 h-20 mb-2 text-gray-600" />
            <div className='flex-col'>
            <h1 className="text-lg text-gray-800">Evident. I-REC Code for Electricity</h1>
            <h2 className="text-lg text-gray-600">SF-02: Production Facility Registration</h2>
            </div>
            
          </div>
          </div>

<div className='content'>
<table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="10" className="border p-2  text-left">1.10 SF-02A: Registrant’s Declaration</th>
              </tr>
              <tr>
              <th colSpan="10" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">The information in this form must be provided in Microsoft Excel format. Note that Issuers are not required to support registration of Production Groups and that additional information may be required.
              Complete all fields.</th>
              </tr>
            </thead>
            <tbody>
            
             
              <tr>
              <td className="border p-2 font-bold"colSpan="3" >Production Group name
              <p className='text-[8px] text-gray-600'>({`same as Facility name in Production Facility Details section`})</p>
              </td>
              <td className="border p-2 text-left break-all h-28" colSpan="7"></td>
              </tr>

              
              <tr>
                <th  className="border p-2  text-left w-12" colSpan="1">id</th>
                <th  className="border p-2  text-left w-24" colSpan="1">Installation name</th>
                <th  className="border p-2  text-left w-24" colSpan="1">Full address</th>
                <th  className="border p-2  text-left" colSpan="1">Latitude</th>
                <th  className="border p-2  text-left" colSpan="1">Longitude</th>
                <th  className="border p-2  text-left w-24" colSpan="1">Installed capacity (MW)</th>
                <th  className="border p-2  text-left" colSpan="1">Meter ID</th>
                <th  className="border p-2  text-left" colSpan="1">Meter Type</th>
                
              </tr>
              <tr>
                <td  className="border p-2  text-left break-all h-20" colSpan="1"></td>
                <td  className="border p-2  text-left break-all h-20" colSpan="1"></td>
                <td  className="border p-2  text-left break-all h-20" colSpan="1"></td>
                <td  className="border p-2  text-left break-all h-20" colSpan="1"></td>
                <td  className="border p-2  text-left break-all h-20" colSpan="1"></td>
                <td  className="border p-2  text-left break-all h-20" colSpan="1"></td>
                <td  className="border p-2  text-left break-all h-20" colSpan="1"></td>
                <td  className="border p-2  text-left break-all h-20" colSpan="1"></td>
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

        <div className="page" id="page-8">
          {/* Page 8 content */}
          <div className="textoutside">--- THIS FORM MUST BE SUBMITTED THROUGH THE EVIDENT REGISTRY---</div>
        <div className="headers">
        <div className="text-center mb-5 flex justify-between">
            <img src={pdfIcon}  alt="Logo" className="w-14 h-20 mb-2 text-gray-600" />
            <div className='flex-col'>
            <h1 className="text-lg text-gray-800">Evident. I-REC Code for Electricity</h1>
            <h2 className="text-lg text-gray-600">SF-02: Production Facility Registration</h2>
            </div>
            
          </div>
          </div>

<div className='content'>
<table className="w-full border-collapse mb-5 text-xs">
            <thead>
              <tr>
                <th colSpan="10" className="border p-2  text-left">1.11 SF-02C: Owner’s Declaration</th>
              </tr>
              <tr>
              <th colSpan="4" className="border p-2  text-[8px] font-noto-sans text-gray-600 text-left ">The Production Facility Owner shall, if not the Registrant, be required to submit a declaration confirming that the Registrant has been assigned the rights to register the Production Facility. The following approved text should be copied onto the Production Facility Owner’s headed paper, completed and signed by an officer of the Production Facility Owner. It can be scanned and submitted electronically to the Issuer. An Issuer may accept a company stamp as an alternative to an authorised representative’s signature. Text within [square brackets] should be replaced with the appropriate content.</th>
              </tr>
            </thead>
            <tbody>
            
             
            <tr>
              <td className="border p-2 h-96 break-all" colSpan="4">
               {
                 `To : Evident
                 400 Springvale Road
                 Sheffield
                 S10 1LP
                 United Kingdom
                 Date: [insert date here]
                 
                 Declaration of Attribute Generation and Ownership
                 
                 Please accept this letter as granting [insert Registrant organisation name here] the exclusive right to act in respect of trading all renewable energy attributes (representing the environmental, economic , and social benefits associated with the generation of electricity) including all associated carbon attributes with [insert Production Facility name here] from [insert Effective Registration Date here] until [further notice/[insert end date here]]. The rights to these attributes are in our exclusive ownership at the time of signing.
                 
                 We understand that the attributes associated with renewable electricity generation are different and distinct from instruments that may be granted under an emissions reduction scheme that have been calculated as displacement (‘offset’) against a business as usual case.
                 
                 In granting this permission we accept that the ownership of the associated renewable and carbon attributes from the generation of electricity may be passed to [insert Registrant company name here] in the form of I REC(E)s as defined in the I REC Code for Electricity. We have received, or will receive, valuable consideration for the delivery of these attributes. We therefore undertake that, for the same units of electrical energy, our organisation will not receive or apply for any certificates or other instruments representing the associated renewable or carbon attributes or the calculated displacement (‘offset’) of these attributes from the electricity production. We also, to the best of our knowledge, have the right to separate renewable attributes from the associated physical electricity generation and are not required by legislation or contract to retain these attributes for any reason.
                 Yours sincerely,
                  
                 On behalf of [insert owner name here]`
               }</td>  
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

export default PdfFormPreview;
