const mongoose = require('mongoose');
const Pumps = require('../models/pumps');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createPump = (req, res, next) => {
    const  petrolPumpName =  req.body.petrolPumpName ;
    const address = req.body.address;
    const companyName = req.body.companyName;
    const landmark = req.body.landmark;
    const city  = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;
    const untanks = req.body.untanks;

    const pump = new Pumps({
        petrolPumpName: petrolPumpName,
        address : address,
        companyName : companyName,
        landmark: landmark,
        city  : city,
        state : state,
        pincode : pincode,
        untanks : untanks,
        tenantId : req.tenantId ,
      });
     pump.save()
    .then(result => {
      return res.status(201).json({ message: 'Pump Created!', tenantId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    });
}
  
    