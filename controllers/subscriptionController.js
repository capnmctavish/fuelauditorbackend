const mongoose = require('mongoose');
const Subscription = require('../models/subscriptionSchema');
const User = require('../models/user');
const fs = require('fs');
const date = require('date-and-time');
const sendNotification = require('../utility/notif');
const Notifications = require('../models/notificationSchema');
const express = require('express');
const app = express();
var request = require('request');

exports.subscribe = (req, res, next) => {
    console.log(req.body);
    // Now
    //var endDate = dateToday.setDate(dateToday.getDate() + 30); // Set now + 30 days as the new date
    const org = req.body.orgName;
    const plan = req.body.plan;
    const amount = (req.body.amt)/100;
   
    var dateToday = new Date();
    const startDate = date.format(dateToday, 'YYYY/MM/DD');

    var lastDate;
    var newSubscription = true;

    if(plan == "trial"){
        var endDate = new Date(); // Now
        endDate.setDate(endDate.getDate() + 7); // Set now + 30 days as the new date
        lastDate = date.format(endDate, 'YYYY/MM/DD');
        console.log(lastDate);
        User.findOneAndUpdate( {"organizationName": org, "role": "owner"}, {
          "trialUsed": true
        }).catch( err => {
          if (!err.statusCode){
          err.statusCode = 500;
        }
        next(err);
        });
    }
    else if(plan == "monthly" && amount == 199){
        var endDate = new Date(); // Now
        endDate.setDate(endDate.getDate() + 30); // Set now + 30 days as the new date
        lastDate = date.format(endDate, 'YYYY/MM/DD');
        console.log(lastDate);
    }
    else if(plan == "yearly" && amount == 499){
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var endDate = new Date(year + 1, month, day);
        lastDate = date.format(endDate, 'YYYY/MM/DD');
        console.log(lastDate);
    }

    Subscription.find( {orgName: org} ).then( data => {
      if(data){ newSubscription = false; }
    }).catch( err => {
      if (!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
    });
      if(newSubscription == true){

        /***************** If no subscription is present add new *******************/
         const sub = new Subscription ({
           orgName: org,
           plan: plan,
           amount: amount,
           startDate: startDate,
           expiryDate: lastDate
       });
       sub.save().then( result => {
           console.log(result);
           var request = require('request');
           let body = { notification: plan + " subscription added. " + "Validity: " + startDate + " to " + lastDate };
           const notify = new Notifications( body );
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
           request.post(
             {
             url:'http://ec2-13-235-67-218.ap-south-1.compute.amazonaws.com:3000/send-notification',
             json: { data: plan + " subscription added. " + "Validity: " + startDate + " to " + lastDate }
             ,
             headers: {
                 'Content-Type': 'application/json'
             }
             },
           function(error, response, body){
             // console.log(error);
             // console.log(response);
             console.log(body);
             //res.send(body);
           });
           /*app.post('/send-notification', function(req, res){
             console.log(req.body);
             request.post(
               {
               url:'http://localhost:3000/send-notification',
               body: plan + "subscription added successfully" + "validity: " + startDate + "to" + expiryDate,
               headers: {
                   'Content-Type': 'application/json'
               }
               },
             function(error, response, body){
               // console.log(error);
               // console.log(response);
               console.log(body);
               res.send(body);
             });
             // res.send("body");
           });*/
           res.status(201).json({ message : "Subscription added successfully"});
         }).catch( err => {
           if (!err.statusCode){
           err.statusCode = 500;
         }
         next(err);
         });
       }
       else if(newSubscription == false){
       Subscription.findOneAndUpdate( {"orgName": org}, {
         "orgName": org,
         "plan": plan,
         "amount": amount,
         "startDate": startDate,
         "expiryDate": lastDate
       }).then( result => {
        let body = { notification: plan + " subscription added. " + "Validity: " + startDate + " to " + lastDate };
        const notify = new Notifications( body );
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

        var request = require('request');
     
        request.post(
          {
          url:' http://ec2-13-235-67-218.ap-south-1.compute.amazonaws.com:3000/send-notification',
          json: { data: plan + " subscription added. " + "Validity: " + startDate + " to " + lastDate }
          ,
          headers: {
              'Content-Type': 'application/json'
          }
          },
        function(error, response, body){
          // console.log(error);
          // console.log(response);
          console.log(body);
          //res.send(body);
        });
        /*app.post('/send-notification', function(req, res){
          console.log(req.body);
          request.post(
            {
            url:'http://localhost:3000/send-notification',
            body: plan + "subscription added successfully" + "validity: " + startDate + "to" + expiryDate,
            headers: {
                'Content-Type': 'application/json'
            }
            },
          function(error, response, body){
            // console.log(error);
            // console.log(response);
            console.log(body);
            res.send(body);
          });
          // res.send("body");
        });*/
         res.status(201).json({ message : "Subscription updated successfully"});
       }).catch( err => {
         if (!err.statusCode){
         err.statusCode = 500;
       }
       next(err);
       });
       };
}

exports.subscriptionList = (req, res, next) => {
 const orgName = req.body;
 Subscription.findOne( orgName ).then( (data) => {
 if(data){
  let result = data.expiryDate;
  const todaysDate =  new Date();
 
  if (result >= todaysDate ){
    res.send(data);
  }
  else if (result < todaysDate ){
    res.send(null);
  } 
}else{
  res.send(null);
}
  }).catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
};

exports.subscriptionDetails = (req, res, next) => {
  const orgName = req.body;
  Subscription.findOne( orgName ).then( (data) => {
    res.send(data); 
   })
   .catch( err => {
   if(!err.statusCode) {
     err.statusCode = 500;
   }
   next(err);
   });
 };