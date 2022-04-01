const fetch = require('node-fetch');


const Price = require('../models/dailyprices.js');
module.exports = {

getPrice : (res, next) => {
fetch("https://daily-fuel-prices-india.p.rapidapi.com/api/ioc/states/MAH",
{ 
 method : 'GET',
 headers : {
	"x-rapidapi-host": "daily-fuel-prices-india.p.rapidapi.com",
	"x-rapidapi-key": "74250d8118msh030e3c7a54936b5p167a4fjsn722f471b05d4",
	"useQueryString": true
}
}).then(res => res.json()).then( json =>
	console.log(json));  
}
}


// .then(res => res.json()).then( json =>
// console.log(json));


// const ioclprice = new Price(res.body);
// ioclprice.save().then( result => { 
// 	console.log(result)
// })



//     const prices = new Price(res.body);


//     prices.save()
//     .then(result => {
//        console.log(result);
//       res.json({ message: 'Daily IOCL prices imported'});
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });

// 	// console.log(res.body);
// });

