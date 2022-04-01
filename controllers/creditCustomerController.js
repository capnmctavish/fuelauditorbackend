const mongoose = require('mongoose');
const CreditCustomer = require('../models/credisutomerSchema');
const date = require('date-and-time')
const path = require('path');
const fs = require('fs');
//var PdfReader = require('pdfreader').PdfReader;
const { google } = require('googleapis');
/*const FileUpload = require('../utility/uploadinvoice');
const BulkExports = require('twilio/lib/rest/preview/BulkExports');
const { file } = require('googleapis/build/src/apis/file');
const { response } = require('express');*/
const User = mongoose.model('User');
const client = require('../utility/smsnotif')
const transporter = require('../utility/emailnotif');
const user = require('../models/user');
const BulkExports = require('twilio/lib/rest/preview/BulkExports');
const doc = require('pdfkit');
const Razorpay = require('razorpay');
const Notifications = require('../models/notificationSchema');
//const doc = require('pdfkit');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

exports.createCustomer = (req, res, next) => {
  //console.log(req.body);
 /* console.log(req.body.body);
  console.log(req.body.org);
  const cName = req.body.body.cName;
  const cCompany = req.body.body.cCompany;
  const ccId = req.body.body.ccId;
  const cEmail = req.body.body.cEmail;
  const cPhone = req.body.body.cPhone;
  const vehicles = req.body.body.vehicles;
  const vehicleNumber = req.body.body.vehicleNumber;
  const fuelType = req.body.body.fuelType;
  const creditlimit = req.body.body.creditlimit;
  const duedate = req.body.body.duedate;
  const transactions = req.body.body.transactions;
  const fuelqty = req.body.body.fuelqty;
  const vehicleNumb = req.body.body.vehicleNumb;
  const fuelTTyp = req.body.body.fuelTTyp;
  const total = req.body.body.total;
  const organizationName = req.body.org;*/
//console.log('req.body', req.body);

//*************** CREATE NEW CREDIT CUSTOMER ***************/
const cc = new CreditCustomer( req.body );
// const cc = new CreditCustomer ({
//   cId : req._id,
//   cName : cName,
//   cCompany : cCompany,
//   cEmail : cEmail,
//   cPhone : cPhone,
//   vehicles : [
//     {
//       vehicleNumber : vehicleNumber,
//       fuelType : fuelType
//     }
//   ],
//   creditlimit : creditlimit,
//   duedate : duedate,
//   transactions : [
//     {
//       fuelqty : fuelqty,
//       vehicleNumb : vehicleNumb,
//       fuelTTyp : fuelTTyp,
//       total : total
//     }
//   ]
// });

cc.save().then( result => {
  console.log("Customer created successfully");
  res.status(201).json({ message : 'Sucessfully created Credit Customer with id', id : result._id});

})
.catch( err => {
  if (!err.statusCode){
  err.statusCode = 500;
}
next(err);
});
};

/*********************Credit Customer by Organization**************************/
exports.creditCustomer = (req,res, next) => {
  //console.log(req.body);
  org = req.body;
  CreditCustomer.find( org ).then( data => {
   //console.log(data);
   res.send(data);
  }).catch( err => {
    if (!err.statusCode){
    err.statusCode = 500;
  }
  next(err);
  });
}

/************** Update transactions **********/

exports.updateTransactions = (req,res, next) => {
const tranchId = req.body.tranchId;
const cId = req.body.cId;
const fuelTTyp = req.body.fuelTTyp;
const fuelqty = req.body.fuelqty;
const vehicleNumb = req.body.vehicleNumb;
const total = req.body.total;

//console.log(req.body);
CreditCustomer.findOneAndUpdate({"_id": cId, "transactions._id" : tranchId}, 
  {
    "$set": 
  {
    "transactions.$.fuelqty" : fuelqty,  
    "transactions.$.fuelTTyp" : fuelTTyp,
    "transactions.$.vehicleNumb" : vehicleNumb ,
    "transactions.$.total" : total ,
   // "transactions.$.invoice" : invoice ,

  }}).then( result => {
    res.status(201).json({ message : 'Sucessfully updated transaction', id : result._id});
  
  })
  .catch( err => {
    if (!err.statusCode){
    err.statusCode = 500;
  }
  next(err);
  });

};

