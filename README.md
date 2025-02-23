

<!-- 專案架構 -->
project/
├── .gitignore               # 忽略不需提交的檔案，例如 node_modules 等
├── docker-compose.yml       # Docker Compose 設定檔
├── Dockerfile               # 建置 Docker 映像檔所需的檔案
├── package.json             # 專案的基本設定與依賴
├── package-lock.json        # npm 依賴鎖定檔
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
