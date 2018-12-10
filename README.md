# RESTful Web API with Node.js Framework
An API for your private blockchain you expose functionality that can be consumed by several types of web clients ranging from desktop, mobile, and IoT devices
## About Restful Web  API

The project's structure is display it on the image down below
![Project Structure](https://github.com/bernestoalberto/private/tree/master/structure.png)

A RESTful API using a Node.js framework that will interfaces with the private blockchain,to persist a blockchain dataset. The project has tow major functionalities
<a src='http://localhost:8000/block/1'>GET block</a>
Error Handling: 
The function throw an error when the height entered in the URL is out of bounds. Prints : <br>
Request :
http://localhost:8000/50 <br>

BlockChain Height : 20 blocks <br>

Response: <br>
``
`Index block 50 out of bounds `
``

<a src='http://localhost:8000/block'>POST block</a>

Request: <br>
``
http://localhost:8000/block
``
``
body : {}
``
<br>
Response:
``
There was an issue with your request. Try again later
``
## Aditional Functionalities
There are additional functions to suppport the API purpose  like: <br>
Counts all the Blocks in your chain and give you as a result the last height in your chain <br>
``
 getBlockHeight() 
 ``
 <br>
  Gets a block and returns it as JSON string object
 <br>
 ``
 getBlock() 
 ``
 <br>
The last block index<br>
 ``
 getLatestBlock() 
 ``
 <br>
 Validates block data integrity <br>
 ``
 validateBlock()  
 ``
 <br>
 Validates all blocks data integrity <br>
 ``
 validateAllBlocks() 
 ``
 <br>
  Validates blockChain data integrity <br>
 ``validateChain() 
``<br>


## Node.js framework
[Express.js](https://expressjs.com/).
## Endpoint documentation
GET Block Endpoint <br>
Request
URL: http://localhost:8000/block/6 <br>
Response <br>
``
{
    "hash": "51322297cefca9f295191c539bfff333d0f89ed896ae2f5eed9884b65ac65403",
    "height": 6,
    "body": "Rest Api end point",
    "time": "1544245209",
    "previousblockHash": "697982816db237a677246fcf4beabf0bc898ced76d0eef115a27ec890fe8acf0"
}
``
<br>
POST Block Endpoint <br>
Request 
URL: http://localhost:8000/block <br>
``
{

"body": "Testing RestApi "
}
``

Response<br>
``
{
    "hash": "b5d2edb90295bee2ecfc9a2ef0abc4fd753b5ff23cb42faf55136f50c8a2f6ba",<br>
    "height": 19,<br>
    "body": "Testing RestApi ",<br>
    "time": "1544354881",<br>
    "previousblockHash": "1337ff0db122b01330663204d317c8099801d2500713f24f8bb2a60339a8f61a"
}``<br>

Errors <br>
Service responds with appropriate error responses when posting or getting contents.

URL: http://localhost:8000/block <br>
``
{

"body": " "
}
``
<br>
Response <br>

Bad Request

### Dependencies
level <br> 
crypto-js <br>
nodemon <br>
cookie-session <br>
npm <br>
winston <br>
helmet <br>
empty <br>
body-parser <br>
express  <br>

## Installation
Run
``
npm install
``
## Execution
Run
``nodemoon
``
