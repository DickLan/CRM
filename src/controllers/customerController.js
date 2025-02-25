// src/controllers/customerController.js
import { filterCustomer } from "../services/customerService.js";

export async function getFilteredCustomers(req, res, next) {
  try {
    const { days, amount } = req.query; 
    const customers = await filterCustomer(days, amount);

    res.status(200).json({ data: customers });
  } catch (error) {
    next(error);
  }
}
