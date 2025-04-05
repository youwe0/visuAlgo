import React from "react";

const Visualizer = ({ array }) => {
  return (
    <div className="w-full h-[75vh] flex items-end justify-center gap-[2px] p-4 bg-gray-300 rounded-lg shadow-inner overflow-hidden">
      {array.map((item, index) => (
        <div
          key={index}
          className={`w-[10px] md:w-[12px] rounded-t transition-all duration-200 ${
            getColorClass(item.color)
          }`}
          style={{ height: `${item.value}px` }}
        ></div>
      ))}
    </div>
  );
};

const getColorClass = (color) => {
  switch (color) {
    case "compare":
      return "bg-yellow-400";
    case "swap":
      return "bg-red-400";
    case "sorted":
      return "bg-green-500";
    case "default":
    default:
      return "bg-blue-500";
  }
};


export default Visualizer;

