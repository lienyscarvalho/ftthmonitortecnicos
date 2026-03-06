
-- Get technician IDs for reference and insert service orders
DO $$
DECLARE
  tech_ids uuid[];
BEGIN
  SELECT array_agg(id ORDER BY name) INTO tech_ids FROM public.technicians LIMIT 15;
  
  INSERT INTO public.service_orders (customer_name, customer_phone, customer_address, service_type, priority, status, technician_id, order_number, location_lat, location_lng, scheduled_date, notes) VALUES
  ('Maria Conceição', '(11) 91234-5678', 'Rua das Flores, 123 - Vila Mariana, SP', 'installation', 'normal', 'completed', tech_ids[1], 'OS-2024-0001', -23.5890, -46.6340, '2024-12-01', 'Instalação FTTH 100MB'),
  ('José Almeida', '(11) 92345-6789', 'Av. Santo Amaro, 456 - Brooklin, SP', 'installation', 'high', 'completed', tech_ids[2], 'OS-2024-0002', -23.6100, -46.6700, '2024-12-01', 'Instalação FTTH 200MB'),
  ('Luciana Martins', '(11) 93456-7890', 'Rua Vergueiro, 789 - Liberdade, SP', 'repair', 'urgent', 'in_progress', tech_ids[3], 'OS-2024-0003', -23.5600, -46.6300, '2024-12-02', 'Sem sinal - cliente reclama há 2 dias'),
  ('Fernando Gomes', '(11) 94567-8901', 'Av. Paulista, 1500 - Bela Vista, SP', 'maintenance', 'normal', 'completed', tech_ids[4], 'OS-2024-0004', -23.5530, -46.6380, '2024-12-02', 'Manutenção preventiva ONU'),
  ('Carla Nascimento', '(11) 95678-9012', 'Rua Oscar Freire, 300 - Jardins, SP', 'installation', 'normal', 'completed', tech_ids[5], 'OS-2024-0005', -23.5620, -46.6680, '2024-12-03', 'Instalação FTTH 300MB - plano empresarial'),
  ('André Batista', '(11) 96789-0123', 'Rua Augusta, 900 - Consolação, SP', 'repair', 'high', 'assigned', tech_ids[6], 'OS-2024-0006', -23.5550, -46.6560, '2024-12-03', 'Fibra rompida na entrada do prédio'),
  ('Renata Cardoso', '(11) 97890-1234', 'Av. Rebouças, 600 - Pinheiros, SP', 'installation', 'normal', 'completed', tech_ids[7], 'OS-2024-0007', -23.5680, -46.6750, '2024-12-04', 'Instalação FTTH 100MB residencial'),
  ('Paulo Vieira', '(11) 98901-2345', 'Rua Haddock Lobo, 200 - Cerqueira César, SP', 'maintenance', 'normal', 'completed', tech_ids[8], 'OS-2024-0008', -23.5530, -46.6620, '2024-12-04', 'Troca de ONU - equipamento defeituoso'),
  ('Sandra Teixeira', '(11) 99012-3456', 'Av. Faria Lima, 1800 - Itaim Bibi, SP', 'installation', 'high', 'completed', tech_ids[9], 'OS-2024-0009', -23.5780, -46.6820, '2024-12-05', 'Instalação FTTH 500MB empresarial'),
  ('Marcos Ribeiro', '(11) 90123-4567', 'Rua Tutóia, 400 - Paraíso, SP', 'repair', 'urgent', 'in_progress', tech_ids[10], 'OS-2024-0010', -23.5780, -46.6430, '2024-12-05', 'Queda intermitente de sinal'),
  ('Tatiana Freitas', '(11) 91111-2222', 'Av. Ibirapuera, 200 - Moema, SP', 'installation', 'normal', 'pending', NULL, 'OS-2024-0011', -23.6000, -46.6500, '2024-12-06', 'Instalação FTTH 200MB'),
  ('Diego Machado', '(11) 92222-3333', 'Rua Domingos de Morais, 800 - Vila Mariana, SP', 'maintenance', 'normal', 'completed', tech_ids[11], 'OS-2024-0012', -23.5850, -46.6370, '2024-12-06', 'Manutenção preventiva cabo óptico'),
  ('Vanessa Pinto', '(11) 93333-4444', 'Av. Cidade Jardim, 500 - Itaim, SP', 'installation', 'normal', 'completed', tech_ids[12], 'OS-2024-0013', -23.5770, -46.6810, '2024-12-07', 'Instalação FTTH 100MB'),
  ('Rafael Cunha', '(11) 94444-5555', 'Rua da Consolação, 1200 - Centro, SP', 'repair', 'high', 'pending', NULL, 'OS-2024-0014', -23.5480, -46.6450, '2024-12-07', 'Sem conexão - prédio inteiro afetado'),
  ('Amanda Lopes', '(11) 95555-6666', 'Av. Brigadeiro Luís Antônio, 1000 - Bela Vista, SP', 'installation', 'normal', 'completed', tech_ids[13], 'OS-2024-0015', -23.5660, -46.6490, '2024-12-08', 'Instalação FTTH 300MB'),
  ('Gustavo Ramos', '(11) 96666-7777', 'Rua Liberdade, 400 - Liberdade, SP', 'maintenance', 'normal', 'completed', tech_ids[14], 'OS-2024-0016', -23.5580, -46.6300, '2024-12-08', 'Verificação de potência óptica'),
  ('Isabela Duarte', '(11) 97777-8888', 'Av. Henrique Schaumann, 300 - Pinheiros, SP', 'installation', 'normal', 'pending', NULL, 'OS-2024-0017', -23.5650, -46.6720, '2024-12-09', 'Instalação FTTH 200MB residencial'),
  ('Bruno Campos', '(11) 98888-9999', 'Rua Haddock Lobo, 600 - Jardim Paulista, SP', 'repair', 'normal', 'assigned', tech_ids[15], 'OS-2024-0018', -23.5560, -46.6640, '2024-12-09', 'Lentidão na conexão'),
  ('Priscila Moura', '(11) 99999-0000', 'Av. Paulista, 2500 - Cerqueira César, SP', 'installation', 'high', 'completed', tech_ids[1], 'OS-2024-0019', -23.5560, -46.6590, '2024-12-10', 'Instalação FTTH 1GB empresarial'),
  ('Rodrigo Fonseca', '(11) 90000-1111', 'Rua Oscar Freire, 900 - Jardins, SP', 'maintenance', 'normal', 'completed', tech_ids[2], 'OS-2024-0020', -23.5610, -46.6710, '2024-12-10', 'Manutenção de splitter')
  ON CONFLICT DO NOTHING;
END $$;
