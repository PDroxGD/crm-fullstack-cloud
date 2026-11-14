CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    segment VARCHAR(20) NOT NULL DEFAULT 'Standard',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clients (name, email, segment) VALUES
    ('Pedro Madero', 'pedro@ejemplo.com', 'VIP'),
    ('Cliente Corporativo', 'contacto@empresa.com', 'Premium')
ON CONFLICT (email) DO NOTHING;