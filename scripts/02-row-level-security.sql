-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Vendor profiles policies
CREATE POLICY "Vendors can manage their own profile" ON vendor_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Suppliers can view vendor profiles" ON vendor_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'supplier')
);

-- Supplier profiles policies
CREATE POLICY "Suppliers can manage their own profile" ON supplier_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Vendors can view verified supplier profiles" ON supplier_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'vendor') AND
    EXISTS (SELECT 1 FROM profiles WHERE id = supplier_profiles.id AND verification_status = 'verified')
);

-- Products policies
CREATE POLICY "Suppliers can manage their own products" ON products FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Vendors can view active products from verified suppliers" ON products FOR SELECT USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'vendor') AND
    EXISTS (SELECT 1 FROM profiles WHERE id = supplier_id AND verification_status = 'verified')
);

-- Orders policies
CREATE POLICY "Vendors can manage their own orders" ON orders FOR ALL USING (auth.uid() = vendor_id);
CREATE POLICY "Suppliers can view and update orders for their products" ON orders FOR SELECT USING (auth.uid() = supplier_id);
CREATE POLICY "Suppliers can update order status" ON orders FOR UPDATE USING (auth.uid() = supplier_id);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND (vendor_id = auth.uid() OR supplier_id = auth.uid()))
);

-- Group orders policies
CREATE POLICY "Suppliers can manage their group orders" ON group_orders FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Vendors can view active group orders" ON group_orders FOR SELECT USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'vendor')
);

-- Group order participants policies
CREATE POLICY "Vendors can manage their group order participation" ON group_order_participants FOR ALL USING (auth.uid() = vendor_id);
CREATE POLICY "Suppliers can view participants in their group orders" ON group_order_participants FOR SELECT USING (
    EXISTS (SELECT 1 FROM group_orders WHERE id = group_order_participants.group_order_id AND supplier_id = auth.uid())
);

-- Reviews policies
CREATE POLICY "Vendors can create reviews for their orders" ON reviews FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Users can view reviews" ON reviews FOR SELECT TO authenticated;
