const Plan = require("../../models/productModel/plans"); // adjust path if needed

// CREATE
const createPlan = async (req, res) => {
    try {
        const newPlan = new Plan(req.body);
        await newPlan.save();
        res.status(201).json({ message: "Plan created successfully", plan: newPlan });
    } catch (error) {
        res.status(500).json({ message: "Error creating plan", error });
    }
};

// READ ALL
const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: "Error fetching plans", error });
    }
};

// READ ONE
const getPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await Plan.findById(id);
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ message: "Error fetching plan", error });
    }
};

// UPDATE
const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPlan = await Plan.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPlan) return res.status(404).json({ message: "Plan not found" });
        res.status(200).json({ message: "Plan updated successfully", plan: updatedPlan });
    } catch (error) {
        res.status(500).json({ message: "Error updating plan", error });
    }
};

// DELETE
const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlan = await Plan.findByIdAndDelete(id);
        if (!deletedPlan) return res.status(404).json({ message: "Plan not found" });
        res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting plan", error });
    }
};

module.exports = {
    createPlan,
    getPlans,
    getPlanById,
    updatePlan,
    deletePlan
};
