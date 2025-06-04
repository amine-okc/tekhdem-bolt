const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    sector: {
        type: Schema.Types.ObjectId,
        ref: 'Sector'
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);