/************** GET transactions **********/
exports.getTransaction = (req, res, next) => {

  const cId = req.body._id;
  CreditCustomer.findById({'_id' : cId }).select('transactions').populate('CreditCustomer.transactions').then( resultData => {
    res.send(resultData);
  })
  .catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
};

/***************** GET VEHICLES BY CUSTOMER ID *********/
exports.getVehicles = (req, res, next) => {
  //console.log(req.body);
  const cId = req.body;
  CreditCustomer.findById( cId ).select('vehicles').populate('CreditCustomer.vehicles').then( data => {
    res.send(data);
  })
  .catch( err => { 
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
};


/************* POST NEW TRANSACTIONS ************* Not tested***/
exports.newTransaction = (req, res, next) => {
  //console.log(req.body);
  var cId = req.body.cId;
  //var fuelTTyp = req.body.body.fuelTTyp;
  var fuelqty = req.body.body.fuelqty;
  var vehicleNumb = req.body.body.vehicleNumb.vehicleNumber;
//  var vehicleId = req.body.vehicleNumb._id;
  var total = req.body.body.total;
  var fuelTTyp = req.body.body.vehicleNumb.fuelType;
  var uId = req.body.uId;
  var details = req.body.details;
 /* var transactionDetails = new Array();
  transactionDetails = req.body.body;*/
  //console.log(transactionDetails);

  CreditCustomer.updateOne({"_id" : cId, }, { $push : {
    transactions : {
      "fuelTTyp" : fuelTTyp,
      "fuelqty" : fuelqty,
      "vehicleNumb" : vehicleNumb,
      "total" : total
    }
  }}).then( result => {
    
    const CLIENT_ID = '581071587656-nltf8ke942qlj3knds6qlvsbfv6vp4ac.apps.googleusercontent.com';
    const CLIENT_SECRET = 'eHowheCURetVgzKeSSQJGG1i';
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    
    const REFRESH_TOKEN = '1//04aP85ynoaUq7CgYIARAAGAQSNgF-L9Irts1IlucX4kzer7ErbWUepV1NOERuX2hxhd6t5v8_SEi8USQTmYnZAjL11WBQT5bsvQ';
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
      );
    
      oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
      const drive = google.drive({
        version: 'v3',
        auth: oAuth2Client
      })
    //  var invoiceLink = '';
    CreditCustomer.findById({'_id': cId}).then(resultData => {
      if(!resultData) {
        return next(new Error('No transaction found'));
      }
      const len = resultData.transactions.length;
      const tId = {_id: resultData.transactions[len-1]._id};
      var email = new Array();
      email = resultData.cEmails;
      //console.log(email);
  
    const invoiceName = 'invoice' + Date.now() + '.pdf'
    const invoicePath = path.join('invoices', invoiceName);
    fs.writeFileSync(invoicePath, Buffer.from(details));
    // console.log(req.files);
    let mailOptions = {
      to: email,
      from: 'notification@fuelauditor.com',
      subject: 'Fuel Auditor Invoice',
      html:  '<p>Fuel Auditor</p>',
     attachments: [
         {
             filename: invoiceName,
             type: "application/pdf",
             content: Buffer.from(details)
         }
     ]
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
         
      }
      else console.log(info);
  });
  
  async function uploadFile(){
    try{
    const response = await drive.files.create({
      requestBody: {
        name: invoiceName,
        mimeType: 'application/pdf'
      },
      media: {
        mimeType: 'application/pdf',
        body: fs.createReadStream(invoicePath)
      }
    })
    //console.log(response.data.id);
    const abc =  response.data.id;
   // console.log(abc);
    await drive.permissions.create({
      fileId: abc,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    })
    const result = await drive.files.get({
      fileId: abc,
      fields: 'webViewLink, webContentLink'
    })
    var invoiceLink = result.data.webViewLink;
    //console.log(invoiceLink);
    setLink(invoiceLink);
  
    //  console.log(invoiceLink);
  }
  catch (error) {
    console.log(error.message);
  }
  }
  uploadFile();
  function setLink(val){
    try{
      //console.log(tId);
      CreditCustomer.updateOne({'_id': cId}, { $push: { invoices: { "invoice": val,
    "transactionIds": tId,
    "invoiceName": invoiceName }}},
      function(err, doc){
      if(err){
          // console.log("Something wrong when updating data!");
          console.log(err);
      }
      else console.log("updated");
      })
    }
  catch (error) {
    console.log(error.message);
  }
  }
  user.updateOne({"_id": uId}, 
  {
    $push : {
      notifications: {
        "notification" : "Invoice has been sent to your mail"
      }
  }}).then( result => {
    console.log('Invoice has been sent to your mail');
  }).catch( err => {
    if (!err.statusCode){
    err.statusCode = 500;
  }
  next(err);
  });

  /*let body = { notification: "Invoice has been sent to your mail" };
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
    });*/
  //setLink();
  res.json("Invoice generated successfully");
    });
  //res.status(201).json({ message : 'Sucessfully added new transaction', id : result._id});
  console.log('Sucessfully added new transaction');
})
.catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
};

