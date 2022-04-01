
const mongoose = require('mongoose');
const { object } = require('mongoose/lib/utils');

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    orgName: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    startDate : {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    }
  },{
    timestamps : true
});

  module.exports = mongoose.model('Subscription', subscriptionSchema);

