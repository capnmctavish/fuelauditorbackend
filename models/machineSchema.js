const mongoose = require('mongoose');

const Schema = mongoose.Schema ;

const readingSchema = new Schema ({
    start : Number,//dont change working now
    end : Number,
    test : Number,
    // nozzleId : {
    //  type : Schema.Types.ObjectId,
    //  ref : 'Nozzle'
    // }
 },
 {
  timestamps : true
 });

 const nozzleSchema = new Schema ({
    nozzle : { type : String } ,
    fueltype : { type : String },
    reading : [ readingSchema ]
    //dont change working now
  });

const machineSchema = new Schema ({
  //  machineId : {
  //   type : Schema.Types.ObjectId,
  //   required : true
  // },

    machine : {
        type : String
      },
    modelno : {
      type : String
    },
    serialno : {
      type : String
    },
    mfgyear : 
    { type : Date},
    pumpId : {
      type : Schema.Types.ObjectId,
      ref : 'Pumps'
             },
  tenantId : {
      type: Schema.Types.ObjectId,
      ref : 'User'
          },
          
    //dont change working now
  nozzles : [nozzleSchema]  //should only accept 4 nozzles per machine
 
  
},
{
    timestamps : true
});

module.exports = mongoose.model('Machine', machineSchema);
// module.exports = mongoose.model('Nozzle', nozzleSchema);
// module.exports = mongoose.model('Reading', readingSchema);
//type: mongoose.Schema.Types.ObjectId, ref: 'Nozzle'