/******************* DELETE TRANSACTIONS **********/
exports.deleteTransaction = (req, res, next) => {
  const tranchId = req.body.tId._id;
  const cId = req.body.cId._id;
  CreditCustomer.updateOne({'_id' : cId }, { $pull : {
    transactions : {
      _id: tranchId
    }
  }}).then (details =>
    {
      res.json("Credit customer deleted successfully");
    })
  .catch( err => {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

/******************* DELETE VEHICLES **********/
exports.deleteVehicles = (req, res, next) => {
  const cId = req.body.cId;
  const vehicleId = req.body.vehicleId;
  CreditCustomer.findOneAndRemove({'_id' : cId,'vehicles._id' : vehicleId}).then( result => {
    res.status(200).json({message : 'Vehicles with following ID have been removed', VehicleID: vehicleId});
  })
  .catch( err => {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

// exports.listCustomers = (req, res, next) => {
//   const 
// }

exports.customerDetails = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
    res.send(data);
  }).catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
};

exports.customerList = (req, res, next) => {
  const cId = req.body._id;
  CreditCustomer.findById({'_id' : cId }).then( data => {
    res.send(data);
  })
  .catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
};

/**************DELETE CREDIT CUSTOMER*************/
exports.deleteCustomer = (req, res, next) => {
  const CustomerId = req.body._id;
  CreditCustomer.findOneAndDelete({_id : CustomerId}).then( result => {
    res.status(200).json({message : 'Customer has been removed'});
  })
  .catch( err => {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}; 

exports.createInvoice = (req, res, next) => {
  const cId = req.body.cId;
  //var uId = req.body.uId;
  const CLIENT_ID = '581071587656-nltf8ke942qlj3knds6qlvsbfv6vp4ac.apps.googleusercontent.com';
  const CLIENT_SECRET = 'eHowheCURetVgzKeSSQJGG1i';
  const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
  
  const REFRESH_TOKEN = '1//04aP85ynoaUq7CgYIARAAGAQSNgF-L9Irts1IlucX4kzer7ErbWUepV1NOERuX2hxhd6t5v8_SEi8USQTmYnZAjL11WBQT5bsvQ';
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
    );
  
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
    const drive = google.drive({
      version: 'v3',
      auth: oAuth2Client
    })
  //  var invoiceLink = '';
  CreditCustomer.findById(cId)
  .then( resultData => {
    if(!resultData) {
      return next(new Error('No transaction found'));
    }
    details = req.body.details;
    var email = new Array();
    email = resultData.cEmails;
    //console.log(resultData.cEmails);
    const invoiceName = 'invoice-' + resultData.ccId + '.pdf' ;
  
//const mimetype = '.pdf';
   //path="kaalpanik.in/"
  const invoicePath = path.join('invoices', invoiceName);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="'+ invoiceName + '"');

  async function uploadFile(){
  try{
  const response = await drive.files.create({
    requestBody: {
      name: invoiceName,
      mimeType: 'application/pdf'
    },
    media: {
      mimeType: 'application/pdf',
      body: pdf
    }
  })
  //console.log(response.data.id);
  const abc =  response.data.id;
 // console.log(abc);
  await drive.permissions.create({
    fileId: abc,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  })
  const result = await drive.files.get({
    fileId: abc,
    fields: 'webViewLink, webContentLink'
  })
  var invoiceLink = result.data.webViewLink;
  setLink(invoiceLink);

  fs.readFile(invoicePath, function (err, data) {
    if(data){
      transporter.sendMail({
        to: email,
        from: 'notification@fuelauditor.com',
        subject: 'New transaction',
        html:  '<p>Fuel Auditor</p>',
        attachments: [{ filename: invoiceName, content: details, type: "application/pdf" }]
      })
    } 
    else if (err){
        console.log(err);
    }})
    console.log(invoiceLink);
}
catch (error) {
  console.log(error.message);
}
}
uploadFile();
function setLink(val){
  try{
    console.log(val);
    CreditCustomer.updateOne(
      { "_id" : cId }, { $push: { invoices: { "invoice": val }}},
    function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
        console.log(err);
    }
    else console.log("updated");
    })
  }
catch (error) {
  console.log(error.message);
}
}
setLink();

/*user.updateOne({"_id": uId}, 
  {
    $push : {
      notifications: {
        "notification" : "Invoice has been sent to your mail"
      }
  }}).then( result => {
    res.status(201).json({ message : 'Invoice has been sent to your mail'});
  })
  .catch( err => {
    if (!err.statusCode){
    err.statusCode = 500;
  }
  next(err);
  });*/

/*var request = require('request');
     
  request.post(
    {
    url:'http://localhost:3000/send-notification',
    json: { data: "Invoice generated" }
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
/*app.post('/send-notification', function(req, res){
  console.log(req.body);
  request.post(
    {
    url:'http://localhost:3000/send-notification',
    body: "invoice created successfully",
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
  })
  .catch( err => {
    if(!err.statusCode) {
      err.statusCode = 500;
      console.log(err)
    }
    next(err);
    });
}

exports.updatecustomer = (req, res, next) => {
  const id = req.body._id;
  const cName = req.body.details.cName;
  const cCompany = req.body.details.cCompany;
 // const ccId = req.body.ccId;
  var cEmail = new Array();
  cEmail = req.body.details.cEmails;
  //console.log(cEmail);
  const cPhone = req.body.details.cPhone;
  const vehicles = req.body.details.vehicles;
 /* const vehicleNumber = req.body.vehicleNumber;
  const fuelType = req.body.fuelType;
  const creditlimit = req.body.creditlimit;
  const duedate = req.body.duedate;
  const transactions = req.body.transactions;
  const fuelqty = req.body.fuelqty;
  const vehicleNumb = req.body.vehicleNumb;
  const fuelTTyp = req.body.fuelTTyp;
  const total = req.body.total;*/
  //console.log(req.body);
CreditCustomer.findOneAndUpdate({"_id" : id, }, {
  "cCompany" : cCompany,
  "cEmails" : req.body.details.cEmails,
  "cName" : cName,
  "cPhones" : req.body.details.cPhones,
  "duedate" : req.body.details.duedate,
  "vehicles" : req.body.details.vehicles,
  /*fuelType : req.body.fuelType,
  vehicleNumber = req.body.vehicleNumber*/
}).then( result => {
//res.status(201).json({ message : 'Sucessfully added new transaction', id : result._id});
//console.log(result);
res.send(result);
//res.status(200).json({message : 'Customer has been updated'});
})
.catch( err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
  });
}

exports.mail = (req, res, next) => {
  const body = req.body.details;
  //console.log(body);
  const invoiceName = 'mail' + Date.now() + '.pdf'
  const invoicePath = path.join('mails', invoiceName);
  fs.writeFileSync(invoicePath, body);
    /*transporter.sendMail({
   
    attachments: [{ filename: 'details.pdf', content: body, type: "application/pdf", encoding: 'base64' }]
    });*/

    let mailOptions = {
      to: 'bhagyashree@kaalpanik.in',
      from: 'notification@fuelauditor.com',
      subject: 'Credit Customer Details',
      html:  '<p>Fuel Auditor</p>',
      attachments: [
          {
              filename: invoiceName,
              //content: body,
              path: invoicePath,
              contentType: 'application/pdf',
             // encoding: 'base64'    //this line!!!!
          }
      ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
         
      }
      else console.log(info);
  });
}

//var moment = require ('moment')
exports.JulyCMFilter = (req, res, next) => {
  //console.log(req.body);
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
  // var today            = new Date();
  // var days_after_20    = "05/31/2021";
    var startDate = req.body.sd;
    var endDate = req.body.ed;
    var result = abc.filter(function (item) {
    //console.log((date.format(item.createdAt, 'YYYY/MM/DD') >= startDate) && (date.format(item.createdAt, 'YYYY/MM/DD') <= endDate));
    return (date.format(item.createdAt, 'YYYY/MM/DD') >= startDate) && (date.format(item.createdAt, 'YYYY/MM/DD') <= endDate);
    });
  
   //console.log(result);
   res.send(result);
  });
}

