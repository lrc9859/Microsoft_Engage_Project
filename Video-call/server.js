const express = require('express')
const app = express()

//Creating the server
const server = require('http').Server(app)

//Passing it to socket.io
const io = require('socket.io')(server)


const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

//uuid is the library used to create ID's for users
const {v4: uuidV4} = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))


//routing the room 
app.get('/:room', (req, res) => {
  res.render('room', {roomId: req.params.room })
})

//routing to dynamic rooms
app.get('/', (req,res) => {
    res.redirect(`/${uuidV4()}`)
})

//Object to store userID's as keys
  const users = {}

//Socket connections for chat

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {

    //Sending both user's name and messsage
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

//Socket connections for video call

  io.on('connection', socket => {
      socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
      //sending info to all the other participant except the user himself
      socket.broadcast.to(roomId).emit('user-connected', userId)

      socket.on('disconnect', () => {
          socket.broadcast.to(roomId).emit('user-disconnected', userId)
      })
          
      })
  })

  

server.listen(process.env.PORT || 3000)