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
        if (!!to ||  to === '') {
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
    }

    display() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('curentUser');

        const el = document.getElementById(this._containerId);
        const frm = new DocumentFragment();
        el.innerHTML = '';

        if(!token) {
            const newDiv = document.createElement('div');
            newDiv.classList = 'sign-body'
            
            const signIn = document.createElement('span');
            signIn.innerText = 'Sign in';
            signIn.classList = 'title sign';
            signIn.addEventListener('click', (event) => {
                chatController.clearPage();
                chatController.loginPageView.display();
            });

            const signUp = document.createElement('span');
            signUp.innerText = 'Sign up';
            signUp.classList = 'title sign sign-up'
            signUp.addEventListener('click', (event) => {
                chatController.clearPage();
                chatController.registrPageView.display();
            });

            newDiv.appendChild(signIn);
            newDiv.appendChild(signUp);

            frm.appendChild(newDiv);
            el.appendChild(frm);

            return;
        }

        const curentBody = document.createElement('div');
        curentBody.classList = 'curent-body';

        const iconTitle = document.createElement('div');
        iconTitle.classList = 'curent-icon title';
        iconTitle.innerText = user[0];
        curentBody.appendChild(iconTitle);

        const curent = document.createElement('div');
        curent.classList = 'curent';

        const userTitle = document.createElement('h2');
        userTitle.classList = 'title';
        userTitle.innerHTML = user;
        const logOut = document.createElement('span');
        logOut.classList = 'curent-btn';
        logOut.innerText = 'Log out';

        logOut.addEventListener('click', async (event) => {
            const response = await chatApiService.logOut();
            localStorage.setItem('curentUser', '');
            localStorage.setItem('token', '');

            chatController.clearPage();
            chatController.start();
        });

        curent.appendChild(userTitle);
        curent.appendChild(logOut);

        curentBody.appendChild(iconTitle);
        curentBody.appendChild(curent);
        frm.appendChild(curentBody);
        el.appendChild(frm);

        this._events();
    }

    _events() {
        const searchBtn = document.getElementById('searchBtn');

        const msgCheck = document.getElementById('msgCheck');
        const searchMsgInp = document.getElementById('searchMsgInp');

        const userCheck = document.getElementById('userCheck');
        const searchUserInp = document.getElementById('searchUserInp');

        const dateCheck = document.getElementById('dateCheck');
        const searchDateInp = document.getElementById('searchDateInp');

        //* inputs
        searchMsgInp.addEventListener('input', (event) => {
            sessionStorage.setItem('searchMsg', searchMsgInp.value);
            if(!!searchMsgInp.value) {
                msgCheck.checked = true;
                searchBtn.classList.add('search-btn');
            } else {
                msgCheck.checked = false;
                searchBtn.classList.remove('search-btn');
            }

            
        });
        searchUserInp.addEventListener('input', () => {
            sessionStorage.setItem('searchUser', searchUserInp.value);
            if(!!searchUserInp.value) {
                userCheck.checked = true;
                searchBtn.classList.add('search-btn');
            } else {
                userCheck.checked = false;
                searchBtn.classList.remove('search-btn');
            }
        });
        searchDateInp.addEventListener('input', () => {
            sessionStorage.setItem('searchDate', searchDateInp.value);
            if(!!searchDateInp.value) {
                dateCheck.checked = true;
                searchBtn.classList.add('search-btn');
            } else {
                dateCheck.checked = false;
                searchBtn.classList.remove('search-btn');
            }
        });

        // *checkboxes
        msgCheck.addEventListener('click', () => {
            if(!msgCheck.checked) {
                searchMsgInp.value = '';
                sessionStorage.setItem('searchMsg', searchMsgInp.value);
                if(!msgCheck.checked && !userCheck.checked && !dateCheck.checked) {
                    searchBtn.classList.remove('search-btn');
                }
            } else {
                msgCheck.checked = false;
            }
        });
        userCheck.addEventListener('click', () => {
            if(!userCheck.checked) {
                searchUserInp.value = '';
                sessionStorage.setItem('searchUser', searchUserInp.value);
                if(!msgCheck.checked && !userCheck.checked && !dateCheck.checked) {
                    searchBtn.classList.remove('search-btn');
                }
            } else {
                userCheck.checked = false;
            }
        });
        dateCheck.addEventListener('click', () => {
            if(!dateCheck.checked) {
                searchDateInp.value = '';
                sessionStorage.setItem('searchDate', searchDateInp.value);
                if(!msgCheck.checked && !userCheck.checked && !dateCheck.checked) {
                    searchBtn.classList.remove('search-btn');
                }
            } else {
                dateCheck.checked = false;
            }
        });

        //* SearchBtn
        searchBtn.addEventListener('click', () => {
            chatController.showMessage();
        });
        if(msgCheck.checked || userCheck.checked || dateCheck.checked) {
            searchBtn.classList.add('search-btn');
        }
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
            us.querySelector('.user').classList.add('user-online');
            us.querySelector('.user-icon').classList += 'online';
            us.querySelector('.user-icon').textContent = user[0];

            us.querySelector('.user-name').textContent = user;
            frm.appendChild(us);
        }

        el.appendChild(frm);
        this.events();
    }

    events() {
        const onlineUsers = document.getElementById(this._containerId);
        const userArr = onlineUsers.querySelectorAll('div.user');

        onlineUsers.addEventListener('click', (event) => {
            const user = event.target.closest('div.user');
            
            const to = user.querySelector('.user-name').innerText;
            const isActiveUser = onlineUsers.querySelector('div.user-active');

            if(!!isActiveUser) {
                isActiveUser.classList.remove('user-active');
                sessionStorage.setItem('to', '');
            }

            if(isActiveUser === user) {
                user.classList.remove('user-active');
                sessionStorage.setItem('to', '');
            } else {
                user.classList.add('user-active');
                sessionStorage.setItem('to', to);
            }
        });
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

    display(messages) {
        this._user = localStorage.getItem('curentUser');

        //typing 
        /* const typing = document.querySelector('div.typing');
        typing.innerHTML = '';
        const typingBody = document.getElementById('typing-template').content.cloneNode(true);
        typing.appendChild(typingBody); */

        const frm = new DocumentFragment();
        const el = document.getElementById(this._containerId);
        el.innerHTML = '';
        const baseHeight = el.scrollHeight;
        
        const msgTpl = document.getElementById('msg-template');
        for (const message of messages) {
            const msg = msgTpl.content.cloneNode(true);

            const classAdd = `${message.author === this._user ? 'my' : 'other'}-message`;

            let personalStyle;
            if(!!message.to) {
                let fromMeTo = `${message.author === this._user ? 'personal-message' : ''}`;
                personalStyle = `${message.to === this._user ? 'personal-message' : fromMeTo}`;

            }
            msg.querySelector('.all-message')
                .classList.add(classAdd);

            if (!!personalStyle && !!this._user) {
                msg.querySelector('.all-message')
                    .classList.add(personalStyle);
            }
            
            //disable confirm box
            msg.querySelector('div.confirm').style.display = 'none';

            msg.querySelector('.user-name').textContent = message.author;
            msg.querySelector('.message').textContent = message.text;
            msg.querySelector('.message-date').textContent = timeAgo(message.createdAt);


            //remove edit block from other message
            if (msg.querySelector('div.other-message')) {
                const removeNode = msg.querySelector('div.message-edit');
                if (removeNode.parentNode) {
                    removeNode.parentNode.removeChild(removeNode);
                }
            }

            //add id
            msg.querySelector('article.message-body').id = message.id;

            frm.appendChild(msg);
        }

        el.appendChild(frm);
        
        const loadNew = document.getElementById('loadNew-template').content.cloneNode(true);
        if(baseHeight === el.scrollHeight) {
            loadNew.querySelector(`.load-new`).classList.add('load-new-absolute');
        }
        el.appendChild(loadNew);

        el.scrollTop = sessionStorage.getItem('scrollTop');

        this._events();
    }

    _events() {
        const el = document.getElementById(this._containerId);

        let msgId;
        const typingBody = document.querySelector('div.typing-body');
        
        const input = document.getElementById('msgInp');
        const sendBtn = document.getElementById('sendMsg');

        const editInput = document.getElementById('editMsgInp');
        const cancelEdit = typingBody.querySelector('div.cancel-edit');
        const editBtn = document.getElementById('editBtn');
        
        const messages = el.querySelectorAll('div.my-message');

        for(const message of messages) {
            const id = message.parentNode.id;

            const editType = message.querySelector('div.message-edit');
            const remove = message.querySelector('#delMsg');
            const edit = message.querySelector('#editMsg');

            const confirm = message.querySelector('div.confirm');
            const yes = message.querySelector('#yes');
            const no = message.querySelector('#no');

            remove.addEventListener('click', (event) => {
                editType.style.display = 'none';
                confirm.style.display = ''; 
            });
            no.addEventListener('click', (event) => {
                confirm.style.display = 'none';
                editType.style.display = ''; 
            });
            yes.addEventListener('click', (event) => {
                /* const top = parseInt(sessionStorage.getItem('top'));
                if(top >= 10) {
                    sessionStorage.setItem('top', top);
                } */

                chatController.removeMessage(id);
                chatController.showMessage();
            });
            
            edit.addEventListener('click', (event) => {
                msgId = message.parentNode.id;
                sessionStorage.setItem('toEditId', msgId);

                sendBtn.style.display = 'none';
                editBtn.style.display = '';

                input.style.display = 'none';
                editInput.style.display = '';

                typingBody.classList.add('typing-body-edit');
                cancelEdit.style.display = '';

                input.value = '';
                editInput.value = message.querySelector('div.message').innerText;
                editInput.focus();
            });
        }

        /* function saveScroll() {
            console.log(el.scrollTop);
            sessionStorage.setItem('scrollTop', el.scrollTop);
        }

        el.removeEventListener('scroll', saveScroll);

        el.scrollTop = parseInt(sessionStorage.getItem('scrollTop'));
        el.addEventListener('scroll', saveScroll); */

        const loadNew = document.querySelector('div.load-new');
        loadNew.addEventListener('click', (event) => {
            localStorage.setItem('scrollTop', el.scrollTop);
            sessionStorage.setItem('top', parseInt(sessionStorage.getItem('top')) + 10);
            chatController.showMessage();
            el.scrollTop = parseInt(localStorage.getItem('scrollTop'));
        })
    }
}
//* Pages View 
class ErrorPageView {
    constructor() {
        this._containerId = 'body';
        this._pageFrm = 'error-page';
    }

