var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
  conversationId: { type: Schema.Types.ObjectId,  required: true },
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  user: {
    _id: String,
    name: String
  }
  user: {type: String},
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
}
);

var Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
