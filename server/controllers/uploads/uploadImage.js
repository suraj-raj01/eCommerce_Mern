const cloudinary = require("../../lib/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Allow only certain file types (optional)
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Only image uploads are allowed" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "uploadimage",
          resource_type: "image", // restrict to image
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      error: "Upload failed",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "uploadimage",
              resource_type: "image",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          );
          stream.end(file.buffer);
        })
    );

    const results = await Promise.all(uploadPromises);

    return res.status(200).json({
      message: "Images uploaded successfully",
      files: results,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
};

module.exports = { uploadImage, uploadMultipleImages };
