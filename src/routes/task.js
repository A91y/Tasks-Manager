const exp = require('express'),
    task = require('../models/task'),
    auth = require('../Mware/auth'),
    chalk = require('chalk');

const Router = new exp.Router();

Router.post('/tasks', auth, async (req, res) => {
    const Task = new task({
        ...req.body, owner: req.user._id
    });

    try {
        await Task.save();
        const data = Task.toObject();
        delete data.owner;
        res.status(200).send(data);
    }
    catch (e) {
        console.log(chalk.yellow(1, e));
        res.status(404).send();
    }
    //Task.save().then(() => res.send(Task)).catch((e) => res.status(404).send());
});

Router.get('/tasks', auth, async (req, res) => {
    try {
        const sort = {}, match = {};

        if (req.query.sort) {
            const parts = req.query.sort.split('_');
            sort[parts[0]] = parts[1] == 'asc' ? 1 : -1;
        }

        if (req.query.status) {
            match.status = req.query.status == 'true';
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(200).send(req.user.tasks);
    }
    catch (e) {
        console.log(chalk.yellow(2, e));
        res.status(404).send();
    }
});

Router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const data = await task.findOne({ _id: req.params.id, owner: req.user._id });
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

Router.patch('/tasks/:id', auth, async (req, res) => {
    const allowed = ['name', 'info', 'status'], updates = Object.keys(req.body);

    if (!updates.every((data => allowed.includes(data))))
        return res.status(505).send(chalk.red('Wrong task data!'));

    try {
        const Task = await task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!Task)
            return res.status(404).send();
        updates.forEach((up) => Task[up] = req.body[up]);
        await Task.save();
        res.status(200).send(Task);
    }
    catch (e) {
        console.log(chalk.yellow(4, e));
        res.status(500).send();
    }
});

Router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const data = await task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
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