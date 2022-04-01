
const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
var MongoClient = require('mongodb').MongoClient;
const port = 3000; //localStorage.getItem("IPAddress");
const Notifications = require('../models/notificationSchema');

// parse some custom thing into a Buffer
app.use(express.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(express.text({ type: 'text/html' }))
app.use(express.text({ type: 'text/plain' }));

/**************/


//var sendNotification = (data) => {
  app.post('/send-notification', (req, res) => {
  const notify = req.body.data;
  console.log("notify:", req.body.data);
  socket.emit('notification', notify); // Updates Live Notification
  //res.set('Content-Type', 'text/plain');
  res.send(notify);
});
//}
// Send Notification API
/*app.get('/send-notification', (req, res) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("notifications");
    dbo.collection("notification").find({}, 
    function(err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
    });
});

  /******Working*******/
  /*Notifications.find({}).then( data => {
    const notify = data;
    socket.emit('notification', notify); // Updates Live Notification
    res.set('Content-Type', 'text/plain');
    res.send(notify);
  });*/
  /*MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    dbo.collection("notifications").find({}, 
    function(err, result) {
        if (err) throw err;
        //res.json(result);
        const notify = result;
        socket.emit('notification', notify); // Updates Live Notification
        res.set('Content-Type', 'text/plain');
        res.send(notify);
        db.close();
    });
});*/

    /*const notify = req.body;
    socket.emit('notification', notify); // Updates Live Notification
    res.set('Content-Type', 'text/plain');
    res.send(notify);*/
/*});*/

const server = app.listen(port, () => {
  console.log(`Server connection on http://ec2-13-235-67-218.ap-south-1.compute.amazonaws.com:${port}`);  // Server Connnected
});
// Socket Layer over Http Server
const socket = require('socket.io')(server);
// On every Client Connection
socket.on('connection', socket => {
  
  //var uId = { _id: socket.handshake.query._id };
  console.log("parameter: " +  socket.handshake.query._id);
    console.log('Socket: client connected');
    
    MongoClient.connect('mongodb+srv://fueldb:9096476219@fuelauditor.klu3r.mongodb.net/test', function (err, client) {
      if (err) throw err
      var ObjectID = require('mongodb').ObjectID;
      var db = client.db('test')
   /* var jhvhh = db.collection('users').find({ '_id': _id}, {notifications: 1});
    console.log(jhvhh);*/
     db.collection('users').find({"_id": new ObjectID(socket.handshake.query._id)}).toArray(function(err, result) {/*.toArray(function (err, result) {*/
        if (err) throw err
        /*var notifications = new Array();
        result.forEach(element => {
          notifications = element.notification;
        });*/ 
        console.log(result.notifications);
        //const notify = result;
        socket.emit('notification', result); // Updates Live Notification
      });
      const pipeline = [
        { $match:
         { documentKey: { "_id": new ObjectID(socket.handshake.query._id) } }
      }];
     /*changeStream = collection.watch(pipeline);*/
     var options = { fullDocument: 'updateLookup' };
     const changeStream =  db.collection('users').watch(pipeline, options);

      //db.collection('users').watch(pipeline)
      changeStream.on('change', (changes) => {
        //Add a event emitter
        console.log("notify changes:", changes);
        socket.compress(true).emit('newNotification',changes.fullDocument);
       });
    });
    
});

//module.exports = sendNotification;