    display() {
        const frm = new DocumentFragment();
        const el = document.querySelector(this._containerId);

        frm.appendChild(document.getElementById(this._pageFrm).content.cloneNode(true));

        el.appendChild(frm);

        const errBtn = document.getElementById('errBtn');

        errBtn.addEventListener('click', async () => {
            chatController.clearPage();
            chatController.start();
        });
    }
}
class ChatPageView {
    constructor() {
        this._containerId = 'body';
        this._pageFrm = 'chat-page';
    }

    display() {
        const frm = new DocumentFragment();
        const el = document.querySelector(this._containerId);

        frm.appendChild(document.getElementById(this._pageFrm).content.cloneNode(true));

        el.appendChild(frm);

        const msgList = document.getElementById('messageList');

        msgList.addEventListener('scroll', () => {
            sessionStorage.setItem('scrollTop', msgList.scrollTop);
        });

        //typing 
        const typing = document.querySelector('div.typing');
        const typingBody = document.getElementById('typing-template').content.cloneNode(true);
        typing.appendChild(typingBody);
        /* this.typing(); */
        this._events();
    }

    _events() {
        const typingBody = document.querySelector('div.typing-body');
        
        const input = document.getElementById('msgInp');
        const sendBtn = document.getElementById('sendMsg');

        const editInput = document.getElementById('editMsgInp');
        const cancelEdit = typingBody.querySelector('div.cancel-edit');
        const editBtn = document.getElementById('editBtn');

        const id = () => {
            return sessionStorage.getItem('toEditId');
        }

        //msg send
        input.addEventListener('keypress', (event) => {
            const to = sessionStorage.getItem('to');
            if(event.key === 'Enter') {
                if(!!input.value) {
                    if(!!to) {
                        chatController.addMessage({text: input.value, to: to});
                    } else {
                        chatController.addMessage({text: input.value});
                    }

                    let skip = parseInt(sessionStorage.getItem('skip'));
                    let top = parseInt(sessionStorage.getItem('top'));

                    input.value = '';
                }
            }
        });

        sendBtn.addEventListener('click', (event) => {
            const to = sessionStorage.getItem('to');
            if(!!input.value) {
                if(!!to) {
                    chatController.addMessage({text: input.value, to: to});
                } else {
                    chatController.addMessage({text: input.value});
                }

                let skip = parseInt(sessionStorage.getItem('skip'));
                let top = parseInt(sessionStorage.getItem('top'));

                if(document.querySelectorAll('div.message').length >= 10) {
                    top++;
                    sessionStorage.setItem('top', top);
                }

                input.value = '';
            }
        });

        //msg edit
        editBtn.addEventListener('click', (event) => {
            chatController.editMessage(id(), {text: editInput.value, to: sessionStorage.getItem('to')});

            editInput.value = '';
            editBtn.style.display = 'none';
            sendBtn.style.display = '';

            editInput.style.display = 'none';
            input.style.display = '';

            typingBody.classList.remove('typing-body-edit');
            cancelEdit.style.display = 'none';
        });

        editInput.addEventListener('keypress', (event) => {
            if(event.key === 'Enter') {
                chatController.editMessage(id(), {text: editInput.value, to: sessionStorage.getItem('to')});

                editInput.value = '';
                editBtn.style.display = 'none';
                sendBtn.style.display = '';
    
                editInput.style.display = 'none';
                input.style.display = '';
    
                typingBody.classList.remove('typing-body-edit');
                cancelEdit.style.display = 'none';
            }
        });

        cancelEdit.addEventListener('click', (event) => {
            editInput.value = '';
            editBtn.style.display = 'none';
            sendBtn.style.display = '';
    
            editInput.style.display = 'none';
            input.style.display = '';
    
            typingBody.classList.remove('typing-body-edit');
            cancelEdit.style.display = 'none';
        });
    }
}

