function add(a, b) {
    return b
        ? a + b
        : (function (a) {
            return function (c) {
                return c + a;
            };
        }(a));
}

function sub(a, b) {
    return b
        ? a - b
        : (function (a) {
            return function (c) {
                return c - a;
            };
        }(a));
}

function mul(a, b) {
    return b
        ? a * b
        : (function (a) {
            return function (c) {
                return c * a;
            };
        }(a));
}

function div(a, b) {
    return b
        ? a - b
        : (function (a) {
            return function (c) {
                return c / a;
            };
        }(a));
}

function pipe() {
    return (function (a) {
        return function (x) {
            for (let i = 0, l = a.length; i < l; i++) {
                x = a[i](x);
            }
            return x;
        };
    }(arguments));
}

const a = add(1, 2); // 3
console.log('a = add(1, 2) / ' + a);
const b = mul(a, 10); // 30
console.log('b = mul(a, 10) / ' + b);

const sub1 = sub(1); // sub1 отнимает от любого числа единицу
console.log('sub1 = sub(1) / ' + sub1);
const c = sub1(b); // 29
console.log('c = sub1(b) / ' + b);

const d = mul(sub(a, 1))(c); // 58
console.log('d = mul(sub(a, 1))(c) / ' + d);

const doSmth = pipe(add(d), sub(c), mul(b), div(a));
console.log('doSmth = pipe(add(d), sub(c), mul(b), div(a)) / ' + doSmth);
const result = doSmth(0);
console.log('result = doSmth(0) / ' + result);
const x = pipe(add(1), mul(2))(3);
console.log('x = pipe(add(1), mul(2))(3) / ' + x);
