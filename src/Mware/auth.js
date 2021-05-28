const user = require('../models/user.js'), jwt = require('jsonwebtoken'), chalk = require('chalk');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''),
            dcode = jwt.verify(token, 'tasks-api09'),
            User = await user.findOne({ _id: dcode._id, tokens: token });

        if (!User)
            throw new Error(chalk.yellow('User not found!'));
        req.user = User;
        req.token = token;
        next();
    }
    catch (e) {
        console.log(chalk.yellow(1, e));
        res.status(401).send('Authenticate!');
    }
};

module.exports = auth;