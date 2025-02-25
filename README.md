
# 設計說明

本功能針對 CRM 系統設計，用於根據客戶在指定時間範圍內的消費行為來篩選目標客戶。舉例來說，系統可查詢「近 30 天內消費金額超過 500 元」的客戶，並將篩選結果用於後續行銷推播（如發送簡訊或 Email）。

# 使用說明

## 啟用程式
docker-compose up

## 測試 API ( Swagger )
http://localhost:3000/api-docs

## 輸入參數
- **days**：查詢的天數範圍（例如：30 天）。
- **amount**：消費金額門檻（例如：500 元）。

## 篩選條件
1. **消費總額檢查**  
   - 計算客戶在過去 `days` 天內的累計消費金額，判斷是否大於或等於 `amount`。
2. **最後消費時間檢查**  
   - 驗證客戶在該期間內的最後消費日期是否符合指定條件（例如，是否在某個日期之後）。

## 輸出結果
- 回傳符合條件的客戶清單，包含：
  - 姓名
  - 聯絡方式
  - 偏好標籤等基本資訊
- 篩選出的客戶可進一步用於行銷簡訊、Email 推播等後續行銷活動。



# 核心功能偽代碼

```
FUNCTION filterCustomers(days: INTEGER, amount: FLOAT) RETURNS LIST OF Customer
    # 計算起始時間
    currentDate = getCurrentDateTime()
    startDate = subtractDays(currentDate, days)

    # 從訂單表中查詢並分組，計算每位客戶的總消費金額和最後消費日期
    orderGroups = DATABASE.GROUPBY(
        table: "order",
        groupByField: "customer_id",
        where: "order_date >= " + startDate,
        aggregates: {
            sum: "total_amount",
            max: "order_date"
        }
    )

    # 過濾符合消費金額條件的客戶
    filteredCustomerIds = []
    FOR EACH record IN orderGroups
        IF record.sum("total_amount") >= amount THEN
            filteredCustomerIds.APPEND(record["customer_id"])
        ENDIF
    ENDFOR

    # 根據ID查詢客戶資料表，獲得客戶完整資料
    customers = DATABASE.FINDMANY(
        table: "customer",
        where: "id IN (" + JOIN(filteredCustomerIds, ", ") + ")"
    )

    RETURN customers
END FUNCTION

```

# 專案架構

```
project/
├── .gitignore               # 忽略不需提交的檔案，例如 node_modules 等
├── docker-compose.yml       # Docker Compose 設定檔
├── Dockerfile               # 建置 Docker 映像檔所需的檔案
├── package.json             # 專案的基本設定與依賴
├── package-lock.json        # npm 依賴鎖定檔
├── prisma/
│   ├── schema.prisma        # Prisma 主設定檔(資料表定義、資料庫連線資訊)
│   └── migrations/          # Prisma migration 檔
├── src/
│   ├── app.js               # Express 主要初始化檔 & 伺服器啟動相關邏輯
│   ├── routes/
│   │   └── index.js         # 路由整合進入點 (或可拆分多個路由模組)
│   ├── controllers/
│   │   └── customerController.js    # 客戶相關的業務邏輯
│   │   └── marketingController.js   # 行銷簡訊等功能的業務邏輯
│   ├── services/
│   │   └── customerService.js       # 客戶的資料存取與商業邏輯
│   │   └── marketingService.js      # 行銷簡訊發送邏輯
│   ├── utils/
│   │   └── templateEngine.js        # 簡訊模板變數替換函式 (動態變數支援)
│   └── middlewares/
│       └── errorHandler.js          # 全域錯誤處理 middleware
├── config/
│   ├── config.js               # 環境變數讀取或 dotenv 設定
└── README.md                # 專案說明文件
```

# 資料庫設計

-- 1 客戶表：儲存客戶的基本資訊與偏好

```
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '姓名',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '信箱',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '聯絡電話',
  `preferences` json DEFAULT NULL COMMENT '偏好',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

-- 2 消費紀錄表：紀錄客戶消費行為

```
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL COMMENT '客戶 id',
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '下單時間',
  `total_amount` decimal(10,2) NOT NULL COMMENT '訂單金額 ',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`),
  KEY `fk_orders_customers` (`customer_id`),
  CONSTRAINT `fk_orders_customers` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
