const express = require("express");
const path=require("path");
const http = require("http");
const socketio=require("socket.io");
const formatMessage = require("./utils/formatMessage");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");
const bot = "Chat Bot";

const app=express();

// to set up socket-io connection
const server=http.createServer(app);
const io=socketio(server);

const PORT=process.env.PORT || 8000;

app.use(express.static(path.join(__dirname,"public")));

// run when client connects

io.on('connection', socket=>{

    socket.on('joinRoom',({username,room})=>{

        const user= userJoin(socket.id,username,room);
        socket.join(room);

        // This method emits only to the client who initiated this 'on' action
        socket.emit('message',formatMessage(bot,`Welcome to ChatCord! ${user.username}`));

        // Broadcast to user's room when a user connects(this method emits to all except client who connected)
        socket.broadcast.to(user.room).emit('message',formatMessage(bot,`${user.username} has joined the chat`));

        // Send Users and Room Info when someOne new joins to update side-bar
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        })
    });

    socket.on('chatMessage',message=>{
        const {username,room} =getCurrentUser(socket.id);

        // this broadcasts to everybody including the client who initiated this action
        io.to(room).emit('message',formatMessage(username,message));
    });

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message", formatMessage(bot, `${user.username} has left the chat!!`));
            
            // Send Users and Room Info when someOne leaves to update side-bar 
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users: getRoomUsers(user.room)
            })
        }
    });

});

server.listen(PORT,()=>console.log(`Server running at ${PORT}`));