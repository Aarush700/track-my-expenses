import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, Check, RefreshCw } from 'lucide-react';

function Transactions() {
    // State management
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        type: 'expense',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        category: 'all'
    });

    // Fetch transactions on mount
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Apply filters whenever transactions or filters change
    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions, filters]);

    // Fetch all transactions from API
    const fetchTransactions = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/transactions', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to fetch transactions');

            const data = await response.json();
            setTransactions(data.transactions);
            setFilteredTransactions(data.transactions);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Apply search and filter logic
    const applyFilters = () => {
        let filtered = [...transactions];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(t =>
                t.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                t.category.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Type filter
        if (filters.type !== 'all') {
            filtered = filtered.filter(t => t.type === filters.type);
        }

        // Category filter
        if (filters.category !== 'all') {
            filtered = filtered.filter(t => t.category === filters.category);
        }

        setFilteredTransactions(filtered);
    };

    // Get unique categories for filter dropdown
    const getUniqueCategories = () => {
        const categories = [...new Set(transactions.map(t => t.category))];
        return categories.sort();
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Open modal for creating new transaction
    const handleAddNew = () => {
        setEditingId(null);
        setFormData({
            type: 'expense',
            category: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            description: ''
        });
        setShowModal(true);
    };

    // Open modal for editing existing transaction
    const handleEdit = (transaction) => {
        setEditingId(transaction._id);
        setFormData({
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            date: new Date(transaction.date).toISOString().split('T')[0],
            description: transaction.description || ''
        });
        setShowModal(true);
    };

    // Submit form (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const url = editingId
                ? `/api/transactions/${editingId}`
                : '/api/transactions';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save transaction');
            }

            // Refresh transactions list
            await fetchTransactions();
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete transaction
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        try {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to delete transaction');

            await fetchTransactions();
        } catch (err) {
            setError(err.message);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
                        <p className="text-gray-600 mt-1">Manage all your income and expenses</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchTransactions}
                            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                            Add Transaction
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>

                        {/* Category Filter */}
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            {getUniqueCategories().map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-lg shadow">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="animate-spin text-blue-600" size={32} />
                        </div>
                    ) : filteredTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold">Date</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold">Type</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold">Category</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold">Description</th>
                                        <th className="text-right py-4 px-6 text-gray-600 font-semibold">Amount</th>
                                        <th className="text-center py-4 px-6 text-gray-600 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction._id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 text-gray-800">{formatDate(transaction.date)}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${transaction.type === 'income'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-800">
                                                {transaction.description || 'No description'}
                                            </td>
                                            <td className={`py-4 px-6 text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {transaction.type === 'income' ? '+' : '-'}
                                                {formatCurrency(transaction.amount)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(transaction)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(transaction._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No transactions found. Add your first transaction to get started!</p>
                        </div>
                    )}
                </div>

                {/* Modal for Add/Edit Transaction */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {editingId ? 'Edit Transaction' : 'Add Transaction'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'income' })}
                                            className={`py-2 px-4 rounded-lg border-2 font-medium transition-colors ${formData.type === 'income'
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            Income
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                                            className={`py-2 px-4 rounded-lg border-2 font-medium transition-colors ${formData.type === 'expense'
                                                    ? 'border-red-500 bg-red-50 text-red-700'
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            Expense
                                        </button>
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Food, Salary, Transport"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Add notes about this transaction..."
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} />
                                        {editingId ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Transactions;