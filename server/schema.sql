-- Beauty Model MySQL schema

CREATE DATABASE IF NOT EXISTS beauty_model CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beauty_model;

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  hue INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  compare_at INT DEFAULT NULL,
  category VARCHAR(64) NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  reviews INT NOT NULL,
  shades JSON DEFAULT NULL,
  ingredients JSON DEFAULT NULL,
  badges JSON DEFAULT NULL,
  description TEXT NOT NULL,
  details JSON DEFAULT NULL,
  image TEXT NOT NULL,
  hue INT NOT NULL,
  is_new TINYINT(1) NOT NULL DEFAULT 0,
  is_bestseller TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (category) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  line1 TEXT NOT NULL,
  city VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  pin VARCHAR(20) NOT NULL,
  delivery_method VARCHAR(32) NOT NULL,
  payment_method VARCHAR(32) NOT NULL,
  subtotal INT NOT NULL,
  shipping INT NOT NULL,
  tax INT NOT NULL,
  total INT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(64) NOT NULL,
  shade VARCHAR(80) DEFAULT NULL,
  quantity INT NOT NULL,
  unit_price INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categories (id, name, tagline, hue) VALUES
('make-up-vanity', 'Make-up vanity', 'Luxury glam, daily wear', 350),
('bath-and-body', 'Bath and body', 'Rituals for skin and scent', 35),
('self-care', 'Self care', 'Hand-finished wellness essentials', 95),
('salon', 'Salon', 'Salon-grade treatments', 150)
ON DUPLICATE KEY UPDATE name=VALUES(name), tagline=VALUES(tagline), hue=VALUES(hue);

