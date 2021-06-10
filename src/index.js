require('mongoose').connect(process.env.MONGO_PORT, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const exp = require('express'),
    hbs = require('hbs'),
    path = require('path');

const publicPath = path.join(__dirname, '../public'),
    viewPath = path.join(__dirname, 'templates/views'),
    partialPath = path.join(__dirname, 'templates/partials');

const app = exp();

app.set('view engine', 'hbs'),
    app.set('views', viewPath),
    hbs.registerPartials(partialPath);

app.use(exp.json()),
    app.use(require('./routes/user')),
    app.use(require('./routes/task')),
    app.use(exp.static(publicPath)),
    app.use(require('body-parser').urlencoded({ extended: false }));

app.get('', (req, res) => res.render('index.hbs')),
    app.get('/about', (req, res) => res.render('about.hbs'));

app.listen(process.env.PORT);