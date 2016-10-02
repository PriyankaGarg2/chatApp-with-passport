var mongoose=require('mongoose');
var chatMSchema=mongoose.Schema({
  chatId: String,
  userName1: String,
  userName2 :String,
  chat :[{"sender":String,"msg":String,"time":Date}]
});

var chatMessages=mongoose.model('chatMessages',chatMSchema);
module.exports=chatMessages;
