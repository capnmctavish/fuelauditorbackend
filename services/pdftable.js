var PdfTable = require('voilab-pdf-table'),
    PdfDocument = require('pdfkit');

module.exports = {
    create: function () {
        // create a PDF from PDFKit, and a table from PDFTable
        var pdf = new PdfDocument({
                autoFirstPage: false
            }),
            table = new PdfTable(pdf, {
                bottomMargin: 30
            });

        table
            // add some plugins (here, a 'fit-to-width' for a column)
            .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
                column: 'description'
            }))
            // set defaults to your columns
            .setColumnsDefaults({
                headerBorder: 'B',
                align: 'right'
            })
            // add table columns
            .addColumns([
                {
                    id: 'vehicleNumb',
                    header: 'Vehicle Number',
                    align: 'left'
                },
                {
                    id: 'fuelTTyp',
                    header: 'Fuel Type',
                    width: 50
                },
                {
                    id: 'fuelqty',
                    header: 'Quantity',
                    width: 40
                },
                {
                    id: 'total',
                    header: 'Total',
                    width: 70,
                    /*renderer: function (tb, data) {
                        return 'CHF ' + data.total;
                    }*/ 
                }
            ])
            // add events (here, we draw headers on each new page)
            .onPageAdded(function (tb) {
                tb.addHeader();
            });

        // if no page already exists in your PDF, do not forget to add one
        pdf.addPage();

        // draw content, by passing data to the addBody method
        resultData.transactions.forEach(element => {
            //totalPrice += element.fuelqty * element.total;
        table.addBody([
            
            {vehicleNumb: element.vehicleNumb , fuelTTyp: element.fuelTTyp, fuelqty: element.fuelqty, total: element.total}
        ]);
    });

        return pdf;
    }
};