export function bubbleSort(array) {
    const animations = [];
    const arr = array.map((bar) => bar.value);
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        animations.push(["compare", [j, j + 1]]);
        if (arr[j] > arr[j + 1]) {
          animations.push(["swap", [j, j + 1]]);
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
      animations.push(["sorted", [n - 1 - i]]);
    }
    animations.push(["sorted", [0]]);
    return animations;
  }
  