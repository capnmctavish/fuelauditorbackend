const express = require('express');
var cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
// const mongotenant = require('mongo-tenant');
const cors = require('cors');
//const bodyparser = require('body-parser');
const http = require('https');
const log4js = require('log4js');
const morgan = require('morgan');

const helmet = require('helmet');
const appLogger = log4js.getLogger();


const app = express();

/***************** INTIALIZING MONGDB SESSION & STORING SESSION */
const store = new MongoDbStore({
      uri : 'mongodb+srv://fueldb:9096476219@fuelauditor.klu3r.mongodb.net/test',
      collection : 'session',
      connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    
      function(err) {
        console.log(err);     
       }
    
    );
    store.on('error', function(error) {
      console.log(error);
    });

app.use(helmet());
app.use(log4js.connectLogger(appLogger));
app.use(
  session({ 
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    secret: 'mysecretyouwontknow', 
    resave: false, 
    saveUninitialized: false,
    store : store
  }));
app.use(express.json());

/***************** CORS settings *********************/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
  });

  /************* Create Access Logs *******************/
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );
/******************** APP ROUTES *****************/
const userdataRoutes = require('./routes/userRoute');
const pumpRoutes = require('./routes/pumpRoutes');
const creditCustomer = require('./routes/creditcustomerRoutes');
const notificationRoute = require('./routes/notificationRoute');
const upload = require('./routes/upload');

app.use('/api/v1/', userdataRoutes);
app.use('/api/v1/', pumpRoutes);
app.use('/api/v1/', creditCustomer);
app.use('/api/v1/', notificationRoute);

app.use(helmet());
app.use(
  morgan('combined', { stream: accessLogStream }));

/************ Check for API APPLICATION IS LIVE ******/
app.get('/', (req,res) => {
  // response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=None");
res.status(200).send({ Name : 'Fuelauditor backend appication', title: 'Multitenant app with organization exapmle.fuelauditor.com' });
});

app.post('/postform', (req, res) => {
  res.status(200).send({'Test post method is like this': req});
});

//**************  Database connection and settings ******/
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on('open', () => 
    console.log('Mongoose connection open to fuelDb'));backend.
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//runing cron on daily prices “At 06:00AM on every day-of-week from Sunday through Saturday.”
const gP = require('./services/dailyrate');
cron.schedule('0 6 * * 0-6', () => {
  gP.getPrice();
  // console.log(gP.getPrice.res);
},
{
    scheduled : true,
    timezone : 'Asia/Kolkata'
});


//app.post("/upload_files", uploadInvoice.array("files"), uploadFiles);

/*function uploadFiles(req, res) {
    console.log(req.body);
   // console.log(req.files);
   Email.send({
    to: "bhagyashree@kaalpanik.in",
    from: "notification@fuelauditor.com",
    subject: "Test",
    html: "html",
    attachments: [
        {
            filename: "test.pdf",
            type: "application/pdf",
            content: Buffer.from(req.body, 'base64')
        }
    ]
});
    res.json({ message: "Successfully uploaded files" });
}*/
//app.use(express.static(__dirname, 'invoices'));
/*app.get('/invoices', (req, res)=>{
  invoices.find()
  .then((invoices) => {
    return res.json({status: 'OK', images});
  }
  )
})*/
/**********Upload PDF file************/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

//create a cors middleware
app.use(function(req, res, next) {
  //set headers to allow cross origin request.
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
  });
  app.use(cors({
    origin: 'http://fuelauditorfrontend.s3-website.ap-south-1.amazonaws.com'
}));
 
//Sever port and listen config
  // http.createServer(app).listen(4540); 
    const server = http.createServer(app);
    server.listen(process.env.PORT || 3000);
  
  //SOCKET Initiated and streamin image file at root
//     const io = require('./socket').init(server);
//   io.on('connection', socket => {
//     console.log('Client connected');
//   }); 
//  console.log('Server started on port 4540');
 
//  //streaming img file over socket
//  io.on('connection', function (socket) { 
//   var readStream = fs.createReadStream(path.resolve(__dirname, './jay.jpg'), { encoding: 'binary'     }), chunks = []; 

//   readStream.on('readable', function () { 
//     console.log('Image loading');     
//   });  

//   readStream.on('data', function (chunk) { 
//     chunks.push(chunk); 
//     socket.emit('img-chunk', chunk);     
//   });  

//   readStream.on('end', function () { 
//     console.log('Image loaded');     
//   }); 
// });
