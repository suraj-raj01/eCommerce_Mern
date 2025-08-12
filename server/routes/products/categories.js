const express = require("express");
const route = express.Router();
const productController = require("../../controllers/products/categories");

route.post("/createcategory",productController.createCategory)
route.get("/getcategory",productController.getCategory)
route.patch("/updatecategory/:id",productController.updateCategory)
route.delete("/deletecategory/:id",productController.deleteCategory)
route.get("/searchcategory/:id",productController.searchCategory)
route.get("/getcategorybyid/:id",productController.getCategoryById)
module.exports = route;