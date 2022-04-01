const mongoose = require('mongoose');
const Notifications = require('../models/notificationSchema');
var sendNotification = require('../utility/notif');
const express = require('express');
const app = express();

exports.addNotification = (req, res, next) => {
  console.log("notification: ", req.body);
    const notify = new Notifications( req.body );
    notify.save().then( result => {
        console.log(result);
        //sendNotification = result;
        //res.status(201).json({ message : 'Sucessfully created Credit Customer with id', id : result._id});
      }).catch( err => {
        if (!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
      });
}