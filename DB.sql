ALTER LOGIN sa WITH PASSWORD = 'QuocTris1204';
CREATE DATABASE foco_db

CREATE TABLE [Roles] (
  [role_id] int PRIMARY KEY IDENTITY(1, 1),
  [role_name] nvarchar(255) NOT NULL,
  [description] nvarchar(500),
  [is_active] bit DEFAULT 1,
  [created_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [Stores] (
  [store_id] int PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(255) NOT NULL,
  [address] nvarchar(500),
  [phone] nvarchar(20),
  [email] nvarchar(255),
  [manager_id] int,
  [is_active] bit DEFAULT 1,
  [created_at] datetime DEFAULT GETDATE(),
  [updated_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [Users] (
  [user_id] int PRIMARY KEY IDENTITY(1, 1),
  [username] nvarchar(255) UNIQUE NOT NULL,
  [name] nvarchar(255) NOT NULL,
  [email] nvarchar(255) UNIQUE NOT NULL,
  [password] nvarchar(255) NOT NULL,
  [phone] nvarchar(20),
  [role_id] int NOT NULL,
  [store_id] int,
  [is_active] bit DEFAULT 1,
  [last_login] datetime,
  [created_at] datetime DEFAULT GETDATE(),
  [updated_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [CustomerTiers] (
  [tier_id] int PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(100) NOT NULL,
  [min_points] int DEFAULT (0),
  [discount_rate] decimal(5,2) DEFAULT (0),
  [color] nvarchar(20),
  [is_active] bit DEFAULT 1
)
GO

CREATE TABLE [Customers] (
  [customer_id] int PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(255) NOT NULL,
  [email] nvarchar(255) UNIQUE,
  [password] nvarchar(255),
  [phone] nvarchar(20),
  [gender] nvarchar(10),
  [birth_date] date,
  [points] int DEFAULT (0),
  [tier_id] int DEFAULT (1),
  [is_active] bit DEFAULT 1,
  [created_at] datetime DEFAULT GETDATE(),
  [updated_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [Zones] (
  [zone_id] int PRIMARY KEY IDENTITY(1, 1),
  [store_id] int NOT NULL,
  [name] nvarchar(100) NOT NULL,
  [description] nvarchar(255),
  [is_active] bit DEFAULT 1
)
GO

CREATE TABLE [Tables] (
  [table_id] int PRIMARY KEY IDENTITY(1, 1),
  [zone_id] int NOT NULL,
  [name] nvarchar(50) NOT NULL,
  [status] nvarchar(20) DEFAULT 'available',
  [capacity] int NOT NULL DEFAULT (4),
  [qr_code] nvarchar(255),
  [is_active] bit DEFAULT 1
)
GO

CREATE TABLE [Categories] (
  [category_id] int PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(255) NOT NULL,
  [description] nvarchar(500),
  [image_url] nvarchar(500),
  [sort_order] int DEFAULT (0),
  [is_active] bit DEFAULT 1
)
GO

CREATE TABLE [MenuItems] (
  [item_id] int PRIMARY KEY IDENTITY(1, 1),
  [category_id] int NOT NULL,
  [name] nvarchar(255) NOT NULL,
  [description] text,
  [price] decimal(10,2) NOT NULL,
  [cost] decimal(10,2),
  [image_url] nvarchar(500),
  [prep_time] int,
  [calories] int,
  [is_available] bit DEFAULT 1,
  [is_featured] bit DEFAULT 0,
  [sort_order] int DEFAULT (0),
  [created_at] datetime DEFAULT GETDATE(),
  [updated_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [MenuItemOptions] (
  [option_id] int PRIMARY KEY IDENTITY(1, 1),
  [item_id] int NOT NULL,
  [name] nvarchar(255) NOT NULL,
  [description] nvarchar(500),
  [is_required] bit DEFAULT 0,
  [multiple_choice] bit DEFAULT 0,
  [max_selections] int DEFAULT (1),
  [sort_order] int DEFAULT (0),
  [is_active] bit DEFAULT 1
)
GO

CREATE TABLE [MenuItemOptionValues] (
  [value_id] int PRIMARY KEY IDENTITY(1, 1),
  [option_id] int NOT NULL,
  [name] nvarchar(255) NOT NULL,
  [extra_price] decimal(10,2) DEFAULT (0),
  [sort_order] int DEFAULT (0),
  [is_active] bit DEFAULT 1
)
GO

CREATE TABLE [Orders] (
  [order_id] int PRIMARY KEY IDENTITY(1, 1),
  [order_number] nvarchar(50) UNIQUE NOT NULL,
  [store_id] int NOT NULL,
  [table_id] int,
  [user_id] int,
  [customer_id] int,
  [customer_name] nvarchar(255),
  [customer_phone] nvarchar(20),
  [order_type] nvarchar(20) DEFAULT 'dine_in',
  [status] nvarchar(20) DEFAULT 'pending',
  [subtotal] decimal(10,2) DEFAULT (0),
  [tax_amount] decimal(10,2) DEFAULT (0),
  [discount_amount] decimal(10,2) DEFAULT (0),
  [total_amount] decimal(10,2) DEFAULT (0),
  [points_earned] int DEFAULT (0),
  [points_used] int DEFAULT (0),
  [notes] text,
  [created_at] datetime DEFAULT GETDATE(),
  [confirmed_at] datetime,
  [completed_at] datetime,
  [cancelled_at] datetime
)
GO

CREATE TABLE [OrderDetails] (
  [order_detail_id] int PRIMARY KEY IDENTITY(1, 1),
  [order_id] int NOT NULL,
  [item_id] int NOT NULL,
  [quantity] int NOT NULL DEFAULT (1),
  [unit_price] decimal(10,2) NOT NULL,
  [total_price] decimal(10,2) NOT NULL,
  [special_instructions] text,
  [status] nvarchar(20) DEFAULT 'pending'
)
GO

CREATE TABLE [OrderDetailOptions] (
  [order_detail_id] int NOT NULL,
  [value_id] int NOT NULL,
  [quantity] int DEFAULT (1),
  [extra_price] decimal(10,2) DEFAULT (0)
)
GO

CREATE TABLE [Discounts] (
  [discount_id] int PRIMARY KEY IDENTITY(1, 1),
  [code] nvarchar(50) UNIQUE,
  [name] nvarchar(255) NOT NULL,
  [description] text,
  [type] nvarchar(20) NOT NULL,
  [value] decimal(10,2) NOT NULL,
  [min_order_amount] decimal(10,2),
  [max_discount_amount] decimal(10,2),
  [usage_limit] int,
  [used_count] int DEFAULT (0),
  [applicable_to] nvarchar(20) DEFAULT 'all',
  [start_date] datetime NOT NULL,
  [end_date] datetime NOT NULL,
  [is_active] bit DEFAULT 1,
  [created_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [OrderDiscounts] (
  [order_id] int NOT NULL,
  [discount_id] int NOT NULL,
  [discount_amount] decimal(10,2) NOT NULL,
  [applied_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [Payments] (
  [payment_id] int PRIMARY KEY IDENTITY(1, 1),
  [order_id] int NOT NULL,
  [payment_method] nvarchar(50) NOT NULL,
  [amount_paid] decimal(10,2) NOT NULL,
  [payment_status] nvarchar(20) DEFAULT 'pending',
  [transaction_id] nvarchar(255),
  [payment_gateway] nvarchar(50),
  [paid_at] datetime,
  [created_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [MergedTables] (
  [merge_id] int PRIMARY KEY IDENTITY(1, 1),
  [main_table_id] int NOT NULL,
  [merged_table_id] int NOT NULL,
  [merged_by] int NOT NULL,
  [merged_at] datetime DEFAULT GETDATE(),
  [unmerged_at] datetime
)
GO

CREATE TABLE [Inventory] (
  [store_id] int NOT NULL,
  [item_id] int NOT NULL,
  [quantity] int DEFAULT (0),
  [min_stock_level] int DEFAULT (0),
  [max_stock_level] int DEFAULT (100),
  [updated_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [Suppliers] (
  [supplier_id] int PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(255) NOT NULL,
  [contact_person] nvarchar(255),
  [phone] nvarchar(20),
  [email] nvarchar(255),
  [address] nvarchar(500),
  [tax_id] nvarchar(50),
  [payment_terms] nvarchar(100),
  [is_active] bit DEFAULT 1,
  [created_at] datetime DEFAULT GETDATE(),
  [updated_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [Ingredients] (
  [ingredient_id] int PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(255) NOT NULL,
  [description] nvarchar(500),
  [unit] nvarchar(50) NOT NULL,
  [category] nvarchar(100),
  [shelf_life_days] int,
  [storage_requirements] nvarchar(255),
  [is_active] bit DEFAULT 1,
  [created_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [PurchaseOrders] (
  [po_id] int PRIMARY KEY IDENTITY(1, 1),
  [po_number] nvarchar(50) UNIQUE NOT NULL,
  [store_id] int NOT NULL,
  [supplier_id] int NOT NULL,
  [user_id] int NOT NULL,
  [status] nvarchar(20) DEFAULT 'draft',
  [subtotal] decimal(10,2) DEFAULT (0),
  [tax_amount] decimal(10,2) DEFAULT (0),
  [total_amount] decimal(10,2) DEFAULT (0),
  [notes] text,
  [created_at] datetime DEFAULT GETDATE(),
  [approved_at] datetime,
  [received_at] datetime,
  [cancelled_at] datetime
)
GO

CREATE TABLE [PurchaseOrderDetails] (
  [po_detail_id] int PRIMARY KEY IDENTITY(1, 1),
  [po_id] int NOT NULL,
  [ingredient_id] int NOT NULL,
  [quantity] decimal(10,2) NOT NULL,
  [unit_price] decimal(10,2) NOT NULL,
  [total_price] decimal(10,2) NOT NULL,
  [received_quantity] decimal(10,2) DEFAULT (0),
  [expiry_date] date,
  [batch_number] nvarchar(100)
)
GO

CREATE TABLE [IngredientInventory] (
  [store_id] int NOT NULL,
  [ingredient_id] int NOT NULL,
  [quantity] decimal(10,2) DEFAULT (0),
  [min_stock_level] decimal(10,2) DEFAULT (0),
  [max_stock_level] decimal(10,2) DEFAULT (100),
  [unit_cost] decimal(10,2),
  [last_purchase_date] date,
  [updated_at] datetime DEFAULT GETDATE()
)
GO

CREATE TABLE [BillOfMaterials] (
  [bom_id] int PRIMARY KEY IDENTITY(1, 1),
  [item_id] int NOT NULL,
  [ingredient_id] int NOT NULL,
  [quantity] decimal(10,2) NOT NULL,
  [waste_percentage] decimal(5,2) DEFAULT (0),
  [notes] nvarchar(255)
)
GO



ALTER TABLE [Users] ADD FOREIGN KEY ([role_id]) REFERENCES [Roles] ([role_id])
GO

ALTER TABLE [Users] ADD FOREIGN KEY ([store_id]) REFERENCES [Stores] ([store_id])
GO

ALTER TABLE [Stores] ADD FOREIGN KEY ([manager_id]) REFERENCES [Users] ([user_id])
GO

ALTER TABLE [Customers] ADD FOREIGN KEY ([tier_id]) REFERENCES [CustomerTiers] ([tier_id])
GO

ALTER TABLE [Zones] ADD FOREIGN KEY ([store_id]) REFERENCES [Stores] ([store_id])
GO

ALTER TABLE [Tables] ADD FOREIGN KEY ([zone_id]) REFERENCES [Zones] ([zone_id])
GO

ALTER TABLE [MenuItems] ADD FOREIGN KEY ([category_id]) REFERENCES [Categories] ([category_id])
GO

ALTER TABLE [MenuItemOptions] ADD FOREIGN KEY ([item_id]) REFERENCES [MenuItems] ([item_id])
GO

ALTER TABLE [MenuItemOptionValues] ADD FOREIGN KEY ([option_id]) REFERENCES [MenuItemOptions] ([option_id])
GO

ALTER TABLE [Orders] ADD FOREIGN KEY ([store_id]) REFERENCES [Stores] ([store_id])
GO

ALTER TABLE [Orders] ADD FOREIGN KEY ([table_id]) REFERENCES [Tables] ([table_id])
GO

ALTER TABLE [Orders] ADD FOREIGN KEY ([user_id]) REFERENCES [Users] ([user_id])
GO

ALTER TABLE [Orders] ADD FOREIGN KEY ([customer_id]) REFERENCES [Customers] ([customer_id])
GO

ALTER TABLE [OrderDetails] ADD FOREIGN KEY ([order_id]) REFERENCES [Orders] ([order_id])
GO

ALTER TABLE [OrderDetails] ADD FOREIGN KEY ([item_id]) REFERENCES [MenuItems] ([item_id])
GO

ALTER TABLE [OrderDetailOptions] ADD FOREIGN KEY ([order_detail_id]) REFERENCES [OrderDetails] ([order_detail_id])
GO

ALTER TABLE [OrderDetailOptions] ADD FOREIGN KEY ([value_id]) REFERENCES [MenuItemOptionValues] ([value_id])
GO

ALTER TABLE [OrderDiscounts] ADD FOREIGN KEY ([order_id]) REFERENCES [Orders] ([order_id])
GO

ALTER TABLE [OrderDiscounts] ADD FOREIGN KEY ([discount_id]) REFERENCES [Discounts] ([discount_id])
GO

ALTER TABLE [Payments] ADD FOREIGN KEY ([order_id]) REFERENCES [Orders] ([order_id])
GO

ALTER TABLE [MergedTables] ADD FOREIGN KEY ([main_table_id]) REFERENCES [Tables] ([table_id])
GO

ALTER TABLE [MergedTables] ADD FOREIGN KEY ([merged_table_id]) REFERENCES [Tables] ([table_id])
GO

ALTER TABLE [MergedTables] ADD FOREIGN KEY ([merged_by]) REFERENCES [Users] ([user_id])
GO

ALTER TABLE [Inventory] ADD FOREIGN KEY ([store_id]) REFERENCES [Stores] ([store_id])
GO

ALTER TABLE [Inventory] ADD FOREIGN KEY ([item_id]) REFERENCES [MenuItems] ([item_id])
GO

ALTER TABLE [PurchaseOrders] ADD FOREIGN KEY ([store_id]) REFERENCES [Stores] ([store_id])
GO

ALTER TABLE [PurchaseOrders] ADD FOREIGN KEY ([supplier_id]) REFERENCES [Suppliers] ([supplier_id])
GO

ALTER TABLE [PurchaseOrders] ADD FOREIGN KEY ([user_id]) REFERENCES [Users] ([user_id])
GO

ALTER TABLE [PurchaseOrderDetails] ADD FOREIGN KEY ([po_id]) REFERENCES [PurchaseOrders] ([po_id])
GO

ALTER TABLE [PurchaseOrderDetails] ADD FOREIGN KEY ([ingredient_id]) REFERENCES [Ingredients] ([ingredient_id])
GO

ALTER TABLE [IngredientInventory] ADD FOREIGN KEY ([store_id]) REFERENCES [Stores] ([store_id])
GO

ALTER TABLE [IngredientInventory] ADD FOREIGN KEY ([ingredient_id]) REFERENCES [Ingredients] ([ingredient_id])
GO

ALTER TABLE [BillOfMaterials] ADD FOREIGN KEY ([item_id]) REFERENCES [MenuItems] ([item_id])
GO

ALTER TABLE [BillOfMaterials] ADD FOREIGN KEY ([ingredient_id]) REFERENCES [Ingredients] ([ingredient_id])
GO
