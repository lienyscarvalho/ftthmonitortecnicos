
-- Insert sample technicians with locations around São Paulo
INSERT INTO public.technicians (name, phone, email, status, current_location_lat, current_location_lng, current_address) VALUES
('Carlos Silva - MAT001', '(11) 98765-4321', 'carlos.silva@ftth.com', 'available', -23.5505, -46.6333, 'Av. Paulista, 1000 - São Paulo, SP'),
('Ana Santos - MAT002', '(11) 97654-3210', 'ana.santos@ftth.com', 'busy', -23.5629, -46.6544, 'Rua Augusta, 500 - São Paulo, SP'),
('Roberto Oliveira - MAT003', '(11) 96543-2109', 'roberto.oliveira@ftth.com', 'available', -23.5443, -46.6388, 'Rua da Consolação, 300 - São Paulo, SP'),
('Fernanda Lima - MAT004', '(11) 95432-1098', 'fernanda.lima@ftth.com', 'busy', -23.5875, -46.6580, 'Av. Brigadeiro Luís Antônio, 2020 - São Paulo, SP'),
('Marcos Pereira - MAT005', '(11) 94321-0987', 'marcos.pereira@ftth.com', 'offline', -23.5330, -46.6250, 'Rua Haddock Lobo, 800 - São Paulo, SP'),
('Juliana Costa - MAT006', '(11) 93210-9876', 'juliana.costa@ftth.com', 'available', -23.5700, -46.6470, 'Av. Rebouças, 1200 - São Paulo, SP'),
('Pedro Souza - MAT007', '(11) 92109-8765', 'pedro.souza@ftth.com', 'busy', -23.5580, -46.6620, 'Rua Oscar Freire, 600 - São Paulo, SP'),
('Mariana Alves - MAT008', '(11) 91098-7654', 'mariana.alves@ftth.com', 'available', -23.5950, -46.6350, 'Av. Ibirapuera, 400 - São Paulo, SP'),
('Lucas Ferreira - MAT009', '(11) 90987-6543', 'lucas.ferreira@ftth.com', 'offline', -23.5200, -46.6100, 'Rua Domingos de Morais, 1500 - São Paulo, SP'),
('Patricia Rodrigues - MAT010', '(11) 89876-5432', 'patricia.rodrigues@ftth.com', 'busy', -23.5480, -46.6700, 'Av. Faria Lima, 3000 - São Paulo, SP'),
('Ricardo Mendes - MAT011', '(11) 88765-4321', 'ricardo.mendes@ftth.com', 'available', -23.5100, -46.6200, 'Rua Vergueiro, 2000 - São Paulo, SP'),
('Camila Barbosa - MAT012', '(11) 87654-3210', 'camila.barbosa@ftth.com', 'busy', -23.5750, -46.6800, 'Av. Cidade Jardim, 800 - São Paulo, SP'),
('Thiago Nunes - MAT013', '(11) 86543-2109', 'thiago.nunes@ftth.com', 'available', -23.5650, -46.6150, 'Rua Liberdade, 100 - São Paulo, SP'),
('Bianca Moreira - MAT014', '(11) 85432-1098', 'bianca.moreira@ftth.com', 'offline', -23.5350, -46.6550, 'Av. Henrique Schaumann, 500 - São Paulo, SP'),
('Gabriel Araújo - MAT015', '(11) 84321-0987', 'gabriel.araujo@ftth.com', 'available', -23.5900, -46.6500, 'Rua Tutóia, 700 - São Paulo, SP')
ON CONFLICT DO NOTHING;
