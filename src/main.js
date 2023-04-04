const express = require('express')
// const path = require("path");
const app = express();
require('dotenv').config();
// const morgan = require('morgan');
// const { json } = require('body-parser');
const port = process.env.PORT || 3000;
const route = require('./routers/MainRouter');
const db = require('./config/ConfigDB');
//socket.io
const http = require('http');
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
global.__basedir = __dirname;



//connect to DB
db.connect();

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// for parsing application/json
app.use(express.json());
//use morgan to see which computer that is connected to server

//MORGAN TO SEE WHICH DEVICE IS IN USE
// app.use(morgan('combined'));


route(app);

server.listen(port, () => {
  console.log(`app listening at http://localhost:${server.address().port}`);
})