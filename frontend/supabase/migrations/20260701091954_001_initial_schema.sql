-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'provider', 'admin')) DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider profiles table
CREATE TABLE provider_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL CHECK (business_type IN ('doctor', 'dentist', 'photographer', 'lawyer', 'personal_trainer', 'beauty_salon', 'freelancer', 'consultant', 'other')),
  description TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'United States',
  postal_code TEXT,
  website TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_appointments INTEGER DEFAULT 0,
  monthly_revenue DECIMAL(10,2) DEFAULT 0.00,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Working hours table
CREATE TABLE working_hours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_working BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, day_of_week)
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE UNIQUE NOT NULL,
  customer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('appointment_confirmed', 'appointment_cancelled', 'appointment_reminder', 'new_review', 'payment_received', 'schedule_change')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RLS Policies for provider_profiles
CREATE POLICY "select_provider_profiles_public" ON provider_profiles FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_own_provider_profile" ON provider_profiles FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'provider')
  );

CREATE POLICY "update_own_provider_profile" ON provider_profiles FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- RLS Policies for services
CREATE POLICY "select_services_public" ON services FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_own_service" ON services FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM provider_profiles WHERE user_id = auth.uid() AND id = provider_id)
  );

CREATE POLICY "update_own_service" ON services FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM provider_profiles WHERE user_id = auth.uid() AND id = provider_id)
  );

CREATE POLICY "delete_own_service" ON services FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM provider_profiles WHERE user_id = auth.uid() AND id = provider_id)
  );

-- RLS Policies for working_hours
CREATE POLICY "select_working_hours_public" ON working_hours FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_own_working_hours" ON working_hours FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM provider_profiles WHERE user_id = auth.uid() AND id = provider_id)
  );

CREATE POLICY "update_own_working_hours" ON working_hours FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM provider_profiles WHERE user_id = auth.uid() AND id = provider_id)
  );

-- RLS Policies for appointments
CREATE POLICY "select_own_appointments" ON appointments FOR SELECT
  TO authenticated USING (
    customer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM provider_profiles WHERE user_id = auth.uid() AND id = provider_id)
  );

CREATE POLICY "insert_appointment_customer" ON appointments FOR INSERT
  TO authenticated WITH CHECK (
    customer_id = auth.uid()
  );

CREATE POLICY "update_own_appointment" ON appointments FOR UPDATE
  TO authenticated USING (
    customer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM provider_profiles WHERE user_id = auth.uid() AND id = provider_id)
  );

-- RLS Policies for reviews
CREATE POLICY "select_reviews_public" ON reviews FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_own_review" ON reviews FOR INSERT
  TO authenticated WITH CHECK (customer_id = auth.uid());

CREATE POLICY "update_provider_response" ON reviews FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM provider_profiles WHERE user_id = auth.uid() AND id = provider_id)
  );

-- RLS Policies for notifications
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

-- RLS Policies for payments
CREATE POLICY "select_own_payments" ON payments FOR SELECT
  TO authenticated USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM provider_profiles WHERE user_id = auth.uid())
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
