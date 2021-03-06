let prices = [7, 1, 5, 3, 6, 4];
console.log(`Task 1 Profit = ${maxProfit(prices)}`);
prices = [1, 2, 3, 4, 5];
console.log(`Task 2 Profit = ${maxProfit(prices)}`);
prices = [7, 6, 4, 3, 1];
console.log(`Task 3 Profit = ${maxProfit(prices)}`);
prices = [3, 3, 5, 0, 0, 3, 1, 4];
console.log(`Task 4 Profit = ${maxProfit(prices)}`);

function maxProfit(price) {
    if (price.length < 1 && price.length < 3 * 10000 + 1) return;

    const n = price.length;
    // Создать массив прибыли и инициализировать его как 0

    const profit = prices.slice(0).fill(0);

    let maxPrice = price[n - 1];

    for (let i = n - 2; i >= 0; i--) {
        if (price[i] > maxPrice) maxPrice = price[i];

        profit[i] = Math.max(profit[i + 1], maxPrice - price[i]);
    }

    let minPrice = price[0];

    for (let i = 1; i < n; i++) {
        // min_price - минимальная цена в цене [0..i]

        if (price[i] < minPrice) minPrice = price[i];

        profit[i] = Math.max(profit[i - 1], profit[i] + (price[i] - minPrice));
    }

    const result = profit[n - 1];

    return result;
}
