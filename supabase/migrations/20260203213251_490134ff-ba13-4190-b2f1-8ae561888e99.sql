-- Enum para status de técnicos
CREATE TYPE public.technician_status AS ENUM ('available', 'busy', 'offline');

-- Enum para tipo de serviço
CREATE TYPE public.service_type AS ENUM ('installation', 'maintenance', 'repair');

-- Enum para prioridade
CREATE TYPE public.priority_level AS ENUM ('normal', 'high', 'urgent');

-- Enum para status de OS
CREATE TYPE public.service_order_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');

-- Enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'supervisor', 'technician');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de roles de usuários
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'technician',
    UNIQUE (user_id, role)
);

-- Tabela de técnicos
CREATE TABLE public.technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    status technician_status NOT NULL DEFAULT 'offline',
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    current_address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de ordens de serviço
CREATE TABLE public.service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    service_type service_type NOT NULL DEFAULT 'installation',
    priority priority_level NOT NULL DEFAULT 'normal',
    status service_order_status NOT NULL DEFAULT 'pending',
    technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
    notes TEXT,
    scheduled_date DATE,
    scheduled_time TIME,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de check-ins
CREATE TABLE public.checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_id UUID REFERENCES public.technicians(id) ON DELETE CASCADE NOT NULL,
    service_order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('checkin', 'checkout')),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de logs de atividade
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
    service_order_id UUID REFERENCES public.service_orders(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Função para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Função para verificar se é admin ou supervisor
CREATE OR REPLACE FUNCTION public.is_admin_or_supervisor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role IN ('admin', 'supervisor')
    )
$$;

-- RLS Policies para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin_or_supervisor(auth.uid()));

-- RLS Policies para user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies para technicians
CREATE POLICY "Authenticated can view technicians" ON public.technicians
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage technicians" ON public.technicians
    FOR ALL USING (public.is_admin_or_supervisor(auth.uid()));

CREATE POLICY "Technicians can update own record" ON public.technicians
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies para service_orders
CREATE POLICY "Authenticated can view service orders" ON public.service_orders
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage service orders" ON public.service_orders
    FOR ALL USING (public.is_admin_or_supervisor(auth.uid()));

CREATE POLICY "Users can create service orders" ON public.service_orders
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- RLS Policies para checkins
CREATE POLICY "Authenticated can view checkins" ON public.checkins
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Technicians can create own checkins" ON public.checkins
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.technicians
            WHERE id = technician_id AND user_id = auth.uid()
        )
    );

-- RLS Policies para activity_logs
CREATE POLICY "Authenticated can view activity logs" ON public.activity_logs
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can create activity logs" ON public.activity_logs
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at
    BEFORE UPDATE ON public.technicians
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at
    BEFORE UPDATE ON public.service_orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'technician');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para gerar número de OS
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'OS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('service_order_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS service_order_seq START 1;

CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.service_orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
    EXECUTE FUNCTION public.generate_order_number();