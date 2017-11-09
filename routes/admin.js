var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/portfolio' });
var db = require('../models');



//update with edits to project detail
router.post('/edit', upload.single('project_file'), function (req, res, next) {

    // Get Form Values
    var project = {
        //names must match to sql db
        project_title: req.body.title,
        description: req.body.description,
        task: req.body.task,
        hours: req.body.hours,
        rate: req.body.rate,
        notes: req.body.notes,
        date: req.body.date
    };
    // Check Image Upload
    if (req.file) {
        project.image = req.file.filename
    }

    db.Project.update(
        project,
        {
            where: {
                id: req.body.id
            }
        }).then(function (row) {
            res.redirect('/admin/' + req.body.client_id);
        });
});


//delete record 
router.delete('/delete/:idOfrecord', (req, res) => {
    
    db.Project.destroy({
        where: {
            id: req.params.idOfrecord
        }
    }).then(function (dbProject) {
        res.end();
        //res.json(dbProject);
        console.log('Deleted ' + JSON.stringify(dbProject));
    });

});



//display list of tasks of a client
router.get('/:client_id', function (req, res, next) {
   
    db.Client.findOne({
        where: {
            client_id: req.params.client_id,
        }
    }).then(function (row) {
        let clientId = row.id;
        let companyName = row.company_name;
        db.Project.findAll({
            where: {
                client_id: clientId
            }
        }).then(function (rows) {
            //change date format for presenation

            rows.map(function (e) {
                e.ext_amt = e.hours * e.rate;
                e.client_id = req.params.client_id;
            });
            res.render('admin/index', {
                'client_id': req.params.client_id,
                'projects': rows,
                'id': clientId,
                'company_name': companyName
            });
        });
    });
});


//route to add task for a Client ID
router.get('/add/:client_id', function (req, res, next) {
    res.render('admin/index', {
        'client_id': req.params.client_id,
        'date': new Date().toISOString().slice(0, 10)
    });
});


//enter details for new task add for a Client ID
router.post('/index/:client_id', function (req, res, next) {

    var project = {
        project_title: req.body.title,
        date: req.body.date,
        task: req.body.task,
        description: req.body.description,
        hours: req.body.hours,
        rate: req.body.rate,
        notes: req.body.notes,
        client_id: req.body.clientId
    };

    db.Project.create(project).then(function (dbClient) {
        res.redirect('/admin/' + req.params.client_id);
    }).catch(function (error) {
        console.log(error);
    });
});

module.exports = router;
