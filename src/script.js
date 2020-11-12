/* eslint-disable no-restricted-globals */
/* eslint-disable max-classes-per-file */
/* eslint-disable func-names */

const counter = (function () {
    let count = 0;

    return {
        increment() {
            return `${++count}`;
        },
    };
}());

class Message {
    constructor(text = '', to = null, author = null, createdAt = null, id = null, isPersonal = null) {
        this._id = id || counter.increment();
        this._text = text;
        this._createdAt = createdAt || new Date();
        this._author = author;
        this._isPersonal = isPersonal || !!to;
        this._to = to;
    }

    set to(to) {
        this._to = to;
        this._isPersonal = !!to;
    }

    get to() {
        return this._to;
    }

    set text(text) {
        this._text = text;
    }

    get text() {
        return this._text;
    }

    get createdAt() {
        return this._createdAt;
    }

    get author() {
        return this._author;
    }

    get id() {
        return this._id;
    }

    get isPersonal() {
        return this._isPersonal;
    }

    writeMessage() {
        console.log(`Id: ${this.id} | ${this.author}: ${this.text} | ${this.isPersonal} | to: ${this.to}`);
    }

    edit(editObj = {}) {
        const { text, to } = editObj;

        if (text) {
            this.text = text;
        }
        if (to) {
            this.to = to;
        }

        if (this.validate()) {
            return true;
        }

        return false;
    }

    validate() {
        if (
            this.text.length <= 200
            && !!this.text && !!this.author
            && this.createdAt <= new Date()
        ) {
            if (this.isPersonal === true) {
                if (this.to !== '') {
                    return true;
                }
                return false;
            } return true;
        }

        return false;
    }
}

class MessageList {
    constructor(arr = null, user = null) {
        this._arr = arr || [];
        this._filterObj = {
            author: (item, authorF) => !authorF
                || item.author.toLowerCase().includes(authorF.toLowerCase()),
            text: (item, textF) => !textF || item.text.toLowerCase().includes(textF.toLowerCase()),
            dateFrom: (item, dateFromF) => !dateFromF || item.createdAt >= dateFromF,
            dateTo: (item, dateToF) => !dateToF || item.createdAt <= dateToF,
        };
        this._invalidArr = [];
        this._user = user || '';
    }

    set user(user) {
        this._user = user;
    }

    get user() {
        return this._user;
    }

    addMessage(text, to) {
        const msg = new Message(text, to, this.user);

        if (msg.validate()) {
            this._arr.push(msg);
            return true;
        }
        return false;
    }

    editMessage(idF, editObj) {
        const index = this._arr.findIndex(({ id }) => idF === id);
        const msg = this._arr[index];

        if (msg.author !== this.user) {
            console.log('Вы не можете редактировать это сообщение');
            return false;
        }

        if (msg.edit(editObj)) {
            this._arr[index] = msg;
            return true;
        }

        return false;
    }

    removeMessage(idF) {
        const index = this._arr.findIndex(({ id }) => id === idF);

        if (this._arr[index].author !== this.user) {
            console.log('Вы не можете удалить это сообщение');
            return false;
        }

        if (index !== -1) {
            this._arr.splice(index, 1);
            console.log('Сообщение удалено');
            return true;
        }
        return false;
    }

    getMessage(idF) {
        const index = this._arr.findIndex(({ id }) => id === idF);
        let msg;

        if (index >= 0) {
            msg = this._arr[index];
        } else {
            msg = console.error('Не удалось найти сообщение с таким Id');
            return {};
        }

        msg.writeMessage();
        return msg;
    }

    _baseFilter() {
        let result = this._arr.slice(0);

        if (this.user) {
            result = result.filter(
                ({ author, isPersonal, to }) => to === this.user
                    || author === this.user
                    || isPersonal === false,
            );
        } else {
            result = result.filter(
                ({ isPersonal }) => isPersonal === false,
            );
        }

        result.sort((a, b) => +b.createdAt - +a.createdAt);

        return result;
    }

    getPage(skip = 0, top = 10, filterConfig = {}) {
        let result = this._baseFilter();

        Object.keys(filterConfig).forEach((key) => {
            result = result.filter((item) => this._filterObj[key](item, filterConfig[key]));
        });

        if (skip < result.length) {
            while (skip + top > result.length) {
                top--;
            }
        } else {
            console.log('Сообщений не найдено');
            return [];
        }

        result = result.slice(skip, top + skip); // Можно сделать в одну строку

        if (result.length > 0) {
            for (let i = 0; i < top; i++) {
                console.log(`${i + 1} : `);
                result[i].writeMessage();
            }
        } else {
            console.log('Сообщений пока нет');
        }

        return result;
    }

    getAll() {
        return this._arr;
    }

    clear() {
        this._arr = [];
    }

    //! ????????????????????????????????????
    /* addAll() {
        return ???;
    } */
}

const msgList = new MessageList(defaultStatus, 'Alexandr');
msgList.addMessage('text1');
msgList.addMessage('text2');
msgList.addMessage('text3');
msgList.addMessage('text4');
msgList.addMessage('text5', 'Rion');
console.log(`============--- Curent user: ${msgList.user}`);
msgList.getPage();
msgList.editMessage('3', { text: 'newtext' });

console.log(`============Skip 4--- Curent user: ${msgList.user}`);
msgList.getPage(4);

msgList.user = 'Ed';
console.log(`============--- Curent user: ${msgList.user}`);
msgList.getPage();

msgList.addMessage('text1');
msgList.addMessage('text2', 'Alexandr');

msgList.user = 'Rion';
msgList.addMessage('text4', 'Ed');
msgList.addMessage('text1');
msgList.addMessage('text2');
msgList.addMessage('text3');
msgList.addMessage('text4');

console.log('============--- RemoveMessage: ');
msgList.removeMessage('5');
msgList.removeMessage('8');

const messages = [
    new Message('added js', 'Ed', 'Alexandr', new Date('2020-09-12T23:00:00')),
    new Message('О, привет. Как дела?', defaultStatus, 'Rion', new Date('2020-09-12T23:01:00')),
];

const msgList2 = new MessageList(messages, 'Ed');

console.log(`============-list2- Curent user: ${msgList2.user}`);
msgList2.getPage();

console.log('======================================');
