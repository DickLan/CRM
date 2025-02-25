import { Router } from "express";
import { sendPromotions } from "../../controllers/marketingController.js";

const router = Router();

/**
 * @swagger
 * /marketing/send:
 *   post:
 *     summary: 發送行銷簡訊
 *     description: 根據提供的條件 (days, amount, template) 篩選符合條件的客戶，並發送行銷簡訊。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               days:
 *                 type: integer
 *                 description: 查詢的天數範圍，例如 30 天
 *                 example: 30
 *               amount:
 *                 type: number
 *                 description: 消費金額門檻，例如 500 元
 *                 example: 500
 *               template:
 *                 type: string
 *                 description: 行銷簡訊模板，支援動態變數 (如 {{name}}, {{total}})
 *                 example: "Hi {{name}}, you have spent {{total}} this month."
 *     responses:
 *       200:
 *         description: 行銷簡訊發送結果
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Promotions sent successfully"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerId:
 *                         type: integer
 *                         example: 1
 *                       phone:
 *                         type: string
 *                         example: "0912345678"
 *                       message:
 *                         type: string
 *                         example: "Hi Alice, you spent 600 this month!"
 *                       status:
 *                         type: string
 *                         example: "SENT"
 */
router.post("/marketing/send", sendPromotions);

export default router;
