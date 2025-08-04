const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  permission: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.models.permissions || mongoose.model("permissions", permissionSchema);