exports.JuneCMFilter = (req, res, next) => {
  //var abc = '';
  CreditCustomer.find({}).then( data => {
    //res.send(data);
    const abc = data;
 

 /*   var dateTimeTofilter = moment().subtract(1, 'year');
    var filter = {
        "date_added": {
            $gte: new Date(dateTimeTofilter._d)
        }
    };
    CreditCustomer.collection.find(
        filter
    ).toArray(function(err, result) {
        if (err) return next(err);
        res.send(result);
    });*/

    var today            = new Date();
    var todayTime        = new Date().getTime();
    var days_after_20    = "06/30/2021";
    var days_before_5    = "06/01/2021";
/*    var days_after_20    = new Date().setDate(today.getDate()+20);*/
   // var days_before_5    = new Date().setDate(today.getDate()-30);
  
    //date.format(details.duedate, 'DD/MM/YYYY')

    var result = abc.filter(function (item) {
     //  var itemTime = new Date(item.date).getTime()
     /*  console.log(itemTime);*/
     //  console.log(item);
    //  var abcd =  itemTime >= days_before_5 && itemTime <= days_after_20; 
    /*console.log(date.format(item.createdAt, 'MM/DD/YYYY'));
    console.log(date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20);*/
    //console.log(item.ccId >= 10009)  ;
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   //console.log(result);
   res.send(result);
  });
  /*_this.lastWeek = function () {
    var result = moment().subtract(7,'days').hours(0);   
    return result._d;
  };*/

}
exports.MayCMFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
    var days_after_20    = "05/31/2021";
    var days_before_5    = "05/01/2021";

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   //console.log(result);
   res.send(result);
  });
}

