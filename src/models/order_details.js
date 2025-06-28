const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    securityDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'security_details', // FK to SECURITY_DETAIL
        required: true
    },
    orderRefNo: {
        type: String,
        required: true,
        unique: true
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
        required: true
    },
    transactionType: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    orderValue: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_login_details',
        required: true
    }
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema);
