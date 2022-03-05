require('newrelic');

'use strict';

const fs = require('fs');
const cors = require('cors');

let corsOptions = {
   origin: ['http://localhost:4000','http://127.0.0.1:4000','https://www.andrewwnewhouse.com','http://3.14.148.27/'],
//   origin: true,
   methods: ['GET', 'HEAD' ,' PUT' ,' PATCH' ,'POST' ,'DELETE', 'OPTIONS'],
   allowedHeaders: ['newrelic','traceparent','tracestate']
}

const winston = require('winston');
const newrelicFormatter = require('@newrelic/winston-enricher')
//const logger = winston.createLogger({
//   format: winston.format.combine(
//     winston.format.label({label: 'andrewwn-rest-api'}),
//     newrelicFormatter()
//   ),
//    transports: [
//        new winston.transports.File({ filename: 'combined.log' }),
//    ]
//});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: winston.format.combine(
     winston.format.label({label: 'andrewwn-rest-api'}),
     newrelicFormatter()
    ),
    transports: [
     new winston.transports.File({ filename: 'combined.log' }),
     new winston.transports.Console()
    ]
});

var express = require('express');
var app = express();

app.set("port", process.env.PORT || 4000);

app.options('*', cors({
   origin: '*',
   allowedHeaders: ['newrelic','traceparent','tracestate'],
   "optionsSuccessStatus": 200
}));

app.use(cors({
   origin: '*',
   allowedHeaders: ['newrelic','traceparent','tracestate'],
   "optionsSuccessStatus": 200
}));

app.get('/api/genError/', (req, res) => {
  var response = { "response" : "Requested the genError endpoint" }
  console.log(response);
  logger.info(response);
  throw new Error('BROKEN') // Express will catch this on its own.
})

app.get('/api/fileReadError/', (req, res, next) => {
  var response = { "response" : "Requested the fileRead endpoint" }
  console.log(response);
  logger.info(response);
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      let errMsg = { "response" : "file doesn't exist" }
      logger.info(errMsg);
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
})

app.get('/api/', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is GET method." }
   console.log(response);
   logger.info(response);
   res.end(JSON.stringify(response));
})

app.get('/api/:id', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is GET method with id=" + req.params.id + "." }
   console.log(response);
   logger.info(response);
   res.end(JSON.stringify(response));
})

app.post('/api/', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is POST method." }
   console.log(response);
   logger.info(response);
   res.end(JSON.stringify(response));
})

app.put('/api/', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is PUT method." }
   console.log(response);
   logger.info(response);
   res.end(JSON.stringify(response));
})

app.delete('/api/', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is DELETE method." }
   console.log(response);
   logger.info(response);
   res.end(JSON.stringify(response));
})

//app.use(cors({
//   origin: '*',
//   allowedHeaders: ['newrelic','traceparent','tracestate'],
//   "optionsSuccessStatus": 200
//}));

app.use((err, req, res, next) => {
   console.log(err.status);
//   res.status(err.status).json(err);
   console.error(err.stack);
   let errMsg = { "response" : 'Something broke error message! ' + err.message + err.status };
   //logger.error('Something broke error status: ' + err.status);
   //logger.error('Something broke error message! ' + err.message);
   logger.error(errMsg);
   res.status(500).send('Something broke!');
});

var server = app.listen(app.get("port"), function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node.js API app listening at http://%s:%s", host, port)

})
