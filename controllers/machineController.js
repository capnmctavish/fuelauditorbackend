const mongoose = require('mongoose');
const { aggregate } = require('../models/machineSchema');
const Machine = require('../models/machineSchema');


exports.addMachine = (req, res, next) => {
    const machine = req.body.machine;
    const nozzles = req.body.nozzles;
    const nozzle = req.body.nozzle;
    const reading = req.body.reading;
    const mfgyear = req.body.mfgyear;
    const modelno = req.body.modelno;
    const serialno = req.body.serialno;
    const start = req.body.start;
    const end = req.body.end;
    const test = req.body.test;
    const tenantId = req.body.tenantId;
    const pumpId = req.body.pumpId;

   

    const fuel = new Machine(req.body);
//Steve suggsted and was working
    console.log('fuel', fuel);

    // const fuel = new Machine({
    //   tenantId : tenantId,
    //   pumpId : pumpId,
    //   // machineId : req.machineId,
    //   machine : machine,
    //   modelno : modelno,
    //   mfgyear : mfgyear,
    //   serialno : serialno,
    //   nozzles: [
    //     {
    //       nozzle: nozzle,
    //       reading: [
    //         {
    //           start : start,
    //           end : end,
    //           test : test
    //         }
    //       ] 
    //   }
    //   ]
    // });
    // fuel.markModified('nozzles');
     fuel.save()
    .then(result => {
      // console.log(result);
      return res.status(201).json({ message: 'New machine has been added!', MachineID: result._id});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
     
    });
};

//************** GET MACHINE BY PUMP ID'S ****************************/
exports.getMachineById = (req, res, next) => {

Machine.find({'pumpId': req.body.pumpId}).then(machines => {
  console.log(machines);
  return res.send(machines);
  // res.status(200).json({ message : 'These are all the MAchines related to Pump' , pumpId : pumpId});
})
.catch( err => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

});
};

//************** GET ALL MACHINES (ADMIN ROUTE ONLY)****************************/
exports.getMachines = (req, res, next) => {
  Machine.find().then( machine => {
    console.log(machine);
    return res.send(machine);
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    
  });
};

exports.deleteMachine = (req, res, next) => {
  const machineId = req.body.machineId;
  Machine.findOneAndDelete({_id : machineId}).then( result => {
    return res.status(200).json({message : 'Machine with following ID has been removed', machineId : machineId, one :result })
  })
  .catch( err => {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // next(err);
  });
};

//************** GET NOZZLES BY MACHINE ID'S ****************************//
exports.getNozzles = (req, res, next) => {
Machine.find({ '_id' : req.body.machineId}).select('nozzles').populate('Machine.nozzles').then( nozzles => {
  return res.send(nozzles);
})
.catch( err => {
  console.log(err);
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  
});
};

//********************Delete Nozzles by ID**************W/
exports.deleteNozzle = (req, res, next) => {
  const machineId = req.body.machineId;
  const nozzleId = req.body.nozzleId;
  Machine.findOneAndRemove({'_id' : machineId,'nozzles._id' : nozzleId}).then( result => {
    return res.status(200).json({message : 'Nozzle with following ID has been removed'});
    console.log(result);
  })
  .catch( err => {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    
  });
};

/**********Get Nozzle wise daily fuel entery*/

// exports.dailyfuelentry = (req, res, next ) => {
//     const pumpId = req.body.pumpId;
//     Machine.findById(pumpId).then( d => {
//      d.aggregate()
//     })
// }

