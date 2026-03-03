const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Auth Routes
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                
                const token = jwt.sign(
                    { id: result.insertId, username, email },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                
                res.status(201).json({ token, userId: result.insertId, username });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token, userId: user.id, username: user.username });
        }
    );
});

// Product Routes
app.get('/api/products', authenticateToken, (req, res) => {
    db.query(
        'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        }
    );
});

app.post('/api/products', authenticateToken, (req, res) => {
    const { name, price, quantity, description } = req.body;
    
    db.query(
        'INSERT INTO products (user_id, name, price, quantity, description) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, name, price, quantity, description],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            db.query(
                'SELECT * FROM products WHERE id = ?',
                [result.insertId],
                (err, product) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.status(201).json(product[0]);
                }
            );
        }
    );
});

// Sales Routes
app.get('/api/sales', authenticateToken, (req, res) => {
    db.query(
        `SELECT s.*, p.name as product_name, p.price 
         FROM sales s 
         JOIN products p ON s.product_id = p.id 
         WHERE s.user_id = ? 
         ORDER BY s.sale_date DESC`,
        [req.user.id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        }
    );
});

app.post('/api/sales', authenticateToken, (req, res) => {
    const { product_id, quantity } = req.body;

    // Check product availability
    db.query(
        'SELECT * FROM products WHERE id = ? AND user_id = ?',
        [product_id, req.user.id],
        (err, products) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (products.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const product = products[0];
            
            if (product.quantity < quantity) {
                return res.status(400).json({ error: 'Insufficient stock' });
            }

            const total_amount = product.price * quantity;

            // Record sale
            db.query(
                'INSERT INTO sales (user_id, product_id, quantity, total_amount) VALUES (?, ?, ?, ?)',
                [req.user.id, product_id, quantity, total_amount],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }

                    // Update product quantity
                    db.query(
                        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                        [quantity, product_id],
                        (err) => {
                            if (err) {
                                return res.status(500).json({ error: 'Database error' });
                            }
                            
                            res.status(201).json({ 
                                message: 'Sale recorded successfully',
                                sale_id: result.insertId 
                            });
                        }
                    );
                }
            );
        }
    );
});

// Expense Routes
app.get('/api/expenses', authenticateToken, (req, res) => {
    db.query(
        'SELECT * FROM expenses WHERE user_id = ? ORDER BY expense_date DESC',
        [req.user.id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        }
    );
});
// UPDATE expense (EDIT)
app.put('/api/expenses/:id', authenticateToken, (req, res) => {
    const { description, amount } = req.body;
    const expenseId = req.params.id;

    console.log('Updating expense:', expenseId, description, amount); // For debugging

    db.query(
        'UPDATE expenses SET description = ?, amount = ? WHERE id = ? AND user_id = ?',
        [description, amount, expenseId, req.user.id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Expense not found or unauthorized' });
            }
            
            res.json({ message: 'Expense updated successfully' });
        }
    );
});

// DELETE expense
app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
    const expenseId = req.params.id;

    console.log('Deleting expense:', expenseId); // For debugging

    db.query(
        'DELETE FROM expenses WHERE id = ? AND user_id = ?',
        [expenseId, req.user.id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Expense not found or unauthorized' });
            }
            
            res.json({ message: 'Expense deleted successfully' });
        }
    );
});
app.post('/api/expenses', authenticateToken, (req, res) => {
    const { description, amount } = req.body;
    
    db.query(
        'INSERT INTO expenses (user_id, description, amount) VALUES (?, ?, ?)',
        [req.user.id, description, amount],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            db.query(
                'SELECT * FROM expenses WHERE id = ?',
                [result.insertId],
                (err, expense) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }
                    res.status(201).json(expense[0]);
                }
            );
        }
    );
});

// Profit & Loss Routes
app.get('/api/profit-loss', authenticateToken, (req, res) => {
    const { month } = req.query;
    let dateFilter = '';
    let params = [req.user.id];

    if (month) {
        dateFilter = 'AND MONTH(sale_date) = ? AND YEAR(sale_date) = YEAR(CURDATE())';
        params.push(month);
    }

    // Get total sales
    db.query(
        `SELECT COALESCE(SUM(total_amount), 0) as total_sales 
         FROM sales 
         WHERE user_id = ? ${dateFilter}`,
        params,
        (err, salesResult) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Get total expenses
            db.query(
                `SELECT COALESCE(SUM(amount), 0) as total_expenses 
                 FROM expenses 
                 WHERE user_id = ? ${dateFilter.replace('sale_date', 'expense_date')}`,
                params,
                (err, expenseResult) => {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }

                    const totalSales = parseFloat(salesResult[0].total_sales);
                    const totalExpenses = parseFloat(expenseResult[0].total_expenses);
                    const netProfit = totalSales - totalExpenses;

                    res.json({
                        total_sales: totalSales,
                        total_expenses: totalExpenses,
                        net_profit: netProfit,
                        status: netProfit >= 0 ? 'profit' : 'loss'
                    });
                }
            );
        }
    );
});
// ============================================
// PRODUCT EDIT & DELETE ROUTES
// ============================================

