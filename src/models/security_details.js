const mongoose = require('mongoose');

const securityDetailsSchema = new mongoose.Schema({
    securityDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'security_details', // FK to SECURITY_DETAIL
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('SecurityDetails', securityDetailsSchema);
