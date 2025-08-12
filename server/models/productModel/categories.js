const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    categoryimg: {
        type: String,
        required: false, 
        trim: true
    },
    subcategories: [
        {
            name: { type: String, required: true, trim: true },
            image: { type: String, trim: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);
