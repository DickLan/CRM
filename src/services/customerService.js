import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function filterCustomer(days, amount) {
  const daysInt = parseInt(days, 10) || 30; // 預設 30 天
  const amountInt = parseInt(amount, 10) || 500; // 預設 500 元

  // 計算起始時間
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysInt);

  // 以 groupBy 查出每位客戶在指定時間內的 sum(total_amount) 與 max(order_date)
  const groupedOrders = await prisma.order.groupBy({
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

  // 過濾出符合消費金額的客戶 ID 和其消費總金額
  const filteredCustomers = groupedOrders
    .filter((orderGroup) => orderGroup._sum.total_amount >= amountInt)
    .map((orderGroup) => ({
      customerId: orderGroup.customer_id,
      totalAmount: orderGroup._sum.total_amount,
      lastOrderDate: orderGroup._max.order_date,
    }));

  // 將符合條件的客戶資料撈出
  const customerIds = filteredCustomers.map((c) => c.customerId);
  const customers = await prisma.customer.findMany({
    where: {
      id: { in: customerIds },
    },
  });

  // 組合客戶詳細資料與消費資訊
  const detailCustomers = customers.map((customer) => ({
    ...customer,
    totalAmount: filteredCustomers.find((c) => c.customerId === customer.id)
      .totalAmount,
    lastOrderDate: filteredCustomers.find((c) => c.customerId === customer.id)
      .lastOrderDate,
  }));

  return detailCustomers;
}
