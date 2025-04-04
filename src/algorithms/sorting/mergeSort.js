export function mergeSort(array) {
    const animations = [];
    const arr = array.map(bar => bar.value);
    const aux = arr.slice();
  
    function mergeSortHelper(start, end) {
      if (start >= end) return;
  
      const mid = Math.floor((start + end) / 2);
      mergeSortHelper(start, mid);
      mergeSortHelper(mid + 1, end);
      merge(start, mid, end);
    }
  
    function merge(start, mid, end) {
      let i = start;
      let j = mid + 1;
      let k = start;
  
      while (i <= mid && j <= end) {
        animations.push(["compare", [i, j]]);
  
        if (aux[i] <= aux[j]) {
          animations.push(["overwrite", [k], aux[i]]);
          arr[k++] = aux[i++];
        } else {
          animations.push(["overwrite", [k], aux[j]]);
          arr[k++] = aux[j++];
        }
      }
  
      while (i <= mid) {
        animations.push(["overwrite", [k], aux[i]]);
        arr[k++] = aux[i++];
      }
  
      while (j <= end) {
        animations.push(["overwrite", [k], aux[j]]);
        arr[k++] = aux[j++];
      }
  
      for (let l = start; l <= end; l++) {
        aux[l] = arr[l];
      }
    }
  
    mergeSortHelper(0, arr.length - 1);
  
    // Mark all sorted
    for (let i = 0; i < arr.length; i++) {
      animations.push(["sorted", [i]]);
    }
  
    return animations;
  }
  