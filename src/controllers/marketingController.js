import { filterCustomer } from "../services/customerService.js";
import { sendMarketingMessages } from "../services/marketingService.js";

export async function sendPromotions(req, res, next) {
  try {
    const { days, amount, template } = req.body;
    // 1. 先取得符合條件的客戶名單
    const customers = await filterCustomer(days, amount);

    // 2. 呼叫行銷服務，將訊息群發給這些客戶
    const result = await sendMarketingMessages(customers, template);

    res.json({
      success: true,
      message: "Promotions sent successfully",
      details: result
    });
  } catch (error) {
    next(error);
  }
}