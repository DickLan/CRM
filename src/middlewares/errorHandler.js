export default function errorHandler(err, req, res, next) {
  console.error("[ErrorHandler]", err);
  const response = { error: err.message || "Internal Server Error" };
  res.status(500).json(response);
}