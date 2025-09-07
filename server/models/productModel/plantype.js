const mongoose = require("mongoose");

const planTypeSchema = new mongoose.Schema({
    name:{type:Number},
    duration:{type:String},
    price:{type:String},
    currency:{type:String},
    description:{type:String},
    status: {type:Boolean}
}, { timestamps: true });

module.exports = mongoose.models.planType || mongoose.model("planType", planTypeSchema);
