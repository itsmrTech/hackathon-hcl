const mongoose = require('mongoose');

const userLoginDetailSchema = new mongoose.Schema({
    userDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_details', // references USER_DETAIL
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    userStatus: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'], // optional constraint example
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    },
    modifiedOn: {
        type: Date,
        default: null
    },
    modifiedBy: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('UserLoginDetail', userLoginDetailSchema);
