Product Service
The Product Service is the core component of the Inventory Management system. it manages the lifecycle of inventory items, including product creation, categorization, stock tracking, and supplier information.

🚀 Features
Complete CRUD: Create, Read, Update, and Delete products.

Categorization: Organize products by categories and sub-categories.

Search & Filtering: Advanced filtering by category, price range, and stock status.

Inter-service Security: Validates JWTs forwarded by the API Gateway.

🛠️ Tech Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB (Mongoose)

Validation: Joi or Express-Validator

Storage: Multer (for handling file uploads)

⚙️ Setup
1️⃣ Install dependencies

Bash

npm install
2️⃣ Configure environment variables

Create a .env file in the product-service directory:

Code snippet

PORT=4002
MONGO_URI=your_mongodb_product_db_uri
JWT_SECRET=your_jwt_secret_key (Must match Auth Service)
API_GATEWAY_URL=http://localhost:4000
3️⃣ Start the service

Bash

npm start
📡 API Routes
Public Routes
GET /products – List all products (with pagination/filters).

GET /products/:id – Get detailed information for a single product.

Protected Routes (Requires Auth/Admin/Manager Role)
POST /products – Add a new product to inventory.

PUT /products/:id – Update product details or stock counts.

PATCH /products/:id/stock – Increment/Decrement stock specifically.

DELETE /products/:id – Remove a product from the system.

🔄 Integration Workflow
Request Flow: Client → API Gateway → Product Service.

Authorization: The Product Service extracts the user object and role from the JWT provided in the request headers/cookies to ensure only authorized staff can modify stock.

Data Persistence: All product metadata and stock levels are stored in a dedicated MongoDB collection separate from user data.
