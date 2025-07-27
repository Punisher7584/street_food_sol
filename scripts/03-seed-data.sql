-- Insert sample supplier profiles (you'll need to create these users first in Supabase Auth)
-- This is just sample data structure - in real implementation, these would be created through registration

-- Sample products for demonstration
INSERT INTO products (supplier_id, name, category, description, price, unit, stock_quantity, min_order_quantity) VALUES
-- Note: Replace with actual supplier UUIDs after user registration
('00000000-0000-0000-0000-000000000001', 'Fresh Onions', 'Vegetables', 'Premium quality red onions', 25.00, 'kg', 500, 5),
('00000000-0000-0000-0000-000000000001', 'Red Tomatoes', 'Vegetables', 'Fresh ripe tomatoes', 35.00, 'kg', 300, 3),
('00000000-0000-0000-0000-000000000001', 'Potatoes', 'Vegetables', 'Grade A potatoes', 20.00, 'kg', 800, 10),
('00000000-0000-0000-0000-000000000002', 'Red Chili Powder', 'Spices', 'Pure red chili powder', 180.00, 'kg', 50, 1),
('00000000-0000-0000-0000-000000000002', 'Turmeric Powder', 'Spices', 'Organic turmeric powder', 120.00, 'kg', 30, 1),
('00000000-0000-0000-0000-000000000002', 'Garam Masala', 'Spices', 'Premium blend garam masala', 250.00, 'kg', 25, 1);

-- Sample group orders
INSERT INTO group_orders (supplier_id, product_id, target_quantity, discount_percentage, min_participants, max_participants, expires_at) VALUES
('00000000-0000-0000-0000-000000000002', (SELECT id FROM products WHERE name = 'Red Chili Powder' LIMIT 1), 50, 15.00, 5, 15, NOW() + INTERVAL '2 days');
