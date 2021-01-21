const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')   //renamed function v4 to uuidv4


app.set('view engine', 'ejs')   //to render
app.use(express.static('public'))   //express app will check all files relative to public
app.use(express.static('views'))


app.get('/', (req, res) => {
  //console.log("here!")
  res.render(`home`)
  //console.log(uuidV4())
})
app.get('/room', (req, res) => {
  //res.send(uuidV4());
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })  //render view room
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT || 5050, () => console.log("Server is running..."));