class LoginPageView {
    constructor() {
        this._containerId = 'body';
        this._loginFrm = 'login-page'
    }

    display() {
        const frm = new DocumentFragment();
        const el = document.querySelector(this._containerId);

        frm.appendChild(document.getElementById(this._loginFrm).content.cloneNode(true));

        el.appendChild(frm);
        document.getElementById('logInp').focus();
        document.querySelector('button').disabled = true;

        this.events();
    }

    events() {
        const loginRegExp = /[a-zA-Z0-9]{3,12}/;
        const passRegExp = /[a-zA-Z0-9\_]{6,12}/;
        
        const form = document.forms[0];

        const login = document.getElementById('logInp');
        const pass = document.getElementById('passInp');
        const submit = document.getElementById('submit');
        submit.disabled = true;
        const errText = document.getElementById('errText');

        login.addEventListener('input', (event) => {
            if(loginRegExp.test(login.value)) {
                login.classList.remove('form-input-wrong');
                login.classList.add('form-input-success');
                
            } else {
                login.classList.remove('form-input-success');
                login.classList.add('form-input-wrong');
            }

            if (
                loginRegExp.test(login.value) &&
                passRegExp.test(pass.value)
            ) {
                submit.disabled = false;
            } else {
                submit.disabled = true;
            }
        });

        pass.addEventListener('input', (event) => {
            if(passRegExp.test(pass.value)) {
                pass.classList.remove('form-input-wrong');
                pass.classList.add('form-input-success');
            } else {
                pass.classList.remove('form-input-success');
                pass.classList.add('form-input-wrong');
            }

            if (
                loginRegExp.test(login.value) &&
                passRegExp.test(pass.value)
            ) {
                submit.disabled = false;
            } else {
                submit.disabled = true;
            }
        });
        // LOGIN
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                const response = await chatApiService.signIn(login.value, pass.value);
                const status = await response.status;
                if (status === 200) {
                    const data = await response.json();
                    const token = data.token;

                    localStorage.setItem('curentUser', login.value);
                    localStorage.setItem('token', token);

                    chatController.clearPage();
                    chatController.start();
                } else if(status === 401) {
                    login.focus();

                    login.classList.remove('form-input-success');
                    login.classList.add('form-input-wrong');

                    pass.classList.remove('form-input-success');
                    pass.classList.add('form-input-wrong');
                } else {
                    errText.innerText = 'Wrong login or password';
                } 
            } catch (err) {
                console.error("Error: ", err);
            }
            
        });
    }
}

