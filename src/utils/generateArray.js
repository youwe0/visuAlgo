export function generateArray(size, min = 10, max = 500) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push({
      value: Math.floor(Math.random() * (max - min + 1)) + min,
      color: "default",
    });
  }
  return array;
}
