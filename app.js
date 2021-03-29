var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo').default;
var server = require('http').createServer(app);
var cors = require('cors');
const io = require('socket.io')(server);
// const socketIo = require("socket.io");
// const socketIo = require("socket.io")(server, {
//   cors: {
//     origin: "https://example.com",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["my-custom-header"],
//     credentials: true
//   }
// });

mongoose.connect('mongodb+srv://techoryze:Superstar@1991@cluster0.rymyu.mongodb.net/test?retryWrites=true&w=majority',  {useNewUrlParser: true});

app.use(session({
  secret: 'foo',
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://techoryze:Superstar@1991@cluster0.rymyu.mongodb.net/test?retryWrites=true&w=majority',
    autoRemove: 'disabled'
  })
}));

app.use(cors());

//set the template engine ejs
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from template
app.use(express.static(__dirname));


// include routes
var conversation = require('./routes/conversation');
var socket1 = require('./routes/socket');
var socket = socket1(app, io);

app.get('/', (req, res) => {
  res.send('Techoryze Hello!')
});

app.use('/conversation', conversation);
socket.start();

// const io = socketIo(server); 
// let interval;

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   if (interval) {
//     clearInterval(interval);
//   }
//   interval = setInterval(() => getApiAndEmit(socket), 1000);
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//     clearInterval(interval);
//   });
// });

// const getApiAndEmit = socket => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   // socket.emit("FromAPI", response);
// };



// catch 400
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(400).send(`Error: ${res.originUrl} not found`);
  next();
});

// catch 500
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send(`Error: ${err}`);
  next();
});

// listen on port 3000
server.listen(process.env.PORT || 3001, function () {
  console.log('Express app listening on port 3001===>');
});
