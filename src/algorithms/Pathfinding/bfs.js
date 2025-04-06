
export function bfs(grid, start, end, getNeighbors) {
    const visited = [];
    const queue = [start];
  
    while (queue.length > 0) {
      const node = queue.shift();
      if (node.isWall || node.isVisited) continue;
      node.isVisited = true;
      visited.push(node);
  
      if (node === end) break;
  
      for (let neighbor of getNeighbors(node, grid)) {
        if (!neighbor.isVisited && !queue.includes(neighbor)) {
          neighbor.previousNode = node;
          queue.push(neighbor);
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
  