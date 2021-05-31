const mgoose = require('mongoose');

const task = mgoose.model('task', {
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
        ref: 'user'
    }
});

module.exports = task;