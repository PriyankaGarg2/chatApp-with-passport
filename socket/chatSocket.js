var express = require('express');
var router = express.Router();
var ss=require('socket.io-stream');
var path=require('path');
var fs=require('fs');
var chatMessages=require('../models/chatTable.js');
var arr=[];

//connection
module.exports=function(ioConn) {
  ioConn.on('connection' , function(socket){
    console.log("User connected");

    //user gets disconnected
    socket.on('disconnect', function(){
      var name=socket.name;
      for(var i=0;i<arr.length;i++){
        if(arr[i].name==name){
          break;
        }
      }
      arr.splice(i,1);
      socket.broadcast.emit('logarr',arr);
      socket.emit('logarr',arr);
      console.log("User disconnected");
    });

    //message gets displayed
    socket.on('message', function(msg){
      console.log('message: ' + msg);
      socket.to(msg.sendTo).emit('receiveMsg',msg.message);
      var id1=msg.sendTo;
      var id2=msg.rfrom;
      var message=msg.message;
      var n1=find(id1);
      var n2=find(id2);
      var cid=n1+n2;
      var cid2=n2+n1;
      var time=new Date().getTime();
      var newChat=new chatMessages(
                                    {chatId:cid,
                                      userName1:n1,
                                      userName2:n2,
                                      chat:{"sender":n2,"msg":message,"time":time}
                                    });

      chatMessages.findOne({ 'chatId': {$in:[cid,cid2]}},function (err, users) {
          if (err || users==null) {
            //save
              newChat.save(function (err,newUser){
                  if(err) return console.log(err);
                  else {

                    console.log("saved");
                  }
              });
          }//saved
          else{
            //update
            var exisMsg = users.chat;
            var newMsg = {"sender":n2 , "msg":message , "time":time};
            exisMsg.push(newMsg);
            users.save(function (err,newUser){
                if(err) return console.log(err);
                else {
                  console.log("updated\n\n");
                }
            });

          }//else
        });


    });

    //online users-user gets connected
    socket.on('logged',function(username){
      var f=0;
      for(var i=0;i<arr.length;i++){
        if(arr[i].name==username){
          f=1;
          break;
        }
      }
      if(f==0){
        var obj={}
        obj.name=username;
        obj.id=socket.id;
        //obj.socket=socket;
        arr.push(obj);
        socket.name=username;
        socket.broadcast.emit('logarr',arr);
        socket.emit('logarr',arr);
      }
    });

    //receiving sender and receiver id
    socket.on('chat-start',function(msg){
      socket.to(msg.receiverId).emit('chatReq',{'senderId':msg.senderId,'senderName':msg.senderName,'receiverId':msg.receiverId});
    });

    //accept request
    socket.on("acceptedRequest",function(msg){
      //console.log("inside acceptedRequest2..cor "+ msg.receiverId);
      socket.to(msg.senderId).emit("acceptedReq",{"receiverId":msg.receiverId,"senderId":msg.senderId});
    });

    //file uploading
    ss(socket).on('file',function(stream,data){
        var filename=path.basename(data.name);
        stream.pipe(fs.createWriteStream('public/uploads/'+filename));
        var msg='<a href="/uploads/'+filename+'" >'+filename+'</a>';
        socket.to(data.sender).emit('receiveMsg',msg);
    });

    // //download file
    //  router.get('/download',function(req,res,next){
    //    var file=req.params.file;
    //    var path=__dirname +'/uploads'+file;
    //    res.download(path);
    //  });

  });
}

function find(id){
  for(var i=0;i<arr.length;i++){
    if(arr[i].id==id)
      return arr[i].name;
      }
}
