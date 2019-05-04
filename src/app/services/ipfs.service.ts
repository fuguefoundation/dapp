import {Injectable} from '@angular/core';
const Buffer = require('buffer/').Buffer
const IPFS = require('ipfs');
//const ipfsNode = new IPFS();
// https://www.npmjs.com/package/buffer

@Injectable()
export class IPFSService {

    node;

  constructor() {

  }

  async init() {
    await this.waitForIPFS();
    return this.node.start();
  }

//   async store(object) {
//     // Prepare our data by passing the object as a JSON string to `Buffer`
//     console.log(Buffer);
//     const data = Buffer.from(JSON.stringify(object));

//     // Upload our file to IPFS
//     const files = await ipfsNode.files.add(data);

//     // Set the hash after upload
//     const { hash } = files[0];
//     console.log(hash);
//   }

//   async restore(hash){
//     // IPFS will provide a binary representation (buffer) of our spec given the hash from our task
//     const buffer = await ipfsNode.files.cat(`/ipfs/${hash}`);

//     // You likely will want to parse the buffer back into a regular JS object
//     const contents = JSON.parse(buffer.toString());
//     console.log(contents);
//   }

  waitForIPFS() {
    this.node = new IPFS({ start: false });
    console.log(this.node);
    return new Promise((resolve, reject) => {
      this.node.on('ready', () => resolve(true));
      this.node.on('error', err => reject(err));
    })
  };

}
