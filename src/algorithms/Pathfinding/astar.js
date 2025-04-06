export function astar(grid, start, end, getNeighbors, heuristic) {
    const openSet = [start];
    const visited = [];
    start.g = 0;
    start.f = heuristic(start, end);
  
    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();
  
      if (current.isWall || current.isVisited) continue;
      current.isVisited = true;
      visited.push(current);
  
      if (current === end) break;
  
      for (let neighbor of getNeighbors(current, grid)) {
        const tempG = current.g + 1;
        if (tempG < neighbor.g) {
          neighbor.g = tempG;
          neighbor.f = tempG + heuristic(neighbor, end);
          neighbor.previousNode = current;
  
          if (!openSet.includes(neighbor)) openSet.push(neighbor);
        }
      }
    }
  
    return { visited, path: reconstructPath(end) };
  }
  
  function reconstructPath(node) {
    const path = [];
    while (node !== null) {
      path.unshift(node);
      node = node.previousNode;
    }
    return path;
  }
  









