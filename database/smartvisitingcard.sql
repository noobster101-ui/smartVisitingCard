SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id         CHAR(36)     NOT NULL,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cards (
  id              CHAR(36)     NOT NULL,
  user_id         CHAR(36)     NOT NULL,
  slug            VARCHAR(255) NOT NULL,
  name            VARCHAR(255) NOT NULL,
  designation     VARCHAR(255) NOT NULL DEFAULT '',
  company         VARCHAR(255) NOT NULL DEFAULT '',
  phone           VARCHAR(50)  NOT NULL DEFAULT '',
  alternate_phone VARCHAR(50)  NOT NULL DEFAULT '',
  email           VARCHAR(255) NOT NULL DEFAULT '',
  website         VARCHAR(500) NOT NULL DEFAULT '',
  address         TEXT         NOT NULL,
  about           TEXT         NOT NULL,
  profile_image   VARCHAR(500) NOT NULL DEFAULT '',
  company_logo    VARCHAR(500) NOT NULL DEFAULT '',
  visiting_card   VARCHAR(500) NOT NULL DEFAULT '',
  theme           ENUM('corporate','minimal','developer','luxury','medical','education','real-estate','startup','creative','dark','light') NOT NULL DEFAULT 'corporate',
  primary_color   VARCHAR(20)  NOT NULL DEFAULT '#3b82f6',
  secondary_color VARCHAR(20)  NOT NULL DEFAULT '#6366f1',
  border_radius   VARCHAR(20)  NOT NULL DEFAULT 'rounded',
  font_family     VARCHAR(100) NOT NULL DEFAULT 'Inter',
  social_links    JSON         NOT NULL,
  business_info   JSON         NOT NULL,
  gallery         JSON         NOT NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cards_slug (slug),
  INDEX idx_cards_user_id (user_id),
  INDEX idx_cards_theme (theme),
  INDEX idx_cards_created (created_at),
  CONSTRAINT fk_cards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE settings (
  `key`   VARCHAR(100) NOT NULL,
  `value` VARCHAR(10)  NOT NULL DEFAULT 'true',
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO settings (`key`, `value`) VALUES
  ('gallery_enabled', 'true'),
  ('visiting_card_enabled', 'true');

INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Admin', 'admin@smartcard.com', 'h_g10hvh_YWRtaW4xMjM=', 'admin', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000001', 'Rakesh Kumar', 'rakesh@example.com', 'h_ducpec_cmFrZXNoMTIz', 'user', NOW(), NOW());

INSERT INTO cards (id, user_id, slug, name, designation, company, phone, email, website, address, about, theme, primary_color, secondary_color, border_radius, font_family, social_links, business_info, gallery, visiting_card, created_at, updated_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'admin-demo-card', 'Rakesh Kumar', 'Full Stack Developer', 'SmartVisitingCard', '+91 98765 43210', 'admin@smartcard.com', 'https://smartcard.com', 'Mumbai, Maharashtra, India', 'Building smart digital visiting cards with Next.js.', 'corporate', '#3b82f6', '#6366f1', 'rounded', 'Inter', '{"linkedin":"https://linkedin.com/in/rakesh","github":"https://github.com/rakesh","facebook":"","instagram":"","twitter":"","youtube":"","whatsapp":"+919876543210"}', '{"gst":"27AABCU9603R1ZM","officeHours":"Mon-Fri 9AM-6PM","googleMapsLink":""}', '[]', '', NOW(), NOW());
