import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

function Earnings() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    paypalEmail: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    }
  });

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/earnings/my-earnings`);
      setEarnings(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/earnings/payment-info`, paymentInfo);
      toast.success('Payment information updated successfully');
      setShowPaymentForm(false);
      fetchEarnings();
    } catch (error) {
      toast.error('Failed to update payment information');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/earnings/withdraw`, {
        amount: parseFloat(withdrawAmount)
      });
      toast.success('Withdrawal request submitted successfully');
      setWithdrawAmount('');
      fetchEarnings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit withdrawal request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${earnings?.earnings.total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Balance</h3>
          <p className="text-3xl font-bold text-green-600">
            ${earnings?.earnings.pending.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Withdrawn</h3>
          <p className="text-3xl font-bold text-gray-600">
            ${earnings?.earnings.withdrawn.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Withdraw Earnings</h2>
        {!earnings?.paymentInfo?.paypalEmail && !earnings?.paymentInfo?.bankDetails?.accountNumber ? (
          <div>
            <p className="text-gray-600 mb-4">
              Please set up your payment information before making a withdrawal.
            </p>
            <button
              onClick={() => setShowPaymentForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Set Up Payment Info
            </button>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount to Withdraw ($)
              </label>
              <input
                type="number"
                min="10"
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum withdrawal amount: $10
              </p>
            </div>
            <button
              type="submit"
              disabled={!withdrawAmount || parseFloat(withdrawAmount) < 10}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Request Withdrawal
            </button>
          </form>
        )}
      </div>

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <form onSubmit={handlePaymentInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PayPal Email
                </label>
                <input
                  type="email"
                  value={paymentInfo.paypalEmail}
                  onChange={(e) =>
                    setPaymentInfo((prev) => ({
                      ...prev,
                      paypalEmail: e.target.value
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Or Bank Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.bankDetails.accountName}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          bankDetails: {
                            ...prev.bankDetails,
                            accountName: e.target.value
                          }
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.bankDetails.accountNumber}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          bankDetails: {
                            ...prev.bankDetails,
                            accountNumber: e.target.value
                          }
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.bankDetails.bankName}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          bankDetails: {
                            ...prev.bankDetails,
                            bankName: e.target.value
                          }
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.bankDetails.ifscCode}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          bankDetails: {
                            ...prev.bankDetails,
                            ifscCode: e.target.value
                          }
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Payment Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Watch History</h2>
        {earnings?.watchHistory.length === 0 ? (
          <p className="text-gray-600">No videos watched yet</p>
        ) : (
          <div className="space-y-4">
            {earnings?.watchHistory.map((watch) => (
              <div
                key={watch._id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={watch.video.thumbnailUrl}
                    alt={watch.video.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{watch.video.title}</h3>
                    <p className="text-sm text-gray-600">
                      Watched on {new Date(watch.watchedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-green-600 font-medium">
                  +${watch.earned.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Earnings; 