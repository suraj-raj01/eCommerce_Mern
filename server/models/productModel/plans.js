const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    logo:{type:String},
    title:{type:String},
    subtitle:{type:String},
    price:{type:Number},
    bilingcycle:{type:String},
    plantype:{type:String},
    buttontext:{type:String},
    buttonlink:{type:String},
    description:{type:String},
    features:[{
        title:{type:String}
    }],
    visibility: {type:Boolean,default:true}
}, { timestamps: true });

module.exports = mongoose.models.plans || mongoose.model("plans", planSchema);
