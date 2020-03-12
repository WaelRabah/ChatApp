const express = require('express')
const app = express(); 
const server = require('http').createServer(app);
const io = require('socket.io').listen(server)
users=[] ; 
connections =[];
server.listen(3000);
console.log('server is running ....')
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
io.sockets.on('connection',(socket)=>{
    connections.push(socket)
    console.log('connected %s sockets connected',connections.length)
    socket.on('disconnect',(data)=>{
        if (!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        updateUsers();
        connections.splice(connections.indexOf(socket),1)
        console.log('disconnected %s sockets connected',connections.length)
    })
    socket.on('send message',(data)=>{
        io.sockets.emit('new message',{msg : data , user : socket.username})
        console.log(data)
    })
    socket.on('new user',(data,callback)=>{
        callback(true)
        console.log(data)
        socket.username = data ;
        users.push(socket.username)
        updateUsers();
    })
    const updateUsers = ()=>{
        io.sockets.emit('get users',users)
    }
})