class RegistrPageView {
    constructor() {
        this._containerId = 'body';
        this._registrFrm = 'registr-page'
    }

    display() {
        const frm = new DocumentFragment();
        const el = document.querySelector(this._containerId);

        frm.appendChild(document.getElementById(this._registrFrm).content.cloneNode(true));

        el.appendChild(frm);
        document.getElementById('logInp').focus();
        document.querySelector('button').disabled = true;

        this.events();
    }

    events() {
        const loginRegExp = /[a-zA-Z0-9]{3,12}/;
        const passRegExp = /[a-zA-Z0-9\_]{6,12}/;

        const form = document.forms[0];
        
        const login = document.getElementById('logInp');
        const pass = document.getElementById('passInp');
        const rePass = document.getElementById('rePassInp');
        const submit = document.getElementById('submit');
        submit.disabled = true;

        login.addEventListener('input', (event) => {
            if(loginRegExp.test(login.value)) {
                login.classList.remove('form-input-wrong');
                login.classList.add('form-input-success');
                
            } else {
                login.classList.remove('form-input-success');
                login.classList.add('form-input-wrong');
            }

            if (
                (loginRegExp.test(login.value) &&
                passRegExp.test(pass.value)) &&
                pass.value === rePass.value
            ) {
                submit.disabled = false;
            } else {
                submit.disabled = true;
            }
        });

        pass.addEventListener('input', (event) => {
            if(passRegExp.test(pass.value)) {
                pass.classList.remove('form-input-wrong');
                pass.classList.add('form-input-success');
            } else {
                pass.classList.remove('form-input-success');
                pass.classList.add('form-input-wrong');
            }

            if (
                (loginRegExp.test(login.value) &&
                passRegExp.test(pass.value)) &&
                pass.value === rePass.value
            ) {
                submit.disabled = false;
            } else {
                submit.disabled = true;
            }
        });

        rePass.addEventListener('input', (event) => {
            if(rePass.value === pass.value) {
                rePass.classList.remove('form-input-wrong');
                rePass.classList.add('form-input-success');
            } else {
                rePass.classList.remove('form-input-success');
                rePass.classList.add('form-input-wrong');
            }

            if (
                (loginRegExp.test(login.value) &&
                passRegExp.test(pass.value)) &&
                pass.value === rePass.value
            ) {
                submit.disabled = false;
            } else {
                submit.disabled = true;
            }
        });
        // REGISTER
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const status = await chatApiService.signUp(login.value, pass.value);

            if (await status.status === 409) {
                errText.innerText = 'User with such login already exists, \n try to sing in.';
            } else if (await status.status === 200) {
                const response = await chatApiService.signIn(login.value, pass.value);
                const data = await response.json();
                const token = await data.token;

                localStorage.setItem('curentUser', login.value);
                localStorage.setItem('token', token);

                chatController.clearPage();
                chatController.start();
            }

            /* if (!status) {
                event.preventDefault();
                errText.innerText = 'User with such login already exists';
            } */
        });
    }
}

