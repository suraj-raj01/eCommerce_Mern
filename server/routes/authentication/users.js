const express = require("express");
const route = express.Router();
const userController = require("../../controllers/authentication/userController");

route.post("/createuser",userController.createUser)
route.get("/getuser",userController.getUsers)
route.patch("/updateuser/:id",userController.updateUser)
route.delete("/deleteuser/:id",userController.deleteUser)
route.post("/login",userController.userLogin)
module.exports = route;