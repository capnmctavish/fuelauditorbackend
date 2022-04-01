const express = require('express');
const creditcontroller = require('../controllers/creditCustomerController');
const router = express.Router();
const {roles} = require('../middleware/auth');
const Resize = require('../Resize');
router.get('/getcustomerdetails', creditcontroller.customerDetails);

//************** CREDIT CUSTOMER ROUTES ****************************//
router.post('/addcustomer', creditcontroller.createCustomer);
router.post('/deletecustomer', creditcontroller.deleteCustomer);
router.post('/updatecustomer', creditcontroller.updatecustomer);
router.post('/addpayment', creditcontroller.addPayment);

//************** CREDIT CUSTOMER TRANSACTIONS ****************************//
router.post('/updatetransactions', creditcontroller.updateTransactions);
router.post('/gettransactions', creditcontroller.getTransaction);
router.post('/getcustomerlist', creditcontroller.customerList);
router.post('/getinvoice', creditcontroller.createInvoice);
router.post('/getvehicles', creditcontroller.getVehicles);
router.post('/newtransactions', creditcontroller.newTransaction);
router.post('/deletetransaction', creditcontroller.deleteTransaction);
router.post('/deletevehicle', creditcontroller.deleteVehicles);
router.post('/testing', creditcontroller.test);
router.post('/getcreditcustomers', creditcontroller.creditCustomer);

//router.get('/payment', creditcontroller.payment);

router.post('/mail', creditcontroller.mail);
router.post('/upload_files', creditcontroller.uploadFiles);
router.get('/week', creditcontroller.weekFilter);
router.post('/julyCM', creditcontroller.JulyCMFilter);
router.get('/juneCM', creditcontroller.JuneCMFilter);
router.get('/mayCM', creditcontroller.MayCMFilter);
router.get('/aprilCM', creditcontroller.AprilCMFilter);
router.get('/marchCM', creditcontroller.MarchCMFilter);
router.get('/febCM', creditcontroller.FebCMFilter);
router.get('/janCM', creditcontroller.JanCMFilter);
router.get('/decLM', creditcontroller.DecLMFilter);
router.get('/novLM', creditcontroller.NovLMFilter);
router.get('/octLM', creditcontroller.OctLMFilter);
router.get('/septLM', creditcontroller.SeptLMFilter);
/*router.post('/month', creditcontroller.monthFilter);
router.post('/year', creditcontroller.yearFilter);*/
/**********UPLOAD**********/
/*router.post('/upload', upload.single('file'), async function (req, res) {
    const imagePath = path.join(__dirname, '/uploads');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      res.status(401).json({error: 'Please provide an image'});
    }
    const filename = await fileUpload.save(req.file.buffer);
    return res.status(200).json({ name: filename });
  });
  */

  var toBuffer = require('blob-to-buffer');
  var multer = require('multer');
  /*var imageBuffer = request.file.buffer;
  var imageName = 'public/invoices/invoice.pdf';
  
  fs.createWriteStream(imageName).write(imageBuffer);*/
 /* var readBlob = require('read-blob');
  readBlob(file, 'dataurl', function (err, dataurl) {
    if (err) throw err;
  
    console.log('that was simple!');
    file.src = dataurl;
  });
  var reader = new FileReader();

  reader.onload = function (res) {
    console.log('that was not so simple!');
    file.src = dataurl;
  }
  
  reader.onend = function (err) {
    throw err;
  }
  
  reader.onabort = function (err) {
    throw err;
  }
  
  reader.readAsDataURL(blob);
*/
  const storage = multer.diskStorage({
  

/*reader.onload = function (res) {
  console.log('that was not so simple!');
  img.src = dataurl;
}*/
    destination: (req, file, cb) => {
      console.log(file);
     // var blob = new Blob([ new Uint8Array([1, 2, 3]) ], { type: 'application/pdf' })
     /* toBuffer(file, function (err, buffer) {
        if (err) throw err
       
        buffer[0] // => 1
        buffer.readUInt8(1) // => 2
      })*/
        cb(null, DIR );
    },
    filename: (req, file, cb) => {
       // console.log(file);
        //cb(null, Date.now() + "-" + file.originalname)//path.extname(file.originalname));
        cb(null, file.fieldname + '-' + Date.now() + '.pdf')
    }
  });
  
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({storage: storage}).single('file');
/* GET home page. */

/*router.get('/', function(req, res, next) {
// render the index page, and pass data to it.
  res.render('index', { title: 'Express' });
});*/

//our file upload function.
router.post('/upload', function (req, res, next) {
     var path = '';
     
     upload(req, res, function (err) {
        if (err) {
          // An error occurred when uploading
          console.log(err);
          return res.status(422).send("an Error occured")
        }  else {
       // No error occured.
       //var blob = (file, { type: 'application/pdf' })
     
       path = req.file;
        return res.send("Upload Completed for "+path); 
        
        }
  });     
})

module.exports = router;