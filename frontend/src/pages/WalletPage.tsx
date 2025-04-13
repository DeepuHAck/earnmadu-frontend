import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { walletApi } from '../lib/api';
import { useAuth } from '../store/auth-context';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

const WalletPage = () => {
  const { user } = useAuth();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => walletApi.getTransactions(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Wallet Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 sm:grid-cols-3"
      >
        {/* Current Balance */}
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <dt className="truncate text-sm font-medium text-gray-500">
            Current Balance
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            ₹{user?.wallet.balance.toFixed(2)}
          </dd>
        </div>

        {/* Total Earned */}
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Earned
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            ₹{user?.wallet.totalEarned.toFixed(2)}
          </dd>
        </div>

        {/* Pending Withdrawal */}
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <dt className="truncate text-sm font-medium text-gray-500">
            Pending Withdrawal
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            ₹{user?.wallet.pendingWithdrawal.toFixed(2)}
          </dd>
        </div>
      </motion.div>

      {/* Withdrawal Button */}
      <div className="flex justify-end">
        <Link
          to="/app/withdrawal"
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Request Withdrawal
        </Link>
      </div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-hidden rounded-lg bg-white shadow"
      >
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Transactions
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {transactions?.data.data.map((transaction: any) => (
              <li key={transaction._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      transaction.type === 'credit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}₹
                    {transaction.amount.toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletPage; 