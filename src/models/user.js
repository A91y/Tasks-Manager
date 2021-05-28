const valid = require('validator'), mgoose = require('mongoose'), chalk = require('chalk'), bcrypt = require('bcryptjs');

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
        type: String,
        required: true
    }]
});

/* userSch.methods.getToken = async function () {
    const tkn = jwt.sign({ _id: this._id.toString() }, 'tasks-api09');
    console.log(tkn);
    return tkn;
} */

/* userSch.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
}); */

userSch.statics.findByCredentials = async function (mail, pass) {
    const data = await this.findOne({ email: mail });
    if (!data) {
        console.log(chalk.red('email'));
        throw new Error();
    }
    if (!(await bcrypt.compare(pass, data.password))) {
        console.log(chalk.red('password'));
        throw new Error();
    }
    return data;
};

userSch.pre('save', async function (nxt) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8);
    nxt()
});

const user = mgoose.model('user', userSch);

module.exports = user;