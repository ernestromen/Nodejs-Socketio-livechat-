const express = require('express');
const http = require('http');
const path = require('path');
const socketio= require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin,getCurrentUser,getRoomUsers,userLeave } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//static page
app.use(express.static(path.join(__dirname,'public')));

const botName = 'ChatCord Bot';

//run when client connects
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user =userJoin(socket.id,username,room);
        socket.join(user.room);

           //to single client thats connecting 
    socket.emit('message',formatMessage(botName,'Welcome to chatCord!'));
    //to all clients expect clients that connecting
        socket.broadcast.to(user.room)
        .emit('message',formatMessage(botName,`${user.username} has join the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUsers(user.room),
        });
    });
 



//listen for chat message
socket.on('chatMessage',message=>{
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username,message));
});

    //runs when client dissconect
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
if(user){
    io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
    
    //Send users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users:getRoomUsers(user.room),
    });
}

    });
});
const PORT = 3000 || process.env.PORT;


server.listen(PORT,()=>console.log(`server is running on ${PORT}`));

