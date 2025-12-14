-- ============================================
-- Script de Inicialización - E-commerce DB
-- ============================================

-- Crear tabla de promociones
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount INTEGER NOT NULL CHECK (discount >= 0 AND discount <= 100)
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    promo_id INTEGER,
    CONSTRAINT fk_promo
        FOREIGN KEY (promo_id)
        REFERENCES promotions(id)
        ON DELETE SET NULL
);

-- ============================================
-- DATOS DE SEMILLA - Promociones
-- ============================================

INSERT INTO promotions (code, discount) VALUES
('WELCOME20', 20),
('FLASH50', 50),
('NO_TAX', 15),
('SUMMER10', 10),
('CYBER25', 25),
('FALL30', 30);

-- ============================================
-- DATOS DE SEMILLA - Productos (100+ items)
-- Incluye productos con palíndromos en títulos/descripciones
-- ============================================

INSERT INTO products (title, description, price, image_url, promo_id) VALUES

-- CATEGORÍA: ELECTRÓNICA (con palíndromos)
('Laptop Gamer Pro', 'Equipo de alto nivel para gaming profesional con radar de temperatura integrado', 1299.99, 'https://placehold.co/400/1e293b/white?text=Laptop+Gamer', 1),
('Mouse Radar Gaming', 'Mouse con sensor radar óptico de alta precisión, 16000 DPI', 89.99, 'https://placehold.co/400/ef4444/white?text=Mouse+Radar', 2),
('Teclado Mecánico RGB', 'Teclado mecánico retroiluminado, somos líderes en tecnología', 129.99, 'https://placehold.co/400/8b5cf6/white?text=Teclado+RGB', 1),
('Monitor Civic 27"', 'Monitor civic de 27 pulgadas, resolución 4K, 144Hz', 549.99, 'https://placehold.co/400/3b82f6/white?text=Monitor+Civic', NULL),
('Webcam Level HD', 'Cámara web level profesional 1080p con micrófono dual', 79.99, NULL, 3),
('Audífonos Somos Pro', 'Audífonos bluetooth premium, somos expertos en audio', 159.99, 'https://placehold.co/400/10b981/white?text=Audifonos', 4),
('Hub USB Rotor', 'Hub USB con diseño rotor giratorio, 7 puertos USB 3.0', 45.99, NULL, 1),
('SSD Radar 1TB', 'Disco sólido con tecnología radar de lectura rápida', 119.99, 'https://placehold.co/400/f59e0b/white?text=SSD+Radar', 2),
('Tablet Ana 10"', 'Tablet Ana de 10 pulgadas, 128GB, Android 13', 299.99, NULL, NULL),
('Smartwatch Ojo', 'Reloj inteligente con sensor ojo para monitoreo de salud', 199.99, 'https://placehold.co/400/ec4899/white?text=Smartwatch', 5),

-- CATEGORÍA: HOGAR Y COCINA
('Cafetera Oso', 'Cafetera automática con diseño de oso, 12 tazas', 89.99, 'https://placehold.co/400/92400e/white?text=Cafetera+Oso', 3),
('Licuadora Ala Power', 'Licuadora de alta potencia con ala de 6 cuchillas', 129.99, NULL, 1),
('Horno Tenet Smart', 'Horno eléctrico tenet con control inteligente', 399.99, 'https://placehold.co/400/dc2626/white?text=Horno+Tenet', NULL),
('Aspiradora Radar', 'Aspiradora robot con navegación radar láser', 349.99, 'https://placehold.co/400/7c3aed/white?text=Aspiradora', 2),
('Ventilador Ese Turbo', 'Ventilador de torre ese con 3 velocidades', 79.99, NULL, 4),
('Plancha Asa Pro', 'Plancha de vapor con asa ergonómica antideslizante', 49.99, 'https://placehold.co/400/0891b2/white?text=Plancha', NULL),
('Batidora Bob Chef', 'Batidora de mano Bob para repostería profesional', 69.99, NULL, 3),
('Freidora Oro Air', 'Freidora de aire color oro, 5.5 litros', 159.99, 'https://placehold.co/400/eab308/white?text=Freidora+Oro', 1),
('Microondas Noon', 'Microondas noon de 1.1 pies cúbicos, 1000W', 129.99, NULL, NULL),
('Tostadora Kayak', 'Tostadora kayak de 4 ranuras con control digital', 59.99, 'https://placehold.co/400/f97316/white?text=Tostadora', 5),

