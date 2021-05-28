const exp = require('express'), user = require('../models/user'), chalk = require('chalk');
const Router = new exp.Router(), jwt = require('jsonwebtoken'), auth = require('../Mware/auth.js');

Router.post('/users', async (req, res) => {
    try {
        let User = await user.findOne({ 'email': req.body.email });
        if (User)
            return res.status(201).send('User by this email already exists. Try logging in.');
        User = new user(req.body);

        const token = jwt.sign({ _id: User._id.toString() }, 'tasks-api09');
        User.tokens.push(token);

        await User.save();

        res.status(200).send({ User, token });
    }
    catch (e) {
        console.log(chalk.yellow(1, e));
        res.status(404).send();
    }
    // User.save().then(() => res.send(User)).catch((e) => res.status(404).send(e));
});

Router.post('/users/login', auth, async (req, res) => {
    try {
        const User = req.user;
        console.log(User.tokens);
        res.status(200).send(User);
    }
    catch (e) {
        console.log(chalk.yellow(6, e));
        res.status(500).send();
    }
});

Router.get('/users/me', auth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    }
    catch (e) {
        console.log(chalk.yellow(2, e));
        res.status(500).send();
    }
    //user.find({}).then((data) => res.status(200).send(data)).catch(() => res.status(500).send());
});

Router.get('/users/:id', async (req, res) => {
    try {
        const data = await user.findById(req.params.id);
        if (!data)
            res.status(404).send();
        else
            res.status(200).send(data);
    }
    catch (e) {
        console.log(chalk.yellow(3, e));
        res.status(500).send();
    }
});

Router.patch('/users/:id', async (req, res) => {
    const allowed = ['name', 'email', 'password'], updates = Object.keys(req.body);

    if (!updates.every((data) => allowed.includes(data)))
        return res.status(505).send(chalk.red('Wrong user data!'));
    try {
        const User = await user.findById(req.params.id);
        updates.forEach((update) => User[update] = req.body[update]);
        //const data = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const data = await User.save();
        if (data)
            res.status(200).send(data);
        else
            res.status(404).send();
    }
    catch (e) {
        console.log(chalk.yellow(4, e));
        res.status(500).send();
    }
});

Router.delete('/users/:id', async (req, res) => {
    try {
        const data = await user.findByIdAndDelete(req.params.id);
        if (data)
            res.status(200).send(data);
        else
            res.status(400).send();
    }
    catch (e) {
        console.log(chalk.yellow(5, e));
        res.status(500).send();
    }
});

module.exports = Router;