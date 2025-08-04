const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  permissionId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "permissions",
      require: false,
    },
  ],
});

module.exports = mongoose.models.roles || mongoose.model("roles", roleSchema);
