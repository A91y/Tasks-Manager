const user = require('../models/user'),
    jwt = require('jsonwebtoken'),
    chalk = require('chalk');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''),
            dcode = await jwt.verify(token, 'tasks-api09'),
            User = await user.findOne({ _id: dcode._id, 'tokens.token': token });

        if (!User)
            throw new Error(chalk.red('User not found!'));
        req.user = User;
        req.token = token;
        next();
    }
    catch (e) {
        console.log(chalk.red(1, e));
        res.status(401).send('Authenticate!');
    }
};

module.exports = auth;