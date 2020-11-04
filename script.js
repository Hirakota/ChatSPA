const chat = (function () {
    let counter = (function () {
        let count = 0;

        return {
            increment: function () {
                return "" + ++count;
            },
        };
    })();

    let messages = [
        {
            id: counter.increment(),
            text: "added js",
            createdAt: new Date("2020-09-12T23:00:00"),
            author: "Alexandr",
            isPersonal: true,
            to: "Ed",
        },
        {
            id: counter.increment(),
            text: "О, привет. Как дела?",
            createdAt: new Date("2020-09-12T23:01:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Всем привет!",
            createdAt: new Date("2020-09-12T23:02:00"),
            author: "Ed",
            isPersonal: true,
            to: "Alexandr",
        },
        {
            id: counter.increment(),
            text: "О, привет. Как дела?",
            createdAt: new Date("2020-09-12T23:03:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет!",
            createdAt: new Date("2020-09-12T23:04:00"),
            author: "Ed",
            isPersonal: true,
            to: "Alexandr",
        },
        {
            id: counter.increment(),
            text: "О, привет. Как дела?",
            createdAt: new Date("2020-09-12T23:05:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет!",
            createdAt: new Date("2020-09-12T23:03:50"),
            author: "Alexandr",
            isPersonal: true,
            to: "Ed",
        },
        {
            id: counter.increment(),
            text: "Привет!",
            createdAt: new Date("2020-09-12T23:05:50"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-12T23:06:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-12T23:07:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-12T23:08:00"),
            author: "Alexandr",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-12T23:09:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:06:00"),
            author: "Alexandr",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:07:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:08:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:09:50"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "всем!",
            createdAt: new Date("2020-09-13T14:10:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:13:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:14:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: counter.increment(),
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:19:00"),
            author: "Rion",
            isPersonal: true,
            to: "Ed",
        },
        {
            id: counter.increment(),
            text: "Hi Rion!",
            createdAt: new Date("2020-09-13T14:20:00"),
            author: "Ed",
            isPersonal: true,
            to: "Rion",
        },
    ];

    let curentUser = "Ed";

    /* Основные параметры */

    let filterObj = {
        author: (item, authorF) =>
            !authorF ||
            item.author.toLowerCase().includes(authorF.toLowerCase()),
        text: (item, textF) =>
            !textF || item.text.toLowerCase().includes(textF.toLowerCase()),
        dateFrom: (item, dateFromF) =>
            !dateFromF || item.createdAt >= dateFromF,
        dateTo: (item, dateToF) => !dateToF || item.createdAt <= dateToF,
    };

    //* Создать модуль с помощью замыкания.
    //* Модуль должен содержать следующие методы для работы с массивом messages:
    /* Бд Сообщений */

    return {
        baseFilter: function () {
            let result = messages.slice(0);

            if (!!this.curentUser) {
                result = result.filter(
                    ({ author, isPersonal, to }) =>
                        to === this.curentUser ||
                        author === this.curentUser ||
                        isPersonal === false
                );
            } else {
                result = result.filter(
                    ({ isPersonal }) => isPersonal === false
                );
            }

            result.sort((a, b) => +b.createdAt - +a.createdAt);

            return result;
        },

        getMessages: function (skip = 0, top = 10, filterConfig = {}) {
            let result = this.baseFilter();

            /* for (key in filterConfig) {
                result = result.filter((item) =>
                    filterObj[key](item, filterConfig[key])
                );
            } */

            Object.keys(filterConfig).forEach((key) => {
                result = result.filter((item) => filterObj[key](item, filterConfig[key]));
            });

            if(skip < result.length) {
                while(skip + top > result.length) {
                    top--;
                }
            } else {
                console.log("Сообщений не найдено");
                return [];
            }

            result = result.slice(skip, top + skip); //Можно сделать в одну строку

            if (result.length > 0) {
                for (let i = 0; i < top; i++) {
                    console.log(i + 1 + " : ");
                    this.writeMessage(result[i]);
                }
            } else {
                console.log("Сообщений пока нет");
            }

            return result;
        },

        getMessage: function (messageId) {
            let msg;

            if (messages.find(({ id }) => id === messageId) != undefined) {
                msg = messages.find(({ id }) => id === messageId);
            } else {
                msg = console.error("Не удалось найти сообщение с таким Id");
                return false;
            }

            this.writeMessage(msg);
            return true;
        },

        //Add messsage
        validateMessage: function (msg) {
            if (
                msg.text.length <= 200 &&
                !!msg.text && !!msg.author &&
                msg.createdAt <= new Date()
            ) {
                if (msg.isPersonal == true) {
                    if (msg.to != "") return true;
                    else return false;
                } else return true;
            }

            return false;
        },

        addMessage: function (msg) {
            if (!this.validateMessage(msg)) return false;
            
            let len = messages.length;
            messages.push(msg);

            if (len < messages.length) return true;

            return false;
        },

        //Message editing
        editMessage: function (messageId, toEdit) {
            let index = messages.findIndex(({ id }) => id === messageId);
            let msg = messages[index];
            
            let {text, to} = toEdit;

            if(!!text) {
                msg.text = toEdit.text;
            }
            if(!!to) {
                msg.isPersonal = true;
                msg.to = toEdit.to;
            } else {
                msg.isPersonal = false;
            }

            if(this.validateMessage(msg)) {
                messages[index] = msg;
                return true;
            }

            return false;
        },

        removeMessage: function (messageId) {
            //
            if (this.getMessage(messageId)) {
                const index = messages.findIndex(({ id }) => id === messageId);
                messages.splice(index, 1);

                if (!!messages.find(({ id }) => id === messageId)) {
                    console.warn("Сообщение удалено");
                    return true;
                }
            }
            return false;
        },

        // Debbug function
        createMessage: function (text, to = "") {
            let msg = {
                id: counter.increment(),
                text: text,
                createdAt: new Date(),
                author: curentUser,
                isPersonal: false,
                to: "",
            };

            if (!!to) {
                msg.isPersonal = true;
                msg["to"] = to;
            }

            this.addMessage(msg);
            return msg;
        },

        // Debbug function
        writeMessage: function (msg) {
            console.log(
                msg.author,
                ": ",
                msg.text,
                msg.isPersonal,
                " Date: ",
                msg.createdAt
            );
        },

        showAll: function () {
            console.log(messages);
            return messages;
        },
    };
})();

//*--- Для проверки
console.log(chat.messages);

console.warn("---------getMessage(id)-----id = '1'");
chat.getMessage("1");

console.warn("---------Получаем сообщения для пользователя " + chat.curentUser);
chat.getMessages();

console.warn(
    '---------Создаем сообщение и добовляем его addMessage(createMessage("Ура! НОВОЕ СООБЩЕНИЕ","ed"))'
);
chat.getMessages();

chat.curentUser = "";
console.warn(
    "---------Получаем сообщения для пользователя (default) " + chat.curentUser
);
chat.getMessages();

console.warn(
    "---------Получаем сообщения для пользователя (default) c фильтрами " +
        chat.curentUser
);

chat.getMessages(10, 10);

chat.curentUser = "Rion";
console.warn("---------Получаем сообщения для пользователя " + chat.curentUser);
chat.getMessages();

console.warn("---------Получениен сообщения по Id и редактирование");
chat.getMessage("1");
chat.editMessage("1", { text: "New Text" });
chat.getMessage("1");
chat.editMessage("1", { text: "New Text 222", author: "New Author" });
chat.getMessage("1");
chat.editMessage("1", { text: "New Text", to: "Ed" });
chat.getMessage("1");
chat.editMessage("1", { text: "New Text", isPersonal: false });
chat.getMessage("1");

console.warn("---------Удаление сообщений");
chat.removeMessage("1");
chat.removeMessage("1");

console.warn("---------Создание сообщения ");
chat.curentUser = 'Rion';
chat.createMessage('texttetxetxt', 'Alexandr');

chat.showAll();
