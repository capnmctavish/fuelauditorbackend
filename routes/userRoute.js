const path = require('path');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {roles} = require('../middleware/auth');
const User = require('../models/user');
const authController = require('../controllers/signup');
const subscriptionController = require('../controllers/subscriptionController');

router.put(
    '/signup',
    [
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
          return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
              return Promise.reject('E-Mail address already exists!');
            }
          });
        })
        .normalizeEmail(),
      body('password')
        .trim()
        .isLength({ min: 5 }),
      body('name')
        .trim()
        .not()
        .isEmpty(),
        body('domainName')
        .isLength({min:5}),
      body('userName').trim().not().isLength({min:5, max:20})

    ],
    authController.signup
  );
  
  router.post('/login', authController.login);
 
  router.put('/forgot-password', authController.forgotPassword);
  router.put('/reset-password', authController.resetPassword);
  router.put('/valid-password-token', authController.verifyPassword);
  router.post('/order', authController.order);
  router.post('/paymentVerify', authController.verifyPayment);
  router.post('/userDetails', authController.users);
  router.post('/subscribe', subscriptionController.subscribe);
  router.post('/subscriptionList', subscriptionController.subscriptionList);
  router.post('/subscriptionInfo', subscriptionController.subscriptionDetails);
  router.get('/organizations', authController.organizationList);
  router.post('/updateuser', authController.updateUser);
  router.post('/read-notify', authController.readNotify);
  router.post('/clear-notify', authController.clearNotify);
  router.post('/delete-notify', authController.deleteNotify);
module.exports = router;