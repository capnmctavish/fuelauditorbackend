const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config();

const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.API_KEY
      }
    })
  );

  module.exports = transporter;