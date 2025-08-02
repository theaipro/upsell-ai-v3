-- Step 6: Create junction/join tables

-- Join Table for Product Upsells
CREATE TABLE product_upsells (
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    upsell_product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, upsell_product_id)
);
