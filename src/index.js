require('mongoose').connect('mongodb://127.0.0.1:27017/tasks-api', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const exp = require('express'),
    chalk = require('chalk');

const app = exp(), port = process.env.PORT || 3000;

app.use(exp.json()),
    app.use(require('./routes/user')),
    app.use(require('./routes/task'));

app.listen(port, () => console.log(chalk.blue('Started the express server on port ' + port)));