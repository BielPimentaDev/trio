CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,            
    product VARCHAR(100) NOT NULL,     
    variant VARCHAR(100) NOT NULL,   
    price DECIMAL(10, 2) NOT NULL,   
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    status VARCHAR(50) NOT NULL,  
    order_id VARCHAR(100) NOT NULL          
);