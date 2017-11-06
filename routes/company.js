var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/logos' });
var db = require('../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


//add new client company
router.get('/add', function (req, res, next) {
    res.render('company/add');
});

//enter details for new client company
router.post('/add', upload.single('logo'), function (req, res, next) {

    // Check Image Upload
    if (req.file) {
        var logo = req.file.filename;
    } else {
        var logo = 'NoLogo.jpg';
    }

    var client = {
        client_id: req.body.client_id,
        company_name: req.body.company_name,
        contact_person: req.body.contact_person,
        email_address: req.body.email_address,
        phone: req.body.phone,
        mailing_address: req.body.mailing_address,
        logo: logo
    };

    db.Client.create(client).then(function (row) {
        res.redirect('/company/profile/' + client.client_id);
    }).catch(function (error) {
        console.log(error);
    });

});

//display company info to edit
router.get('/update/:client_id', function (req, res, next) {

    db.Client.findOne({
        where: {
            client_id: req.params.client_id
        },
    }).then(function (row) {
        res.render('company/edit', {
            'client': row
        });
    });

});

//update details for new client company
router.post('/save', upload.single('logo'), function (req, res, next) {

    var client = {
        company_name: req.body.company_name,
        contact_person: req.body.contact_person,
        email_address: req.body.email_address,
        phone: req.body.phone,
        mailing_address: req.body.mailing_address
        //do  not add logo to reset by default
    };
    //add only if logo uploaded
    if (req.file) {
        client.logo = req.file.filename;
    }

    db.Client.update(
        req.body,
        {
            where: {
                client_id: req.body.client_id
            }
        }).then(function () {
            res.redirect('/company/profile/' + req.body.client_id);
        });
});


//delete client company
router.delete('/delete/:idOfrecord', (req, res) => {
    
    db.Client.destroy({
        where: {
            client_id: req.params.idOfrecord
        }
    }).then(function (dbClient) {
        res.json(dbClient);
    });

});


//display company profile 
router.get('/profile/:id', function (req, res, next) {

    db.Client.findOne({
        where: {
            client_id: req.params.id
        }
    }).then(function (row) {
        res.render('company/profile', {
            'clients': row
        });
    });
});


//search bar
router.get('/search', function (req, res, next) {
    var term = req.query.term;
    console.log('Search Term = ' + term);
    
    db.Client.findAll({
        attributes: ['company_name', 'client_id'],
        where: {
            company_name: {
                [Op.like]: '%' + term + '%'
            }
        }
    }).then(function (rows) {
        var list = [];
        //map is similar to foreach
        rows.map(function (row) {
            list.push({ value: row.client_id, label: row.company_name });
        });
        res.json(list);
    });
});



module.exports = router;
