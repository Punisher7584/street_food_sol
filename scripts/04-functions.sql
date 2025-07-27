-- Function to increment group order quantity
CREATE OR REPLACE FUNCTION increment_group_order_quantity(
    group_order_id UUID,
    quantity_to_add INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE group_orders 
    SET current_quantity = current_quantity + quantity_to_add
    WHERE id = group_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get supplier statistics
CREATE OR REPLACE FUNCTION get_supplier_stats(supplier_uuid UUID)
RETURNS TABLE(
    total_orders BIGINT,
    total_revenue NUMERIC,
    active_products BIGINT,
    average_rating NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_revenue,
        COUNT(p.id) as active_products,
        COALESCE(AVG(r.rating), 0) as average_rating
    FROM supplier_profiles sp
    LEFT JOIN orders o ON sp.id = o.supplier_id
    LEFT JOIN products p ON sp.id = p.supplier_id AND p.is_active = true
    LEFT JOIN reviews r ON sp.id = r.supplier_id
    WHERE sp.id = supplier_uuid
    GROUP BY sp.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get vendor statistics
CREATE OR REPLACE FUNCTION get_vendor_stats(vendor_uuid UUID)
RETURNS TABLE(
    total_orders BIGINT,
    total_spent NUMERIC,
    favorite_category TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        (
            SELECT p.category
            FROM orders ord
            JOIN order_items oi ON ord.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE ord.vendor_id = vendor_uuid
            GROUP BY p.category
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) as favorite_category
    FROM vendor_profiles vp
    LEFT JOIN orders o ON vp.id = o.vendor_id
    WHERE vp.id = vendor_uuid
    GROUP BY vp.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS VOID AS $$
BEGIN
    DELETE FROM otp_verifications 
    WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to clean up expired OTPs (if using pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-otps', '0 2 * * *', 'SELECT cleanup_expired_otps();');
