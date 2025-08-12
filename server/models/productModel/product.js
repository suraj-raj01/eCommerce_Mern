const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: false,
    },
  ],
},
{ timestamps: true });

module.exports = mongoose.models.products || mongoose.model("products", productSchema);
