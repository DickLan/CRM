import { Router } from "express";
import { getFilteredCustomers } from "../../controllers/customerController.js";
const router = Router();

// GET /api/customers/filter?days=30&amount=500
router.get("/customers/filter", getFilteredCustomers);

export default router;
