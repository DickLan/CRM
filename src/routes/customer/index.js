import { Router } from "express";
import { getFilteredCustomers } from "../../controllers/customerController.js";

const router = Router();

/**
 * @swagger
 * /customers/filter:
 *   get:
 *     summary: 根據消費條件篩選客戶
 *     description: 回傳符合「近指定天數內消費金額大於設定金額」的客戶列表。
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: 查詢的天數範圍，例如 30
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *         description: 消費金額門檻，例如 500
 *     responses:
 *       200:
 *         description: 篩選出的客戶清單
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       phone:
 *                         type: string
 */
router.get("/customers/filter", getFilteredCustomers);

export default router;
