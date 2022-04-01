const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    notification : {
        type : String,
        required: true
    }
},{
    timestamps : true
});

module.exports = mongoose.model('Notifications', notificationSchema);
