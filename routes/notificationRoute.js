const express = require('express');
const notifycontroller = require('../controllers/notificationController');
const router = express.Router();

router.post('/addnotification', notifycontroller.addNotification);

module.exports = router;