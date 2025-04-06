export function dfs(grid, start, end, getNeighbors) {
  const visited = [];
  const stack = [start];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node.isWall || node.isVisited) continue;
    node.isVisited = true;
    visited.push(node);

    if (node === end) break;

    for (let neighbor of getNeighbors(node, grid)) {
      if (!neighbor.isVisited) {
        neighbor.previousNode = node;
        stack.push(neighbor);
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
