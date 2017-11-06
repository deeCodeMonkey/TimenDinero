var express = require('express');
var router = express.Router();
var path = require('path');
var phantom = require('phantom-render-stream');
var fs = require('fs');
var render = phantom();
var nodemailer = require('nodemailer');
var db = require('../models');


//generate and display invoice for client
router.get('/:id', function (req, res, next) {
    /*
    connection.query('SELECT * FROM projects INNER JOIN clients ON projects.client_id = clients.client_id WHERE projects.client_id = ? ORDER BY project_title', req.params.id, (err, rows, fields) => {
        if (err) throw err;

        var total = 0;
        console.log(rows);
        //sum ext_amt for every row 
        rows.map(function (row) { total += row.ext_amt; });
        total = currency(total);

        res.render('invoice/invoice', {
            'client_id': req.params.id,
            'projects': rows,
            'invoice_total': total,
            'company_name': rows[0].company_name,
            'contact_person': rows[0].contact_person,
            'mailing_address': rows[0].mailing_address,
            'email_address': rows[0].email_address,
            'phone': rows[0].phone
        });   
    });
    */
    Project.findAll({
        include: [
            {
                model: Client,
                required: true
            }
        ]
    }).then(function (rows) {
        var total = 0;
        console.log(rows);
        //sum ext_amt for every row 
        rows.map(function (row) { total += row.ext_amt; });
        total = currency(total);

        res.render('invoice/invoice', {
            'client_id': req.params.id,
            'projects': rows,
            'invoice_total': total,
            'company_name': rows[0].company_name,
            'contact_person': rows[0].contact_person,
            'mailing_address': rows[0].mailing_address,
            'email_address': rows[0].email_address,
            'phone': rows[0].phone
        });
    });
});


//generate actual invoice without GUI
router.get('/inv/:id', function (req, res, next) {
    /*
    connection.query('SELECT * FROM projects INNER JOIN clients ON projects.client_id = clients.client_id WHERE projects.client_id = ? ORDER BY project_title', req.params.id, (err, rows, fields) => {
        if (err) throw err;

        var total = 0;
        console.log(rows);
        //sum ext_amt for every row 
        rows.map(function (row) { total += row.ext_amt; });
        total = currency(total);

        res.render('invoice/invoicePrint', {
            'client_id': req.params.id,
            'projects': rows,
            'invoice_total': total,
            'company_name': rows[0].company_name,
            'contact_person': rows[0].contact_person,
            'mailing_address': rows[0].mailing_address,
            'email_address': rows[0].email_address,
            'phone': rows[0].phone,
            layout: false
        });
    });
    */
    Project.findAll({
        include: [
            {
                model: Client,
                required: true
            }
        ]
    }).then(function (rows) {
        var total = 0;
        console.log(rows);
        //sum ext_amt for every row 
        rows.map(function (row) { total += row.ext_amt; });
        total = currency(total);

        res.render('invoice/invoicePrint', {
            'client_id': req.params.id,
            'projects': rows,
            'invoice_total': total,
            'company_name': rows[0].company_name,
            'contact_person': rows[0].contact_person,
            'mailing_address': rows[0].mailing_address,
            'email_address': rows[0].email_address,
            'phone': rows[0].phone,
            layout: false
        });
    });
});


//generate pdf invoice to path
router.get('/pdf/:id', function (req, res, next) {
    var destination = fs.createWriteStream('invoice.pdf');
    destination.addListener('finish', () => {
        let fp = path.join(__dirname, '../invoice.pdf');

        /*
        connection.query('SELECT * FROM clients WHERE client_id=' +
            req.params.id, (err, rows, fields) => {
                sendPdf(fp, rows[0].email_address, rows[0].company_name, rows[0].contact_person, rows[0].client_id, res);
            });
    });
        */
        db.Client.findOne({
            where: {
                client_id: req.params.id
            }
        }).then(function (rows) {
            sendPdf(fp, rows[0].email_address, rows[0].company_name, rows[0].contact_person, rows[0].client_id, res);
        });
});


render('http://localhost:8080/invoice/inv/' + req.params.id, {
    orientation: 'portrait',
    format: 'pdf',
    zoomFactor: 1,
    margin: '1cm',
    width: 1000,
}).pipe(destination);

});


//email pdf invoice
function sendPdf(pdfPath, emailAddress, companyName, contactPerson, client_id, res) {
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'testCo108@gmail.com',
                pass: 'testco888'
            }
        });
        // setup email data 
        let mailOptions = {
            from: " Time'nDinero <testCo108@gmail.com>",
            to: emailAddress + ', testCo108@gmail.com',
            subject: "Invoice for " + companyName,
            text: 'Please see your attached invoice. Prompt payment is appreciated. Thank you!',
            html: '<p><strong>Dear ' + contactPerson + ',<br/><br/> Please see your attached invoice. Prompt payment is appreciated!</strong></p> <br /> <a href="paypal.me/payDeidra">Please click here to pay via PayPal.<a /> <br /> <p>Thank you!</p>',
            attachments: [
                {
                    filename: 'invoice.pdf',
                    path: pdfPath
                }
            ]
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.redirect('/');
            }
            console.log('Message Sent: ' + info.response);
            res.redirect('/invoice/' + client_id);
        });
    });
}



//currency format function
var currency = function (num) {
    var str = num.toString();
    var decIndex = str.indexOf('.');
    if (decIndex === -1) {
        decIndex = str.length;
        str += '.00';
    }
    for (var i = decIndex - 3; i > 0; i -= 3) {
        str = str.slice(0, i) + "," + str.slice(i);
    }
    return str;
};



module.exports = router;
