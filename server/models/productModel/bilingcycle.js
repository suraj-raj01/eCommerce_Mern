const mongoose = require("mongoose");

const bilingCycleSchema = new mongoose.Schema({
    name:{type:String},
    duration:{type:String},
    price:{type:String},
    currency:{type:String},
    description:{type:String},
    status: {type:Boolean}
}, { timestamps: true });

module.exports = mongoose.models.bilingcycle || mongoose.model("bilingcycle", bilingCycleSchema);
