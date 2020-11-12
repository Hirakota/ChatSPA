class Message {
    constructor(text = '', to = null, author = null, id = null, createdAt = null, isPersonal = null) {
        
        this.id = id || counter.increment();;
        this.text = text;
        this.createdAt = createdAt || new Date();
        this.author = author || curentUser;
        this.isPersonal = isPersonal ?? !!to;
        this._to = to;
    }

    writeMessage() {
        console.log(this.id + '. '+ this.author + ': ' + this.text + ' |' + this.isPersonal + ' | to: ' + this.to);
    }
    
    set to(to) {
        this._to = to;
        this.isPersonal = !!to;
    }

    get to() {
        return this._to;
    }

    get createdAt() {
        // if ...  = 
    }

    editMessage(editObj = {}) {
        let {text, to} = editObj;
        
        this.to = to;
        this.text = text;
    }

    validMessage() {
        return true;
    }

    validEditMessage() {
        return true;
    }
}

class Pagenation {
    
}

class MessageList {
    _arr = [];

    constructor(arr) {
        this._arr = arr;
    }
    
    get messages() {
        return this._arr;
    }
    
    addMessage() {
        let msg = new Message(text, to, id, createdAt,author, isPersonal);

        if(msg.validate()) {
            this._arr.push(msg);
            return true;
        }   
        return false;
    }

    editMessage(idF, editObj) {
        const msg = this._arr.find(({id}) => idF === id);
        if(msg) {
            msg.editMessage(editObj);
            return true;
        }

        return false;
    }

    removeMessage(msg) {
        let index = this._arr.findIndex((message) => msg.id === message.id);
        if(index != -1) {
            this._arr.splice(index, 1);
            return true;
        }
        return false;
    }
}


//=============================
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
  