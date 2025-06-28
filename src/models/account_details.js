const mongoose = require('mongoose');

const accountDetailSchema = new mongoose.Schema({
    userLoginDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_login_details', // FK to USER_LOGIN_DETAIL
        required: true
    },
    credit: {
        type: Number,
        default: 0
    },
    debit: {
        type: Number,
        default: 0
    },
    runningBalance: {
        type: Number,
        default: 10000 // default to $10,000
    },
    orderDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order_details', // FK to ORDER_DETAIL
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_login_details', // FK to USER_LOGIN_DETAIL
        required: true
    }
});

module.exports = mongoose.model('AccountDetail', accountDetailSchema);