-- CATEGORÍA: MUEBLES Y DECORACIÓN
('Silla Civic Ergonómica', 'Silla de oficina civic con soporte lumbar', 279.99, 'https://placehold.co/400/1e40af/white?text=Silla+Civic', 2),
('Mesa Radar Wood', 'Mesa de madera con detector radar de movimiento LED', 449.99, NULL, NULL),
('Lámpara Ojo LED', 'Lámpara de escritorio con sensor ojo automático', 39.99, 'https://placehold.co/400/facc15/white?text=Lampara+Ojo', 3),
('Librero Sagas', 'Librero sagas de 5 niveles, madera roble', 189.99, 'https://placehold.co/400/78716c/white?text=Librero', NULL),
('Espejo Level', 'Espejo level de cuerpo completo con marco LED', 99.99, NULL, 1),
('Alfombra Oso Suave', 'Alfombra con diseño de oso, extra suave, 2x3m', 79.99, 'https://placehold.co/400/a16207/white?text=Alfombra+Oso', 4),
('Cojín Ala Premium', 'Set de 4 cojines ala decorativos, algodón', 49.99, NULL, NULL),
('Cortinas Refer', 'Cortinas refer blackout, 2.5m de alto', 69.99, 'https://placehold.co/400/4338ca/white?text=Cortinas', 2),
('Reloj Rotor Pared', 'Reloj de pared rotor con péndulo decorativo', 89.99, 'https://placehold.co/400/be123c/white?text=Reloj+Rotor', NULL),
('Perchero Ama Style', 'Perchero ama de pie, metal negro mate', 59.99, NULL, 5),

-- CATEGORÍA: DEPORTES Y FITNESS
('Pesas Radar Gym', 'Set de pesas radar ajustables 5-25kg', 199.99, 'https://placehold.co/400/047857/white?text=Pesas+Radar', 1),
('Bicicleta Civic Pro', 'Bicicleta estática civic con monitor digital', 449.99, NULL, 2),
('Caminadora Level', 'Caminadora level eléctrica plegable, 12km/h', 599.99, 'https://placehold.co/400/065f46/white?text=Caminadora', 3),
('Colchoneta Oso Yoga', 'Colchoneta oso extra gruesa para yoga, 6mm', 34.99, 'https://placehold.co/400/a21caf/white?text=Colchoneta', NULL),
('Ligas Refer Fitness', 'Set de 5 ligas refer de resistencia', 24.99, NULL, 4),
('Guantes Kayak Box', 'Guantes kayak para boxeo, cuero sintético', 49.99, 'https://placehold.co/400/b91c1c/white?text=Guantes', 1),
('Balón Tenet Soccer', 'Balón tenet profesional, tamaño 5', 39.99, NULL, NULL),
('Raqueta Stats Tennis', 'Raqueta stats de tenis, fibra de carbono', 129.99, 'https://placehold.co/400/1e3a8a/white?text=Raqueta', 5),
('Mancuernas Oro Set', 'Set de mancuernas oro cromadas, 10kg c/u', 89.99, 'https://placehold.co/400/ca8a04/white?text=Mancuernas', NULL),
('Cuerda Ala Jump', 'Cuerda ala para saltar con contador digital', 19.99, NULL, 2),

