// src/blockchain.ts

class Block {
    constructor(
        public index: number,
        public previousHash: string,
        public timestamp: number,
        public data: string,
        public hash: string
    ) {}
}

class Blockchain {
    chain: Block[] = [];

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, '0', Date.now(), 'Genesis Block', '0000');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock: Block) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = this.calculateHash(newBlock);
        this.chain.push(newBlock);
    }

    calculateHash(block: Block) {
        const { index, previousHash, timestamp, data } = block;
        return `${index}${previousHash}${timestamp}${data}`;
    }
}

const myBlockchain = new Blockchain();
myBlockchain.addBlock(new Block(1, myBlockchain.getLatestBlock().hash, Date.now(), 'First Block', ''));
myBlockchain.addBlock(new Block(2, myBlockchain.getLatestBlock().hash, Date.now(), 'Second Block', ''));

console.log(JSON.stringify(myBlockchain, null, 2));
