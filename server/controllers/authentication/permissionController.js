const PermissionModel = require("../../models/authenticationModel/permissionModel")
const mongoose = require("mongoose")

// create permission
const createPermission = async (req, res) => {
    const body = req.body;
    try {
        const Data = await PermissionModel.create({
            ...body
        })
        res.status(200).json({ data: Data, message: "Role created Successfull!!" }, { status: 200 })
    } catch (error) {
        res.status(500).json(error)
    }
}

// get permission with pagination
const getPermission = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            PermissionModel.find().skip(skip).limit(limit),
            PermissionModel.countDocuments()
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            data,
            currentPage: page,
            totalPages,
            totalItems: total,
            message: "Permission fetched successfully"
        });
    } catch (error) {
        console.error("Pagination Error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// delete permission
const deletePermission = async (req, res) => {
    const { id } = req.params;
    try {
        await PermissionModel.findByIdAndDelete(id)
        res.status(200).json({ message: "Permission Deleted Successfull" })
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error })
    }
}

// update permission
const updatePermission = async (req, res) => {
    const { id } = req.params;
    const { ...data } = req.body;
    try {
        await PermissionModel.findByIdAndUpdate(id, data, { new: true })
        res.status(200).json({ message: "Permission Updated Successfully" }, { status: 200 })
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error }, { status: 500 })
    }
}

// search permission by name or id
const searchPermission = async (req, res) => {
    const { id } = req.params;
    try {
        const searchConditions = [
            { permission: { $regex: id, $options: "i" } }
        ]
        if (mongoose.Types.ObjectId.isValid(id)) {
            searchConditions.push({ _id: id });
        }

        const data = await PermissionModel.find({
            $or: searchConditions
        })

        res.status(200).json({ data, message: "Search results" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error: error.message }, { status: 500 })
    }
}

module.exports = {
    createPermission,
    getPermission,
    deletePermission,
    updatePermission,
    searchPermission
}