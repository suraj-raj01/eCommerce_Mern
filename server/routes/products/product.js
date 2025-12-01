const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../../controllers/products/productController.js");
// const { protect, authorize } = require("../middleware/authMiddleware.js");
const upload = require('../../middleware/uploadMiddleware.js');


router.route("/")
  // .post(protect, authorize("admin", "seller"), upload.array("images", 5), createProduct)
  .post(upload.array("images", 15), createProduct)
  .get(getProducts);       // Get all products

router.route("/:id")
  .get(getProductById)     // Get one product
  // .put(protect, authorize("admin", "seller"), upload.array("images", 5), updateProduct)
  .put(upload.array("images", 15), updateProduct)
  // .delete(protect, authorize("admin"), deleteProduct);
  .delete(deleteProduct);  // Delete

module.exports = router;
