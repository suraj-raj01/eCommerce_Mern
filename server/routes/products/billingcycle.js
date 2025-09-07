const express = require("express");
const router = express.Router();
const {
    createBillingCycle,
    getBillingCycles,
    getBillingCycleById,
    updateBillingCycle,
    deleteBillingCycle
} = require("../../controllers/products/billingcycle");

router.post("/", createBillingCycle);
router.get("/", getBillingCycles);
router.get("/:id", getBillingCycleById);
router.put("/:id", updateBillingCycle);
router.delete("/:id", deleteBillingCycle);

module.exports = router;