exports.AprilCMFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
    var days_after_20    = "04/30/2021";
    var days_before_5    = "04/01/2021";

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   //console.log(result);
   res.send(result);
  });
}

exports.MarchCMFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
    var days_after_20    = "03/31/2021";
    var days_before_5    = "03/01/2021";

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   //console.log(result);
   res.send(result);
  });
}

exports.FebCMFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
    var days_after_20    = "02/31/2021";
    var days_before_5    = "02/01/2021";

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   //console.log(result);
   res.send(result);
  });
}
exports.payment = (req, res, next) => {
var instance = new Razorpay({ key_id: 'rzp_test_AF8tI2dXgiE7Bt', key_secret: 'QFkX7bSI48gPFWXqBzOn72sN' })

var options = {
  amount: 5000,  // amount in the smallest currency unit
  currency: "INR",
  receipt: "order_rcptid_11"
};
instance.orders.all().then(order=>{
  //console.log(order);
  res.send(order);
}).catch(console.error);
/*instance.orders.create(options, function(err, order) {
  console.log(order);
  res.send(order);
});*/
}

exports.addPayment = (req, res, next) => {
  const id = req.body._id;
  const mode = req.body.paymentMode;
  const amount = req.body.details.amount;
  const others = req.body.details.others;
  const tax = req.body.details.taxDeducted;
  const status = req.body.status;
  const invoiceId = req.body.invoiceId;

  //console.log(req.body);
  CreditCustomer.updateOne({"_id" : id, }, { $set : {
    "paymentMode": mode,
    "amountPaid": amount,
    "taxDeducted": tax,
    "others": others,
    "status": status
  }}).then( result => {
    if(status == "Paid"){
      CreditCustomer.findById({"_id" : id }).then( details => {
        const custdetails = details;
        const tLength = details.transactions.length;
        const iLength = details.invoices.length;
        const iDetails = details.invoices;
        //console.log(tLength, iLength, iDetails);
        var transactionIds={};
        for(i=0; i< iLength; i++){
          if(iDetails[i]._id == invoiceId){
           
           const query = { "_id": id };
           
           const updateDocument = {
              $set: { "invoices.$[orderItem].paid": true }
            }; 
           
            const options = {
              arrayFilters: [{ "orderItem._id": invoiceId }]
            };
          
            CreditCustomer.updateMany(query, updateDocument, options).then( data => {
            console.log(data);
            }).catch( err => {
              if(!err.statusCode) {
                err.statusCode = 500;
              } 
              next(err);
              });


           // const invoiceDetail = iDetails[i];
            transactionIds = iDetails[i].transactionIds;
            /*console.log("Ids:" + transactionIds);
            console.log("Ids:" + transactionIds[0]._id);*/
 
           /* for(i=0; i< transactionIds.length; i++){
              
              CreditCustomer.updateMany({transactions:{$_id:transactionIds[i]}}, 
              {"paid": true}, function (err, docs) {
              if (err){
                  console.log(err)
              }
              else{
                  console.log("Updated Docs : ", docs);
              }
          });
        }*/
      /*  if( tLength > 2 ) {
          for(i=0; i< tLength; i++){
            for(j=0; j< transactionIds.length; j++){
              /*  console.log("transaction Ids: "+custdetails.transactions[i]._id);
                console.log("invoice tIds: " + transactionIds[j]._id);*/
             /* console.log( custdetails.transactions[i]._id == transactionIds[j]._id );
              if(custdetails.transactions[i]._id == transactionIds[j]._id){
              console.log("final loop");
              //custdetails.transactions[i].paid = true;
          
              }
              else
                console.log("error");
          }}
        }
        else {
          console.log( custdetails.transactions._id == transactionIds._id );
          if(custdetails.transactions._id == transactionIds._id){
            console.log("final loop");
           // custdetails.transactions.paid = true;
        
            const query = { _id: id };
            const updateDocument = {
              $push: { "transactions.$[orderItem].paid": "true" }
            };
            const options = {
              arrayFilters: [{
                "orderItem._id": transactionIds._id
              }]
            };
            const result = await pizza.updateMany(query, updateDocument, options);

            }
            else
              console.log("error");
        }*/
          /*
            }
            //console.log(transactionIds);
          }*/
        }
      }
      if( tLength > 1 ) {
        changeMultipleStatus();
      }
      else{
        changeStatus();
      }
      async function changeMultipleStatus() {
       
      const query = { "_id": id };
      /*var updateDocument ={};
      var options={}; */
      for(i=0; i< transactionIds.length; i++){
        //console.log(transactionIds[i]);
     const updateDocument = {
        $set: { "transactions.$[orderItem].paid": true }
      }; 
     
      const options = {
        arrayFilters: [{ "orderItem._id": transactionIds[i]._id }]
      };
    
      const result = await CreditCustomer.updateMany(query, updateDocument, options).then( data => {
      console.log(data);
      }).catch( err => {
        if(!err.statusCode) {
          err.statusCode = 500;
        } 
        next(err);
        });}
    }
      async function changeStatus() {
      const query = { "_id": id };
      const updateDocument = {
        $set: { "transactions.$[orderItem].paid": true }
      }; 
      const options = {
        arrayFilters: [{ "orderItem._id": transactionIds[0]._id }]
      }; 
      const result = await CreditCustomer.updateMany(query, updateDocument, options).then( data => {
        console.log(data);
      }).catch( err => {
        if(!err.statusCode) {
          err.statusCode = 500;
        } 
        next(err);
        });
    }

       /* const trans = ;
        for(i=0; i< length; i++){

        }*/
       
      }).catch( err => {
        if(!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
        });;
    }
    else{
      console.log(status);
    }
    //res.status(201).json({ message : 'Sucessfully added new transaction', id : result._id});
    console.log('Sucessfully added payment details');
    res.status(201).json({ message : 'Payment details added sucessfully'});
    })
    .catch( err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
      });
}

