const mongoose = require('mongoose');

const auditActionSchema = new mongoose.Schema({
    userLoginDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_login_details', // FK to USER_LOGIN_DETAIL
        required: true
    },
    userAction: {
        type: String,
        required: true
    },
    startDateTime: {
        type: Date,
        default: Date.now
    },
    endDateTime: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('AuditAction', auditActionSchema);
