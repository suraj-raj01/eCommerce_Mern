const express = require("express");
const route = express.Router();
const roleController = require("../../controllers/authentication/roleController");

route.post("/createrole",roleController.createRole)
route.get("/getrole",roleController.getRole)
route.delete("/deleterole/:id",roleController.deleteRole)
route.patch("/updaterole/:id",roleController.updateRole)
route.post("/searchrole/:id",roleController.searchRole)

module.exports = route;