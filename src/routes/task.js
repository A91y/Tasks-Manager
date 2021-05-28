const exp = require('express'),
    task = require('../models/task'),
    auth = require('../Mware/auth');

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

Router.get('/tasks', async (req, res) => {
    try {
        const data = await task.find();
        res.status(200).send(data);
    }
    catch (e) {
        console.log(chalk.yellow(2, e));
        res.status(404).send();
    }
});

Router.get('/tasks/:id', async (req, res) => {
    try {
        const data = await task.findById(req.params.id);
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

Router.patch('/tasks/:id', async (req, res) => {
    const allowed = ['name', 'info', 'status'], updates = Object.keys(req.body);
    if (!updates.every((data => allowed.includes(data))))
        return res.status(505).send(chalk.red('Wrong task data!'));
    try {
        const Task = await task.findById(req.params.id);
        updates.forEach((up) => Task[up] = req.body[up]);
        await Task.save();
        if (Task)
            res.status(200).send(Task);
        else
            res.status(400).send();
    }
    catch (e) {
        console.log(chalk.yellow(4, e));
        res.status(500).send();
    }
});

Router.delete('/tasks/:id', async (req, res) => {
    try {
        const data = await task.findByIdAndDelete(req.params.id);
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