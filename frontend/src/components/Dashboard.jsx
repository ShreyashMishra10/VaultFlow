import React, { useState, useEffect } from 'react';
import api from '../api';
import TransferModal from './TransferModal';
import { Eye, EyeOff, LogOut, Send, RefreshCw, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function Dashboard({ onLogout }) {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);


const fetchData = async () => {
  setLoading(true);
  try {
    const balanceRes = await api.get('/accounts'); 
    const accountsData = balanceRes.data.accounts || balanceRes.data.data;
  
    if (Array.isArray(accountsData) && accountsData.length > 0) {
      setBalance(accountsData[0].balance);
    } else {
      setBalance(balanceRes.data.balance ?? 0);
    }

    const historyRes = await api.get('/transaction/history');
    setTransactions(historyRes.data.data || historyRes.data.transactions || []);
  } catch (err) {
    console.error('Failed to fetch account data:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">VaultFlow</h1>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm text-gray-300 transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>

      {/* Container */}
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Balance & Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50 p-6 rounded-2xl relative shadow-xl">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Total Available Balance</span>
              <button onClick={() => setShowBalance(!showBalance)} className="text-indigo-300 hover:text-white">
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-4xl font-extrabold my-2">
              {showBalance ? `$${balance !== null ? Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}` : '••••••••'}
            </div>

            <p className="text-xs text-indigo-300/70">Calculated live via Double-Entry Ledger Aggregation</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl flex flex-col justify-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" /> Send Money
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Ledger
            </button>
          </div>
        </div>

        {/* Ledger Transactions Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-gray-200">Recent Transactions History</h3>

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No transaction records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700 text-xs uppercase text-gray-400">
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Description / Reference</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50 text-sm">
                  {transactions.map((tx, idx) => {
                    const isCredit = tx.type?.toLowerCase() === 'credit';
                    return (
                      <tr key={tx._id || idx} className="hover:bg-gray-700/30">
                        <td className="py-4 flex items-center gap-2">
                          {isCredit ? (
                            <span className="p-1.5 bg-green-500/10 text-green-400 rounded-lg">
                              <ArrowDownLeft className="w-4 h-4" />
                            </span>
                          ) : (
                            <span className="p-1.5 bg-red-500/10 text-red-400 rounded-lg">
                              <ArrowUpRight className="w-4 h-4" />
                            </span>
                          )}
                          <span className={`font-semibold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300">{tx.description || tx.reference || 'Bank Transfer'}</td>
                        <td className={`py-4 text-right font-bold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                          {isCredit ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <TransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}