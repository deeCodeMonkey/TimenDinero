var express = require('express');
var router = express.Router();
var db = require('../models');
var Sequelize = require('sequelize');


//show all clients
router.get('/', function (req, res, next) {

    db.Client.findAll({
        order: ['company_name']
    }).then(function (rows) {
        res.render('index', {
            'clients': rows,
        })
    });
});



//display all clients with their projects
router.get('/api', function (req, res, next) {
    
    db.Client.findAll({
        include: [db.Project],
    }).then(function (rows) {
        res.json(rows);
        });
});



module.exports = router;
