import React from 'react'

const transactions = [
    { id: 1, description: "Groceries", amount: -50.25, date: "2025-01-10" },
    { id: 2, description: "Salary", amount: 2000.00, date: "2025-01-01" },
    { id: 3, description: "Electricity Bill", amount: -75.00, date: "2025-02-05" },
    { id: 4, description: "Freelance", amount: 800.00, date: "2025-02-15" },
    { id: 5, description: "Rent", amount: -900.00, date: "2025-03-01" },
    { id: 6, description: "Salary", amount: 2000.00, date: "2025-03-01" },
    { id: 7, description: "Dining Out", amount: -120.00, date: "2025-03-20" },
    { id: 8, description: "Salary", amount: 2000.00, date: "2025-04-01" },
    { id: 9, description: "Internet", amount: -60.00, date: "2025-04-10" },
    { id: 10, description: "Gift", amount: 300.00, date: "2025-05-05" },
    { id: 11, description: "Shopping", amount: -200.00, date: "2025-05-15" },
    { id: 12, description: "Salary", amount: 2000.00, date: "2025-05-01" },
    { id: 13, description: "Salary", amount: 2000.00, date: "2025-06-01" },
    { id: 14, description: "Vacation", amount: -700.00, date: "2025-06-20" },
    { id: 15, description: "Salary", amount: 2000.00, date: "2025-07-01" },
    { id: 16, description: "Medical", amount: -150.00, date: "2025-07-10" },
    { id: 17, description: "Salary", amount: 2000.00, date: "2025-08-01" },
    { id: 18, description: "Groceries", amount: -100.00, date: "2025-08-15" },
    { id: 19, description: "Salary", amount: 2000.00, date: "2025-09-01" },
    { id: 20, description: "Car Repair", amount: -400.00, date: "2025-09-20" },
    { id: 21, description: "Salary", amount: 2000.00, date: "2025-10-01" },
    { id: 22, description: "Dining Out", amount: -80.00, date: "2025-10-10" },
    { id: 23, description: "Salary", amount: 2000.00, date: "2025-11-01" },
    { id: 24, description: "Shopping", amount: -300.00, date: "2025-11-15" },
    { id: 25, description: "Salary", amount: 2000.00, date: "2025-12-01" },
    { id: 26, description: "Gift", amount: -150.00, date: "2025-12-20" },
];

function Transactions() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
            <ul className="space-y-3">
                {transactions.slice().reverse().map(tx => (
                    <li
                        key={tx.id}
                        className="bg-white rounded-xl shadow flex items-center justify-between px-5 py-3 border border-gray-100"
                    >
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800">{tx.description}</span>
                            <span className="text-gray-400 text-xs">{tx.date}</span>
                        </div>
                        <span className={tx.amount < 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                            {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Transactions
