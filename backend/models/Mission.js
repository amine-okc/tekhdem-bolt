const mongoose = require('mongoose');
const { Schema } = mongoose;

const missionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    location: {
        line1: {
            type: String
        },
        line2: {
            type: String
        },
        zipCode: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: (v) => Array.isArray(v) && v.length === 2,
                message: 'Coordinates must be an array of [latitude, longitude]'
            }
        }
    },
    salaryHour: {
        type: Number,
        required: true
    },
    schedule: [{
        date: {
            type: Date,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    }],
    skills: [{
        type: Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    requirements: {
        type: String
    },
    educationLevel: {
        type: String,
        enum: ['aucun', 'CAP/BEP', 'Bac', 'Bac+2', 'Bac+3', 'Bac+5', 'Doctorat'],
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Mission', missionSchema);