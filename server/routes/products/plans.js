const express = require("express");
const router = express.Router();
const {
    createPlan,
    getPlans,
    getPlanById,
    updatePlan,
    deletePlan
} = require("../../controllers/products/plan");

// CRUD Routes
router.post("/", createPlan);     // Create
router.get("/", getPlans);        // Get all
router.get("/:id", getPlanById);  // Get one
router.put("/:id", updatePlan);   // Update
router.delete("/:id", deletePlan);// Delete

module.exports = router;
