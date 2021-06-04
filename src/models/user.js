const valid = require('validator'),
    mgoose = require('mongoose'),
    //chalk = require('chalk'),
    bcrypt = require('bcryptjs'),
    task = require('./task');

const userSch = new mgoose.Schema({
    name: {
        required: true,
        type: String,
        minlength: 1,
        trim: true
    },
    email: {
        unique: true,
        required: true,
        type: String,
        validate(val) {
            if (!valid.isEmail(val))
                throw new Error(chalk.red('Invalid email provided!'));
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(val) {
            if (valid.contains(val.toLowerCase(), 'password'))
                throw new Error(chalk.orange('Invalid password provided!'));
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSch.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
});

userSch.statics.findByCredentials = async (email, password) => {
    const User = await user.findOne({ email });
    if (!User)
        return;

    if (!(await bcrypt.compare(password, User.password)))
        return;

    return User
};

userSch.pre('remove', async function (next) {
    await task.deleteMany({ owner: this._id });
    next();
});

userSch.pre('save', async function (nxt) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8);
    nxt();
});

const user = mgoose.model('user', userSch);
module.exports = user;