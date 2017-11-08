var express = require('express');
var router = express.Router();
var path = require('path');
var phantom = require('phantom-render-stream');
var fs = require('fs');
var render = phantom();
var nodemailer = require('nodemailer');
var db = require('../models');



router.getInvoiceData = function (client_id, res, layout, url) {

    db.Client.findAll({
        include: [
            {
                model: db.Project,
            }
        ],
        where: {
            client_id: client_id
        }
    }).then(function (rows) {
        var total = 0;
        //console.log(JSON.stringify(rows[0].Projects));
        //sum ext_amt for every row 
        rows[0].Projects.map(function (row) {
            row.ext_amt = row.rate * row.hours;
            total += row.ext_amt;
            row.ext_amt = router.currency(row.ext_amt);
        });
        total = router.currency(total);

        var option = {
            'client_id': client_id,
            'projects': rows[0].Projects,
            'invoice_total': total,
            'company_name': rows[0].company_name,
            'contact_person': rows[0].contact_person,
            'mailing_address': rows[0].mailing_address,
            'email_address': rows[0].email_address,
            'phone': rows[0].phone,
        };
        if (!layout) {
            option.layout = false;
        }
        res.render(url, option);
    });
};


//generate and display invoice for client
router.get('/:id', function (req, res, next) {
    router.getInvoiceData(req.params.id, res, true, 'invoice/invoice');
});


//generate actual invoice without GUI
router.get('/inv/:id', function (req, res, next) {
    router.getInvoiceData(req.params.id, res, false, 'invoice/invoicePrint');
});


//generate pdf invoice to path
router.get('/pdf/:id', function (req, res, next) {
    var destination = fs.createWriteStream('invoice.pdf');
    destination.addListener('finish', () => {
        let fp = path.join(__dirname, '../invoice.pdf');

        db.Client.findOne({
            where: {
                client_id: req.params.id
            }
        }).then(function (row) {
            router.sendPdf(fp, row.email_address, row.company_name, row.contact_person, row.client_id, res);
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
router.sendPdf = function (pdfPath, emailAddress, companyName, contactPerson, client_id, res) {
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
};



//currency format function
router.currency = function (num) {
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
