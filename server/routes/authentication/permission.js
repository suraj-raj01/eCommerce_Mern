const express = require("express");
const route = express.Router();
const permissionController = require("../../controllers/authentication/permissionController");

route.post("/createpermission",permissionController.createPermission)
route.get("/getpermission",permissionController.getPermission)
route.delete("/deletepermission/:id",permissionController.deletePermission)
route.patch("/updatepermission/:id",permissionController.updatePermission)
route.post("/searchpermission/:id",permissionController.searchPermission)

module.exports = route;