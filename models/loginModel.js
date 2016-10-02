var mongoose=require('mongoose');

//database creation
var chatSchema=mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String
});

//model
var chatModel=mongoose.model('chatModel',chatSchema);
module.exports=chatModel;
