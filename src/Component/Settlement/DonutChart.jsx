import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import numeral from "numeral";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({data,totalPercent,unit,convertUnit,additional}) => {
  console.log(additional)
  const [chartData, setChartData] = useState({
    labels: [
      "Actual Solar",
      "Actual Wind",
      "Actual Hydro",
      "UGT2 Inventory",
      "UGT1 Inventory",
      "Unmatched Energy",
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "#4D6A00",
          "#87BE33",
          "#33BFBF",
          "#FA6B6E",
          "#70B2FF",
          "#B0BAC9",
        ],
        borderWidth: 1,
      },
    ],
  });


  //console.log(data)
  const [totalLoadPercentage, setTotalLoadPercentage] = useState(0); // ค่าเริ่มต้น %
  const [chartKey, setChartKey] = useState(0);

  const [additionalData,setAdditionalData] = useState([
    { label: "Actual Solar", value: 0 },
    { label: "Actual Wind", value: 0 }, // ค่า 0 จะไม่ถูก plot
    { label: "Actual Hydro", value: 0 },
    { label: "UGT2 Inventory", value: 0 }, // ค่า 0 จะไม่ถูก plot
    { label: "UGT1 Inventory", value: 0 },
    { label: "Unmatched Energy", value: 0 },
  ])

  useEffect(() => {
     let percentNew = numeral(totalPercent).format("0,000.00")
      setChartData(data); // อัปเดตข้อมูลกราฟ
      setTotalLoadPercentage(percentNew); // อัปเดตเปอร์เซ็นต์
      setChartKey((prevKey) => prevKey + 1);
      setAdditionalData(additional)
  }, [data]);

  

  const [legendData,setlegendData] = useState([
    { label: "Actual Solar", value: 0, color: "#4D6A00" },
    { label: "Actual Wind", value: 0, color: "#87BE33" }, // ค่า 0 จะไม่ถูก plot
    { label: "Actual Hydro", value: 0, color: "#33BFBF" },
    { label: "UGT2 Inventory", value: 0, color: "#FA6B6E" }, // ค่า 0 จะไม่ถูก plot
    { label: "UGT1 Inventory", value: 0, color: "#70B2FF" },
    { label: "Unmatched Energy", value: 0, color: "#B0BAC9" },
  ])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%", // ทำให้เป็น Donut Chart
    plugins: {
      legend: {
        position: "bottom",
        marginTop: "10px",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          generateLabels: (chart) =>{
            const labels = legendData.map((item, index) => ({
              text: item.label,
              fillStyle: item.color,
              lineWidth: 0,
            }));
  
            // แบ่ง legend เป็น 2 คอลัมน์
            return labels.map((label, i) => ({
              ...label,
              text: i % 2 === 0 ? label.text + "   " : label.text,
            }));
          }
        },
      },
      datalabels: {
        color: "#fff",
        formatter: (value) => {
          return `${value}%`; // Display percentage value
        },
        anchor: "center",
        align: "center",
        font: {
          weight: "bold",
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "ไม่มีข้อมูล";
            const value = context.raw || 0;
  
            // ดึงข้อมูลเพิ่มเติมจาก custom data
            const chart = context.chart;
            const additionalInfo =
            chart.config._config.options.plugins.additionalData?.[context.dataIndex]
                ?.label || "ไม่มีข้อมูลเพิ่มเติม";
            const additionalData = convertData(chart.config._config.options.plugins.additionalData?.[context.dataIndex]?.value * convertUnit)
            console.log(context.dataIndex,chart.config._config.options.plugins.additionalData?.[context.dataIndex],additionalData)
  
            // แสดงข้อมูลรวมกับค่าของกราฟ
            return [`${label}: ${value} %`,`${additionalInfo}: ${additionalData} ${unit}`];
          },
        },
      },
      // เพิ่มข้อมูลเพิ่มเติมใน options
      additionalData: additionalData,
    },
  };

  const optionss = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          generateLabels: (chart) => {
            return legendData.map((item, index) => ({
              text: item.label,
              fillStyle: item.color,
              lineWidth: 0,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "ไม่มีข้อมูล";
            const value = context.raw || 0;
  
            // ดึงข้อมูลเพิ่มเติมจาก custom data
            const chart = context.chart;
            const additionalInfo =
            chart.config._config.options.plugins.additionalData?.[context.dataIndex]
                ?.label || "ไม่มีข้อมูลเพิ่มเติม";
            const additionalData = convertData(chart.config._config.options.plugins.additionalData?.[context.dataIndex]?.value * convertUnit)
            console.log(context.dataIndex,chart.config._config.options.plugins.additionalData?.[context.dataIndex],additionalData)
  
            // แสดงข้อมูลรวมกับค่าของกราฟ
            return [`${label}: ${value} %`,`${additionalInfo}: ${additionalData} ${unit}`];
          },
        },
      },
      // เพิ่มข้อมูลเพิ่มเติมใน options
      additionalData: additionalData,
    },
  };

  const plugins = [
    {
      id: "centerText",
      beforeDraw: (chart) => {
        const { ctx, chartArea: { left, right, top, bottom } } = chart;

        ctx.save();
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        // ใช้ค่า React State ล่าสุด
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${totalLoadPercentage}%`, centerX, centerY - 10);

        ctx.font = "14px Arial";
        ctx.fillStyle = "#666";
        ctx.fillText("of Total Load", centerX, centerY + 15);

        ctx.restore();
      },
    },
  ];

  const convertData = (value) => {
      let decFixed = 3;
      if (unit == "kWh") {
        decFixed = 3;
      } else if (unit == "MWh") {
        decFixed = 6;
      } else if (unit == "GWh") {
        decFixed = 6;
      }
  
      if (value) {
        if (decFixed == 3) {
          return numeral(value).format("0,0.000");
        }
        if (decFixed == 6) {
          return numeral(value).format("0,0.000000");
        }
      } else {
        return numeral(0).format("0,0.000");
      }
    };

  return (
    
      <Doughnut key={chartKey} data={chartData} options={options} plugins={plugins} />
    
  );
};

export default DonutChart;