const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const UsersModel = require('./UsersModel');
const ProductsModel = require('./ProductsModel');
const OrdersModel = require('./OrdersModel');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Initialize Models
const usersModel = new UsersModel(db);
const productsModel = new ProductsModel(db);
const ordersModel = new OrdersModel(db);

// User Routes
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  usersModel.createUser(name, email, (err, userId) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create user' });
    }
    res.status(201).json({ id: userId, name, email });
  });
});

app.get('/api/users', (req, res) => {
  usersModel.getAllUsers((err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(users);
  });
});

app.post('/api/login', (req, res) => {
  const { email } = req.body;

  usersModel.loginUser(email, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }

    const user=results;
      res.json({ message: 'Login successful', user });
  });
});
  

// Product Routes
app.post('/api/products', (req, res) => {
  const { name, price, stock } = req.body;
  productsModel.createProduct(name, price, stock, (err, productId) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create product' });
    }
    res.status(201).json({ id: productId, name, price, stock });
  });
});

app.get('/api/products', (req, res) => {
  productsModel.getAllProducts((err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(products);
  });
});

// Order Routes
app.post('/api/orders', (req, res) => {
  const { userId, productIds } = req.body;
  ordersModel.createOrder(userId, productIds, (err, orderId) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create order' });
    }
    res.status(201).json({ id: orderId, userId, productIds, date: new Date() });
  });
});

app.get('/api/orders', (req, res) => {
  ordersModel.getAllOrders((err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
    res.json(orders);
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
