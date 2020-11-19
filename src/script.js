/* eslint-disable no-undef */
/* eslint-disable guard-for-in */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-template */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        // Adding leading zero to minutes
        minutes = `0${minutes}`;
    }

    if (prefomattedDate) {
        // Today at 10:20
        // Yesterday at 10:20
        return `${prefomattedDate} at ${hours}:${minutes}`;
    }

    if (hideYear) {
        // 10. January at 10:20
        return `${day}. ${month} at ${hours}:${minutes}`;
    }

    // 10. January 2017. at 10:20
    return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
}

// --- Main function
function timeAgo(dateParam) {
    if (!dateParam) {
        return null;
    }

    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();

    if (seconds < 5) {
        return 'Now';
    } if (seconds < 60) {
        return `${seconds} seconds ago`;
    } if (seconds < 90) {
        return 'about a minute ago';
    } if (minutes < 60) {
        return `${minutes} minutes ago`;
    } if (isToday) {
        return getFormattedDate(date, 'Today'); // Today at 10:20
    } if (isYesterday) {
        return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    } if (isThisYear) {
        return getFormattedDate(date, false, true); // 10. January at 10:20
    }

    return getFormattedDate(date); // 10. January 2017. at 10:20
}

//* Model ------------------
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

    print() {
        console.log(`Id: ${this.id} | ${this.author}: ${this.text} | ${this.isPersonal} | to: ${this.to}`);
    }

    edit(editObj = {}) {
        const { text, to } = editObj;

        if (!!text) {
            this._text = text;
        }
        if (!!to) {
            this.to = to;
        }
    }
}

