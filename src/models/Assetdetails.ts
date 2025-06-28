import mongoose from 'mongoose';

const assetDetailSchema = new mongoose.Schema({
    securityName: { type: String, required: true },
    assetType: { type: String, required: true }, // e.g., Mutual Fund, Stock
    isin: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const AssetDetail = mongoose.model('AssetDetail', assetDetailSchema);
