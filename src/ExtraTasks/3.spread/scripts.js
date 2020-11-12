const students = [
  {
    name: 'Andrey',
    surname: 'Holubev',
    age: 18,

  },
  {
    name: 'Alexandr',
    surname: 'Sary',
    age: 20,
  },
  {
    name: 'Mariya',
    surname: 'Belaya',
    age: 19,
  },
  {
    name: 'Andrey1',
    surname: 'Holubev1',
    age: 18,

  },
  {
    name: 'Alexandr1',
    surname: 'Sary1',
    age: 20,
  },
  {
    name: 'Mariya1',
    surname: 'Belaya1',
    age: 19,
  },
];

// for(let std of students) {
//     console.log(std.name + ' ' + std.surname + ' ' + std.age);
// }

const sergeyFree = students.filter(({ name }) => name != 'Alexandr');
sergeyFree.forEach((student) => console.log(`${student.name} ${student.age}`));

// console.log(students.slice(1,2));

// console.log(students.sort((a,b) => +b.age - +a.age));

// //===================

// const fullStd = students.map(student => Object.assign({}, student, {fullname: student.name + ' ' + student.surname}));

// console.log('students' , students);

// for(let std of fullStd) {
//     console.log(std.name + ' ' + std.surname + ' ' + std.age + ' ' + std.fullname);
// }

console.log(Math.max(...students.map((student) => student.age)));

console.log(students.filter((student, index) => index % 2 === 0));

//* =========================

const cat = {
  name: 'Busya',
  angry: 10,
  color: 'black',
};

const { name, angry, color } = cat;

console.log(name);

console.log(students.filter(({ name }) => name != 'Alexandr'));
console.log(students.filter((student) => student.name != 'Alexandr'));

//* =========================

const human = {
  name: 'Vasily',
  gender: 'M',
  lastname: 'Sas',
  company: 'DataMola',
  age: 17,
};

let key = Object.keys(human);
console.error(key);

key = Object.values(human);
console.error(key);

for (const value in human) {
  console.log(value, ':', human[value]);
}

//* ==========================

function counter() {
  let count = 0;

  return {
    increment() {
      return ++count;
    },

    decriment() {
      return --count;
    },
    getValue() {
      return count;
    },
  };
}

const myCounter = counter();
myCounter.increment();
myCounter.increment();
myCounter.increment();
myCounter.increment();
console.log(myCounter.getValue());
console.log(myCounter.decriment());
console.log(myCounter.getValue());

// const myCounter2 = counter();

// // console.log(myCounter());
// // console.log(myCounter());
// // console.log(myCounter());
// // console.log(myCounter2());

const beginDate = new Date(2020, 10, 28, 9, 45);
const endDate = new Date();

console.log(beginDate.toDateString());
console.log(endDate);

console.log(beginDate - endDate);
console.log(beginDate > endDate);
console.log(beginDate < endDate);