// UPDATE product
app.put('/api/products/:id', authenticateToken, (req, res) => {
    const { name, price, quantity, description } = req.body;
    const productId = req.params.id;

    db.query(
        'UPDATE products SET name = ?, price = ?, quantity = ?, description = ? WHERE id = ? AND user_id = ?',
        [name, price, quantity, description, productId, req.user.id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found or unauthorized' });
            }
            
            res.json({ message: 'Product updated successfully' });
        }
    );
});

// DELETE product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
    const productId = req.params.id;

    db.query(
        'DELETE FROM products WHERE id = ? AND user_id = ?',
        [productId, req.user.id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found or unauthorized' });
            }
            
            res.json({ message: 'Product deleted successfully' });
        }
    );
});

// ============================================
// SALES EDIT & DELETE ROUTES
// ============================================

// UPDATE sale
app.put('/api/sales/:id', authenticateToken, (req, res) => {
    const { quantity } = req.body;
    const saleId = req.params.id;

    // First get the sale to find product_id and original quantity
    db.query(
        'SELECT * FROM sales WHERE id = ? AND user_id = ?',
        [saleId, req.user.id],
        (err, sales) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (sales.length === 0) return res.status(404).json({ error: 'Sale not found' });

            const sale = sales[0];
            const quantityDiff = quantity - sale.quantity;

            // Check if product has enough stock for increase
            if (quantityDiff > 0) {
                db.query(
                    'SELECT quantity FROM products WHERE id = ? AND user_id = ?',
                    [sale.product_id, req.user.id],
                    (err, products) => {
                        if (err) return res.status(500).json({ error: 'Database error' });
                        if (products.length === 0) return res.status(404).json({ error: 'Product not found' });

                        if (products[0].quantity < quantityDiff) {
                            return res.status(400).json({ error: 'Insufficient stock' });
                        }

                        updateSaleAndStock(sale, quantityDiff);
                    }
                );
            } else {
                updateSaleAndStock(sale, quantityDiff);
            }

            function updateSaleAndStock(sale, quantityDiff) {
                // Get product price
                db.query(
                    'SELECT price FROM products WHERE id = ?',
                    [sale.product_id],
                    (err, products) => {
                        if (err) return res.status(500).json({ error: 'Database error' });

                        const newTotal = products[0].price * quantity;

                        // Update sale
                        db.query(
                            'UPDATE sales SET quantity = ?, total_amount = ? WHERE id = ?',
                            [quantity, newTotal, saleId],
                            (err) => {
                                if (err) return res.status(500).json({ error: 'Database error' });

                                // Update product stock
                                db.query(
                                    'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                                    [quantityDiff, sale.product_id],
                                    (err) => {
                                        if (err) return res.status(500).json({ error: 'Database error' });
                                        res.json({ message: 'Sale updated successfully' });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        }
    );
});

// DELETE sale
app.delete('/api/sales/:id', authenticateToken, (req, res) => {
    const saleId = req.params.id;

    // First get the sale to restore product quantity
    db.query(
        'SELECT * FROM sales WHERE id = ? AND user_id = ?',
        [saleId, req.user.id],
        (err, sales) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (sales.length === 0) return res.status(404).json({ error: 'Sale not found' });

            const sale = sales[0];

            // Delete sale and restore product quantity
            db.query(
                'DELETE FROM sales WHERE id = ?',
                [saleId],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Database error' });

                    db.query(
                        'UPDATE products SET quantity = quantity + ? WHERE id = ?',
                        [sale.quantity, sale.product_id],
                        (err) => {
                            if (err) return res.status(500).json({ error: 'Database error' });
                            res.json({ message: 'Sale deleted and stock restored' });
                        }
                    );
                }
            );
        }
    );
});

// ============================================
// EXPENSES EDIT & DELETE ROUTES (already added)
// ============================================
// Your existing expense routes are fine
// Serve HTML pages

// Serve View Records page
app.get('/view-records', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'view-records.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'products.html'));
});

app.get('/sales', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sales.html'));
});

app.get('/expenses', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'expenses.html'));
});

app.get('/profit-loss', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profit-loss.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});