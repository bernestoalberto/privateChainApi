/**
 * @file simpleChain.js
 * @author Ernesto Bonet <ebonet@eabonet.com>
 * @version 0.1
 */

const SHA256 = require('crypto-js/sha256');
const level = require('./leveldb');
let Block = require('./block');

class BlockChain{
    constructor(){
        this.chain=[];
        // let Block = new Block();
       this.getBlockHeight().then((counter)=>{
        if(counter == 0){
            
            this.addBlock(this.createGenesisBlock());
    }
    else if(counter == 1){
        console.log(`BlockChain only has the Genesis block`);
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
        this.getAllBlocks().then((value)=>{
            if(value.length == 0){
                this.addBlock(this.createGenesisBlock());
        }         
            if(value.length > 2){
            
            console.log(`The last block  id: ${value[value.length - 1].key} and #: ${(JSON.parse(value[value.length - 1].value).hash)} `);
            }
            else{
              console.log(`The last block  id: ${value[1].key} and #: ${(JSON.parse(value[1].value)).hash} `);
            }
            ;
           }).catch((error)=>{console.log(error)});
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
                    this.getBlockHeight();
                 resolve(value);
               }).catch((error)=>{
                    reject(error);
               });
            }  
            else{
                level.addDataToLevelDB(newBlock).then((value)=>{
                    resolve(value);
               }).catch((error)=>{
                    reject(error);
               });
            }
        })
        .catch((error)=>{
         console.log(error);
         process.exit(1);
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
        level.countBlocks().then((blockcounter)=>{
            // this.printBlockChain(blockchain);
            resolve(blockcounter);
        }).
        catch((error)=>{
            console.log(error);
            reject(error);
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
      
         resolve(block);
     })
     .catch((error)=>{
        console.log(error);
        reject(Error(Error(`Block ${blockHeight} not found!!! `)));
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
   // get block hash
   let jsobject =JSON.parse(block);
   console.log(`Hash:${jsobject.hash} => blockHeight: ${blockHeight}`);
   // remove block hash to test block integrity

   // generate block hash   
  let vBlock = new Block(jsobject.body);
   vBlock.previousblockHash = jsobject.previousblockHash;
   vBlock.height = jsobject.height;
   vBlock.time = jsobject.time;
   let validBlockHash = SHA256(JSON.stringify(vBlock)).toString();
   // Compare
      if (jsobject.hash===validBlockHash) {
       console.log(`Block ${blockHeight} valid`);
       resolve(true);
     } else {
       console.log(`Block # ${blockHeight} invalid hash:\n ${jsobject.hash} <> ${validBlockHash}`);    
       resolve(false);
     }
    }).catch((error)=>{
        console.log(error);
        reject(error);
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
        return new Promise( async (resolve,reject)=>{
        let errorLog = [];
       
        level.getAllBlocks().then((chains)=>{
            let long = chains.length;
        for(let i =1; i < long;i++){
            blockchain.validateBlock(chains[i].key).then((result)=>{
                if (!result)errorLog.push(i);  
                 // compare blocks hash link
                     let blockHash =chains[i].value;
                      blockHash = JSON.parse(blockHash).hash;
                     let previousHash = (chains[i+1] && i <= long)? JSON.parse(chains[i+1].value).previousblockHash:'';
                     if (blockHash!==previousHash)errorLog.push(i);
                      i++;
                 }).
                 catch((error)=>{
                     console.log(error);
                     }); 
    }      
           if(errorLog.length>0) {
            console.log(`Block errors =  ${errorLog.length}`);
            console.log(`Blocks: ${errorLog}`);
            reject(errorLog);
          } else {
            console.log(`No errors detected. BlockChain Valid`);
            resolve(true)
          }
        }).
        catch((error)=>{
        console.log(error);
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
let blockchain = new BlockChain();
console.log(`blockchain.chain`);
// blockchain.validateChain();
// level.deleteBlock(2);
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