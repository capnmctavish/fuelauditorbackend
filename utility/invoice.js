async function uploadFile(invoicename, pdfBody){
    const invoiceName = invoicename;
    pdf = pdfBody;
try{
const response = await drive.files.create({
  requestBody: {
    name: invoiceName,
    mimeType: 'application/pdf'
  },
  media: {
    mimeType: 'application/pdf',
    body: pdf
  }
})
//console.log(response.data.id);
const abc =  response.data.id;
console.log(abc);
await drive.permissions.create({
  fileId: abc,
  requestBody: {
    role: 'reader',
    type: 'anyone'
  }
})
const result = await drive.files.get({
  fileId: abc,
  fields: 'webViewLink, webContentLink'
})
const invoiceLink = result.data.webViewLink;
inv = result.data.webViewLink;
//console.log(invoiceLink);

/*}
catch (error) {
  console.log(error.message);
}*/

console.log(cId);
console.log(inv);
}
catch (error) {
console.log(error.message);
}
}


/*
try{
CreditCustomer.findOneAndUpdate({ "_id" : cId }, { $set : {
  invoice: result.data.webViewLink
}})
}
catch(error) {
console.log(error.message);
}
uploadFile();
try{
CreditCustomer.updateOne({ "_id" : cId }, { $set : {
  invoice: inv
}})
}
catch(error) {
console.log(error.message);
}*/