INSERT INTO products (id, slug, name, tagline, price, compare_at, category, rating, reviews, shades, ingredients, badges, description, details, image, hue, is_new, is_bestseller) VALUES
('p1', 'velvet-lip-serum', 'Velvet Lip Serum', 'Plumping rose-cacao tint', 1490, 1890, 'make-up-vanity', 4.9, 412, JSON_ARRAY(JSON_OBJECT('name','Bare Petal','hex','#d6a89a'), JSON_OBJECT('name','Rose Smoke','hex','#b87268'), JSON_OBJECT('name','Ember','hex','#7d3a32'), JSON_OBJECT('name','Plum Noir','hex','#4a2230')), JSON_ARRAY('Squalane','Hyaluronic Acid','Cacao Butter','Vitamin E'), JSON_ARRAY('Vegan','Cruelty-Free'), 'A weightless serum-tint that hydrates and sculpts the lip in a single glide. Buildable, never sticky.', JSON_ARRAY('8ml glass refillable vial','Made in France','Dermatologist-tested'), 'radial-gradient(circle at 30% 30%, hsl(355 45% 88%), hsl(355 45% 70%) 45%, hsl(15 45% 38%) 100%)', 355, 0, 1),
('p2', 'luminous-skin-tint', 'Luminous Skin Tint', 'Second-skin radiance, SPF 30', 2290, NULL, 'make-up-vanity', 4.8, 289, JSON_ARRAY(JSON_OBJECT('name','Shade 01','hex','hsl(28 40% 82%)'), JSON_OBJECT('name','Shade 02','hex','hsl(30 38% 78%)'), JSON_OBJECT('name','Shade 03','hex','hsl(32 36% 74%)'), JSON_OBJECT('name','Shade 04','hex','hsl(34 34% 70%)'), JSON_OBJECT('name','Shade 05','hex','hsl(36 32% 66%)'), JSON_OBJECT('name','Shade 06','hex','hsl(38 30% 62%)'), JSON_OBJECT('name','Shade 07','hex','hsl(40 28% 58%)'), JSON_OBJECT('name','Shade 08','hex','hsl(42 26% 54%)'), JSON_OBJECT('name','Shade 09','hex','hsl(44 24% 50%)'), JSON_OBJECT('name','Shade 10','hex','hsl(46 22% 46%)'), JSON_OBJECT('name','Shade 11','hex','hsl(48 20% 42%)'), JSON_OBJECT('name','Shade 12','hex','hsl(50 18% 38%)')), JSON_ARRAY('SPF 30','Niacinamide'), JSON_ARRAY(), 'A bare-skin finish in 12 luminous shades. Adapts to your tone with cushioning hyaluronic spheres.', JSON_ARRAY('30ml frosted glass','Refill available','Suitable for sensitive skin'), 'radial-gradient(circle at 30% 30%, hsl(30 35% 88%), hsl(30 35% 70%) 45%, hsl(50 35% 38%) 100%)', 30, 1, 0),
('p3', 'neem-comb-classic', 'Neem Wood Wide Comb', 'Hand-cut, kiln-cured neem', 690, NULL, 'self-care', 5.0, 1284, NULL, NULL, JSON_ARRAY('Wild-harvested','Plastic-free'), 'A traditional wide-tooth comb hand-finished from sustainably harvested neem. Anti-static and naturally antimicrobial.', JSON_ARRAY('Hand-cut in Coorg','16cm length','Lifetime craft warranty'), 'radial-gradient(circle at 30% 30%, hsl(95 28% 88%), hsl(95 28% 70%) 45%, hsl(115 28% 38%) 100%)', 95, 0, 1),
('p4', 'neem-detangler-comb', 'Neem Detangler', 'Curl-friendly, no snag', 790, NULL, 'self-care', 4.9, 642, NULL, NULL, NULL, 'Specially angled teeth glide through curls without breakage. Pair with our scalp serum for a daily ritual.', JSON_ARRAY('18cm length','Engraved monogram option'), 'radial-gradient(circle at 30% 30%, hsl(110 30% 88%), hsl(110 30% 70%) 45%, hsl(130 30% 38%) 100%)', 110, 0, 0),
('p5', 'vanity-mirror-aurora', 'Aurora Vanity Mirror', 'Tri-tone LED, brushed brass', 4990, 5990, 'bath-and-body', 4.7, 174, NULL, NULL, JSON_ARRAY('Brushed brass','USB-C'), 'A countertop mirror with three light temperatures and a magnetic dimmer. Designed to feel like daylight on demand.', JSON_ARRAY('1x / 5x magnification','USB-C rechargeable','2-year warranty'), 'radial-gradient(circle at 30% 30%, hsl(45 30% 88%), hsl(45 30% 70%) 45%, hsl(65 30% 38%) 100%)', 45, 1, 0),
('p6', 'vanity-organizer', 'Heirloom Organizer', 'Travertine + walnut', 3490, NULL, 'bath-and-body', 4.6, 98, NULL, NULL, NULL, 'Hand-poured travertine base with walnut compartments to cradle your most-loved rituals.', JSON_ARRAY('Made in Jaipur','Modular inserts'), 'radial-gradient(circle at 30% 30%, hsl(35 22% 88%), hsl(35 22% 70%) 45%, hsl(55 22% 38%) 100%)', 35, 0, 0),
('p7', 'rose-facial-oil', 'Rose Otto Facial Oil', 'Cold-pressed, 24-botanical', 2890, NULL, 'salon', 4.9, 502, NULL, JSON_ARRAY('Rose Otto','Squalane','Bakuchiol','Sea Buckthorn'), JSON_ARRAY('Vegan','Cold-pressed'), 'A botanical face oil that drinks into the skin, leaving a velvet finish and a soft halo of rose.', JSON_ARRAY('30ml apothecary bottle','Refillable'), 'radial-gradient(circle at 30% 30%, hsl(15 38% 88%), hsl(15 38% 70%) 45%, hsl(35 38% 38%) 100%)', 15, 0, 1),
('p8', 'scalp-ritual-serum', 'Scalp Ritual Serum', 'Neem + rosemary + peptides', 1990, NULL, 'salon', 4.8, 318, NULL, NULL, JSON_ARRAY('Microbiome-safe'), 'A weightless scalp treatment that nourishes the root with neem extract, rosemary CO2, and copper peptides.', JSON_ARRAY('50ml dropper','Use 3x weekly'), 'radial-gradient(circle at 30% 30%, hsl(140 28% 88%), hsl(140 28% 70%) 45%, hsl(160 28% 38%) 100%)', 140, 0, 0),
('p9', 'kohl-pencil-noir', 'Kohl Pencil Noir', '12-hour matte black', 990, NULL, 'make-up-vanity', 4.7, 220, JSON_ARRAY(JSON_OBJECT('name','Noir','hex','#0a0a0a'), JSON_OBJECT('name','Bronze','hex','#5b3a1f'), JSON_OBJECT('name','Forest','hex','#1f3a2a')), NULL, NULL, 'A buttery, water-resistant kohl that sets to a true matte. Glides without tugging.', JSON_ARRAY('Twist-up, no sharpener','0.35g'), 'radial-gradient(circle at 30% 30%, hsl(0 5% 88%), hsl(0 5% 70%) 45%, hsl(20 5% 38%) 100%)', 0, 0, 0),
('p10', 'highlight-balm', 'Liquid Highlight Balm', 'Wet-glass dewy finish', 1690, NULL, 'make-up-vanity', 4.8, 198, JSON_ARRAY(JSON_OBJECT('name','Champagne','hex','#e8c89b'), JSON_OBJECT('name','Rose Gold','hex','#d49a7e'), JSON_OBJECT('name','Bronze','hex','#a86a3e')), NULL, NULL, 'A fluid balm that catches the light without disturbing makeup. Press on with fingertips.', JSON_ARRAY('15ml glass jar'), 'radial-gradient(circle at 30% 30%, hsl(40 35% 88%), hsl(40 35% 70%) 45%, hsl(60 35% 38%) 100%)', 40, 0, 0),
('p11', 'neem-beard-comb', 'Neem Beard Comb', 'Pocket-cut, hand-finished', 590, NULL, 'salon', 4.9, 412, NULL, NULL, NULL, 'A travel-sized neem comb with closely-spaced teeth, ideal for beard grooming.', JSON_ARRAY('10cm length','Cotton sleeve included'), 'radial-gradient(circle at 30% 30%, hsl(85 30% 88%), hsl(85 30% 70%) 45%, hsl(105 30% 38%) 100%)', 85, 0, 0),
('p12', 'ritual-candle', 'Forest Ritual Candle', 'Vetiver, neem leaf, oud', 2190, NULL, 'salon', 4.8, 156, NULL, NULL, JSON_ARRAY('48-hr burn'), 'A botanical candle hand-poured in coconut wax. A grounding cloud of vetiver and oud.', JSON_ARRAY('220g vessel','Lead-free wick'), 'radial-gradient(circle at 30% 30%, hsl(150 25% 88%), hsl(150 25% 70%) 45%, hsl(170 25% 38%) 100%)', 150, 0, 0)
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  tagline=VALUES(tagline),
  price=VALUES(price),
  compare_at=VALUES(compare_at),
  category=VALUES(category),
  rating=VALUES(rating),
  reviews=VALUES(reviews),
  shades=VALUES(shades),
  ingredients=VALUES(ingredients),
  badges=VALUES(badges),
  description=VALUES(description),
  details=VALUES(details),
  image=VALUES(image),
  hue=VALUES(hue),
  is_new=VALUES(is_new),
  is_bestseller=VALUES(is_bestseller);
