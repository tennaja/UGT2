import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Highlighter from "react-highlight-words";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow ,Paper} from '@mui/material';

const ModalValidation = (props) => {
  const {
    dataList,
    columns,
    onClickConfirmBtn,
    closeModal,
    buttonTypeColor = "primary",
  } = props;

  const {
    handleSubmit,
  } = useForm();

  const [searchDevice, setSearchDevice] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSearchDeviceChange = (e) => {
    setSearchDevice(e.target.value);
  };

  const handleSelectedRowsChange = (selected) => {
    const selectedRowData = dataList.filter((row) => selected.includes(row.id));
    setSelectedRows(selectedRowData);
  };

  const onClickOk = () => {
    onClickConfirmBtn(selectedRows);
    closeModal();
  };

  const getButtonColor = () => {
    switch (buttonTypeColor) {
      case "primary":
        return "bg-[#87BE33]";
      case "danger":
        return "bg-[#EF4835]";
      default:
        return "bg-[#87BE33]";
    }
  };

  const Highlight = ({ children }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const columnErrorDevice = [
    {
      id: "deviceName",
      label: "Device Name",
      align: "left",
      render: (row) => (
        <div className="break-words" style={{ maxWidth: "350px" }}>
          <Highlighter
            highlightTag={Highlight}
            searchWords={[searchDevice]}
            autoEscape={true}
            textToHighlight={row.deviceName}
          />
        </div>
      ),
    },
    {
      id: "portfolioName",
      label: "Portfolio Name",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.portfolioName}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={formatDate(row.startDate)}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={formatDate(row.endDate)}
        />
      ),
    },
  ];

  const columnErrorSub = [
    {
      id: "subscriberName",
      label: "Subscriber Name",
      align: "left",
      render: (row) => (
        <div className="break-words" style={{ maxWidth: "350px" }}>
          <Highlighter
            highlightTag={Highlight}
            searchWords={[searchDevice]}
            autoEscape={true}
            textToHighlight={row.subscriberName}
          />
        </div>
      ),
    },
    {
      id: "portfolioName",
      label: "Portfolio Name",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.portfolioName}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={formatDate(row.startDate)}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={formatDate(row.endDate)}
        />
      ),
    },
  ];


  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          className="inline-block align-middle bg-white rounded px-4 pt-4 pb-5 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form>
            <div className="bg-white rounded p-14 px-2 md:p-4 mb-6">
              <div className="text-sm">
                <div className="grid gap-4 gap-y-2 text-sm lg:grid-cols-6">
                  <div className="col-span-2 mb-4">
                    <div className="md:col-span-6"></div>
                  </div>
                </div>
                {columns == "device" ? 
                <TableContainer component={Paper}
                style={{ border: "none", boxShadow: "none" }}>
                          <Table>
                            <TableHead style={{
                                      // textAlign: index === 0 ? "left" : "center",
                                      backgroundColor: "#F3F6F9",
                                    }}>
                              <TableRow>
                                {columnErrorDevice.map((column) => (
                                  <TableCell key={column.id} align={column.align}>
                                    {column.label}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {dataList.map((row) => (
                                <TableRow key={row.id}>
                                  {columnErrorDevice.map((column) => (
                                    <TableCell key={column.id} align={column.align} >
                                      {column.render(row)}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer> : 
                        <TableContainer component={Paper}
                        style={{ border: "none", boxShadow: "none" }}>
                                  <Table>
                                    <TableHead style={{
                                              // textAlign: index === 0 ? "left" : "center",
                                              backgroundColor: "#F3F6F9",
                                            }}>
                                      <TableRow>
                                        {columnErrorSub.map((column) => (
                                          <TableCell key={column.id} align={column.align}>
                                            {column.label}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {dataList.map((row) => (
                                        <TableRow key={row.id}>
                                          {columnErrorSub.map((column) => (
                                            <TableCell key={column.id} align={column.align} >
                                              {column.render(row)}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
              
              }
                

                
              </div>
            </div>

            <div className="grid grid-cols-4 px-4 gap-4">
            <div className="col-span-4 flex justify-center">
            <button
            type="button"
            onClick={closeModal}
            className="w-40 rounded shadow-sm px-4 py-2 font-normal bg-[#EFEFEF] hover:bg-[#78829D] hover:text-white"
          >
            Close
          </button>
        </div>
</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalValidation;
