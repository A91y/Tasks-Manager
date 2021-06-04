require('mongoose').connect(process.env.MONGO_PORT, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const exp = require('express');
//chalk = require('chalk');

const app = exp();

app.use(exp.json()),
    app.use(require('./routes/user')),
    app.use(require('./routes/task'));

app.listen(process.env.PORT);