exports.JanCMFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
    var days_after_20    = "01/31/2021";
    var days_before_5    = "01/01/2021";

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   //console.log(result);
   res.send(result);
  });
}

exports.DecLMFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
    var days_after_20    = "12/31/2020";
    var days_before_5    = "12/01/2020";

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   //console.log(result);
   res.send(result);
  });
}

exports.NovLMFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
    var days_after_20    = "11/30/2020";
    var days_before_5    = "11/01/2020";

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   //console.log(result);
   res.send(result);
  });
}

exports.OctLMFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
    var days_after_20    = "10/31/2020";
    var days_before_5    = "10/01/2020";

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   console.log(result);
   res.send(result);
  });
}

exports.SeptLMFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;
    var days_after_20    = "09/31/2020";
    var days_before_5    = "09/01/2020";

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   console.log(result);
   res.send(result);
  });
}

exports.weekFilter = (req, res, next) => {
  CreditCustomer.find({}).then( data => {
   
    const abc = data;

    var today            = new Date();
    var todayTime        = new Date().getTime();
    var days_after_20    = "07/16/2021";
    var days_before_5    = "06/23/2021";
    var days_before_5    = new Date().setDate(today.getDate()-30);

    var result = abc.filter(function (item) {
    return date.format(item.createdAt, 'MM/DD/YYYY') >= days_before_5 && date.format(item.createdAt, 'MM/DD/YYYY') <= days_after_20;
    });
  
   console.log(result);
   res.send(result);
  });
}

