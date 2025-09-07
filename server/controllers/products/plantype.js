const PlanType = require("../../models/productModel/plantype");

// CREATE
const createPlanType = async (req, res) => {
    try {
        const data = req.body;
        const newPlanType = new PlanType(data);
        await newPlanType.save();
        res.status(201).json({ 
            message: "plan-type created successfully", 
            PlanType: newPlanType 
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating plan-type", error });
    }
};

// READ ALL
const getPlanTypes = async (req, res) => {
    try {
        const PlanTypes = await PlanType.find();
        res.status(200).json(PlanTypes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching plan-types", error });
    }
};

// READ ONE
const getPlanTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const PlanType = await PlanType.findById(id);
        if (!PlanType) {
            return res.status(404).json({ message: "plan-type not found" });
        }
        res.status(200).json(PlanType);
    } catch (error) {
        res.status(500).json({ message: "Error fetching plan-type", error });
    }
};

// UPDATE
const updatePlanType = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPlanType = await PlanType.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPlanType) {
            return res.status(404).json({ message: "plan-type not found" });
        }
        res.status(200).json({ 
            message: "plan-type updated successfully", 
            PlanType: updatedPlanType 
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating plan-type", error });
    }
};

// DELETE
const deletePlanType = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlanType = await PlanType.findByIdAndDelete(id);
        if (!deletedPlanType) {
            return res.status(404).json({ message: "plan-type not found" });
        }
        res.status(200).json({ message: "plan-type deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting plan-type", error });
    }
};

module.exports = {
    createPlanType,
    getPlanTypes,
    getPlanTypeById,
    updatePlanType,
    deletePlanType
};
