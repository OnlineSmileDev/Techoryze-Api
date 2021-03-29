var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ConversationSchema = new mongoose.Schema({
  channel: {
    type: String,
  },
  user: {
    type: String,
  },
  expert: {
    type: String,
  },
  environment: {
    type: String,
  },
  problem: {
    type: String,
  },
  session: {
    type: String, //Yes, No, Open, Close
  },
  expertRating: {
    type: String,
  },
  participants: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  lastMessage: {
    type: Schema.Types.ObjectId, ref: 'Message'
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
})

var Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;