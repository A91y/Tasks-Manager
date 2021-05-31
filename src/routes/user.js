const exp = require('express'),
    user = require('../models/user'),
    chalk = require('chalk'),
    jwt = require('jsonwebtoken'),
    auth = require('../Mware/auth.js');

const Router = new exp.Router();

Router.post('/users', async (req, res) => {
    try {
        let User = await user.findOne({ 'email': req.body.email });
        if (User)
            return res.status(201).send('User by this email already exists. Try logging in.');
        User = new user(req.body);

        User.tokens.push({ token: jwt.sign({ _id: User._id.toString() }, 'tasks-api09') });

        await User.save();

        const UserObj = User.toObject();
        delete UserObj.password, delete UserObj._id;

        res.status(200).send(UserObj);
    }
    catch (e) {
        console.log(chalk.yellow(1, e));
        res.status(404).send();
    }
    // User.save().then(() => res.send(User)).catch((e) => res.status(404).send(e));
});

Router.post('/users/login', async (req, res) => {
    try {
        const User = await user.findByCredentials(req.body.email, req.body.password);
        if (!User)
            res.status(404).send();
        else {
            User.tokens.push({ token: jwt.sign({ _id: User._id.toString() }, 'tasks-api09') });
            await User.save();
            const UserObj = User.toObject();
            delete UserObj.password, delete UserObj._id;
            res.status(200).send(UserObj);
        }
    }
    catch (e) {
        console.log(chalk.yellow(6, e));
        res.status(500).send();
    }
});

Router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tkn) => tkn.token != req.token);
        await req.user.save();
        res.status(200).send();
    }
    catch (e) {
        console.log(chalk.yellow(7, e));
        res.status(500).send();
    }
});

Router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    }
    catch (e) {
        console.log(chalk.yellow(8, e));
        res.status(500).send();
    }
});

Router.get('/users/me', auth, async (req, res) => {
    try {
        const User = req.user.toObject();
        delete User.password, delete User._id;
        res.status(200).send(User);
    }
    catch (e) {
        console.log(chalk.yellow(2, e));
        res.status(500).send();
    }
});

Router.patch('/users/me', auth, async (req, res) => {
    const allowed = ['name', 'email', 'password'], updates = Object.keys(req.body);

    if (!updates.every((data) => allowed.includes(data)))
        return res.status(500).send('Wrong user data!');
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);

        const data = (await req.user.save()).toObject();
        delete data.password, delete data._id;
        res.status(200).send(data);
    }
    catch (e) {
        console.log(chalk.yellow(4, e));
        res.status(500).send();
    }
});

Router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send(req.user);
    }
    catch (e) {
        console.log(chalk.yellow(5, e));
        res.status(500).send();
    }
});

module.exports = Router;