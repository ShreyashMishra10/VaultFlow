import React, { useState } from 'react';
import api from '../api';
import { v4 as uuidv4 } from 'uuid';
import { X, Send } from 'lucide-react';

export default function TransferModal({ isOpen, onClose, onSuccess }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Endpoint updated to match your backend route (/api/transaction)
      await api.post('/transaction/transfer', {
        toAccount: recipient,
        amount: Number(amount),
        idempotencyKey: uuidv4()
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed. Check recipient ID and balance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-indigo-400" /> Send Money
        </h3>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">
              Recipient Account ID / Email
            </label>
            <input
              type="text"
              required
              placeholder="Enter account ID or email"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase font-semibold mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="0.00"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg text-sm transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Processing Transfer...' : 'Confirm & Execute Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}