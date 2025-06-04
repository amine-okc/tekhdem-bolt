const mongoose = require('mongoose');

const { Schema } = mongoose;

const jobOfferSchema = new Schema({
    title: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    required_skills: [{
        type: Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    address: {
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
    },
    contractType: {
        type: String,
        enum: ['cdi', 'cdd', 'freelance', 'internship'],
        required: true
    },
    experienceLevel: {
        type: Number,
        enum: [1, 2, 3], // 1: Junior, 2: Mid-level, 3: Senior
        required: true
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
    startAt: {
        type: Date,
        required: true
    },
    endAt: Date,
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: [String],
    trendingScore: {
        type: Number,
        default: 0
    },
    socialShares: {
        type: Map,
        of: Number,
        default: {}
    }
}, {
    timestamps: true
});

const JobOffer = mongoose.model('JobOffer', jobOfferSchema);

module.exports = JobOffer;