/*const multer = require("multer");
const uploadInvoice = multer({ dest: "uploads/" });*/
exports.uploadFiles = (req, res, next) => {
  cId = req.body.cId;
  details = req.body.details;
  tId = req.body.transactions;
  uId = req.body.uId;

  const CLIENT_ID = '581071587656-nltf8ke942qlj3knds6qlvsbfv6vp4ac.apps.googleusercontent.com';
  const CLIENT_SECRET = 'eHowheCURetVgzKeSSQJGG1i';
  const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
  
  const REFRESH_TOKEN = '1//04aP85ynoaUq7CgYIARAAGAQSNgF-L9Irts1IlucX4kzer7ErbWUepV1NOERuX2hxhd6t5v8_SEi8USQTmYnZAjL11WBQT5bsvQ';
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
    );
  
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
    const drive = google.drive({
      version: 'v3',
      auth: oAuth2Client
    })
  //  var invoiceLink = '';
  CreditCustomer.findById(cId).then(resultData => {
    if(!resultData) {
      return next(new Error('No transaction found'));
    }
    
    var email = new Array();
    email = resultData.cEmails;
    console.log(email);

  const invoiceName = 'invoice' + Date.now() + '.pdf'
  const invoicePath = path.join('invoices', invoiceName);
  fs.writeFileSync(invoicePath, Buffer.from(details));
  // console.log(req.files);
  let mailOptions = {
    to: email,
    from: 'notification@fuelauditor.com',
    subject: 'Fuel Auditor Invoice',
    html:  '<p>Fuel Auditor</p>',
   attachments: [
       {
           filename: invoiceName,
           type: "application/pdf",
           content: Buffer.from(details)
       }
   ]
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    else console.log(info);
});
user.updateOne({"_id": uId}, 
  {
    $push : {
      notifications: {
        "notification" : "Invoice has been sent to your mail"
      }
  }}).then( result => {
    console.log('Invoice has been sent to your mail');
    //res.status(201).json({ message : 'Invoice has been sent to your mail'});
  })
  .catch( err => {
    if (!err.statusCode){
    err.statusCode = 500;
  }
  next(err);
  });
/*app.post('/send-notification', function(req, res){
  console.log(req.body);
  request.post(
    {
    url:'http://localhost:3000/send-notification',
    body: "invoice created successfully",
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

/*fs.readFile(invoicePath, function (err, data) {
  if(data){
    transporter.sendMail({
      to: email,
      from: 'notification@fuelauditor.com',
      subject: 'New transaction',
      html:  '<p>Fuel Auditor</p>',
      attachments: [{ filename: invoiceName, content: details, type: "application/pdf" }]
    })
  } 
  else if (err){
      console.log(err);
  }})*/
async function uploadFile(){
  try{
  const response = await drive.files.create({
    requestBody: {
      name: invoiceName,
      mimeType: 'application/pdf'
    },
    media: {
      mimeType: 'application/pdf',
      body: fs.createReadStream(invoicePath)
    }
  })
  //console.log(response.data.id);
  const abc =  response.data.id;
 // console.log(abc);
  await drive.permissions.create({
    fileId: abc,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  })
  const result = await drive.files.get({
    fileId: abc,
    fields: 'webViewLink, webContentLink'
  })
  var invoiceLink = result.data.webViewLink;
  //console.log(invoiceLink);
  setLink(invoiceLink);

  //  console.log(invoiceLink);
}
catch (error) {
  console.log(error.message);
}
}
uploadFile();
function setLink(val){
  try{
    //console.log(val);
    CreditCustomer.updateOne(cId, { $push: { invoices: 
      { 
        "invoice": val, 
        "transactionIds": tId,
        "invoiceName": invoiceName 
    }}},
    function(err, doc){
    if(err){
        // console.log("Something wrong when updating data!");
        console.log(err);
    }
    else console.log("updated");
    })
  }
catch (error) {
  console.log(error.message);
}
}

//setLink();
res.json("Invoice generated successfully");
  })
  .catch( err => {
    if(!err.statusCode) {
      err.statusCode = 500;
      console.log(err)
    }
    next(err);
    });
}
exports.test = (req, res, next) => {
 console.log(req.body);
}