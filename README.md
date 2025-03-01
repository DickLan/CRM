
# CRM 系統 設計說明

本功能針對 CRM 系統設計，用於根據客戶在指定時間範圍內的消費行為來篩選目標客戶。舉例來說，系統可查詢「近 30 天內消費金額超過 500 元」的客戶，並將篩選結果用於後續行銷推播（如發送簡訊或 Email）。

---
# 目錄
- [使用說明](#使用說明)
- [核心功能偽代碼](#核心功能偽代碼)
- [專案架構](#專案架構)
- [功能設計說明](#功能設計說明)
- [資料庫設計](#資料庫設計)

# 使用說明

## 啟用程式
1.啟動您的 docker，並確認主機的 port 3000 & 3310 未被占用  
2.複製.env.example，改名為 .env，內容不用變動
3.執行下行:建置並啟動容器，初次建立會自動建立資料表，並加入測試資料  
docker-compose up --build  
4.測試 API  
開啟瀏覽器，進入：  
http://localhost:3000/api-docs  
透過 Swagger 測試 API。

# 核心功能偽代碼

```pl
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

```pl
FUNCTION sendMarketingSMS(customers: LIST OF Customer, template: STRING) RETURNS BOOLEAN
    # 例如 template = "親愛的 {name}，您近30天消費達到 {amount} 元，感謝您的支持！"
    FOR EACH customer IN customers
        # 取得客戶姓名與消費金額（可由客戶資料或額外計算獲得）
        personalizedMessage = REPLACE(template, "{name}", customer.name)
        personalizedMessage = REPLACE(personalizedMessage, "{amount}", customer.total_amount)
        
        # 發送簡訊給客戶 (調用第三方簡訊服務 API)
        SMSService.send(customer.phone, personalizedMessage)
    ENDFOR

    RETURN TRUE
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

# 功能設計說明
本系統主要提供根據客戶在指定時間內的消費行為來篩選目標客戶的功能，供後續行銷活動使用。

## 篩選目標客戶 (filterCustomers)
  流程：  
    -計算起始時：  
    -查詢消費紀錄  
    -篩選符合條件的客戶  
    -查詢客戶資料

## 發送行銷簡訊 (sendMarketingSMS)：
  流程：  
      -接收篩選結果與簡訊範本  
      -動態變數替換  
      -發送簡訊


# 資料庫設計

-- 1 客戶表：儲存客戶的基本資訊與偏好

```sql
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

```sql
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
