const budget = 1000;
const API_URL = 'http://localhost:3000/api/expenses';

const expenseForm = document.getElementById('expense-form');
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const expenseList = document.getElementById('expense-list');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');

// Fetch items from the backend server on startup
async function fetchExpenses() {
    try {
        const response = await fetch(API_URL);
        const expenses = await response.json();
        renderExpenses(expenses);
    } catch (error) {
        console.error('Error connecting to backend API:', error);
    }
}

function renderExpenses(expenses) {
    expenseList.innerHTML = '';
    let totalExpense = 0;

    expenses.forEach(expense => {
        totalExpense += expense.amount;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.name}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td><button class="delete-btn" onclick="deleteExpense('${expense.id}')">Delete</button></td>
        `;
        expenseList.appendChild(row);
    });

    totalExpenseEl.innerText = `$${totalExpense.toFixed(2)}`;
    balanceEl.innerText = `$${(budget - totalExpense).toFixed(2)}`;
}

// POST: Add an expense to Backend
expenseForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);

    if (!name || isNaN(amount) || amount <= 0) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, amount })
        });
        const updatedExpenses = await response.json();
        renderExpenses(updatedExpenses);
        expenseForm.reset();
    } catch (error) {
        console.error('Failed to add record:', error);
    }
});

// DELETE: Remove an expense from Backend
async function deleteExpense(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const updatedExpenses = await response.json();
        renderExpenses(updatedExpenses);
    } catch (error) {
        console.error('Failed to delete record:', error);
    }
}

fetchExpenses();