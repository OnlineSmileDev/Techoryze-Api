var Message = require("../models/message");
var Conversation = require("../models/conversation");

module.exports = init;

var mobileSockets = {};
var sockets = []
let interval;

function init(app, io) {
  return {
    start: function(){
      io.on("connection", (socket)=>{
        sockets.push(socket)

        socket.on('disconnect',function(){
          sockets.splice(sockets.indexOf(socket), 1);
        });

        socket.on('newUser', credentials => {

        })

        socket.on('incoming data', (data) => {
          socket.broadcast.emit('outgoing data', {num: data})
        })
      
        socket.on('join', (conversation) => {         
          mobileSockets[conversation.user] = socket.id
          // const receiverSocketId = mobileSockets[conversation.receiver]
          var room = conversation.user + conversation.receiver
          socket.join(room);
        });
        
        socket.on('leave', (conversation) => {
          var room1 = conversation.user + conversation.receiver
          var room2 = conversation.receiver + conversation.user
          socket.leave(room1);
          socket.leave(room2);
          sockets.splice(sockets.indexOf(socket), 1);
        });

        socket.on('chatmember', (users) => {
          Conversation.findOne({ $or:[{participants: [users.sender, users.receiver]}, {participants: [users.receiver, users.sender]} ]}, function(err, conversation) {      

            Message.findById(conversation.lastMessage, function(err, message) {
              socket.emit('lastMessage', message)
            })
          })
        })
        
        socket.on('message', (conversationMessage) => {
          let newMessage = new Message();
          newMessage.text = conversationMessage.text;
          newMessage.user = conversationMessage.sender;
          io.emit("incomingMessage", conversationMessage);
        });
      
        socket.on('session', (session) => {
          socket.broadcast.emit("incomingSession", session);
        });

        socket.on('sessionOption', (session) => {
          socket.broadcast.emit("incomingSessionOption", session);
        });

        socket.on('sessionVideo', (session) => {
          socket.broadcast.emit("incomingSessionVideo", session);
        });

        socket.on('sessionVideoOption', (session) => {
          socket.broadcast.emit("incomingSessionVideoOption", session);
        });

        socket.on('rating', (rating) => {
          socket.broadcast.emit("incomingRating", rating);
        });

        socket.on('chatroom', (users) => {
          Conversation.findOne({ $or:[{participants: [users.user, users.receiver]}, {participants: [users.receiver, users.user]} ]}, function(err, conversation) {
            if(conversation){
              Message.find({conversationId: conversation._id})
              .sort('-createdAt')
              .exec((err, messages) => {
                mobileSockets[users.user] = socket.id
                socket.emit('priorMessages', messages)
              })
            } else {
              var newConver = new Conversation({
                participants: [users.user, users.receiver],
                // lastMessage: {}
              });
              
              newConver.save(function(err, doc) {
                  Message.find({conversationId: doc._id})
                  .sort('-createdAt')
                  .exec((err, messages) => {
                    mobileSockets[users.user] = socket.id
                    socket.emit('priorMessages', messages)
                  })
              })
            }
          })
        })
        socket.on('join', function (data) {
          socket.join(data.roomId);
          socket.room = data.roomId;
          const sockets = io.of('/').in().adapter.rooms[data.roomId];
          if (sockets.length === 1) {
            io.emit('init')
            io.emit('getRoomId', data.roomId);
          }else{
            if (sockets.length === 2) {
              io.to(data.roomId).emit('ready')
            } else {
              socket.room = null
              socket.leave(data.roomId)
              socket.emit('full')
            }
          }
        });
        socket.on('openRoomId', (data) => {
          io.emit('openRoomId1', data);
        });

        socket.on('signal', (data) => {
          io.to(data.room).emit('desc', data.desc)        
        })
        socket.on('disconnect', () => {
          const roomId = Object.keys(socket.adapter.rooms)[0]
          if (socket.room){
              io.to(socket.room).emit('disconnected')
          }
        })
      });
    }
  }


}
