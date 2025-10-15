import React from 'react'
import { Doughnut, Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
} from 'chart.js'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler
)

// Custom plugin for dark chart background
const chartAreaBg = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#181c2f';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
};

function Dashboard() {
    // Example transactions (add more for a better graph)
    const recentTransactions = [
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

    // Prepare monthly totals for income and expenses
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const incomeDataArr = Array(12).fill(0);
    const expenseDataArr = Array(12).fill(0);

    recentTransactions.forEach(tx => {
        const monthIdx = new Date(tx.date).getMonth();
        if (tx.amount >= 0) {
            incomeDataArr[monthIdx] += tx.amount;
        } else {
            expenseDataArr[monthIdx] += Math.abs(tx.amount);
        }
    });

    const maxIncome = Math.max(...incomeDataArr);
    const maxExpenses = Math.max(...expenseDataArr);

    // Line chart data
    const lineData = {
        labels: months,
        datasets: [
            {
                label: 'Income',
                data: incomeDataArr,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34,197,94,0.1)',
                borderWidth: 2,
                borderDash: [8, 6],
                pointBackgroundColor: '#22c55e',
                pointBorderColor: '#fff',
                pointRadius: 4,
                tension: 0.4,
                fill: false,
            },
            {
                label: 'Expenses',
                data: expenseDataArr,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.2)',
                borderWidth: 2,
                borderDash: [],
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointRadius: 4,
                tension: 0.4,
                fill: true, // Fill area under expenses
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.08)' },
                ticks: { color: '#fff' },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.08)' },
                ticks: { color: '#fff' },
            },
        },
    };

    // Calculate balance, total income, total expenses from transactions
    const totalIncome = incomeDataArr.reduce((a, b) => a + b, 0);
    const totalExpenses = expenseDataArr.reduce((a, b) => a + b, 0);
    const balance = totalIncome - totalExpenses;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 font-sans">
            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-tight">Expense Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="md:col-span-2 flex flex-col gap-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100 col-span-3 w-full">
                            <span className="text-4xl mb-2">💰</span>
                            <h2 className="text-lg font-semibold text-gray-600">Balance</h2>
                            <p className="text-2xl font-bold text-blue-700 mb-2">
                                ${balance.toLocaleString()}
                            </p>
                            <div className="flex gap-8">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm text-gray-500">Total Income</span>
                                    <span className="text-xl font-bold text-green-600">
                                        ${totalIncome.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-sm text-gray-500">Total Expenses</span>
                                    <span className="text-xl font-bold text-red-500">
                                        ${totalExpenses.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Transactions</h2>
                            <ul className="space-y-3">
                                {recentTransactions.slice(-6).reverse().map(tx => (
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
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Income vs Expenses</h3>
                            <Doughnut
                                data={{
                                    labels: ['Expenses', 'Income'],
                                    datasets: [
                                        {
                                            data: [totalExpenses, totalIncome],
                                            backgroundColor: ['#f87171', '#34d399'],
                                            hoverBackgroundColor: ['#ef4444', '#10b981'],
                                            borderWidth: 2,
                                        },
                                    ],
                                }}
                            />
                        </div>
                        <div className="bg-[#181c2f] rounded-2xl shadow-lg p-6 flex flex-col items-center w-full">
                            <div className="flex justify-between w-full mb-2">
                                <div className="text-orange-400 font-bold text-lg">
                                    ${maxExpenses.toLocaleString()} <span className="text-xs font-normal">Max. Expenses</span>
                                </div>
                                <div className="text-green-400 font-bold text-lg">
                                    ${maxIncome.toLocaleString()} <span className="text-xs font-normal">Max. Income</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-4 text-white w-full text-left">Income & Expenses</h3>
                            <div className="w-full h-72">
                                <Line data={lineData} options={lineOptions} plugins={[chartAreaBg]} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
