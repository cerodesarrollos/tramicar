-- Tramicar MVP Schema

-- Profiles (extends Supabase auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  dni TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Operations
CREATE TABLE operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  seller_email TEXT,
  vehicle_brand TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year INTEGER NOT NULL,
  vehicle_plate TEXT NOT NULL,
  vehicle_price BIGINT NOT NULL,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Operation steps
CREATE TABLE operation_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id UUID NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 6),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  notes TEXT,
  data JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(operation_id, step_number)
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id UUID NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  operation_id UUID REFERENCES operations(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create 6 steps when operation is created
CREATE OR REPLACE FUNCTION create_operation_steps()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO operation_steps (operation_id, step_number, status)
  SELECT NEW.id, n, CASE WHEN n = 1 THEN 'in_progress' ELSE 'pending' END
  FROM generate_series(1, 6) AS n;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_operation_created
  AFTER INSERT ON operations
  FOR EACH ROW EXECUTE FUNCTION create_operation_steps();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Operations: buyer and seller can view
CREATE POLICY "Participants can view operations" ON operations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers can create operations" ON operations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update operations" ON operations FOR UPDATE
  USING (auth.uid() = buyer_id);

-- Steps: participants can view/update
CREATE POLICY "Participants can view steps" ON operation_steps FOR SELECT
  USING (EXISTS (SELECT 1 FROM operations WHERE id = operation_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())));
CREATE POLICY "Participants can update steps" ON operation_steps FOR UPDATE
  USING (EXISTS (SELECT 1 FROM operations WHERE id = operation_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())));

-- Documents: participants can view/upload
CREATE POLICY "Participants can view documents" ON documents FOR SELECT
  USING (EXISTS (SELECT 1 FROM operations WHERE id = operation_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())));
CREATE POLICY "Participants can upload documents" ON documents FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Notifications: own only
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_operations_buyer ON operations(buyer_id);
CREATE INDEX idx_operations_seller ON operations(seller_id);
CREATE INDEX idx_steps_operation ON operation_steps(operation_id);
CREATE INDEX idx_documents_operation ON documents(operation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
