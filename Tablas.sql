-- ===== ELITE AUTO SERVICES - ESQUEMA FINAL =====

-- Limpiar
DROP TABLE IF EXISTS contact_inquiry CASCADE;
DROP TABLE IF EXISTS vehicle CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- 1. Admin Users
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  -- email VARCHAR(100) UNIQUE NOT NULL,
  -- phone VARCHAR(20),
  status VARCHAR(1) DEFAULT 'A',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vehicles (SIN title vacío - se genera automáticamente)
CREATE TABLE vehicle (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL DEFAULT '', -- Se llenará con trigger
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  type VARCHAR(30) NOT NULL,
  color VARCHAR(30) NOT NULL,
  mileage VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  specs JSONB,
  image_main VARCHAR(255),
  images JSONB,
  status VARCHAR(20) DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contact Inquiries
CREATE TABLE contact_inquiry (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  interest_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== TRIGGER AUTOMÁTICO PARA TITLE =====
CREATE OR REPLACE FUNCTION auto_generate_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.title = '' OR NEW.title IS NULL THEN
    NEW.title := CONCAT(NEW.make, ' ', NEW.model, ' ', NEW.year);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_title
  BEFORE INSERT OR UPDATE ON vehicle
  FOR EACH ROW EXECUTE FUNCTION auto_generate_title();

CREATE TRIGGER update_vehicle_updated_at 
  BEFORE UPDATE ON vehicle 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices
CREATE INDEX idx_vehicle_status ON vehicle(status);
CREATE INDEX idx_vehicle_price ON vehicle(price);
CREATE INDEX idx_vehicle_featured ON vehicle(featured);
CREATE INDEX idx_contact_status ON contact_inquiry(status);


INSERT INTO vehicle (make, model, year, type, color, mileage, price, specs, image_main, images) VALUES
-- SUVs (1-10)
('Toyota', 'RAV4', 2019, 'SUV', 'Blue Pearl', '45000', 24500.00, 
 '{"condition": "Excellent", "warranty": "12 Months", "features": ["Fully Inspected", "Clean Title", "No Accidents"]}',
 'toyota-rav4.jpg',
 '{"main": "toyota-rav4.jpg", "gallery": ["toyota-rav4.jpg", "toyota-rav4.jpg", "toyota-rav4.jpg", "toyota-rav4.jpg", "toyota-rav4.jpg"]}'),

('Honda', 'CR-V', 2021, 'SUV', 'Crystal Black', '32000', 27800.00, 
 '{"condition": "Like New", "warranty": "18 Months", "features": ["Navigation", "Backup Camera", "Sunroof"]}',
 'honda-crv.jpg',
 '{"main": "honda-crv.jpg", "gallery": ["honda-crv.jpg", "honda-crv.jpg", "honda-crv.jpg", "honda-crv.jpg", "honda-crv.jpg"]}'),

('Jeep', 'Grand Cherokee', 2020, 'SUV', 'Bright White', '51000', 32900.00, 
 '{"condition": "Excellent", "warranty": "6 Months", "features": ["4x4", "Leather Seats", "Heated Seats"]}',
 'jeep-grand-cherokee.jpg',
 '{"main": "jeep-grand-cherokee.jpg", "gallery": ["jeep-grand-cherokee.jpg", "jeep-grand-cherokee.jpg", "jeep-grand-cherokee.jpg", "jeep-grand-cherokee.jpg", "jeep-grand-cherokee.jpg"]}'),

('Ford', 'Escape', 2022, 'SUV', 'Agate Black', '21000', 26500.00, 
 '{"condition": "Excellent", "warranty": "12 Months", "features": ["Hybrid", "Apple CarPlay", "Adaptive Cruise"]}',
 'ford-escape.jpg',
 '{"main": "ford-escape.jpg", "gallery": ["ford-escape.jpg", "ford-escape.jpg", "ford-escape.jpg", "ford-escape.jpg", "ford-escape.jpg"]}'),

('Subaru', 'Forester', 2018, 'SUV', 'Crystal White', '68000', 21800.00, 
 '{"condition": "Very Good", "warranty": "3 Months", "features": ["AWD", "EyeSight", "Roof Rails"]}',
 'subaru-forester.jpg',
 '{"main": "subaru-forester.jpg", "gallery": ["subaru-forester.jpg", "subaru-forester.jpg", "subaru-forester.jpg", "subaru-forester.jpg", "subaru-forester.jpg"]}'),

('Hyundai', 'Tucson', 2023, 'SUV', 'Shimmering Silver', '15000', 29900.00, 
 '{"condition": "Like New", "warranty": "24 Months", "features": ["Wireless Charging", "Blind Spot Monitor"]}',
 'hyundai-tucson.jpg',
 '{"main": "hyundai-tucson.jpg", "gallery": ["hyundai-tucson.jpg", "hyundai-tucson.jpg", "hyundai-tucson.jpg", "hyundai-tucson.jpg", "hyundai-tucson.jpg"]}'),

('Kia', 'Sportage', 2020, 'SUV', 'Snow White Pearl', '44000', 23900.00, 
 '{"condition": "Excellent", "warranty": "12 Months", "features": ["Panoramic Roof", "Smart Key"]}',
 'kia-sportage.jpg',
 '{"main": "kia-sportage.jpg", "gallery": ["kia-sportage.jpg", "kia-sportage.jpg", "kia-sportage.jpg", "kia-sportage.jpg", "kia-sportage.jpg"]}'),

('Nissan', 'Rogue', 2021, 'SUV', 'Scarlet Ember', '37000', 26700.00, 
 '{"condition": "Excellent", "warranty": "9 Months", "features": ["ProPilot Assist", "360 Camera"]}',
 'nissan-rogue.jpg',
 '{"main": "nissan-rogue.jpg", "gallery": ["nissan-rogue.jpg", "nissan-rogue.jpg", "nissan-rogue.jpg", "nissan-rogue.jpg", "nissan-rogue.jpg"]}'),

('Mazda', 'CX-5', 2019, 'SUV', 'Soul Red Crystal', '42000', 24900.00, 
 '{"condition": "Excellent", "warranty": "6 Months", "features": ["G-Vectoring Control", "Bose Audio"]}',
 'mazda-cx5.jpg',
 '{"main": "mazda-cx5.jpg", "gallery": ["mazda-cx5.jpg", "mazda-cx5.jpg", "mazda-cx5.jpg", "mazda-cx5.jpg", "mazda-cx5.jpg"]}'),

('Chevrolet', 'Equinox', 2022, 'SUV', 'Mosaic Black', '28000', 25500.00, 
 '{"condition": "Excellent", "warranty": "15 Months", "features": ["Hands-Free Liftgate", "Wireless Charging"]}',
 'chevy-equinox.jpg',
 '{"main": "chevy-equinox.jpg", "gallery": ["chevy-equinox.jpg", "chevy-equinox.jpg", "chevy-equinox.jpg", "chevy-equinox.jpg", "chevy-equinox.jpg"]}'),

-- SEDANS (11-20)
('Toyota', 'Camry', 2021, 'Sedan', 'Midnight Black', '39000', 23800.00, 
 '{"condition": "Excellent", "warranty": "12 Months", "features": ["Toyota Safety Sense", "Wireless CarPlay"]}',
 'toyota-camry.jpg',
 '{"main": "toyota-camry.jpg", "gallery": ["toyota-camry.jpg", "toyota-camry.jpg", "toyota-camry.jpg", "toyota-camry.jpg", "toyota-camry.jpg"]}'),

('Honda', 'Accord', 2020, 'Sedan', 'Lunar Silver', '46000', 24900.00, 
 '{"condition": "Excellent", "warranty": "9 Months", "features": ["Honda Sensing", "Leather Seats"]}',
 'honda-accord.jpg',
 '{"main": "honda-accord.jpg", "gallery": ["honda-accord.jpg", "honda-accord.jpg", "honda-accord.jpg", "honda-accord.jpg", "honda-accord.jpg"]}'),

('Nissan', 'Altima', 2022, 'Sedan', 'Gun Metallic', '25000', 25900.00, 
 '{"condition": "Like New", "warranty": "18 Months", "features": ["ProPilot", "Zero Gravity Seats"]}',
 'nissan-altima.jpg',
 '{"main": "nissan-altima.jpg", "gallery": ["nissan-altima.jpg", "nissan-altima.jpg", "nissan-altima.jpg", "nissan-altima.jpg", "nissan-altima.jpg"]}'),

('Hyundai', 'Sonata', 2023, 'Sedan', 'Hampton Gray', '12000', 28900.00, 
 '{"condition": "Like New", "warranty": "24 Months", "features": ["Digital Key", "Highway Driving Assist"]}',
 'hyundai-sonata.jpg',
 '{"main": "hyundai-sonata.jpg", "gallery": ["hyundai-sonata.jpg", "hyundai-sonata.jpg", "hyundai-sonata.jpg", "hyundai-sonata.jpg", "hyundai-sonata.jpg"]}'),
 ('Kia', 'K5', 2021, 'Sedan', 'Glacial White', '34000', 24800.00, 
 '{"condition": "Excellent", "warranty": "12 Months", "features": ["LED Headlights", "Surround View"]}',
 'kia-k5.jpg',
 '{"main": "kia-k5.jpg", "gallery": ["kia-k5.jpg", "kia-k5.jpg", "kia-k5.jpg", "kia-k5.jpg", "kia-k5.jpg"]}'),

('Volkswagen', 'Passat', 2019, 'Sedan', 'Pure White', '52000', 19900.00, 
 '{"condition": "Very Good", "warranty": "3 Months", "features": ["Digital Cockpit", "Adaptive Cruise"]}',
 'volkswagen-passat.jpg',
 '{"main": "volkswagen-passat.jpg", "gallery": ["volkswagen-passat.jpg", "volkswagen-passat.jpg", "volkswagen-passat.jpg", "volkswagen-passat.jpg", "volkswagen-passat.jpg"]}'),

('Mazda', 'Mazda6', 2020, 'Sedan', 'Jet Black', '41000', 23500.00, 
 '{"condition": "Excellent", "warranty": "6 Months", "features": ["i-Activsense", "Bose Audio"]}',
 'mazda-mazda6.jpg',
 '{"main": "mazda-mazda6.jpg", "gallery": ["mazda-mazda6.jpg", "mazda-mazda6.jpg", "mazda-mazda6.jpg", "mazda-mazda6.jpg", "mazda-mazda6.jpg"]}'),

('Subaru', 'Legacy', 2021, 'Sedan', 'Magnetite Gray', '30000', 26900.00, 
 '{"condition": "Excellent", "warranty": "12 Months", "features": ["EyeSight", "AWD"]}',
 'subaru-legacy.jpg',
 '{"main": "subaru-legacy.jpg", "gallery": ["subaru-legacy.jpg", "subaru-legacy.jpg", "subaru-legacy.jpg", "subaru-legacy.jpg", "subaru-legacy.jpg"]}'),

('Toyota', 'Corolla', 2022, 'Sedan', 'Ruby Flare Pearl', '22000', 21900.00, 
 '{"condition": "Excellent", "warranty": "15 Months", "features": ["Safety Sense 3.0", "Hybrid Available"]}',
 'toyota-corolla.jpg',
 '{"main": "toyota-corolla.jpg", "gallery": ["toyota-corolla.jpg", "toyota-corolla.jpg", "toyota-corolla.jpg", "toyota-corolla.jpg", "toyota-corolla.jpg"]}'),

('Honda', 'Civic', 2023, 'Sedan', 'Sonic Gray Pearl', '8000', 27900.00, 
 '{"condition": "Like New", "warranty": "24 Months", "features": ["Honda Sensing", "Turbo Engine"]}',
 'honda-civic.jpg',
 '{"main": "honda-civic.jpg", "gallery": ["honda-civic.jpg", "honda-civic.jpg", "honda-civic.jpg", "honda-civic.jpg", "honda-civic.jpg"]}'),

-- TRUCKS (21-30)
('Ford', 'F-150', 2020, 'Truck', 'Oxford White', '65000', 35900.00, 
 '{"condition": "Excellent", "warranty": "6 Months", "features": ["5.0L V8", "Tow Package", "Sync 4"]}',
 'ford-f150.jpg',
 '{"main": "ford-f150.jpg", "gallery": ["ford-f150.jpg", "ford-f150.jpg", "ford-f150.jpg", "ford-f150.jpg", "ford-f150.jpg"]}'),

('Chevrolet', 'Silverado 1500', 2021, 'Truck', 'Summit White', '48000', 37900.00, 
 '{"condition": "Excellent", "warranty": "12 Months", "features": ["6.2L V8", "Trailering Package"]}',
 'chevy-silverado.jpg',
 '{"main": "chevy-silverado.jpg", "gallery": ["chevy-silverado.jpg", "chevy-silverado.jpg", "chevy-silverado.jpg", "chevy-silverado.jpg", "chevy-silverado.jpg"]}'),

('Ram', '1500', 2019, 'Truck', 'Delmonico Red', '72000', 32800.00, 
 '{"condition": "Very Good", "warranty": "3 Months", "features": ["5.7L HEMI", "Air Suspension"]}',
 'ram-1500.jpg',
 '{"main": "ram-1500.jpg", "gallery": ["ram-1500.jpg", "ram-1500.jpg", "ram-1500.jpg", "ram-1500.jpg", "ram-1500.jpg"]}'),

('Toyota', 'Tacoma', 2022, 'Truck', 'Celestial Silver', '29000', 34900.00, 
 '{"condition": "Excellent", "warranty": "18 Months", "features": ["4x4", "TRD Off-Road"]}',
 'toyota-tacoma.jpg',
 '{"main": "toyota-tacoma.jpg", "gallery": ["toyota-tacoma.jpg", "toyota-tacoma.jpg", "toyota-tacoma.jpg", "toyota-tacoma.jpg", "toyota-tacoma.jpg"]}'),

('GMC', 'Sierra 1500', 2020, 'Truck', 'Onyx Black', '54000', 36800.00, 
 '{"condition": "Excellent", "warranty": "9 Months", "features": ["MultiPro Tailgate", "Adaptive Ride"]}',
 'gmc-sierra.jpg',
 '{"main": "gmc-sierra.jpg", "gallery": ["gmc-sierra.jpg", "gmc-sierra.jpg", "gmc-sierra.jpg", "gmc-sierra.jpg", "gmc-sierra.jpg"]}'),

('Ford', 'F-250', 2018, 'Truck', 'Race Red', '89000', 41900.00, 
 '{"condition": "Good", "warranty": "None", "features": ["Power Stroke Diesel", "Heavy Duty"]}',
 'ford-f250.jpg',
 '{"main": "ford-f250.jpg", "gallery": ["ford-f250.jpg", "ford-f250.jpg", "ford-f250.jpg", "ford-f250.jpg", "ford-f250.jpg"]}'),

('Chevrolet', 'Colorado', 2021, 'Truck', 'Radiant Red', '37000', 29900.00, 
 '{"condition": "Excellent", "warranty": "12 Months", "features": ["4x4", "Z71 Package"]}',
 'chevy-colorado.jpg',
 '{"main": "chevy-colorado.jpg", "gallery": ["chevy-colorado.jpg", "chevy-colorado.jpg", "chevy-colorado.jpg", "chevy-colorado.jpg", "chevy-colorado.jpg"]}'),

('Nissan', 'Frontier', 2022, 'Truck', 'Everest White', '24000', 33900.00, 
 '{"condition": "Like New", "warranty": "15 Months", "features": ["PRO-4X", "Bilstein Shocks"]}',
 'nissan-frontier.jpg',
 '{"main": "nissan-frontier.jpg", "gallery": ["nissan-frontier.jpg", "nissan-frontier.jpg", "nissan-frontier.jpg", "nissan-frontier.jpg", "nissan-frontier.jpg"]}'),

('Toyota', 'Tundra', 2023, 'Truck', 'Midnight Black', '11000', 53900.00, 
 '{"condition": "Like New", "warranty": "24 Months", "features": ["i-FORCE MAX Hybrid", "Adaptive Suspension"]}',
 'toyota-tundra.jpg',
 '{"main": "toyota-tundra.jpg", "gallery": ["toyota-tundra.jpg", "toyota-tundra.jpg", "toyota-tundra.jpg", "toyota-tundra.jpg", "toyota-tundra.jpg"]}'),

('Ram', '2500', 2020, 'Truck', 'Flame Red', '61000', 48900.00, 
 '{"condition": "Excellent", "warranty": "6 Months", "features": ["Cummins Diesel", "Heavy Duty Towing"]}',
 'ram-2500.jpg',
 '{"main": "ram-2500.jpg", "gallery": ["ram-2500.jpg", "ram-2500.jpg", "ram-2500.jpg", "ram-2500.jpg", "ram-2500.jpg"]}');