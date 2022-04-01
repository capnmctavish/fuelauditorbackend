
const mongoose = require('mongoose');
const { object } = require('mongoose/lib/utils');
// const User = require ('../models/user.js');
// const mongoTenant = require('mongo-tenant');
const Roles = Object.freeze({
  owner: "owner", manager: "manager", employee: "employee", accountant: "accountant" 
});
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  notification : {
    type : String
  },
  read: {
    type: Boolean,
    default: false
  }
  },{
  timestamps : true
});

const userSchema = new Schema({
  /*  tenantId: {
                type : Schema.Types.ObjectId,
                //removed ref, if user model dosent work add again idiot
                required : false,
              },*/
      userName : {
          type : String,
          required: true,
          minlength: 4,
          maxlength: 20,
          unique : true

              },
    email: {
      type: String,
      required: true
    },
    phoneNumber : {
      type : Number,
      minlength : 10,
      maxlength : 14,
      required : true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'I am new!'
    },
    profileUri : {
      type : String,
      requirerd : true     
  },
    role: {
      type: String,
     /* enum: Object.values(Roles)*/
     default: 'owner',
     enum: ["manager", "employee", "super-admin", "accountant","owner"]
    },
    organizationName : {
      type : String,
      minlength : 4,
      maxlength : 30,
      required : true
  },
  trialUsed: {
    type: Boolean,
    default: false
  },
  profile: {
    type: String
  },
  notifications : [notificationSchema],
  /*pumpId : {
    type : Schema.Types.ObjectId,
    ref : 'Pumps'
  },*/
  resetLink: {
    data: String,
    default: ''
  }

  });
  /*Object.assign(userSchema.statics,{
    Roles,
  })*/
  // userSchema.plugin(mongoTenant);

  module.exports = mongoose.model('User', userSchema);

