import React from "react";

const Controls = ({
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  size,
  setSize,
  generateArray,
  startVisualization,
  isRunning
}) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg flex flex-wrap items-center justify-center gap-4 mt-4">

      {/* Algorithm Selector */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium">Algorithm</label>
        <select
          className="p-2 rounded border"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={isRunning}
        >
          <option value="bubbleSort">Bubble Sort</option>
          <option value="selectionSort">Selection Sort</option>
          <option value="insertionSort">Insertion Sort</option>
          <option value="mergeSort">Merge Sort</option>
          <option value="quickSort">Quick Sort</option>
        </select>
      </div>

      {/* Speed Control */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium">Speed</label>
        <input
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          disabled={isRunning}
        />
      </div>

      {/* Array Size Control */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium">Array Size</label>
        <input
          type="range"
          min="10"
          max="100"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          disabled={isRunning}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={generateArray}
          disabled={isRunning}
        >
          New Array
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={startVisualization}
          disabled={isRunning}
        >
          Visualize
        </button>
      </div>

    </div>
  );
};

export default Controls;
