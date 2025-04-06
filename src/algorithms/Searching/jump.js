export function jumpSearch(arr, target) {
    const steps = [];
    const n = arr.length;
    const stepSize = Math.floor(Math.sqrt(n));
    let prev = 0;
    let current = stepSize;
  
    // Jumping phase
    while (current < n && arr[current] <= target) {
      steps.push({ mid: current, found: false });
      prev = current;
      current += stepSize;
    }
  
    // Linear search in the block
    for (let i = prev; i < Math.min(current, n); i++) {
      steps.push({ mid: i, found: arr[i] === target });
      if (arr[i] === target) break;
    }
  
    return steps;
  }
  