-- Tornar order_number opcional e gerar automaticamente se não fornecido
ALTER TABLE public.service_orders ALTER COLUMN order_number DROP NOT NULL;

-- Atualizar o trigger para sempre gerar quando não fornecido
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'OS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('service_order_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$;

-- Recriar o trigger sem a condição WHEN
DROP TRIGGER IF EXISTS set_order_number ON public.service_orders;
CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.service_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_order_number();