const messages = [
    new Message('added js', 'Sasha', 'Pasha', new Date('2020-10-12T12:01:44')),
    new Message('О, привет. Как дела?', defaultStatus, 'Rion', new Date('2020-10-12T11:01:44')),
    new Message('Hello world!1', defaultStatus, 'Sasha', new Date('2020-10-12T15:01:44')),
    new Message('Hello world!2', defaultStatus, 'Sasha', new Date('2020-11-19T00:30:00')),
    new Message('Hello world!3', defaultStatus, 'ZhenyaH', new Date('2020-11-19T01')),
    new Message('Hello world!4', defaultStatus, 'Dima', new Date()),

];

//*Controller
class ChatController {
    constructor() {
        //* Message List n UserList
        this.msgList = new MessageList(messages);

        /* this.userList = chatApiService.getUsers(); */
        this.userList = new UserList([],[]);

        //* View
        this.headerView = new HeaderView('curentUser');
        this.onlineUsersView = new OnlineUsersView('onlineList');
        this.offlineUsersView = new OfflineUsersView('offlineList');
        this.messageView = new MessageView('messageList');

        //* Page view
        this.chatPageView = new ChatPageView();
        this.loginPageView = new LoginPageView();
        this.registrPageView = new RegistrPageView();
        this.errorPageView = new ErrorPageView();
    }

