const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({
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
        required: true,
        unique: true
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
    },

});

module.exports = mongoose.model('UserDetail', userDetailSchema);
