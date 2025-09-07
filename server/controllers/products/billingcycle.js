const BillingCycle = require("../../models/productModel/bilingcycle");

// CREATE
const createBillingCycle = async (req, res) => {
    try {
        const data = req.body;
        const newBillingCycle = new BillingCycle(data);
        await newBillingCycle.save();
        res.status(201).json({ 
            message: "Billing cycle created successfully", 
            billingCycle: newBillingCycle 
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating billing cycle", error });
    }
};

// READ ALL
const getBillingCycles = async (req, res) => {
    try {
        const billingCycles = await BillingCycle.find();
        res.status(200).json(billingCycles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching billing cycles", error });
    }
};

// READ ONE
const getBillingCycleById = async (req, res) => {
    try {
        const { id } = req.params;
        const billingCycle = await BillingCycle.findById(id);
        if (!billingCycle) {
            return res.status(404).json({ message: "Billing cycle not found" });
        }
        res.status(200).json(billingCycle);
    } catch (error) {
        res.status(500).json({ message: "Error fetching billing cycle", error });
    }
};

// UPDATE
const updateBillingCycle = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBillingCycle = await BillingCycle.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBillingCycle) {
            return res.status(404).json({ message: "Billing cycle not found" });
        }
        res.status(200).json({ 
            message: "Billing cycle updated successfully", 
            billingCycle: updatedBillingCycle 
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating billing cycle", error });
    }
};

// DELETE
const deleteBillingCycle = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBillingCycle = await BillingCycle.findByIdAndDelete(id);
        if (!deletedBillingCycle) {
            return res.status(404).json({ message: "Billing cycle not found" });
        }
        res.status(200).json({ message: "Billing cycle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting billing cycle", error });
    }
};

module.exports = {
    createBillingCycle,
    getBillingCycles,
    getBillingCycleById,
    updateBillingCycle,
    deleteBillingCycle
};
