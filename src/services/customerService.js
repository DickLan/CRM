import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function filterCustomer(days, amount) {
  const daysInt = parseInt(days, 10) || 30; // 預設 30 天
  const amountInt = parseInt(amount, 10) || 500; // 預設 500 元

  // 1. 計算起始時間
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysInt);

  // 2. 以 groupBy 查出每位客戶在指定時間內的 sum(total_amount) 與 max(order_date)
  const groupedOrder = await prisma.order.groupBy({
    by: ["customer_id"],
    where: {
      order_date: { gte: startDate },
    },
    _sum: {
      total_amount: true,
    },
    _max: {
      order_date: true,
    },
  });

  // 3. 過濾出符合消費金額的客戶 ID
  const filteredCustomerIds = groupedOrder
    .filter((orderGroup) => (orderGroup._sum.total_amount || 0) >= amountInt)
    .map((orderGroup) => orderGroup.customer_id);

  // 4. 將符合條件的客戶資料撈出
  const customer = await prisma.customer.findMany({
    where: {
      id: { in: filteredCustomerIds },
    },
  });

  return customer;
}
