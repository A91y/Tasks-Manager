const mgoose = require('mongoose');

const taskSch = new mgoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    info: { type: String },
    status: {
        type: Boolean,
        required: true
    }
});
taskSch.pre('save', async function (nxt) {
    nxt();
});

const task = mgoose.model('task', taskSch);

module.exports = task;