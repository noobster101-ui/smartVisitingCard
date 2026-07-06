ALTER TABLE cards DROP COLUMN brochure;
ALTER TABLE cards ADD COLUMN visiting_card VARCHAR(500) NOT NULL DEFAULT '' AFTER company_logo;
