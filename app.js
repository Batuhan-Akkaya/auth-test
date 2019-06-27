const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const middleware = require('./middlewares');
const auth = require('./routes/auth');

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-test', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

mongoose.connect('mongodb://localhost/passport-test', { useNewUrlParser: true });

require('./models/user');
require('./config/passport');
const userAuthorisation = require('./config/userAuthorisation')(app);
app.use(require('./routes'));

app.get('/admin', [auth.required, userAuthorisation.can('access_private')], (req, res) => res.send('test') );



//Error handlers & middlewares
app.use(middleware.errorHandler);

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));
