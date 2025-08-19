const UserModel = require("../../models/authenticationModel/userModel")
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
require('dotenv').config();


const createUser = async (req, res) => {
    try {
        const { name, email, password, roleId } = req.body;
        const profile = req.file?.filename || null;
        const hashedPassword = await bcrypt.hash(password, 8)

        if (!name || !email || !password || !roleId || !profile) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await UserModel.create({
            name,
            email,
            password:hashedPassword,
            roleId,
            profile,
        });
        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
      .populate("roleId")
      .populate("chatId");

    res.status(200).json({
      data: users,
      message: "User data fetched successfully",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      status: 500,
    });
  }
};


const getUserById = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id).populate('roleId');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: user, message: "User fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}
const searchUser = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.find({
            $or: [
                { email: id },
                { name: { $regex: id, $options: "i" } }
            ]
        }).populate('roleId');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: user, message: "User fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, roleId, profile } = req.body;
    let updateData = { name, email, roleId };

    try {
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (password) {
            updateData.password = await bcrypt.hash(password, 8);
        }
        if (req.file) {
            if (existingUser.profile && fs.existsSync(path.join("uploads", existingUser.profile))) {
                fs.unlinkSync(path.join("uploads", existingUser.profile));
            }
            updateData.profile = req.file.filename;
        } 
        else if (profile && profile !== existingUser.profile) {
            updateData.profile = profile;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({
            message: "User updated successfully",
        });

    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.profile) {
            const imagePath = path.join(__dirname, "../..", "uploads", user.profile);
            console.log("Attempting to delete file:", imagePath);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); 
                console.log("Image deleted:", user.profile);
            }
        }
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ message: "User and profile image deleted successfully!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};




const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey"; 
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Both fields are required!" });
        }

        const isUser = await UserModel.findOne({ email }).populate("roleId");
        if (!isUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const matchPassword = await bcrypt.compare(password, isUser.password);
        if (!matchPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const payload = {
            id: isUser._id,
            email: isUser.email,
            role: isUser.roleId.role,
        };

        // Generate JWT token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).json({
            message: "User login successful!",
            token,
            user: isUser,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


module.exports = {
    createUser,
    getUsers,
    getUserById,
    searchUser,
    updateUser,
    deleteUser,
    userLogin
}