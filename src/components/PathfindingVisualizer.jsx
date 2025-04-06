import React, { useEffect, useState } from "react";
import { astar } from "../algorithms/Pathfinding/Astar";
import { dfs } from "../algorithms/pathfinding/dfs";
import { bfs } from "../algorithms/pathfinding/bfs";

const SMALL_GRID = { rows: 18, cols: 20 };
const LARGE_GRID = { rows: 20, cols: 40 };

const createNode = (row, col, start, end) => ({
  row,
  col,
  isStart: row === start.row && col === start.col,
  isEnd: row === end.row && col === end.col,
  isWall: false,
  isVisited: false,
  previousNode: null,
  g: Infinity,
  f: Infinity,
});

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState({ row: 5, col: 5 });
  const [end, setEnd] = useState({ row: 10, col: 15 });
  const [mouseDown, setMouseDown] = useState(false);
  const [selectStart, setSelectStart] = useState(false);
  const [selectEnd, setSelectEnd] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState("astar");

  const dimensions = isMobile ? SMALL_GRID : LARGE_GRID;

  useEffect(() => {
    generateGrid();
  }, [dimensions]);

  const generateGrid = () => {
    const newGrid = [];
    for (let row = 0; row < dimensions.rows; row++) {
      const currentRow = [];
      for (let col = 0; col < dimensions.cols; col++) {
        currentRow.push(createNode(row, col, start, end));
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
  };

  const getNeighbors = (node, grid) => {
    const { row, col } = node;
    const neighbors = [];
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < dimensions.rows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < dimensions.cols - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  };

  const heuristic = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

  const animate = async (visited, path) => {
    for (const node of visited) {
      await new Promise((r) => setTimeout(r, 10));
      const el = document.getElementById(`node-${node.row}-${node.col}`);
      if (el && !node.isStart && !node.isEnd)
        el.className = "bg-blue-400 w-5 h-5 border border-gray-200";
    }

    for (const node of path) {
      await new Promise((r) => setTimeout(r, 20));
      const el = document.getElementById(`node-${node.row}-${node.col}`);
      if (el && !node.isStart && !node.isEnd)
        el.className = "bg-green-500 w-5 h-5 border border-gray-200";
    }
  };

  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    if (selectStart) {
      updateStart(row, col);
      setSelectStart(false);
    } else if (selectEnd) {
      updateEnd(row, col);
      setSelectEnd(false);
    } else {
      toggleWall(row, col);
      setMouseDown(true);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseDown || isRunning) return;
    toggleWall(row, col);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const toggleWall = (row, col) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return;
    node.isWall = !node.isWall;
    setGrid(newGrid);
  };

  const updateStart = (row, col) => {
    const newGrid = [...grid];
    const oldStart = newGrid[start.row][start.col];
    const node = newGrid[row][col];
    if (node.isEnd || node.isWall) return;
    oldStart.isStart = false;
    node.isStart = true;
    setStart({ row, col });
    setGrid(newGrid);
  };

  const updateEnd = (row, col) => {
    const newGrid = [...grid];
    const oldEnd = newGrid[end.row][end.col];
    const node = newGrid[row][col];
    if (node.isStart || node.isWall) return;
    oldEnd.isEnd = false;
    node.isEnd = true;
    setEnd({ row, col });
    setGrid(newGrid);
  };

  const visualize = async () => {
    setIsRunning(true);
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        previousNode: null,
        g: Infinity,
        f: Infinity,
      }))
    );
    const startNode = newGrid[start.row][start.col];
    const endNode = newGrid[end.row][end.col];
    let result;

    if (algorithm === "astar") {
      result = astar(newGrid, startNode, endNode, getNeighbors, heuristic);
    } else if (algorithm === "dfs") {
      result = dfs(newGrid, startNode, endNode, getNeighbors);
    } else if (algorithm === "bfs") {
      result = bfs(newGrid, startNode, endNode, getNeighbors);
    }

    await animate(result.visited, result.path);
    setIsRunning(false);
  };

  const generateMaze = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => {
        if (!node.isStart && !node.isEnd) {
          return { ...node, isWall: Math.random() < 0.3 };
        }
        return node;
      })
    );
    setGrid(newGrid);
  };








  return (
    <div className="min-h-screen p-4 bg-gray-500 ">
      <h1 className="text-2xl font-bold text-center mb-4">Pathfinding Visualizer</h1>

      <div className="flex justify-center gap-3 flex-wrap mb-4">
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="astar">A*</option>
          <option value="dfs">DFS</option>
          <option value="bfs">BFS</option>
          {/* bhai or option yha pe daal agar or algorithm add karne he to */}
        </select>

        <button
          onClick={visualize}
          disabled={isRunning}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Visualize {algorithm.toUpperCase()}
        </button>

        <button
          onClick={() => setSelectStart(true)}
          className="bg-yellow-400 px-4 py-2 rounded"
        >
          Set Start
        </button>

        <button
          onClick={() => setSelectEnd(true)}
          className="bg-red-400 px-4 py-2 rounded"
        >
          Set End
        </button>

        <button
          onClick={generateMaze}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Generate Maze
        </button>

        <button
          onClick={() => setIsMobile(!isMobile)}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Toggle {isMobile ? "Desktop" : "Mobile"} Mode
        </button>
      </div>

      <div
        className="mx-auto w-fit flex flex-col gap-[1px] bg-gray-300"
        onMouseLeave={handleMouseUp}
      >
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-[1px]">
            {row.map((node) => {
              let className =
                "w-5 h-5 border border-gray-200 transition-all duration-200";
              if (node.isStart) className += " bg-yellow-400";
              else if (node.isEnd) className += " bg-red-400";
              else if (node.isWall) className += " bg-black";
              else className += " bg-white";

              return (
                <div
                  key={`${node.row}-${node.col}`}
                  id={`node-${node.row}-${node.col}`}
                  className={className}
                  onMouseDown={() => handleMouseDown(node.row, node.col)}
                  onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                  onMouseUp={handleMouseUp}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathfindingVisualizer;

















