-- User authentication query (INSECURE - credentials hardcoded)
SELECT * FROM users 
WHERE username = 'admin' AND password = 'admin123';

-- SQL Injection vulnerable query
SELECT * FROM orders WHERE order_id = '' OR '1'='1';

-- Dumping all users (suspicious)
SELECT id, username, email, password_hash, credit_card, ssn 
FROM users 
UNION SELECT null, null, null, null, null, null--;

-- Hardcoded API key in comment
-- api_key = sk-live-xK9mNpQrStUvWxYz1234567890abcdef
INSERT INTO config (key, value) VALUES ('stripe_key', 'sk_live_51HZ9aBcDeFgHiJkLmNoPqRsTuVwXyZ');

-- Dropping tables (destructive)
DROP TABLE IF EXISTS audit_logs;
DELETE FROM sessions WHERE 1=1;

-- Legitimate query (should be low/no risk)
SELECT product_name, price, stock_count 
FROM products 
WHERE category = 'electronics' AND price < 500
ORDER BY price ASC;
