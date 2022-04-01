const mongoose = require('mongoose');
const { array } = require('mongoose/lib/utils');

const Schema = mongoose.Schema;

const vehicleSchema = new Schema ({
    vehicleNumber : {
        type : String
        },
    fuelType : {
        type : String,
        enum : ['Petrol', 'Diesel', 'Extra Mile', 'Extra Premium']
    }
    
}, { timestamps : true});
const transactionIdsSchema = new Schema({
    tId : {
        type: String
    }
})
const invoiceSchema = new Schema ({
    invoiceName:{
        type: String
    },
    invoice: {
        type: String,
       // required: 'URL can\'t be empty',
        //unique: true
    },
    invoiceId : {
        type : String
    },
    paid: {
        type: Boolean,
        default: false
    },
    transactionIds : [transactionIdsSchema],
}, { timestamps : true});

const transactionSchema = new Schema({
    fuelqty : {
        type : Number
    },
    vehicleNumb : {
        type : String
    },
    fuelTTyp: {
        type : String
    },
    total : {
        type : Number
    },
    paid: {
        type: Boolean,
        default: false
    },
},{
    timestamps : true
});
const emailSchema = new Schema({
    cEmail : {
        type : String,
        required: true
    }
});
const phoneSchema = new Schema({
cPhone : {
    type : Number,
    required : true,
    maxlength : 12
}
});
const creditCustomerSchema = new Schema ({
    /*pumpId :
    {
        type : Schema.Types.ObjectId,
        ref : 'Pumps',
        required : true
    },*/
    cName : {
        type : String,
        required : true,
        maxlength : 30
    },
    cCompany : {
        type : String,
        required : true, 
        maxlength : 30
    },
    ccId:{
        type : Number,
        required : true
    },
    creditlimit : {
        type : Number
    },
    cPhones: [phoneSchema],
    cEmails : [emailSchema],
    vehicles : [vehicleSchema],
    transactions : [transactionSchema], 
    invoices : [invoiceSchema],
    paymentMode: {
        type : String,
    },
    amountPaid: {
        type : Number,
    },
    taxDeducted: {
        type : Number,
    },
    others: {
        type : String,
    },
    status: {
        type: String
    },
    duedate : 
        { type : Date,
            default : oneMonthFromNow
        },
    organizationName: {
        type: String,
        required: true
    }
},{
    timestamps : true
});
invoiceSchema.path('invoice').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');
function oneMonthFromNow() {
    var d = new Date();
    var targetMonth = d.getMonth() + 1;
    d.setMonth(targetMonth);
    if(d.getMonth() !== targetMonth % 12) {
        d.setDate(0); // last day of previous month
    }
    return d;
};
// creditCustomerSchema.path('cEmail').validate(function (email) {
//     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//     return emailRegex.test(email.text); // Assuming email has a text attribute
//  }, 'The e-mail field cannot be empty.');

/*customerTable = mongoose.model('CreditCustomer', creditCustomerSchema);*/
module.exports = mongoose.model('CreditCustomer', creditCustomerSchema);

/*module.exports={
     
     getcustomerdetails:function(callback){
        var customerData=customerTable.find({});
        customerData.exec(function(err, data){
            if(err) throw err;
            return callback(data);
        })
        
     }
}*/
