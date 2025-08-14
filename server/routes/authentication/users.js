const express = require("express");
const route = express.Router();
const userController = require("../../controllers/authentication/userController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"), 
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)), 
});

const upload = multer({ storage });

route.post("/createuser",upload.single("profile"),userController.createUser)
route.get("/getuser",userController.getUsers)
route.get("/getuserbyid/:id",userController.getUserById)
route.post("/searchuser/:id",userController.searchUser)
route.patch("/updateuser/:id",upload.single("profile"),userController.updateUser)
route.delete("/deleteuser/:id",userController.deleteUser)
route.post("/login",userController.userLogin)
module.exports = route;