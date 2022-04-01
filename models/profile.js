const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getprofileschema = new Schema ({
   profileUri : {
       type : String,
       requirerd : true     
   },
   address : {
       type : String
   },
   subscriptionPlan:{
       subcriptionAmt: { type: Currency },
       Creator: {type : Object, required : String}
   },
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
    name: {
    type: String,
    required: true
    },
    status: {
    type: String,
    default: 'I am new!'
    },
    domainName : {
    type: String,
    required: true
    }
    
});
// getprofileschema.plugin(mongoTenant);

module.exports = mongoose.model('getUserProfile', getprofileschema);