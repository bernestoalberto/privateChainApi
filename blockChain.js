/**
 * @file simpleChain.js
 * @author Ernesto Bonet <ebonet@eabonet.com>
 * @version 0.1
 */

const SHA256 = require('crypto-js/sha256');
const level = require('./leveldb');
let Block = require ('./block'); 

class BlockChain{
    constructor(){
        this.chain=[];
       this.getBlockHeight().then((counter)=>{
        if(counter == 0){
            this.addBlock(this.createGenesisBlock()).then(()=>{
                console.log(`The Genesis block was added !!!`);
            }).catch((error)=>{
            console.log(error);
            });
    }
        else{
            console.log(`BlockChain long is ${counter} block(s)`);
        }
       }).catch((error)=>{console.log(error)});
       
    }
 /**
   * @function createGenesisBlock
   *@description Create the Genesis Block of the BlockChain
   * @returns {Block}
   */
    createGenesisBlock(){
        let newBlock = new Block("First block in the chain - Genesis block");
		newBlock.height = 0;
		newBlock.previousblockHash = "";
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        return newBlock;
      }
 
 /**
   * @function getLatestBlock
   *@description Get the last block index
   * @returns {Integer} The last block index
   */
      getLatestBlock(){
        level.getAllBlocks().then((value)=>{
            if(value.length
                 == 0){
               this.addBlock(this.createGenesisBlock());
        }         
            if(value.length > 2){
            
            console.log(`The last block  id: ${value[value.leng - 1].key} and #: ${(JSON.parse(value[value.length - 1].value).hash)} `);
            }
            else{
              console.log(`The last block  id: ${value[1].key} and #: ${(JSON.parse(value[1].value)).hash} `);
            }
            ;
           }).catch((error)=>{console.log(error); process.exit(1)});
      }
 /**
   * @function addBlock
   *@description Adds a new block into the chain, to do that you need to assign the corresponding height, hash, previousBlockHash and timeStamp to your block.
   @param {Block} 
   * @returns {String} if was resolved or {Error} if was rejected
   */
    addBlock(newBlock){
        return new Promise((resolve, reject)=>{
            level.getAllBlocks().then((blockchain)=>{
            if(blockchain.length > 0){
                newBlock = new Block(newBlock);
                newBlock.previousblockHash = JSON.parse(blockchain[blockchain.length-1].value).hash;
                newBlock.height = blockchain.length;
                newBlock.time =  new Date().getTime().toString().slice(0,-3);
                newBlock.hash =  SHA256(JSON.stringify(newBlock)).toString();
                level.addDataToLevelDB(newBlock).then((value)=>{
                    console.log(`New block was added ${newBlock.height}!!!`);
                 resolve(value);
               }).catch((error)=>{
                    reject(error);
               });
            }  
            else{
              
                level.addDataToLevelDB(this.createGenesisBlock()).then((value)=>{
                    console.log(`Genesis block was added !!!`);
                    resolve(value);
               }).catch((error)=>{
                    reject(error);
                    process.exit(1)
               });
            }
        })
        .catch((error)=>{
         console.log(error);
         reject(error);
         process.exit(1)
        });
        });
 
    }
    
    /**
 * @function printBlockChain
 * @author Ernesto Bonet <ebonet@eabonet.com>
 * @version 0.1
 */

    printBlockChain(){
        level.getAllBlocks().then((list)=>{   
        (list.length > 0) ?console.log(`This is the genesis block ${list[0].value}`):'';
        // console.log(`This is the last block ${value[value.length - 1].value}`);
        for(let current of list){
            console.log(`Block # ${current.key} Hash : ${current.value} `);
        }
    }).catch((error)=>{
        console.error(error);
        process.exit(1)
    });
    }
    
    /**
 * @function getBlockHeight
 * @description Counts all the Blocks in your chain and give you as a result the last height in your chain
 * @param {Integer} blockHeight number of the block
 * @returns {JSON} success or false on Error Message
 * @author Ernesto Bonet <ebonet@eabonet.com>
 * @version 0.1
 */

    getBlockHeight(){
        return new Promise((resolve,reject)=>{
        level.countBlocks(). then((blockchain)=>{
            // this.printBlockChain(blockchain);
            resolve(blockchain);
        }).
        catch((error)=>{
            console.log(error);
            reject(error);
            process.exit(1)
        });
        });
    }
    /**
 * @function getBlock
 * @description Gets a block and returns it as JSON string object
 * @param {Integer} blockHeight number of the block
 * @returns {JSON} success or false on Error Message
 * @author Ernesto Bonet <ebonet@eabonet.com>
 * @version 0.1
 */


