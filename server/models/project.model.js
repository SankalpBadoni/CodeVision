import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "No description provided"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    files: {
        type: Object,
        required: true
    },
    messages: {
        type: Array,
        default: []
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: []
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

projectSchema.index({ userId: 1 });
projectSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Project = mongoose.model('Project', projectSchema);

export default Project; 