var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date
    }
});

var User = mongoose.model('userData', UserSchema);

module.exports = {
    User: User
}