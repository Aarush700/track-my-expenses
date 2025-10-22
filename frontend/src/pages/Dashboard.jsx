import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import {
    DollarSign, TrendingUp, TrendingDown, Activity, Calendar, RefreshCw
} from 'lucide-react';

function Dashboard() {
    // State for stats and transactions
    const [stats, setStats] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch dashboard data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Fetch statistics and recent transactions
    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');

        try {
            // Fetch stats
            const statsRes = await fetch('/api/transactions/stats', {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (!statsRes.ok) throw new Error('Failed to fetch stats');
            const statsData = await statsRes.json();

            // Fetch recent transactions
            const transactionsRes = await fetch('/api/transactions', {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (!transactionsRes.ok) throw new Error('Failed to fetch transactions');
            const transactionsData = await transactionsRes.json();

            // Fetch monthly summary and attach to stats
            const monthlyRes = await fetch('/api/transactions/monthly-summary', {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (monthlyRes.ok) {
                const monthlyData = await monthlyRes.json();

                // Normalize possible shapes:
                // - { monthlySummary: { "Jan": { income, expense }, ... } }
                // - { months: [...], income: [...], expenses: [...] }
                let monthlySummary = {};

                if (monthlyData.monthlySummary && typeof monthlyData.monthlySummary === 'object') {
                    monthlySummary = monthlyData.monthlySummary;
                } else if (Array.isArray(monthlyData.months) && Array.isArray(monthlyData.income) && Array.isArray(monthlyData.expenses)) {
                    monthlyData.months.forEach((m, i) => {
                        monthlySummary[m] = {
                            income: monthlyData.income[i] || 0,
                            expense: monthlyData.expenses[i] || 0
                        };
                    });
                } else if (Array.isArray(monthlyData)) {
                    // maybe backend returned an array of { month, income, expense }
                    monthlyData.forEach(item => {
                        if (item.month) monthlySummary[item.month] = { income: item.income || 0, expense: item.expense || 0 };
                    });
                } else {
                    console.warn('Unknown monthly summary format', monthlyData);
                }

                statsData.monthlySummary = monthlySummary;
            } else {
                console.warn('Monthly summary request failed, skipping chart data.');
                statsData.monthlySummary = {};
            }

            // Save data
            setStats(statsData);
            setRecentTransactions(transactionsData.transactions.slice(0, 5));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Prepare category chart data
    const getCategoryChartData = () => {
        if (!stats?.categorySummary) return [];
        return Object.entries(stats.categorySummary).map(([name, value]) => ({
            name,
            value: parseFloat(value.toFixed(2)),
        }));
    };

    // Prepare monthly trend data
    const getMonthlyTrendData = () => {
        if (!stats?.monthlySummary) return [];
        return Object.entries(stats.monthlySummary).map(([month, values]) => ({
            month,
            income: values.income || 0,
            expense: values.expense || 0,
        }));
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <p className="text-red-800">Error: {error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Overview of your financial activity</p>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Balance */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-blue-100 text-sm">Current Balance</p>
                            <Activity size={24} />
                        </div>
                        <p className="text-3xl font-bold">{formatCurrency(stats?.balance || 0)}</p>
                        <p className="text-blue-100 text-sm mt-2">
                            {stats?.balance >= 0 ? 'Positive balance' : 'Negative balance'}
                        </p>
                    </div>

                    {/* Income */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Income</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {formatCurrency(stats?.totalIncome || 0)}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Expenses */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Expenses</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">
                                    {formatCurrency(stats?.totalExpense || 0)}
                                </p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-full">
                                <TrendingDown className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Count */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Transactions</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">
                                    {stats?.transactionCount || 0}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Calendar className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Spending by Category</h2>

                        {getCategoryChartData().length > 0 ? (
                            <div
                                className="flex flex-col lg:flex-row items-center justify-between w-full"
                                style={{
                                    minHeight: 340,
                                    overflow: 'hidden',
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        width: '60%',
                                        height: 320,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart
                                            margin={{
                                                top: 10,
                                                bottom: 10,
                                                left: 30,
                                                right: 30,
                                            }}
                                        >
                                            <Pie
                                                data={getCategoryChartData()}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={
                                                    getCategoryChartData().length > 8
                                                        ? 80
                                                        : getCategoryChartData().length > 5
                                                            ? 90
                                                            : 100
                                                }
                                                dataKey="value"
                                                fill="#8884d8"
                                                labelLine={false}
                                            >
                                                {getCategoryChartData().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div
                                    style={{
                                        width: '40%',
                                        maxHeight: 300,
                                        overflowY: 'auto',
                                        paddingLeft: '10px',
                                        paddingRight: '5px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        position: 'relative',
                                    }}
                                    className="legend-container"
                                >
                                    {getCategoryChartData().map((item, index) => {
                                        const total = getCategoryChartData().reduce((sum, val) => sum + val.value, 0);
                                        const percent = ((item.value / total) * 100).toFixed(1);
                                        return (
                                            <div
                                                key={item.name}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '8px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        backgroundColor: COLORS[index % COLORS.length],
                                                        marginRight: 8,
                                                        flexShrink: 0,
                                                    }}
                                                ></div>
                                                <span
                                                    style={{
                                                        color: COLORS[index % COLORS.length],
                                                        fontSize: '14px',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {item.name} — {percent}%
                                                </span>
                                            </div>
                                        );
                                    })}

                                    <div
                                        style={{
                                            position: 'sticky',
                                            bottom: 0,
                                            height: 30,
                                            background:
                                                'linear-gradient(to top, white, rgba(255,255,255,0))',
                                            pointerEvents: 'none',
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                No data available
                            </div>
                        )}
                    </div>


                    {/* Bar Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Breakdown</h2>
                        {getCategoryChartData().length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getCategoryChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Bar dataKey="value" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                No data available
                            </div>
                        )}
                    </div>

                    {/* Line Chart - Monthly Income vs Expenses */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Trends</h2>
                        {getMonthlyTrendData().length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={getMonthlyTrendData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Income" />
                                    <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} name="Expense" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                No data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
                        <a href="/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View All →
                        </a>
                    </div>

                    {recentTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Type</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Category</th>
                                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Description</th>
                                        <th className="text-right py-3 px-4 text-gray-600 font-medium">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((transaction) => (
                                        <tr key={transaction._id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-800">{formatDate(transaction.date)}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${transaction.type === 'income'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-800">
                                                {transaction.description || 'No description'}
                                            </td>
                                            <td
                                                className={`py-3 px-4 text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            >
                                                {transaction.type === 'income' ? '+' : '-'}
                                                {formatCurrency(transaction.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No transactions yet. Start by adding your first transaction!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
