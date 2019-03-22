const Node = require('./node');

class MaxHeap {
    constructor() {
        this.root = null;
        this._nodes = [];
    }

    push(data, priority) {
        const node = new Node(data, priority);
        this.insertNode(node);
        this.shiftNodeUp(node);
    }

    pop() {
        if (!this.isEmpty()) {
            const detached = this.detachRoot();
            this.restoreRootFromLastInsertedNode(detached);
            this.shiftNodeDown(this.root);
            return detached.data;
        }
    }

    detachRoot() {
        const {root} = this;
        if (this._nodes.includes(root)) {
            this._nodes.shift();
        }
        this.root = null;
        return root;
    }

    restoreRootFromLastInsertedNode(detached) {
        if (!this.isEmpty()) {
            const lastNode = this._nodes.pop();
            if (!lastNode.parent) {
                return this.root = lastNode;
            }
            if (lastNode.parent.right === lastNode && lastNode.parent !== detached) {
                this._nodes.unshift(lastNode.parent);
            }
            lastNode.remove();
            if (detached !== lastNode.parent) {
                if (detached.left) {
                    lastNode.appendChild(detached.left);
                }
                if (detached.right) {
                    lastNode.appendChild(detached.right);
                }
            }
            if (!lastNode.right) {
                this._nodes.unshift(lastNode);
            }
            this.root = lastNode;
        }
    }

    size() {
        return MaxHeap.getSize(this.root);
    }

    static getSize(node) {
        return (node !== null) ? MaxHeap.getSize(node.left) + MaxHeap.getSize(node.right) + 1 : 0;
    }

    isEmpty() {
        return this.root === null && this._nodes.length === 0;
    }

    clear() {
        this._nodes.splice(0, this._nodes.length);
        this.root = null;
    }

    insertNode(node) {
        if (this.isEmpty()) {
            this.root = node;
            this._nodes.push(node);
        } else {
            this._nodes.push(node);
            this._nodes[0].appendChild(node);
        }
        if (this._nodes[0].left && this._nodes[0].right) {
            return this._nodes.shift();
        }
    }

    shiftNodeUp(node) {
        if (node.parent) {
            if (node.priority > node.parent.priority) {
                const parentIndex = this._nodes.indexOf(node.parent);
                const indexOfNode = this._nodes.indexOf(node);
                if (indexOfNode !== -1) {
                    if ((parentIndex !== -1)) {
                        [this._nodes[indexOfNode], this._nodes[parentIndex]] = [this._nodes[parentIndex], this._nodes[indexOfNode]];
                    } else {
                        this._nodes[indexOfNode] = node.parent;
                    }
                }
                node.swapWithParent();
                this.shiftNodeUp(node);
            }
        } else {
            this.root = node;
        }
    }

    static selectChild(node) {
        if (node.left && node.right) {
            if (node.left.priority > node.right.priority) {
                return node.left;
            } else {
                return node.right;
            }
        } else {
            return node.left;
        }
    }

    shiftNodeDown(node) {
        if (!this.isEmpty() && node.left) {
            const resChild = MaxHeap.selectChild(node);
            if (node.priority < resChild.priority) {
                const indexNode = this._nodes.indexOf(node);
                const indexChild = this._nodes.indexOf(resChild);
                if (node === this.root) {
                    this.root = resChild;
                }
                if (indexChild !== -1) {
                    if (indexNode !== -1) {
                        [this._nodes[indexChild], this._nodes[indexNode]] = [this._nodes[indexNode], this._nodes[indexChild]];
                    } else {
                        this._nodes[indexChild] = node;
                    }
                }
                resChild.swapWithParent();
                this.shiftNodeDown(node);
            }
        }
    }

}


module.exports = MaxHeap;