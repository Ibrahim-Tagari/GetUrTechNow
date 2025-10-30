-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  brand TEXT,
  stock INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  image_url TEXT,
  description TEXT,
  specs JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  upgrades JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create returns table
CREATE TABLE IF NOT EXISTS returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  issued_at TIMESTAMP DEFAULT NOW(),
  due_at TIMESTAMP,
  paid_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_returns_user_id ON returns(user_id);
CREATE INDEX idx_returns_order_id ON returns(order_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_invoices_order_id ON invoices(order_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR (SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for products table (public read, admin write)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

-- Create RLS policies for orders table
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id::text OR (SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create RLS policies for returns table
CREATE POLICY "Users can view their own returns" ON returns
  FOR SELECT USING (auth.uid()::text = user_id::text OR (SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY "Users can create returns for their orders" ON returns
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create RLS policies for invoices table
CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT USING ((SELECT user_id FROM orders WHERE id = order_id) = auth.uid()::text OR (SELECT role FROM users WHERE id = auth.uid()::text) = 'admin');
