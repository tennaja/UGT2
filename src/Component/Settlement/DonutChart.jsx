import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({data,totalPercent}) => {
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

  useEffect(() => {
    
      setChartData(data); // อัปเดตข้อมูลกราฟ
      setTotalLoadPercentage(totalPercent); // อัปเดตเปอร์เซ็นต์
      setChartKey((prevKey) => prevKey + 1);
    
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
            return legendData.map((item,index)=>({
              text: item.label,
              fillStyle: item.color,
              lineWidth:0,
              //hidden: chart.data.datasets[0].data[index]
            }))
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
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
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

  return (
    
      <Doughnut key={chartKey} data={chartData} options={options} plugins={plugins} />
    
  );
};

export default DonutChart;