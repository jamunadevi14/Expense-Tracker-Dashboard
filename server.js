const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS so backend can securely accept requests from frontend file system
app.use(cors());
app.use(express.json());

// In-Memory Database Storage array
let expenses = [
    { id: "1", name: "Sample Setup Record", amount: 5.50 }
];

// GET Route: Send all tracking data
app.get('/api/expenses', (req, res) => {
    res.json(expenses);
});

// POST Route: Receive and store a new expenditure
app.post('/api/expenses', (req, res) => {
    const { name, amount } = req.body;
    if (!name || !amount) {
        return res.status(400).json({ error: 'Missing field inputs' });
    }
    const newExpense = { id: Date.now().toString(), name, amount: parseFloat(amount) };
    expenses.push(newExpense);
    res.json(expenses);
});

// DELETE Route: Remote deletion filtering
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    expenses = expenses.filter(exp => exp.id !== id);
    res.json(expenses);
});

app.listen(PORT, () => {
    console.log(`Backend Dashboard Server running on http://localhost:${PORT}`);
});