class MessageList {
    constructor(arr = null, user = null) {
        this._arr = arr || [];
        this._filterObj = {
            author: (item, authorF) => !authorF
                    || item.author.toLowerCase().includes(authorF.toLowerCase()),
            text: (item, textF) => !textF
                    || item.text.toLowerCase().includes(textF.toLowerCase()),
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

    add(text, to = null, author = this.user, createdAt = null) {
        const msg = new Message(text, to, author, createdAt);

        this._arr.push(msg);
        return true;
    }

    edit(idF, editObj) {
        const index = this._arr.findIndex(({ id }) => idF === id);
        const msg = this._arr[index];

        if (msg.author !== this._user) {
            console.log('Вы не можете редактировать это сообщение');
            return false;
        }

        msg.edit(editObj);
        if (MessageList.validate(msg)) {
            this._arr[index] = msg;
            return true;
        }

        return false;
    }

    remove(idF) {
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

    get(idF) {
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
        let result = this._arr.slice(0).filter((el) => MessageList.validate(el));

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

        result = result.slice(skip, top + skip);

        //debug;
        for (let i = 0; i < result.length; i++) {
            console.log(`${i + 1} : `);
            result[i].print();
        }
        return result;
    }

    static validate(msg) {
        if (
            !!msg.text
                && msg.text.length <= 200 && !!msg.author
                && msg.createdAt <= new Date()
        ) {
            if (msg.isPersonal === true) {
                if (msg.to !== '') {
                    return true;
                }
                return false;
            } return true;
        }

        return false;
    }

    addAll() {
        return this._arr.filter((el) => !MessageList.validate(el));
    }

    getAll() {
        return this._arr;
    }

    clear() {
        this._arr = [];
    }
}

class UserList {
    constructor(users, activeUsers) {
        this.users = users;
        this.activeUsers = activeUsers;
    }

    getOffline() {
        let offlineList = this.users;
        offlineList = offlineList.filter((el) => !this.activeUsers.includes(el));

        return offlineList;
    }
}

//* View -------------------
class HeaderView {
    constructor(containerId) {
        this._containerId = containerId;
        this._user = null;
    }

    set user(user) {
        this._user = user;
    }

    get user() {
        return this._user;
    }

    display() {
        const el = document.getElementById(this._containerId);
        const frm = new DocumentFragment();

        if(!this._user) {
            el.innerHTML = '';
            return 0;
        }

        const curentBody = document.createElement('div');
        curentBody.classList = 'curent-body';

        const iconTitle = document.createElement('div');
        iconTitle.classList = 'curent-icon title';
        iconTitle.innerText = this._user[0];
        curentBody.appendChild(iconTitle);

        const curent = document.createElement('div');
        curent.classList = 'curent';

        const userTitle = document.createElement('h2');
        userTitle.classList = 'title';
        userTitle.innerHTML = this._user;
        const logOut = document.createElement('span');
        logOut.classList = 'curent-btn';
        logOut.innerText = 'Log out';

        curent.appendChild(userTitle);
        curent.appendChild(logOut);

        curentBody.appendChild(iconTitle);
        curentBody.appendChild(curent);
        frm.appendChild(curentBody);
        el.appendChild(frm);
    }
}

class OnlineUsersView {
    constructor(containerId) {
        this._containerId = containerId;
    }

    display(userList) {
        const frm = new DocumentFragment();
        const el = document.getElementById(this._containerId);
        el.innerHTML = '';

        const onlineH2 = document.createElement('h2');
        onlineH2.classList = 'title status-title';
        onlineH2.innerText = 'Online: ' + userList.length;

        frm.appendChild(onlineH2);

        const userTpl = document.getElementById('user-template');
        for (const user of userList) {
            const us = userTpl.content.cloneNode(true);
            us.querySelector('.user-icon').classList += 'online';
            us.querySelector('.user-icon').textContent = user[0];

            us.querySelector('.user-name').textContent = user;
            frm.appendChild(us);
        }

        el.appendChild(frm);
    }
}

class OfflineUsersView {
    constructor(containerId) {
        this._containerId = containerId;
    }

    display(userList) {
        const frm = new DocumentFragment();
        const el = document.getElementById(this._containerId);
        el.innerHTML = '';

        const offlineH2 = document.createElement('h2');
        offlineH2.classList = 'title status-title';
        offlineH2.innerText = 'Offline: ' + userList.length;

        frm.appendChild(offlineH2);

        const userTpl = document.getElementById('user-template');
        for (const user of userList) {
            const us = userTpl.content.cloneNode(true);
            us.querySelector('.user-icon').classList += 'offline';
            us.querySelector('.user-icon').textContent = user[0];

            us.querySelector('.user-name').classList += ' offline-title';
            us.querySelector('.user-name').textContent = user;
            frm.appendChild(us);
        }

        el.appendChild(frm);
    }
}

class MessageView {
    constructor(containerId) {
        this._containerId = containerId;
        this._user = null;
    }

    set user(user) {
        this._user = user;
    }

    display(messages) {
        const frm = new DocumentFragment();
        const el = document.getElementById(this._containerId);
        el.innerHTML = '';
        const baseHeight = el.scrollHeight;
        
        const msgTpl = document.getElementById('msg-template');
        for (const message of messages) {
            const msg = msgTpl.content.cloneNode(true);
            msg.querySelector('.all-message').classList.add(`${message.author === this._user
                ? 'my' : (message.to === this._user
                    ? 'personal' : 'other')}-message`);

            msg.querySelector('.user-name').textContent = message.author;
            msg.querySelector('.message').textContent = message.text;
            msg.querySelector('.message-date').textContent = timeAgo(message.createdAt);

            frm.appendChild(msg);
        }

        el.appendChild(frm);
        const loadNew = document.getElementById('loadNew-template').content.cloneNode(true);
        console.log(loadNew);
        if(baseHeight === el.scrollHeight) {
            loadNew.querySelector(`.load-new`).classList.add('load-new-absolute');
        }
        el.appendChild(loadNew);
    }
}

//* Global Controll -----

function setCurrentUser(user) {
    headerView.user = user;
    headerView.display();

    messageView.user = user;

    msgList.user = user;
    messageView.display(msgList.getPage());
}

function addMessage(msg) {
    if(!msgList.user) {
        console.warn('User is not authorized');
    }

    const {text, to} = msg;
    msgList.add(text, to);
    messageView.display(msgList.getPage());
}

function editMessage(idF, msg) {
    if(msgList.edit(idF, msg)) {
        messageView.display(msgList.getPage());
    }
}

function removeMessage(idF) {
    msgList.remove(idF);
    messageView.display(msgList.getPage());
}

function showMessage(skip = 0, top = 10, filterObj = {}) {
    messageView.display(msgList.getPage(skip, top, filterObj));
}

function showUsers() {
    onlineUsersView.display(userList.activeUsers);
    offlineUsersView.display(userList.getOffline());
}

const messages = [
    new Message('added js', 'Sasha', 'Pasha', new Date('2020-10-12T12:01:44')),
    new Message('О, привет. Как дела?', defaultStatus, 'Rion', new Date('2020-10-12T11:01:44')),
    new Message('Hello world!', defaultStatus, 'Sasha', new Date('2020-10-12T15:01:44')),
    new Message('Hello world!', defaultStatus, 'Sasha', new Date('2020-11-19T00:30:00')),
    new Message('Hello world!', defaultStatus, 'ZhenyaH', new Date('2020-11-19T01')),
    new Message('Hello world!', defaultStatus, 'Dima', new Date()),

];

const userList = new UserList(['Dima', 'ZhenyaZh', 'ZhenyaH', 'Sasha', 'Pasha'], ['Dima', 'ZhenyaZh']);
const msgList = new MessageList(messages);

//* View Objects
const headerView = new HeaderView('curentUser');
const onlineUsersView = new OnlineUsersView('onlineList');
const offlineUsersView = new OfflineUsersView('offlineList');
const messageView = new MessageView('messageList');


showUsers();
setCurrentUser('Sasha');
addMessage({text: 'Message !!!'});
addMessage({text: 'Hello warld !!!'});
removeMessage('7');
editMessage('8', {text: 'Hello world !!'});




