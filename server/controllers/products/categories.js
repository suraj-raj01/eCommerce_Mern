const CategoryModel = require("../../models/productModel/categories")

// create categories & subcategories with images
const createCategory = async (req, res) => {
    try {
        const { category, categoryimg, subcategories } = req.body;
        const newCategory = new CategoryModel({ category, categoryimg, subcategories });
        await newCategory.save();
        res.status(201).json({ message: "Category created successfully", categories: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating categories", error });
    }
}

// get categories with pagination
const getCategory = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;
        const data = await CategoryModel.find()
            .skip(skip)
            .limit(limit);

        const total = await CategoryModel.countDocuments();

        res.status(200).json({
            message: "Categories retrieved successfully",
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCategories: total,
            categories: data
        });

    } catch (error) {
        res.status(500).json({
            message: "Error retrieving categories",
            error
        });
    }
};

// update categories
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const { categories, categoryimg, subcategories } = req.body;
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, { categories, categoryimg, subcategories }, { new: true });
        res.status(200).json({ message: "Category updated successfully", categories: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Error updating categories", error });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        await CategoryModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting categories", error });
    }
}


// search categories by name
const searchCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Search term is required" });
        }
        // Build search conditions
        const conditions = [
            { category: { $regex: id, $options: "i" } }
        ];

        const category = await CategoryModel.findOne({ $or: conditions });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            message: "Category retrieved successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            message: "Error retrieving category",
            error
        });
    }
};

// get category by id
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const category = await CategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({
            message: "Category retrieved successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving category",
            error
        });
    }
};

module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    getCategoryById,
    deleteCategory,
    searchCategory
}