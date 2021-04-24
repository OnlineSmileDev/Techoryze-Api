var express = require("express");
var router = express.Router();
var Conversation = require("../models/conversation")

router.post('/create_conversation', function (req, res) {
  let userName = req.body.userName;
  let expertName = req.body.expertName;

  let newConversation = new Conversation();
  newConversation.user = userName;
  newConversation.channel = 'FIRST-CHANNEL';
  newConversation.chat_accpet = false;
  newConversation.environment = '';
  newConversation.problem = '';
  newConversation.expert = '';
  newConversation.expertRating = '';

  Conversation.findOne({ channel: 'FIRST-CHANNEL' }).exec(function (err, doc) {
    if (err) {
      return res.json({
        success: false,
        data: err
      });
    } else {
      if (doc) {
        Conversation.findOneAndUpdate(
          { channel: 'FIRST-CHANNEL' },
          {
            $set: {
              user: userName,
              expertName: expertName,
              chat_accpet: false,
              environment: '',
              problem: '',
              expert: '',
              expertRating: '',
            }
          },
          { new: true },
          function (err, doc) {
            if (err) {
              return res.json({
                success: false,
                data: err
              })
            } else {
              return res.json({
                success: true,
                data: doc
              })
            }
          }
        )
      } else {
        newConversation.save(function (err, doc) {
          if (err) {
            return res.json({
              success: false,
              error: err
            })
          } else {
            return res.json({
              success: true,
              data: doc
            })
          }
        })
      }
    }
  })
});

router.post('/update_conversation', function (req, res) {
  let conversation_id = req.body.id;
  let field = req.body.key;
  let value = req.body.value;

  Conversation.findOneAndUpdate(
    { channel: 'FIRST-CHANNEL' },
    { $set: { [field]: value } },
    { new: true },
    function (err, doc) {
      if (err) {
        return res.json({
          success: false,
          data: err
        })
      } else {
        return res.json({
          success: true,
          data: doc
        })
      }
    }
  )
})

router.get('/get_conversation', function (req, res) {
  let conversation_id = req.body.id;
  let field = req.body.key;
  let value = req.body.value;

  Conversation.find({ channel: 'FIRST-CHANNEL' }).exec(function (err, doc) {
    if (err) {
      return res.json({
        success: false,
        data: err,
      })
    } else {
      if (doc === null) {
        return res.json({
          success: false,
          data: 'Not data',
        })
      } else {
        return res.json({
          success: true,
          data: doc
        })
      }
    }
  })
})

module.exports = router;