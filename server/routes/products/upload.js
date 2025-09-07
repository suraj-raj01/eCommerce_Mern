// routes/products/upload.js
const express = require("express");
const multer = require("multer");
const { uploadImage,uploadMultipleImages } = require("../../controllers/uploads/uploadImage");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadImage);
router.post("/multiple", upload.array("files", 10), uploadMultipleImages);

module.exports = router;
