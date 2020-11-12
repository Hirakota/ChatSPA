class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class NodeList {
    constructor(node = null) {
        this.root = node;
        this._length = 0;
    }

    addNode(value, position = undefined) {
        const node = new Node(value);
        let currentNode = this.root;

        if (!currentNode) {
            this.root = node;
            this._length++;

            return node;
        }

        let count = 1;
        if (!!position && position > 0) {
            while (count < position) {
                currentNode = currentNode.next;
                count++;
            }

            node.next = currentNode.next;
            currentNode.next = node;
            this._length++;

            return true;
        }
        while (currentNode.next) {
            currentNode = currentNode.next;
        }

        currentNode.next = node;

        this._length++;

        return true;
    }

    searchNodeAt(position) {
        let currentNode = this.root;
        const length = this._length;
        let count = 1;

        if (length === 0 || position < 1 || position > length) {
            console.err('Invailid value');
        }

        while (count < position) {
            currentNode = currentNode.next;
            count++;
        }

        return currentNode;
    }

    removeNode(position) {
        let currentNode = this.root;
        const length = this._length;
        let preNode = null;

        if (this._length === 1) {
            return false;
        }

        if (position < 0 || position > length) {
            return false;
        }

        let count = 1;
        while (count < position) {
            preNode = currentNode;
            currentNode = currentNode.next;
            count++;
        }

        preNode.next = currentNode.next;
        this._length--;

        return true;
    }

    printNodes() {
        let currentNode = this.root;
        const arr = [];

        while (currentNode.next) {
            arr.push(currentNode.value);
            currentNode = currentNode.next;
        }
        arr.push(currentNode.value);

        console.log('Print:' + arr.join(', '));
    }
}

const list = new NodeList();

list.addNode(1);
list.addNode(2);
list.addNode(3);
list.printNodes();
list.addNode(4, 1);
list.printNodes();
list.removeNode(2);
list.printNodes();