-- CATEGORÍA: TECNOLOGÍA Y GADGETS
('Drone Radar Vision', 'Drone con cámara radar 4K y GPS', 699.99, 'https://placehold.co/400/1e293b/white?text=Drone+Radar', 2),
('Powerbank Civic 20000', 'Batería portátil civic de 20000mAh', 49.99, NULL, 3),
('Auriculares Noon Pro', 'Auriculares noon in-ear con cancelación de ruido', 89.99, 'https://placehold.co/400/312e81/white?text=Auriculares', 1),
('Cargador Rotor Multi', 'Cargador rotor inalámbrico de 15W', 34.99, NULL, NULL),
('Speaker Kayak Bass', 'Bocina kayak bluetooth resistente al agua', 79.99, 'https://placehold.co/400/0f766e/white?text=Speaker', 4),
('Ring Light Ojo Pro', 'Aro de luz ojo con trípode, 18 pulgadas', 69.99, 'https://placehold.co/400/fbbf24/white?text=Ring+Light', NULL),
('Cable Refer USB-C', 'Cable refer USB-C 3.0 de 2 metros', 14.99, NULL, 1),
('Micrófono Level Stream', 'Micrófono level condensador para streaming', 129.99, 'https://placehold.co/400/7c2d12/white?text=Microfono', 5),
('Tripie Asa Camera', 'Tripié asa profesional hasta 5kg', 89.99, NULL, NULL),
('Estabilizador Somos Gimbal', 'Estabilizador somos de 3 ejes para smartphone', 159.99, 'https://placehold.co/400/581c87/white?text=Gimbal', 2),

-- CATEGORÍA: OFICINA Y PAPELERÍA
('Escritorio Civic Desk', 'Escritorio civic ajustable en altura', 349.99, 'https://placehold.co/400/475569/white?text=Escritorio', NULL),
('Organizador Radar', 'Organizador radar de escritorio con cajones', 39.99, NULL, 3),
('Lámpara Ana Escritorio', 'Lámpara ana LED regulable con USB', 44.99, 'https://placehold.co/400/facc15/white?text=Lampara+Ana', 1),
('Silla Oso Gamer', 'Silla gamer oso con soporte lumbar y cervical', 299.99, 'https://placehold.co/400/dc2626/white?text=Silla+Oso', 2),
('Monitor Soporte Level', 'Soporte level para monitor ajustable', 49.99, NULL, NULL),
('Mousepad Refer XXL', 'Mousepad refer extendido 90x40cm', 29.99, 'https://placehold.co/400/334155/white?text=Mousepad', 4),
('Archivero Tenet', 'Archivero tenet metálico de 3 gavetas', 179.99, NULL, NULL),
('Pizarra Ojo Magnética', 'Pizarra ojo blanca magnética 120x90cm', 89.99, 'https://placehold.co/400/f8fafc/white?text=Pizarra+Ojo', 5),
('Calculadora Stats Pro', 'Calculadora stats científica programable', 34.99, NULL, 1),
('Guillotina Ala Paper', 'Guillotina ala para papel, corte 30cm', 24.99, NULL, NULL),

-- CATEGORÍA: AUDIO Y VIDEO
('TV Radar Smart 55"', 'Televisor radar smart 4K UHD, 55 pulgadas', 699.99, 'https://placehold.co/400/1e1b4b/white?text=TV+Radar+55', 2),
('Soundbar Civic 2.1', 'Barra de sonido civic con subwoofer inalámbrico', 249.99, NULL, 3),
('Proyector Noon HD', 'Proyector noon portátil 1080p, 5000 lúmenes', 399.99, 'https://placehold.co/400/422006/white?text=Proyector', 1),
('Reproductor Kayak 4K', 'Reproductor kayak multimedia 4K UHD', 89.99, NULL, NULL),
('Amplificador Rotor', 'Amplificador rotor estéreo 100W', 179.99, 'https://placehold.co/400/292524/white?text=Amplificador', 4),
('Consola Tenet Game', 'Consola tenet retro con 500 juegos', 79.99, 'https://placehold.co/400/7e22ce/white?text=Consola', NULL),
('Control Ese Wireless', 'Control ese inalámbrico para PC', 39.99, NULL, 5),
('Pedestal Ama TV', 'Pedestal ama universal para TV 32-65"', 129.99, 'https://placehold.co/400/18181b/white?text=Pedestal', NULL),
('Antena Sagas HDTV', 'Antena sagas digital para HDTV, alcance 80km', 34.99, NULL, 2),
('Cable Oro HDMI', 'Cable oro HDMI 2.1 de 3 metros, 8K', 24.99, NULL, NULL),

