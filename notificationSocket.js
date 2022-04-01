const express = require('express');
const app = express();
//var bodyParser = require('body-parser');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
  
const port = 3000; //localStorage.getItem("IPAddress");

// parse some custom thing into a Buffer
app.use(express.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(express.text({ type: 'text/html' }))
app.use(express.text({ type: 'text/plain' }))
// Send Notification API
app.post('/notification', (req, res) => {
 /* fs.readFile(req.body, 'utf8', function(err, data) {
    if (err) throw err;
    return res.json(req.body);
  })*/console.log(req.body);
    const notify = req.body;
  
   socket.emit('notifications', notify); // Updates Live Notification
    res.set('Content-Type', 'text/plain');
    res.send(notify);
});

const server = app.listen(port, () => {
  //db.collection.watch( pipeline, options );
  console.log(`Server connection on http://ec2-13-235-67-218.ap-south-1.compute.amazonaws.com:${port}`);  // Server Connnected 192.168.43.116
});
// Socket Layer over Http Server
const socket = require('socket.io')(server);
// On every Client Connection
socket.on('connection', socket => {
    console.log('Socket: client connected');
});
