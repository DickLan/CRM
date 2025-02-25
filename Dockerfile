# 使用與本地開發環境相同版本的 Node.js 官方映像
FROM node:20.16.0
# 設定容器內的工作目錄
WORKDIR /app 
# 將本地的 package.json 和 package-lock.json 複製到容器中
COPY package*.json ./
# 安裝專案依賴
RUN npm install
# 複製 prisma 目錄
COPY prisma ./prisma
# 生成 Prisma Client
RUN npx prisma generate
# 全域安裝 nodemon
RUN npm install -g nodemon
# 檢查
RUN which nodemon && nodemon --version
# 將本地的專案檔案複製到容器的工作目錄中
COPY . .
# 暴露容器運行時的端口
EXPOSE 3000
# 容器啟動時執行的命令
CMD ["npm", "run", "dev"]