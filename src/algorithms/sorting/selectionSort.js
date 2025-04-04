export function selectionSort(array) {
    const animations = [];
    const arr = array.map((bar) => bar.value);
    const n = arr.length;
  
    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        animations.push(["compare", [minIdx, j]]);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        animations.push(["swap", [i, minIdx]]);
        let temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
      }
      animations.push(["sorted", [i]]);
    }
    return animations;
  }