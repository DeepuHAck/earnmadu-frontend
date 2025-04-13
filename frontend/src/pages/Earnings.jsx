import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEarnings, setWithdrawals } from '../store/slices/earningSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const Earnings = () => {
  const dispatch = useDispatch();
  const { earnings, totalEarnings, availableBalance, withdrawals } = useSelector(
    (state) => state.earning
  );
  const [loading, setLoading] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const [earningsRes, withdrawalsRes] = await Promise.all([
          axios.get('/api/earnings/my-earnings'),
          axios.get('/api/earnings/withdrawals')
        ]);

        dispatch(setEarnings(earningsRes.data.data.earnings));
        dispatch(setWithdrawals(withdrawalsRes.data.data.withdrawals));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error fetching earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [dispatch]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/earnings/withdraw', {
        amount: parseFloat(withdrawalAmount)
      });

      dispatch(setWithdrawals([...withdrawals, response.data.data.withdrawal]));
      setWithdrawalAmount('');
      toast.success('Withdrawal request submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !earnings.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Earnings</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            ${totalEarnings.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Available Balance</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            ${availableBalance.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Pending Withdrawals</h3>
          <p className="mt-2 text-3xl font-bold text-orange-600">
            ${withdrawals
              .filter(w => w.status === 'pending')
              .reduce((acc, w) => acc + w.amount, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {availableBalance >= 10 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
          <form onSubmit={handleWithdrawal} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (minimum $10)
              </label>
              <input
                type="number"
                id="amount"
                min="10"
                max={availableBalance}
                step="0.01"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !withdrawalAmount || parseFloat(withdrawalAmount) < 10}
              className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50">Withdrawal History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${withdrawal.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        withdrawal.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : withdrawal.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </td>
                </tr>
              ))}
              {withdrawals.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    No withdrawal history
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Earnings; 