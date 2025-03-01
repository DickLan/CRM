import dotenv from "dotenv";
import express from "express";
import config from "../config/config.js";
import routers from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import { swaggerUi, specs } from "./swagger.js";
// 載入環境變量
dotenv.config();

const app = express();
app.use(express.json());
// 設定中間件、路由等
app.get("/", (req, res) => {
  res.send("Hello World!");
});

for (const router of routers) {
  app.use("/api", router);
}

// 掛載 Swagger 檔案路由
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

// 啟動伺服器
app.listen(config.server.port, () => {
  console.log(`Server is running on port ${config.server.port}`);
});

export default app;
