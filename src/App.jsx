import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Controls from './components/Controls';
import Visualizer from './components/Visualizer';
import { generateArray } from './utils/generateArray';
import { bubbleSort } from './algorithms/sorting/bubbleSort';
import { selectionSort } from './algorithms/sorting/selectionSort';
import { mergeSort } from './algorithms/sorting/mergeSort';
import AStarVisualizer from './components/AStarVisualizer';

const App = () => {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubbleSort");
  const [isRunning, setIsRunning] = useState(false);


  useEffect(() => {
    setArray(generateArray(size));
  }, [size]);

  const handleGenerateArray = () => {
    if (!isRunning) setArray(generateArray(size));
  };

  const handleStart = async () => {
    if (isRunning) return;
    setIsRunning(true);
    let animations = [];

    if (algorithm === "bubbleSort") {
      animations = bubbleSort(array);
    } else if (algorithm === "selectionSort") {
      animations = selectionSort(array);
    } else if (algorithm === "mergeSort") {
      animations = mergeSort(array);
    }

    // const arrCopy = [...array];
    for (let i = 0; i < animations.length; i++) {
      const [type, indices, newVal] = animations[i];
      const newArray = [...array]; 
    
      if (type === "compare") {
        indices.forEach(idx => newArray[idx].color = "compare");
      } else if (type === "swap") {
        const [i, j] = indices;
        const temp = newArray[i].value;
        newArray[i].value = newArray[j].value;
        newArray[j].value = temp;
        newArray[i].color = "swap";
        newArray[j].color = "swap";
      } else if (type === "overwrite") {
        const [idx] = indices;
        newArray[idx].value = newVal;
        newArray[idx].color = "swap"; // or use another color like "overwrite"
      } else if (type === "sorted") {
        indices.forEach(idx => newArray[idx].color = "sorted");
      }
    
      setArray(newArray);
    
      await new Promise(resolve => setTimeout(resolve, 100 - speed));
    
      
      setArray(prev =>
        prev.map(bar => ({
          ...bar,
          color: bar.color === "sorted" ? "sorted" : "default",
        }))
      );
    }
    

    setIsRunning(false);
  };















  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Controls
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        speed={speed}
        setSpeed={setSpeed}
        size={size}
        setSize={setSize}
        generateArray={handleGenerateArray}
        startVisualization={handleStart}
        isRunning={isRunning}
      />
      <Visualizer array={array} />
      <AStarVisualizer />
    </div>
  );
};

export default App;

