const SHA256 = require('crypto-js/sha256');
let BlockChain = require('./blockChain');
let empty = require('is-empty');
let cookieSession = require('cookie-session');
let helmet = require('helmet');
let compression = require('compression');
let expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
let winston = require('winston');
const levels = { 
    error: 0, 
    warn: 1, 
    info: 2, 
    verbose: 3, 
    debug: 4, 
    silly: 5 
  };
const logger = winston.createLogger({
    level: levels.info,
    format: winston.format.json(),
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
   
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  // 
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.app.use(helmet());
        this.app.use(compression())
        /*this.app.use(session({
            name: 'session',
            keys: ['key1', 'key2'],
            cookie: {
              secure: true,
              httpOnly: true,
              domain: 'example.com',
              path: 'foo/bar',
              expires: expiryDate
            }
          }))*/
        // this.blocks = [];
        // this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
        this.blockchain = new BlockChain();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            // Add your code here
            if (!req.params.index) return res.sendStatus(400);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('cache-control', 'no-cache');
            // res.setHeader('Content-Length', '238');
            res.setHeader('Conection', 'close');
            res.cookie('eb', 'gb', { domain: '.eabonet.com', path: '/block/:index', secure: true });
            res.cookie('blockchain', '1', { maxAge: 900000, httpOnly: true });
             this.blockchain.getBlock(req.params.index).then((block)=>{
                res.end(block);
             }).
             catch((error)=>{
              console.log(error);
              res(error);
              logger.error(error.toString);
              process.exit(1);
             });
   
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
   
     postNewBlock() {
        this.app.post("/block", (req, res)=>{
            if (empty(req.body)) return res.sendStatus(400).end();
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('cache-control', 'no-cache');
            res.setHeader('Content-Length', '238');
            res.setHeader('Conection', 'close');
            res.cookie('eb', 'gb', { domain: '.eabonet.com', path: '/block/:index', secure: true });
            res.cookie('blockchain', '1', { maxAge: 900000, httpOnly: true });
            this.blockchain.addBlock(req.body.message || `Testing Rest Api`).then((value)=>{
                res.send(value);
            }).catch((error)=>{
                console.log(error);
                 res.send('There was an issue with your request. Try again later');
                 logger.error(error.toString);
                 process.exit(1)
            })
            
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}