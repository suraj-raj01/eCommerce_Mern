const express = require("express");
const router = express.Router();
const {
    createPlanType,
    getPlanTypes,
    getPlanTypeById,
    updatePlanType,
    deletePlanType
} = require("../../controllers/products/plantype");

router.post("/", createPlanType);
router.get("/", getPlanTypes);
router.get("/:id", getPlanTypeById);
router.patch("/:id", updatePlanType);
router.delete("/:id", deletePlanType);

module.exports = router;
