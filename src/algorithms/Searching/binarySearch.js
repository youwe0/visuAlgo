// src/algorithms/binarySearch.js

export function binarySearch(arr, target) {
    const steps = [];
    let left = 0;
    let right = arr.length - 1;
  
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({ left, right, mid });
  
      if (arr[mid] === target) {
        steps.push({ left, right, mid, found: true });
        return steps;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  
    steps.push({ found: false });
    return steps;
  }
  