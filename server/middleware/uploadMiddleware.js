const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // destructure in CJS
const cloudinary = require('../lib/cloudinary'); // your Cloudinary config

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;  // use CommonJS export
