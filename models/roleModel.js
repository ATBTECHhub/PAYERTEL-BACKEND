import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: {
        type: [String], // Example: ['view_users', 'edit_users', 'delete_users']
        default: [],
    },
}, {
    timestamps: true
}
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
