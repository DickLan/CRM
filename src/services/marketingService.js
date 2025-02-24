import { compileTemplate } from "../utils/templateEngine.js";

// 模擬「發送簡訊」行為
export async function sendMarketingMessages(customers, template) {
  const results = [];
  for (const customer of customers) {
    // 準備動態參數
    const placeholders = {
      name: customer.name || "",
      phone: customer.phone || "",
      total: customer.totalAmount || "",
    };

    // 使用模板引擎替換變數
    const compiledMessage = compileTemplate(template, placeholders);

    // 模擬「發送」
    console.log(`Sending SMS to ${customer.phone} => ${compiledMessage}`);

    // 收集發送結果
    results.push({
      customerId: customer.id,
      phone: customer.phone,
      message: compiledMessage,
      status: "SENT", // 模擬成功
    });
  }

  return results;
}
