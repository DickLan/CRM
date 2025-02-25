-- seed.sql 插入測資
-- 插入 10 筆客戶資料
INSERT INTO customer (name, email, phone, preferences)
VALUES
  ('Alice', 'alice@example.com', '0912345678', '{"tag": "VIP"}'),
  ('Bob', 'bob@example.com', '0987654321', '{"tag": "Regular"}'),
  ('Charlie', 'charlie@example.com', '0922333444', '{"tag": "VIP"}'),
  ('David', 'david@example.com', '0933444555', '{"tag": "Regular"}'),
  ('Eve', 'eve@example.com', '0944555666', '{"tag": "VIP"}'),
  ('Frank', 'frank@example.com', '0955666777', '{"tag": "Regular"}'),
  ('Grace', 'grace@example.com', '0966777888', '{"tag": "VIP"}'),
  ('Henry', 'henry@example.com', '0977888999', '{"tag": "Regular"}'),
  ('Irene', 'irene@example.com', '0988999000', '{"tag": "VIP"}'),
  ('Jack', 'jack@example.com', '0999000111', '{"tag": "Regular"}');

-- 插入 10 筆訂單資料，對應 customer_id 1~10
INSERT INTO `order` (customer_id, order_date, total_amount)
VALUES
  (1, NOW(), 600.00),
  (2, NOW(), 300.00),
  (3, NOW(), 450.00),
  (4, NOW(), 200.00),
  (5, NOW(), 750.00),
  (6, NOW(), 350.00),
  (7, NOW(), 500.00),
  (8, NOW(), 400.00),
  (9, NOW(), 650.00),
  (10, NOW(), 300.00);
