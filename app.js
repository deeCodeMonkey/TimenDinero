var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var multer = require('multer');
//default destination directory for multer
var upload = multer({ dest: './public/images/logos' });
var db = require('./models');

var phantom = require('phantom-render-stream');
var fs = require('fs');
var render = phantom();

var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Middleware, body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Route Files
var routes = require('./routes/index');
var admin = require('./routes/admin');
var company = require('./routes/company');
var invoice = require('./routes/invoice');
app.use('/', routes);
app.use('/admin', admin);
app.use('/company', company);
app.use('/invoice', invoice);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT);
    });
});

