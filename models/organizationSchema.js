const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orgSchema = new Schema ({
    orgName : {
        type : String
        }
    },{
        timestamps : true
    });

module.exports = mongoose.model('Organization', orgSchema);
