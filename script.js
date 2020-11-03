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
    let settings = {
        skip: 0,
        top: 10,
    };

    let filterObject = {
        author: "",
        dateFrom: "",
        dateTo: "",
        text: "",
    };

    //* Создать модуль с помощью замыкания.
    //* Модуль должен содержать следующие методы для работы с массивом messages:
    /* Бд Сообщений */

    return {
        baseFilter: function () {
            let correctMessages = messages.slice(0);

            if (curentUser != "") {
                correctMessages = correctMessages.filter(
                    ({ author, isPersonal, to }) =>
                        to === curentUser ||
                        author === curentUser ||
                        isPersonal === false
                );
            } else {
                correctMessages = correctMessages.filter(
                    ({ isPersonal }) => isPersonal === false
                );
            }

            correctMessages.sort((a, b) => +b.createdAt - +a.createdAt);

            return correctMessages;
        },

        getMessages: function (
            skip = 0,
            top = 10,
            curentFilters = filterObject
        ) {
            let curentMessages = this.baseFilter();


            let isFilter = false;
            for (key in curentFilters) {
                if (curentFilters[key] === "") continue;
                switch (key) {
                    case "author":
                        {
                            if (
                                curentMessages.filter(({ author }) =>
                                    author
                                        .toLowerCase()
                                        .includes(
                                            curentFilters[key].toLowerCase()
                                        )
                                ).length > 0
                            ) {
                                curentMessages = curentMessages.filter(
                                    ({ text }) =>
                                        author
                                            .toLowerCase()
                                            .includes(
                                                curentFilters[key].toLowerCase()
                                            )
                                );
                            } else {
                                curentMessages = [];
                            }
                            isFilter = true;
                        }
                        break;
                    case "dateFrom":
                        {
                            if (
                                curentMessages.filter(
                                    ({ createdAt }) =>
                                        createdAt >=
                                        new Date(curentFilters[key])
                                ).length > 0
                            ) {
                                curentMessages = curentMessages.filter(
                                    ({ createdAt }) =>
                                        createdAt >=
                                        new Date(curentFilters[key])
                                );
                            } else {
                                curentMessages = [];
                            }
                            isFilter = true;
                        }
                        break;
                    case "dateTo":
                        {
                            if (
                                curentMessages.filter(
                                    ({ createdAt }) =>
                                        createdAt <=
                                        new Date(curentFilters[key])
                                ).length > 0
                            ) {
                                curentMessages = curentMessages.filter(
                                    ({ createdAt }) =>
                                        createdAt <=
                                        new Date(curentFilters[key])
                                );
                            } else {
                                curentMessages = [];
                            }

                            isFilter = true;
                        }
                        break;
                    case "text":
                        {
                            if (
                                curentMessages.filter(({ text }) =>
                                    text
                                        .toLowerCase()
                                        .includes(
                                            curentFilters[key].toLowerCase()
                                        )
                                ).length > 0
                            ) {
                                curentMessages = curentMessages.filter(
                                    ({ text }) =>
                                        text
                                            .toLowerCase()
                                            .includes(
                                                curentFilters[key].toLowerCase()
                                            )
                                );
                            } else {
                                curentMessages = [];
                            }
                            isFilter = true;
                        }
                        break;
                    default:
                        break;
                }
            }

            /* while (skip + top > curentMessages.length) {
                if (skip >= 0 && skip + top > curentMessages.length) {
                    skip--;
                } else {
                    if (top >= curentMessages.length) {
                        top = curentMessages.length;
                    }
                }
            } */
            currentMessages = messages.slice(skip, skip + top); //Можно сделать в одну строку

            if (curentMessages.length > 0) {
                for (let i = 0 + skip; i < top + skip; i++) {
                    console.log(i + 1 + " : ");
                    this.writeMessage(curentMessages[i]);
                }
            } else {
                if (isFilter) {
                    console.warn("По данным поиска не удалось найти сообщения");
                } else {
                    console.log("Сообщений пока нет");
                }
            }

            return curentMessages;
        },

        getMessage: function (messageId) {
            let msg;

            if (messages.find(({ id }) => id === messageId) === undefined) {
                msg = console.error("Не удалось найти сообщение с таким Id");
                return false;
            } else {
                msg = messages.find(({ id }) => id === messageId); //Vj;yj gjvtyznm
            }

            this.writeMessage(msg);
            return true;
        },

        //Add messsage
        validateMessage: function (msg) {
            let { text, createdAt, author } = msg;

            if (
                text.length <= 200 &&
                text != "" &&
                createdAt <= new Date() &&
                author != ""
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
            let count = 0;
            let msg = messages.find(({ id }) => id === messageId);
            let index = messages.indexOf(msg);

            for (key in toEdit) {
                if (key == "text" || key == "isPersonal" || key == "to") {
                } else {
                    count++;
                }
            }
            if (count > 0)
                console.warn("Можно изменить только text, isPersonal, to");

            Object.assign(msg, toEdit);

            if (this.validateMessage(msg)) {
                messages[index] = msg;
                return true;
            }

            return false;
        },

        removeMessage: function (messageId) {
            //
            if (this.getMessage(messageId)) {
                const msg = messages.find(({ id }) => id === messageId);
                let index = messages.indexOf(msg);
                console.log(msg);
                messages.splice(msg, 1);
                console.warn("Сообщение удалено");

                if(messages.find(({ id }) => id === messageId) === undefined)
                    console.log(true);
            }
            return false;
        },

        // Debbug function
        createMessage: function (text, to = '') {
            let msg = {
                id: counter.increment(),
                text: text,
                createdAt: new Date(),
                author: curentUser,
                isPersonal: false,
                to: "",
            };

            if (to > '') {
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
chat.createMessage("Ура! НОВОЕ СООБЩЕНИЕ ! ", "Rion");
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

chat.showAll();
