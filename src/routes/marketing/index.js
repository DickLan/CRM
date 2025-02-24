import { Router } from "express";
import { sendPromotions } from "../../controllers/marketingController.js";

const router = Router();

// POST /api/marketing/send
// body 需要帶入 { days, amount, template }
router.post("/marketing/send", sendPromotions);

export default router;
