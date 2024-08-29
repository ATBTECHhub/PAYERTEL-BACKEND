import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['info', 'warning', 'error'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const SystemLog = mongoose.model('systemLog', systemLogSchema);

export default SystemLog;
