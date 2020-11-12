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