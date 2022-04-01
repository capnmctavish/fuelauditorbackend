const mongoose = require('mongoose');
// const mongoTenant = require('mongo-tenant');

const Schema =  mongoose.Schema;

const petrolPumpSchema = new Schema ({
   pumpName : {
        type : String,
        minlength: 4,
        maxlength: 30,
        required : true
    },
    address : {
        type : String,
        required: true,
        minlength: 10,
        maxlength: 200
    },
    companyName : {
        type : String,
        enum : ["IOCL","BP","HP"],
        required: true
    },
    landmark : { type : String},
    district : { type : String, required: true},
    state : { type : String, required: true},
    pincode : { type : Number, required: true},
    undergroundtank : {
        untanks: [
          {
            // productId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            tankname : {type : String, minlength: 4, maxlength : 50},
            quantity: { type: Number, required: true },
            fueltype : {
                type : String,
                enum : ["Petrol", "Disel", "ExtraPremium", "ExtraMile"],
                required : true
                    }
          }
        ]
      },
    tenantId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    createdon : {
        type : Date,
        default : Date.now
    },
    pumpId :
    {
        type : Schema.Types.ObjectId,
        required : true
    }
        
},{ timestamps : true});
// petrolPumpSchema.plugin(mongoTenant);
module.exports = mongoose.model('Pumps', petrolPumpSchema);