-- CATEGORÍA: CUIDADO PERSONAL
('Secadora Oso Hair', 'Secadora oso de cabello iónica 2000W', 59.99, 'https://placehold.co/400/be185d/white?text=Secadora+Oso', 1),
('Afeitadora Radar Pro', 'Afeitadora radar eléctrica 5D recargable', 89.99, NULL, 3),
('Cepillo Ala Dental', 'Cepillo ala dental eléctrico sónico', 49.99, 'https://placehold.co/400/0891b2/white?text=Cepillo+Ala', NULL),
('Báscula Civic Digital', 'Báscula civic digital de baño, 180kg', 34.99, NULL, 4),
('Masajeador Level', 'Masajeador level de cuello y espalda', 69.99, 'https://placehold.co/400/701a75/white?text=Masajeador', 2),
('Termómetro Ojo IR', 'Termómetro ojo infrarrojo sin contacto', 29.99, NULL, NULL),
('Humidificador Noon', 'Humidificador noon ultrasónico 4L', 54.99, 'https://placehold.co/400/7dd3fc/white?text=Humidificador', 5),
('Espejo Kayak LED', 'Espejo kayak de maquillaje con luz LED', 39.99, NULL, 1),
('Cortapelos Refer', 'Cortapelos refer profesional inalámbrico', 44.99, 'https://placehold.co/400/475569/white?text=Cortapelos', NULL),
('Plancha Oro Hair', 'Plancha oro alisadora de cerámica', 49.99, NULL, 3),

-- CATEGORÍA: ACCESORIOS Y OTROS
('Mochila Radar Travel', 'Mochila radar para laptop 17", antirrobo', 79.99, 'https://placehold.co/400/1e3a8a/white?text=Mochila+Radar', 2),
('Maleta Civic 24"', 'Maleta civic rígida con TSA lock', 129.99, NULL, NULL),
('Paraguas Somos Auto', 'Paraguas somos automático invertido', 24.99, 'https://placehold.co/400/1e40af/white?text=Paraguas', 4),
('Cartera Oso Leather', 'Cartera oso de piel genuina con RFID', 39.99, NULL, 1),
('Lentes Refer UV400', 'Lentes refer de sol polarizados UV400', 49.99, 'https://placehold.co/400/27272a/white?text=Lentes+Refer', NULL),
('Gorra Level Sports', 'Gorra level deportiva ajustable', 19.99, NULL, 5),
('Reloj Ana Digital', 'Reloj ana deportivo digital multifunción', 34.99, 'https://placehold.co/400/1f2937/white?text=Reloj+Ana', NULL),
('Cinturón Tenet', 'Cinturón tenet de piel reversible', 29.99, NULL, 2),
('Bufanda Ala Wool', 'Bufanda ala de lana merino', 24.99, NULL, NULL),
('Guantes Oro Touch', 'Guantes oro para pantalla táctil', 14.99, NULL, 3),

-- CATEGORÍA: JUGUETES Y ENTRETENIMIENTO
('Peluche Oso Grande', 'Peluche oso gigante de 1 metro', 79.99, 'https://placehold.co/400/78350f/white?text=Peluche+Oso', 1),
('Rompecabezas Radar 1000', 'Rompecabezas radar de 1000 piezas', 24.99, NULL, NULL),
('Drone Kayak Mini', 'Mini drone kayak para principiantes', 59.99, 'https://placehold.co/400/1e293b/white?text=Drone+Kayak', 4),
('Cubo Rubik Civic', 'Cubo rubik civic speedcube profesional', 14.99, NULL, 2),
('Tablero Stats Chess', 'Tablero stats de ajedrez magnético', 34.99, 'https://placehold.co/400/422006/white?text=Ajedrez', NULL),
('LEGO Tenet Set', 'Set LEGO tenet de construcción 500 pzs', 49.99, NULL, 5);

-- ============================================
-- Verificación de datos insertados
-- ============================================

SELECT 'Promociones creadas:' as info, COUNT(*) as total FROM promotions
UNION ALL
SELECT 'Productos creados:', COUNT(*) FROM products
UNION ALL
SELECT 'Productos con imagen:', COUNT(*) FROM products WHERE image_url IS NOT NULL
UNION ALL
SELECT 'Productos sin imagen:', COUNT(*) FROM products WHERE image_url IS NULL
UNION ALL
SELECT 'Productos con promoción:', COUNT(*) FROM products WHERE promo_id IS NOT NULL
UNION ALL
SELECT 'Productos sin promoción:', COUNT(*) FROM products WHERE promo_id IS NULL;
