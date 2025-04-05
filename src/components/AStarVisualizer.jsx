
import React, { useState, useEffect } from "react";

const SMALL_GRID = { rows: 18, cols: 20 };
const LARGE_GRID = { rows: 20, cols: 40 };

const createNode = (row, col, start, end) => ({
  row,
  col,
  isStart: row === start.row && col === start.col,
  isEnd: row === end.row && col === end.col,
  isWall: false,
  previousNode: null,
  isVisited: false,
});

const AStarVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [movingStart, setMovingStart] = useState(false);
  const [movingEnd, setMovingEnd] = useState(false);
  const [startPos, setStartPos] = useState({ row: 0, col: 0 });
  const [endPos, setEndPos] = useState({ row: 1, col: 1 });
  const [isRunning, setIsRunning] = useState(false);
  const [selectingStart, setSelectingStart] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);

  const dimensions = isMobileMode ? SMALL_GRID : LARGE_GRID;

  useEffect(() => {
    resetGrid();
  }, [dimensions]);

  const resetGrid = () => {
    const freshGrid = Array.from({ length: dimensions.rows }, (_, row) =>
      Array.from({ length: dimensions.cols }, (_, col) =>
        createNode(row, col, startPos, endPos)
      )
    );
    setGrid(freshGrid);
  };

  const toggleWall = (row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return;
    node.isWall = !node.isWall;
    setGrid(newGrid);
  };

  const handleMouseDown = (row, col) => {
    if (isRunning) return;

    if (selectingStart) {
      updateStart(row, col);
      setSelectingStart(false);
      return;
    }
    if (selectingEnd) {
      updateEnd(row, col);
      setSelectingEnd(false);
      return;
    }

    const node = grid[row][col];
    if (node.isStart) setMovingStart(true);
    else if (node.isEnd) setMovingEnd(true);
    else toggleWall(row, col);

    setMouseDown(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseDown || isRunning) return;

    if (movingStart) moveStart(row, col);
    else if (movingEnd) moveEnd(row, col);
    else toggleWall(row, col);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    setMovingStart(false);
    setMovingEnd(false);
  };

  const moveStart = (row, col) => {
    const newGrid = grid.slice();
    const oldStart = newGrid[startPos.row][startPos.col];
    oldStart.isStart = false;

    const newStart = newGrid[row][col];
    if (newStart.isEnd || newStart.isWall) return;
    newStart.isStart = true;
    setStartPos({ row, col });
    setGrid(newGrid);
  };

  const moveEnd = (row, col) => {
    const newGrid = grid.slice();
    const oldEnd = newGrid[endPos.row][endPos.col];
    oldEnd.isEnd = false;

    const newEnd = newGrid[row][col];
    if (newEnd.isStart || newEnd.isWall) return;
    newEnd.isEnd = true;
    setEndPos({ row, col });
    setGrid(newGrid);
  };

  const updateStart = (row, col) => {
    const newGrid = grid.slice();
    const oldStart = newGrid[startPos.row][startPos.col];
    const node = newGrid[row][col];
    if (node.isEnd || node.isWall) return;
    oldStart.isStart = false;
    node.isStart = true;
    setStartPos({ row, col });
    setGrid(newGrid);
  };

  const updateEnd = (row, col) => {
    const newGrid = grid.slice();
    const oldEnd = newGrid[endPos.row][endPos.col];
    const node = newGrid[row][col];
    if (node.isStart || node.isWall) return;
    oldEnd.isEnd = false;
    node.isEnd = true;
    setEndPos({ row, col });
    setGrid(newGrid);
  };

  const heuristic = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

  const getNeighbors = (node, grid) => {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < dimensions.rows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < dimensions.cols - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  };

  const animate = async (visited, path) => {
    for (let i = 0; i < visited.length; i++) {
      await new Promise(r => setTimeout(r, 15));
      const { row, col } = visited[i];
      const el = document.getElementById(`node-${row}-${col}`);
      if (el && !grid[row][col].isStart && !grid[row][col].isEnd) {
        el.className = "border border-gray-300 transition-all duration-200 bg-blue-300 w-4 h-4 sm:w-5 sm:h-5";
      }
    }

    for (let i = 0; i < path.length; i++) {
      await new Promise(r => setTimeout(r, 30));
      const { row, col } = path[i];
      const el = document.getElementById(`node-${row}-${col}`);
      if (el && !grid[row][col].isStart && !grid[row][col].isEnd) {
        el.className = "border border-gray-300 transition-all duration-200 bg-green-400 w-4 h-4 sm:w-5 sm:h-5";
      }
    }
  };

  const reconstructPath = (endNode) => {
    const path = [];
    let current = endNode;
    while (current !== null) {
      path.unshift(current);
      current = current.previousNode;
    }
    return path;
  };

  const visualizeAStar = async () => {
    setIsRunning(true);
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        previousNode: null,
        isVisited: false,
        g: Infinity,
        f: Infinity,
      }))
    );

    const start = newGrid[startPos.row][startPos.col];
    const end = newGrid[endPos.row][endPos.col];

    start.g = 0;
    start.f = heuristic(start, end);

    const openSet = [start];
    const visited = [];

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();

      if (current.isWall || current.isVisited) continue;
      current.isVisited = true;
      visited.push(current);

      if (current === end) {
        const path = reconstructPath(end);
        await animate(visited, path);
        setIsRunning(false);
        return;
      }

      for (let neighbor of getNeighbors(current, newGrid)) {
        if (neighbor.isWall || neighbor.isVisited) continue;

        const tentativeG = current.g + 1;
        if (tentativeG < neighbor.g) {
          neighbor.g = tentativeG;
          neighbor.f = tentativeG + heuristic(neighbor, end);
          neighbor.previousNode = current;

          if (!openSet.includes(neighbor)) openSet.push(neighbor);
        }
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="p-4 bg-red-200 min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-4">A* Pathfinding Visualizer</h1>
      <div
        className="flex flex-col items-center gap-[1px] bg-gray-400 w-fit mx-auto"
        onMouseLeave={handleMouseUp}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[1px]">
            {row.map((node) => {
              const { row, col, isStart, isEnd, isWall } = node;
              let classes = "border border-gray-300 transition-all duration-200 w-4 h-4 sm:w-5 sm:h-5";
              if (isStart) classes += " bg-yellow-400";
              else if (isEnd) classes += " bg-red-400";
              else if (isWall) classes += " bg-black";
              else classes += " bg-white";

              return (
                <div
                  id={`node-${row}-${col}`}
                  key={`${row}-${col}`}
                  className={classes}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                />
              );
            })}
          </div>
        ))}
      </div>


      {/* Controls */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={visualizeAStar}
          disabled={isRunning}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Visualize A*
        </button>

        <button
          onClick={() => setSelectingStart(true)}
          disabled={selectingEnd}
          className={`px-4 py-2 rounded ${selectingStart ? "bg-yellow-500 text-white" : "bg-yellow-300 text-black"
            }`}
        >
          Select Start Node
        </button>

        <button
          onClick={() => setSelectingEnd(true)}
          disabled={selectingStart}
          className={`px-4 py-2 rounded ${selectingEnd ? "bg-red-500 text-white" : "bg-red-300 text-black"
            }`}
        >
          Select End Node
        </button>

        {/* <button
          onClick={resetGrid}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Reset Grid
        </button> */}

        <button
          onClick={() => setIsMobileMode(!isMobileMode)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Switch to {isMobileMode ? "Window" : "Mobile"} Mode
        </button>
      </div>
    </div>
  );
};

export default AStarVisualizer;
