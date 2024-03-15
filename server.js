const express = require('express');
const http= require('http')
const path =require('path');

const socketio=require('socket.io')
const app = express();
const {userJoin,getCurrentUser,userLeave,getRoomUsers}= require('./utils/users')
const server =http.createServer(app)
const io=socketio(server)

const formatMessage=require('./utils/messages')


// Define a route

app.use(express.static(path.join(__dirname, 'public/_html_css')));
console.log('Public directory path:' );

const botName='chatBot'
// run when client connects 
io.on('connection',socket =>{ 
socket.on('joinRoom',({username,room })=>{
  const user=userJoin(socket.id,username,room);

  socket.join(user.room);

// welcome current user
socket.emit('message', formatMessage( botName,'welcome to chat app'))
// braocast a message 
socket.broadcast.to(user.room).emit('message', formatMessage( botName,`${user.username} has joined the chat`));
// send user and room info 
io.to(user.room).emit('roomUsers',{
room:user.room,
users:getRoomUsers(user.room)

});

})
//  runs when client  dicconnects 
socket.on('disconnect',()=>{
  const user=userLeave(socket.id)
  if(user){
    io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomUsers(user.room)
      
      });
  }

  
});


//listen for chat message 
socket.on('chatMessage', msg => {
  const  user=getCurrentUser(socket.id)
  io.to(user.room).emit('message', formatMessage(user.username,msg))
  console.log(msg);
});
});



const port = 3000||process.env.PORT
// Start the server
server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});