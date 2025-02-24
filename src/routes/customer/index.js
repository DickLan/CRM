import { Router } from "express";
import { getFilteredCustomers } from "../../controllers/customerController.js";
const router = Router();

router.post("/test", (req, res) => {
  res.send("Hello World2!");
});

// GET /api/customers/filter?days=30&amount=500
router.get("/customers/filter", getFilteredCustomers);

export default router;
