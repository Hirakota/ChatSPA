/* function fib(n) {
    if(n === 0) {
        return 0;
    }

    let first = 1;
    let second = 1;
    console.log(second);

    let result;
    for(let i = 0; i < n; i++) {
        result = second + first
        first = second;
        second = result;

        console.log(result);
    }
}

fib(10);
console.log('==================');
function fibonacci(n) {
    if(n <= 1) {
        return 1;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); */

function anagram(str, target) {
  if (str.length !== target.length) {
    return false;
  }

  str = str.toLowerCase();

  arr = target.split('');

  for (let i = 0; i < str.length; i++) {
    const index = arr.indexOf(str[i]);
    if (index !== -1) {
      arr.splice(index, 1);
    } else {
      return false;
    }
  }

  return arr.length === 0;
}

console.log(anagram('банка', 'кабан'));

//= =====================================

function anagram1(firstWord, secondWord) {
  if (firstWord.length !== secondWord.length) {
    return false;
  }

  const charsAn = {};
  for (const char of (firstWord + secondWord)) {
    charsAn[char] = charsAn[char] ? charsAn[char] + 1 : 1;
  }

  for (const key in charsAn) {
    if (charsAn[key] % 2 !== 0) {
      return false;
    }
  }

  return true;
}

console.log(anagram1('банка', 'кабан'));

//= ===============

function anagram3(s1, s2) {
  return s1.split('').sort().join('') === s2.split('').sort('').join('');
}

//= ================

function intersection(s1, s2) {
  const arr1 = Array.from(s1);
  const arr2 = Array.from(s2);

  const result = arr1.filter((el) => arr2.includes(el));

  return [...new Set(result)];
}

console.log(intersection('банка', 'кабан'));
