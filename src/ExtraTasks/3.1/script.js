const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
const reducer = (sum, curentValue) => sum + curentValue;

const maxSum = {
    sum: arr.reduce(reducer),
    arr,
};

for (let i = 0; i < arr.length - 1; i++) {
    for (let j = arr.length; j > i; j--) {
        const curentSum = arr.slice(i, j).reduce(reducer);

        if (curentSum > maxSum.sum) {
            maxSum.arr = arr.slice(i, j);
            maxSum.sum = curentSum;
        }
    }
}

alert(`${maxSum.sum}: [${maxSum.arr}]`);
console.log(`${maxSum.sum}: [${maxSum.arr}]`);
