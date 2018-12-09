# RESTful Web API with Node.js Framework
An API for your private blockchain you expose functionality that can be consumed by several types of web clients ranging from desktop, mobile, and IoT devices

## Node.js framework
Express.js
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
