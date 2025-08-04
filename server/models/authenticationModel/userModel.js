const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email:{
    type: String,
    require: true,
  },
  password:{
    type: String,
    require: true,
  },
  profile:{
    type: String,
    require: true,
  },
  roleId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      require: false,
    },
  ],
});

module.exports = mongoose.models.users || mongoose.model("users", userSchema);