    getBlock(blockHeight){
        return new Promise((resolve,reject)=>{
     level.getLevelDBData(blockHeight).then((block)=>{
         //validate block validateBlock
            let blockJson = JSON.parse(block);
         console.log(`Hash:${blockJson.hash} => blockHeight: ${blockHeight}`);
         resolve(block);
     })
     .catch((error)=>{
        console.log(error);
        reject(Error(Error(`Block ${blockHeight} not found!!! `)));
        process.exit(1);
     });
    });
    }
 
    /**
 * @function validateBlock
 * @description Validates block data integrity
 * @param {Integer} blockHeight number of the block
 * @returns True success or false on Error Message
 * @author Ernesto Bonet <ebonet@eabonet.com>
 * @version 0.1
 */

 validateBlock(blockHeight){
    return new Promise((resolve,reject)=>{
    // get block object
    this.getBlock(blockHeight).then((block)=>{

   // remove block hash to test block integrity

   // generate block hash   
  let vBlock = new Block(block.body);
   vBlock.previousblockHash = block.previousblockHash;
   vBlock.height = block.height;
   vBlock.time = block.time;
   let validBlockHash = SHA256(JSON.stringify(vBlock)).toString();
   // Compare
      if (block.hash===validBlockHash) {
       console.log(`Block ${blockHeight} valid`);
       resolve(true);
     }
      else {
       console.log(`Block # ${blockHeight} invalid hash:\n ${block.hash} <> ${validBlockHash}`);    
       resolve(false);
     }
    })
    .catch((error)=>{
        console.log(error);
        reject(error);
        process.exit(1);
     });
    });
    
    }
    /**
 * @function validateAllBlocks
 * @description Validates all blocks from the blockChain at any time
 * @returns True if succeed or false on Error Message
 * @author Ernesto Bonet <ebonet@eabonet.com>
 * @version 0.1
 */

    validateAllBlocks(){
        return new Promise((resolve,reject)=>{
          level.getAllBlocks().then((chains)=>{ 
        for (let i= 1;i < chains.length;i++) {
            // validate block
           this.validateBlock(chains[i].key).then((value,error)=>{
               let errorLog = [];
            if(value==false)errorLog.push(i);
                if(errorLog.length>0) {
                    console.log(`Block errors =  ${errorLog.length}`);
                    console.log(`Blocks: ${errorLog}`);
                    reject(errorLog);
                  } else {
                    console.log(`No errors detected`);
                    resolve(true)
                  }
     
            // compare blocks hash link
            let blockHash = chains[i].hash;
            let previousHash = (chains[i+1])? JSON.parse(chains[i+1].value).previousblockHash:'';
            if (blockHash!==previousHash)errorLog.push(i);
            }).catch((error)=>{
                console.log(error);
                reject(error);
            });
          } 
        });
        });
    }
   
    /**
   *@function validateChain
   * @description  Validate blockchain.To validate the entire chain,go through all the blocks
   *  in the chain and verify the block integrity and also verify that 
   * the previousBlockHash in current block match with the hash in the 
   * previous block. Allows us to know if the entire chain is still valid at any moment or not
   * @return {Boolean} True if valid and false is invalid
   */
    validateChain(){
      let errorLog = [];
    return new Promise((resolve, reject)=>{
        this.validateAllBlocks().then((validation)=>{
            resolve(validation);
        }).catch((error)=>{
            console.log(error);
            reject(error);
        });
   });
   }
}
console.log(`blockchain.chain`);
// let blockch = new BlockChain();
// level.deleteBlock(0);
// blockchain.validateChain();
// blockchain.validateChain();
// blockchain.getBlockHeight();
// blockchain.validateBlock(1);
// blockchain.printBlockChain();
// blockchain.addBlock(new Block(`Block Vincero`));
// blockchain.getBlock(3);
//  blockchain.getBlockHeight();

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

/*
  (function theLoop (i) {
    setTimeout(function () {
        let blockTest = new Block("Test Block - " + (i + 1));
        blockchain.addBlock(blockTest).then((result) => {
            console.log(result);
            i++;
            if (i < 10) theLoop(i);
        });
    }, 10000);
  })(0);*/
  module.exports = BlockChain;