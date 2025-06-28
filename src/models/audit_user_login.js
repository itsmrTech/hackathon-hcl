const mongoose = require('mongoose');

const auditUserLoginSchema = new mongoose.Schema({
    userLoginDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_login_details', // FK to USER_LOGIN_DETAIL
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    loginStatus: {
        type: String,
        enum: ['SUCCESS', 'FAILED'], // You can customize as needed
        required: true
    },
    loginDateTime: {
        type: Date,
        default: Date.now
    },
    logoutDateTime: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('AuditUserLogin', auditUserLoginSchema);
