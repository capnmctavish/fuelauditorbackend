const path = require('path');
const express = require('express');
const pumpController = require('../controllers/pumpsController');
const machinecontroller = require('../controllers/machineController');
const router = express.Router();
const { body } = require('express-validator');
const {roles} = require('../middleware/auth');



//************** MACHINE ROUTES ****************************/
router.post('/addmachine', machinecontroller.addMachine);
router.post('/deletemachine', machinecontroller.deleteMachine);
router.post('/deletenozzle', machinecontroller.deleteNozzle);
router.get('/getmachinesbyid', machinecontroller.getMachineById);
router.get('/getnozzles', machinecontroller.getNozzles);
//************** MACHINE ROUTES ONLY FOR ADMIN ****************************/
router.get('/getmachines', machinecontroller.getMachines);

//************** PUMP ROUTES ****************************/
router.post('/createpump',  pumpController.createPump);


 
module.exports = router;