    signIn(login) {
        if(!!this.userList) {
            for(let user of this.userList.users) {
                if(user === login) {
                    localStorage.setItem('curentUser', login);
                    this.clearPage();
                    this.chatPageView.display();
                    return true;
                }
            }
        }
    
        return false;
    }
    
    signUp(login, pass) {
        console.log('Try to register...');

        (async () => {
            console.log(await chatApiService.signUp(login, pass));
            return status.status;
        })()
        /* try {
            console.log('Try to register...');
            const response = await chatApiService.signUp(login, pass);
            debugger;
            console.log(response.status);

            setTimeout(() => console.log('TimeOut'), 5000); 
        } catch(err) {
            console.error("Error: ", err);
        } */
        

        //const result = await chatApiService.signUp(login, pass);

        /* if(!!this.userList) {
            for(let user of this.userList.users) {
                if(user === login) {
                    return false;
                }
            } 
    
            this.userList.users.push(login);
            localStorage.setItem('userList', JSON.stringify(this.userList));
    
            localStorage.setItem('curentUser', login);
            this.clearPage();
            this.chatPageView.display();
    
            return true;
        } */
    }

    setCurrentUser(user) {
        this.headerView.user = user;
        this.headerView.display();
    
        this.messageView.user = user;
    
        this.msgList.user = user;
        this.showMessage();
    }
    
    async addMessage(msg) {
        const {text, to} = msg;
        
        try {
            const response = await chatApiService.postMessage(text, to);
            this.showMessage();
        } catch(err) {
            console.error("Error: ", err);
        }
        
    }
    
    async editMessage(idF, msg) {
        const {text, to} = msg;
        try {
            const response = await chatApiService.putMessage(idF, text, to);
            this.showMessage();
        } catch(err) {
            console.error("Error: ", err);
        }
    }
    
    async removeMessage(idF) {
        try {
            const response = await chatApiService.delMessage(idF);
            this.showMessage();
        } catch(err) {
            console.error("Error: ", err);
        }
    }
    
    async showMessage() {
        try {
            const response = await chatApiService.getMessages();
            const msgs = await response.json();
            this.messageView.display(msgs);
        } catch (err) {
            console.log(error);
        }
    }
  
    showUsers() {
        this.onlineUsersView.display(this.userList.activeUsers);
        this.offlineUsersView.display(this.userList.getOffline());
    }

    clearPage() {
        clearInterval(window.msgInterval);                
        clearInterval(window.usersInterval);                

        const body = document.querySelector('body');
        body.removeChild(document.querySelector('div.wrapper'));
    }

