import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger 定義設定
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CRM API",
      version: "1.0.0",
      description: "API documentation for CRM 系統",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  // 指定包含 Swagger 註解的檔案位置
  apis: ["./src/**/*.js"],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
