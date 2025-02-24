// src/middlewares/errorHandler.js
export default function errorHandler(err, req, res, next) {
  console.error("[ErrorHandler]", err);
  res.status(500).json({ error: "Internal Server Error" });
}
