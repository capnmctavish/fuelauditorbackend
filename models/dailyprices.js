const mongoose = require('mongoose');


const Schema =  mongoose.Schema;

const priceSchema = new Schema ({
 
    pumpName: {type: String},
    district: { type: String},
    petrolPrice: { type: Number},
    dieselPrice: {type : Number},
},
{timestamps: true});
module.exports = mongoose.model('Price',priceSchema);