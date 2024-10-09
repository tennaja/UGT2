import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DataTable from "../Control/Table/DataTable";
import SearchBox from "../Control/SearchBox";
import Highlighter from "react-highlight-words";
import numeral from "numeral";

const ModalAddPort = (props) => {
  const {
    title,
    columns,
    dataList,
    onClickConfirmBtn,
    closeModal,
    selectedData,
    buttonTypeColor = "primary",
  } = props;
  const {
    handleSubmit,
    resetField,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  // console.log("columns ==", columns);
  // console.log("dataList ==", dataList);

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

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  // ไม่ได้ใช้
  /*  const getColumn = () => {
    return columns.filter(
      (item) =>
        item?.id != "startDate" &&
        item?.id != "endDate" &&
        item?.id != "retailESAContractStartDate" &&
        item?.id != "retailESAContractEndDate"
    );
  }; */
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  const columnsDevice = [
    {
      id: "deviceName",
      label: "Device Name",
      align: "left",
      render: (row) => (
        <div
          className="break-words"
          style={{
            maxWidth: "350px",
          }}
        >
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
      id: "utilityContractAbbr",
      label: "Utility Contract",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.utilityContractAbbr}
        />
      ),
    },
    {
      id: "deviceTechnologiesName",
      label: "Energy Source",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.deviceTechnologiesName}
        />
      ),
    },
    {
      id: "capacity",
      label: "Capacity (MW)",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={(
            numeral(row.capacity).format("0,0.000000") ?? ""
          ).toString()}
        />
      ),
    },
    {
      id: "startDate",
      label: "Effective Registration Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },
    {
      id: "EndDate",
      label: "Expire Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={formatDate(row.expiryDate)}
        />
      ),
    },
  ];
  const columnsSubscriber = [
    {
      id: "subcriberName",
      label: "Subscriber Name",
      align: "left",
      render: (row) => (
        <div
          className="break-words"
          style={{
            maxWidth: "350px",
          }}
        >
          <Highlighter
            highlightTag={Highlight}
            searchWords={[searchDevice]}
            autoEscape={true}
            textToHighlight={row.subcriberName}
          />
        </div>
      ),
    },
    {
      id: "utilityContractAbbr",
      label: "Utility Contract",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.utilityContractAbbr}
        />
      ),
    },
    {
      id: "allocateEnergyAmount",
      label: "Allocated Energy Amount (kWh)",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={(
            numeral(row.allocateEnergyAmount).format("0,0.00") ?? ""
          ).toString()}
        />
      ),
    },
    {
      id: "retailESAContractStartDate",
      label: "ESA Contract Start Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.retailESAContractStartDate}
        />
      ),
    },
    {
      id: "retailESAContractEndDate",
      label: "ESA Contract End Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.retailESAContractEndDate}
        />
      ),
    },
  ];
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          className="inline-block align-bottom bg-white rounded px-4 pt-4 pb-5 text-left overflow-hidden shadow-xl  transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form>
            <div className="bg-white rounded p-14 px-2 md:p-4 mb-6 ">
              <div className="  text-sm  ">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6  ">
                  <div className="col-span-2 mb-4">
                    <div className="md:col-span-6">
                      <h6 className="text-PRIMARY_TEXT font-semibold">
                        {title}
                      </h6>
                      <label
                        className={`font-sm font-normal text-sm text-PRIMARY_TEXT`}
                      >
                        {dataList?.length}{" "}
                        {title == "Add Device"
                          ? dataList?.length > 1
                            ? "Devices"
                            : "Device"
                          : dataList?.length > 1
                          ? "Subscribers"
                          : "Subscriber"}
                      </label>
                    </div>
                  </div>

                  <div className="grid col-span-4 grid-cols-12">
                    <form
                      autoComplete="off"
                      className="grid col-span-12 grid-cols-12"
                    >
                      <div className="col-span-6 px-2"></div>

                      <div className="col-span-6 px-2">
                        <Controller
                          name="SearchText"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <SearchBox
                              placeholder="Search"
                              onChange={handleSearchDeviceChange}
                            />
                          )}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div>
                  <DataTable
                    data={dataList}
                    // columns={getColumn()}
                    columns={
                      columns == "device" ? columnsDevice : columnsSubscriber
                    }
                    searchData={searchDevice}
                    checkbox={true}
                    onSelectedRowsChange={handleSelectedRowsChange}
                    selectedData={selectedData}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 px-4 gap-4">
              <div className="col-span-2 text-right">
                <button
                  onClick={closeModal}
                  className="w-50 rounded shadow-sm px-4 py-2 font-normal bg-[#EFEFEF] hover:bg-[#78829D] hover:text-white"
                >
                  Back
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={handleSubmit(onClickOk)}
                  className={`${getButtonColor()} w-50 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm hover:bg-[#4D6A00] `}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAddPort;
