const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const User = mongoose.model('User');
const Organization = require('../models/organizationSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { roles } = require('../utility/roles')
const client = require('../utility/smsnotif')
const transporter = require('../utility/emailnotif');
const { request } = require('http');
const { Session } = require('inspector');
const user = require('../models/user');
const _ = require('lodash');
const Razorpay = require('razorpay');
const express = require('express');
const { forEach } = require('mongoose/lib/helpers/specialProperties');
const { json } = require('body-parser');
const app = express();
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

exports.signup = (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) { 
  //   const error = new Error('Validation failed.');
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }
  //console.log(req.body);
  const email = req.body.email;
  const phoneNumber = req.body.phone;
  const name = req.body.name;
  const password = req.body.password;
  const userName = req.body.username;
  const organizationName = req.body.organization;
  const pumpId = req.body.pumpId;
  const role = req.body.role;
  const fullName = name.split(' ');
  const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
  const profile =  initials.toUpperCase();
   
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
        userName: userName,   
        phoneNumber : phoneNumber,
        organizationName: organizationName,
        pumpId: pumpId,
        role: role,
        profile: profile
      });
     if (role == "owner"){
    const org = new Organization({
      orgName: organizationName
    });
    return user.save(), org.save();}
    else {return user.save(); }
    }).then(result => {
      res.status(201).json({ message: 'User created!', tenantId: result._id });
      // res.redirect('/login');
      client.messages
      .create({
         body: 'Thankyou, You successfully signed up! to fuelauditor',
         from: process.env.TWILIO_NUMBER,
         to: '+91'+phoneNumber
       })
      .then(message => console.log(message.sid));
          return transporter.sendMail({
            to: email,
            from: 'notification@fuelauditor.com',
            subject: 'Hurray!!!! Signup succeeded!',
            html: '<h1>You successfully signed up to fuelauditor</h1> <br> <p>Kindly login to fuelauditor with below link <a href="http://localhost:4200/">Login with this link</a><br> Kindly login by copy pasting this link if the above link dosent work http://fuelauditopr.com</p>'
          });
    }).catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
        res.send(err);
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'kaalpanikthalaiva', 
        { expiresIn: '1d' }
      );
      /*var request = require('request');
     
        request.post(
          {
          url:'http://localhost:3000/send-notification',
          json: { data: "Login successful" }
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
      });*/
      res.status(200).json({ 
        role : loadedUser.role, 
        name: loadedUser.name, 
        username : loadedUser.userName, 
        organizationName: loadedUser.organizationName, 
        token: token, 
        trialUsed: loadedUser.trialUsed, 
        userId: loadedUser._id.toString(), 
        notifications: loadedUser.notifications 
      });
      /*email: loadedUser.email,*/
    
      return req.session.save(err => {
        console.log(err);
        req.session.isLoggedin = true;
      req.session.user = loadedUser;
        //console.log(req.session);
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

 
exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
   const permission = roles.can(req.user.role)[action](resource);
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}
 
exports.allowIfLoggedin = async (req, res, next) => {
 try {
  const user = res.locals.loggedInUser;
  if (!user)
   return res.status(401).json({
    error: "You need to be logged in to access this route"
   });
   req.user = user;
   next();
  } catch (error) {
   next(error);
  }
}

exports.forgotPassword = (req, res, next )=> {
  const email = req.body.email;
  let loadedUser;
  User.findOne({ email: email }, (err, user) => { 
    if( err || !user ){
      return res.status(401).json({
        error: "A user with this email could not be found."});
    }
    loadedUser = user;
    const token = jwt.sign({userId: loadedUser._id.toString()},process.env.RESET_PASSWORD_KEY, { expiresIn: '1d' });
    const data = {
      from: 'notification@fuelauditor.com',
      to: email,
      subject: 'Reset Password',
      html: `
      <h3>Click the link below and you'll be redirected to the site from where you can set a new password.</h3>
      <p>${process.env.URL}/reset-password/${token}</p>
      `
    };

    return user.updateOne({resetLink: token}, function (err, success) {
      if(err){
        return res.status(401).json({
          error: "Password reset link error."});
      } else {
        transporter.sendMail(data, function(error, body){
          if(error){
            return res.json({
              error: "error sending email"
            })
          } else {
          return res.json({message: 'Email has been sent, kindly follow the instructions'})
          }
        })
      }
    })
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.verifyPassword = (req, res)=>{
  const {resetLink} = req.body;
 
  if(resetLink){
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY/*'kaalpanikthalaiva'*/, function(error, decodedData){
      if(error){
        return res.status(401).json({error: "Incorrect token or it is expired"})
      }
        
      User.findOne({resetLink}, (err, user)=>{
        if(err || !user){
          return res.status(400).json({ error: "User with this token does not exist." })
        } else
       
          return res.status(200).json({ message: 'Token verified successfully.' });
          
      });
  });
} else 
  return res.status(401).json({error: "Token is required"});
}
exports.resetPassword = (req, res )=> {
  const resetLink = req.body.resetLink;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  if(resetLink){
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY/*'kaalpanikthalaiva'*/, function(error, decodedData){
      if(error){
        return res.status(401).json({error: "Incorrect token or it is expired"})
      }
      User.findOne({resetLink}, (err, user)=>{
        if(err || !user){
          return res.status(400).json({ error: "User with this token does not exist." })
        }
        bcrypt
    .hash(newPassword, 12)
    .then(hashedPw => {
        const obj = { 
          password: hashedPw,
          resetLink: ''
        }
      
        user = _.extend(user, obj);
        user.save(( error, result )=> {
          if(error) {
          return res.status(400).json({ error: "Reset password error." })
          }  else {
            return res.status(200).json({ message: "Password has been successfully changed." })
          }
        })
      })
      })
    })
  } else 
  return res.status(401).json({error: "A user with this email could not be found."});
}

exports.order = (req, res, next) => {
  //console.log(req.body);
  var instance = new Razorpay({ key_id: 'rzp_test_AF8tI2dXgiE7Bt', key_secret: 'QFkX7bSI48gPFWXqBzOn72sN' })
 /*const amount = req.body.amt;
 console.log(amount);
 console.log(JSON.parse(amount));*/
 
  var options = {
    amount: req.body.amount*100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  /*instance.orders.all().then(order=>{
    console.log(order);
    res.send(order);
  }).catch(console.error);*/
  instance.orders.create(options, function(err, order) {
    //console.log(order);
    res.send(order);
  });
  /*instance.plans.create(params);
  instance.plans.fetch(planId);*/
  /*instance.payments.capture(payment_id, amount, currency, function(err, order) {
    console.log(payments);
    res.send(payments);
  });
  res.send(instance.payments.all({from, to, count, skip}));*/
  }
  /*generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);

  if (generated_signature == razorpay_signature) {
    payment is successful
  }*/
  exports.verifyPayment = (req, res, next) => {
    //console.log( req.body );

  let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto.createHmac('sha256', 'QFkX7bSI48gPFWXqBzOn72sN')
                                  .update(body.toString())
                                  .digest('hex');
                                  console.log("sig received " ,req.body.razorpay_signature);
                                  console.log("sig generated " ,expectedSignature);
  var response = {"signatureIsValid":"false"}
  if(expectedSignature === req.body.razorpay_signature)
   response={"signatureIsValid":"true"}
      res.send(response);
  }

exports.users = (req, res, next) => {
  //console.log(req.body);
  const id = req.body;
  User.findById( id ).then(resultData => {
    //console.log(resultData);
    res.send(resultData);
  }).catch( err => {
    if (!err.statusCode){
    err.statusCode = 500;
  }
  next(err);
  });
}
exports.updateUser = (req, res, next) => {
  //console.log(req.body._id);
  const id = req.body._id;
  User.findOneAndUpdate({ "_id": id }, {
    "name" : req.body.details.name,
    "userName": req.body.details.userName,
    "email": req.body.details.email,
    "phoneNumber": req.body.details.phoneNumber,
    "organizationName": req.body.details.organizationName
  }).then( data => {
    res.send(data);
  }).catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
}

exports.organizationList = (req, res, next) => {
  Organization.find({}).then( data => {
    res.send(data);
  }).catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
}

exports.readNotify = (req, res, next) => {
  uId = req.body;
  /*User.findOneAndUpdate ( uId,
    { $setAll: {
     notifications: [ read: true ] }} )*/
     const query = uId;
           
      const updateDocument = {
        $set: { "notifications.$[orderItem].read": true }
      }; 
      
      const options = {
        arrayFilters: [{ "orderItem.read": false }]
      };
          
      User.updateMany(query, updateDocument, options)
  .then(user => {
    res.send("sucessful");
/* else 
      return res.status(201).json({ message : 'No unread notification'}); */
  }).catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
}

exports.deleteNotify = (req, res, next) => {
  uid = req.body.uId;
  nid = req.body.nId;
  user.updateOne(uid, { $pull : {
    notifications : nid
  }}).then (details =>
    {
      res.json("Notification deleted successfully");
    })
  .catch( err => {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.clearNotify = (req, res, next) => {
  uId = req.body;
  console.log("body:", req.body);
  user.findOneAndUpdate ( uId ,
     { $set: {
      notifications: [] }})
  .then(user => {
    res.send(user);
/* else 
      return res.status(201).json({ message : 'No unread notification'}); */
  }).catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
}