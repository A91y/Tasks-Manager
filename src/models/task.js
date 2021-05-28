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
    },
    owner: {
        type: mgoose.Schema.Types.ObjectId,
        required: true,
        //ref: 'user'
    }
});
taskSch.pre('save', async function (nxt) {
    nxt();
});

const task = mgoose.model('task', taskSch);

module.exports = task;