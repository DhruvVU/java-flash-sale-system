-- -- Create product table
-- CREATE TABLE products (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
--     price DECIMAL(10, 2) NOT NULL
-- );

-- -- Create orders table
-- CREATE TABLE orders (
--     id SERIAL PRIMARY KEY, 
--     user_id INT NOT NULL,
--     product_id INT NOT NULL,
--     order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     status VARCHAR(50) DEFAULT 'CONFIRMED',
--     FOREIGN KEY (product_id) REFERENCES products(id)
-- );

-- SELECT * FROM products;
-- SELECT * FROM orders;

--  Create the Users table
-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(50) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL, 
--     role VARCHAR(20) DEFAULT 'ADMIN'
-- );