    async start() {
        this.chatPageView.display();

        sessionStorage.setItem('skip', 0);
        sessionStorage.setItem('top', 10);

        sessionStorage.setItem('searchMsg', '');
        sessionStorage.setItem('searchUser', '');
        sessionStorage.setItem('searchDate', '');
        
        try {

            //Curent user
            this.headerView.display();

            //Messages
            this.showMessage();
            window.msgInterval = setInterval(() => {
                this.showMessage();
            }, 10 * 1000);

            //USERS
            const localLoadUsers = async () => {
                try {
                    this.userList = await chatApiService.getUsers();
                    this.showUsers();
                } catch(err) {
                    console.error("Load users ERROR: ", err);
                }
            }

            localLoadUsers();
            window.usersInterval = setInterval(() => {
                localLoadUsers();
            }, 40 * 1000);
        } catch(e) {
            console.error("Error :", e);
            this.errorPage();
        }
        
    }

    errorPage() {
        this.clearPage();
        this.errorPage.display();
    }
}

class ChatApiService {
    constructor(host) {
        this._host = host;
    }

    _getHeaders() {
        const myHeaders = new Headers();
        const data = 'Bearer ' + localStorage.getItem('token') || '';
        myHeaders.append("Authorization", data);

        return myHeaders;
    }
    //Users
    getUsers() {
        const link = this._host + 'users';

        const newUserList = [];
        const newActiveList = [];

        var myHeaders = this._getHeaders();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(link, requestOptions)
            .then(response => response.json())
            .then(result => {
                for (const user of result) {
                    if(!!user.name) {
                        newUserList.push(user.name);
                        if (user.isActive) {
                            newActiveList.push(user.name);
                        }
                    }
                }
                return new UserList(newUserList, newActiveList);
            })
            .catch(error => console.log('Error', error));
    }

    //Accaunt
    async logOut() {
        const link = this._host + 'auth/logout'
        var myHeaders = this._getHeaders();

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(link, requestOptions);
        /* return fetch(link, requestOptions); */
    }

    async signIn(name, pass) {
        const link = this._host + 'auth/login';

        var formdata = new FormData();
        formdata.append("name", `${name}`);
        formdata.append("pass", `${pass}`);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
        
        try {
            return await fetch(link, requestOptions);
        } catch (err) {
            console.error("Error: ", err);
        }
        
    }

    async signUp(name, pass) {
        const link = this._host + 'auth/register';
        var formdata = new FormData();
        formdata.append("name", `${name}`);
        formdata.append("pass", `${pass}`);     

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        return await fetch(link, requestOptions);
    }

    //Messages
    async getMessages() {
        let link = `${this._host}messages?skip=${sessionStorage.getItem('skip')}&top=${sessionStorage.getItem('top')}`;
        link += `&author=${sessionStorage.getItem('searchUser')}&text=${sessionStorage.getItem('searchMsg')}&dateTo=${sessionStorage.getItem('searchDate').split('-').join()}`;
        var myHeaders = this._getHeaders();

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            return await fetch(link, requestOptions)
        } catch(err) {
            console.error("Error: ", err);
        }
        
    }

    async postMessage(text, to) {
        var myHeaders = this._getHeaders();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({"text":text,"isPersonal":to ? true : false, "to": to ? to : '',"author":localStorage.getItem('curentUser')});

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return fetch("https://jslabdb.datamola.com/messages", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }

    async delMessage(id) {
        const link = this._host + "messages/" + id;
        var myHeaders = this._getHeaders();

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(link, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }

    async putMessage(id, text, to = '') {
        const link = this._host + 'messages/' + id;
        
        var myHeaders = this._getHeaders();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({"text":text,"isPersonal":to ? true : false, "to":to ? to : ''});

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch(link, requestOptions);
    }
}

const chatApiService = new ChatApiService("https://jslabdb.datamola.com/");
const chatController = new ChatController();
chatController.start();
