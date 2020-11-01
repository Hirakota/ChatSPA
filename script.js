(function () {
    messages = [
        {
            id: "1",
            text: "added js",
            createdAt: new Date("2020-09-12T23:00:00"),
            author: "Alexandr",
            isPersonal: true,
            to: "Ed",
        },
        {
            id: "2",
            text: "О, привет. Как дела?",
            createdAt: new Date("2020-09-12T23:01:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: "3",
            text: "Всем привет!",
            createdAt: new Date("2020-09-12T23:02:00"),
            author: "Ed",
            isPersonal: true,
            to: "Alexandr",
        },
        {
            id: "4",
            text: "О, привет. Как дела?",
            createdAt: new Date("2020-09-12T23:03:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: "5",
            text: "Привет!",
            createdAt: new Date("2020-09-12T23:04:00"),
            author: "Ed",
            isPersonal: true,
            to: "Alexandr",
        },
        {
            id: "6",
            text: "О, привет. Как дела?",
            createdAt: new Date("2020-09-12T23:05:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: "7",
            text: "Привет!",
            createdAt: new Date("2020-09-12T23:03:50"),
            author: "Alexandr",
            isPersonal: true,
            to: "Ed",
        },
        {
            id: "8",
            text: "Привет!",
            createdAt: new Date("2020-09-12T23:05:50"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: "9",
            text: "Привет всем!",
            createdAt: new Date("2020-09-12T23:06:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: "10",
            text: "Привет всем!",
            createdAt: new Date("2020-09-12T23:07:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: "11",
            text: "Привет всем!",
            createdAt: new Date("2020-09-12T23:08:00"),
            author: "Alexandr",
            isPersonal: false,
        },
        {
            id: "12",
            text: "Привет всем!",
            createdAt: new Date("2020-09-12T23:09:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: "13",
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:06:00"),
            author: "Alexandr",
            isPersonal: false,
        },
        {
            id: "14",
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:07:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: "15",
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:08:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: "16",
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:09:50"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: "17",
            text: "всем!",
            createdAt: new Date("2020-09-13T14:10:00"),
            author: "Ed",
            isPersonal: false,
        },
        {
            id: "18",
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:13:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: "19",
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:14:00"),
            author: "Rion",
            isPersonal: false,
        },
        {
            id: "20",
            text: "Привет всем!",
            createdAt: new Date("2020-09-13T14:19:00"),
            author: "Rion",
            isPersonal: true,
            to: "Ed",
        },
        {
            id: "21",
            text: "Hi Rion!",
            createdAt: new Date("2020-09-13T14:20:00"),
            author: "Ed",
            isPersonal: true,
            to: "Rion",
        },
    ];

    let curentUser = "Ed";

    const chat = (function () {
        /* Основные параметры */
        let settings = {
            skip: 0,
            top: 10,
        };

        let filterConfig = {
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
                skip = settings.skip,
                top = settings.top,
                curentFilters = filterConfig
            ) {
                let curentMessages = this.baseFilter();
                curentMessages.sort((a, b) => +b.createdAt - +a.createdAt);

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
                                                    curentFilters[
                                                        key
                                                    ].toLowerCase()
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
                                                    curentFilters[
                                                        key
                                                    ].toLowerCase()
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

                if (top >= curentMessages.length) top = curentMessages.length;

                if (curentMessages.length > 0) {
                    for (let i = 0 + skip; i < top + skip; i++) {
                        console.log(i + 1 + " : ");
                        this.writeMessage(curentMessages[i]);
                    }
                } else {
                    if (isFilter) {
                        console.warn(
                            "По данным поиска не удалось найти сообщения"
                        );
                    } else {
                        console.log("Сообщений пока нет");
                    }
                }

                return curentMessages;
            },

            getMessage: function (messageId) {
                let msg;

                if (messages.find(({ id }) => id === messageId) === undefined) {
                    msg = console.error(
                        "Не удалось найти сообщение с таким Id"
                    );
                    return false;
                } else {
                    msg = messages.find(({ id }) => id === messageId);
                }

                this.writeMessage(msg);
                return true;
            },

            //Add messsage
            validateMessage: function (msg) {
                let { id, text, createdAt, author } = msg;

                if (
                    id != "" &&
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
                        delete toEdit[key];
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
                if (this.getMessage(messageId)) {
                    messages.splice(
                        messages.find(({ id }) => id === messageId),
                        1
                    );
                    console.warn("Сообщение удалено");
                    return true;
                } else {
                    console.error("Удалить сообщение");
                }
                return false;
            },

            // Debbug function
            createMessage: function (text, to = undefined) {
                let msg = {
                    id: undefined,
                    text: "",
                    createdAt: new Date(),
                    author: curentUser,
                    isPersonal: false,
                    to: "",
                };

                msg.id =
                    "" +
                    (Math.max(...messages.map((message) => message.id)) + 1);
                msg.text = text;

                if (to != undefined) {
                    msg.isPersonal = true;
                    msg["to"] = to;
                }

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
        };
    })();

    //*--- Для проверки
    console.log(messages);

    console.warn("---------getMessage(id)-----id = '1'");
    chat.getMessage("1");

    console.warn("---------Получаем сообщения для пользователя " + curentUser);
    chat.getMessages();

    console.warn(
        '---------Создаем сообщение и добовляем его addMessage(createMessage("Ура! НОВОЕ СООБЩЕНИЕ","ed"))'
    );
    chat.addMessage(chat.createMessage("Ура! НОВОЕ СООБЩЕНИЕ ! ", "Rion"));
    console.log();
    chat.getMessages();

    curentUser = "";
    console.warn(
        "---------Получаем сообщения для пользователя (default) " + curentUser
    );
    chat.getMessages();

    curentUser = "Rion";
    console.warn("---------Получаем сообщения для пользователя " + curentUser);
    chat.getMessages();

    console.warn("---------Получениен сообщения по Id и редактирование");
    chat.getMessage("1");
    chat.editMessage("1", { text: "New Text" });
    chat.getMessage("1");

    console.warn("---------Удаление сообщений");
    chat.removeMessage("1");
    chat.removeMessage("1");
})();
